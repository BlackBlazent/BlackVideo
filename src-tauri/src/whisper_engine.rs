/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * whisper_engine.rs
 *
 * Production-grade Whisper.cpp integration for offline subtitle generation.
 *
 * PIPELINE:
 *   Video → FFmpeg (background thread, extracts audio to 16kHz WAV) → Whisper.cpp CLI
 *   → SRT parse → VTT convert → progress events streamed to frontend (0–100%)
 *
 * PERFORMANCE:
 *   - FFmpeg runs in a Tokio spawn_blocking so it never blocks the async runtime
 *   - Whisper runs in a separate Tokio task so video playback is unaffected
 *   - Progress is emitted via Tauri events to the frontend every ~1 second
 *   - Temp audio WAV is cleaned up regardless of success/failure
 *
 * BINARY LAYOUT (tauri.conf.json externalBin / resources):
 *   bin/windows/main.exe          ← whisper.cpp CLI binary
 *   bin/windows/ffmpeg.exe        ← FFmpeg binary (already implemented)
 *   bin/linux/main
 *   bin/linux/ffmpeg
 *   bin/macos/main
 *   bin/macos/ffmpeg
 *   models/whisper/ggml-base.bin  ← default model (~142 MB)
 *
 * Download whisper.cpp binaries:
 *   https://github.com/ggerganov/whisper.cpp/releases
 * Download models:
 *   https://huggingface.co/ggerganov/whisper.cpp/tree/main
 */

use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};
use std::process::Stdio;
use tauri::{AppHandle, Emitter, Manager, Runtime};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command as AsyncCommand;
use tokio::fs;

// ─────────────────────────────────────────────────────────────
//  Progress event payload
// ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubtitleProgress {
    pub job_id:    String,
    pub percent:   f32,
    pub stage:     String,
    pub completed: bool,
    pub error:     Option<String>,
}

impl SubtitleProgress {
    pub fn new(job_id: &str, percent: f32, stage: &str) -> Self {
        Self {
            job_id:    job_id.to_string(),
            percent,
            stage:     stage.to_string(),
            completed: false,
            error:     None,
        }
    }

    pub fn done(job_id: &str) -> Self {
        Self {
            job_id:    job_id.to_string(),
            percent:   100.0,
            stage:     "Done".to_string(),
            completed: true,
            error:     None,
        }
    }

    pub fn fail(job_id: &str, msg: &str) -> Self {
        Self {
            job_id:    job_id.to_string(),
            percent:   0.0,
            stage:     "Failed".to_string(),
            completed: false,
            error:     Some(msg.to_string()),
        }
    }
}

/// Emit a progress event to the frontend via "subtitle:progress".
/// Requires `use tauri::Emitter` in scope (imported above in this file).
pub fn emit_progress<R: Runtime>(app: &AppHandle<R>, p: SubtitleProgress) {
    let _ = app.emit("subtitle:progress", p);
}

// ─────────────────────────────────────────────────────────────
//  Binary / model path resolution
// ─────────────────────────────────────────────────────────────

pub fn get_whisper_binary(app: &AppHandle<impl Runtime>) -> PathBuf {
    if let Ok(res) = app.path().resource_dir() {
        #[cfg(target_os = "windows")]
        let bin = res.join("bin/windows/main.exe");
        #[cfg(target_os = "linux")]
        let bin = res.join("bin/linux/main");
        #[cfg(target_os = "macos")]
        let bin = res.join("bin/macos/main");

        if bin.exists() { return bin; }
    }
    PathBuf::from("whisper")
}

pub fn get_ffmpeg_binary(app: &AppHandle<impl Runtime>) -> PathBuf {
    if let Ok(res) = app.path().resource_dir() {
        #[cfg(target_os = "windows")]
        let bin = res.join("bin/windows/ffmpeg.exe");
        #[cfg(target_os = "linux")]
        let bin = res.join("bin/linux/ffmpeg");
        #[cfg(target_os = "macos")]
        let bin = res.join("bin/macos/ffmpeg");

        if bin.exists() { return bin; }
    }
    PathBuf::from("ffmpeg")
}

pub fn get_whisper_model(app: &AppHandle<impl Runtime>) -> PathBuf {
    if let Ok(res) = app.path().resource_dir() {
        let model = res.join("models/whisper/ggml-base.bin");
        if model.exists() { return model; }
    }
    PathBuf::from("models/whisper/ggml-base.bin")
}

// ─────────────────────────────────────────────────────────────
//  Step 1 — FFmpeg audio extraction
// ─────────────────────────────────────────────────────────────

pub async fn extract_audio_for_whisper<R: Runtime>(
    app: &AppHandle<R>,
    job_id: &str,
    video_path: &str,
) -> Result<PathBuf, String> {
    emit_progress(app, SubtitleProgress::new(job_id, 5.0, "Extracting audio…"));

    let ffmpeg = get_ffmpeg_binary(app);

    let video_stem = Path::new(video_path)
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    let temp_dir = std::env::temp_dir();
    let wav_path = temp_dir.join(format!("bv_whisper_{video_stem}_{}.wav", uuid_simple()));

    let output = tokio::task::spawn_blocking({
        let ffmpeg     = ffmpeg.clone();
        let wav_path   = wav_path.clone();
        let video_path = video_path.to_string();
        move || {
            std::process::Command::new(&ffmpeg)
                .args([
                    "-y", "-loglevel", "error",
                    "-i", &video_path,
                    "-vn", "-ar", "16000", "-ac", "1", "-f", "wav",
                    &wav_path.to_string_lossy(),
                ])
                .stdout(Stdio::piped())
                .stderr(Stdio::piped())
                .output()
        }
    })
    .await
    .map_err(|e| format!("spawn_blocking error: {e}"))?
    .map_err(|e| format!("FFmpeg launch failed: {e}"))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!(
            "FFmpeg audio extraction failed: {stderr}\n\
             Make sure ffmpeg binary is at bin/<platform>/ffmpeg[.exe]"
        ));
    }

    emit_progress(app, SubtitleProgress::new(job_id, 30.0, "Audio extracted, starting Whisper…"));
    Ok(wav_path)
}

// ─────────────────────────────────────────────────────────────
//  Step 2 — Whisper.cpp transcription
// ─────────────────────────────────────────────────────────────

pub async fn run_whisper<R: Runtime>(
    app: &AppHandle<R>,
    job_id: &str,
    wav_path: &Path,
    language: Option<&str>,
    task: &str,
    video_duration_secs: Option<f64>,
) -> Result<String, String> {
    let binary = get_whisper_binary(app);
    let model  = get_whisper_model(app);

    let wav_str  = wav_path.to_string_lossy().to_string();
    let out_stem = wav_path.parent().unwrap_or(Path::new("."))
        .join(wav_path.file_stem().unwrap_or_default());
    let out_srt  = format!("{}.srt", out_stem.to_string_lossy());

    let mut args = vec![
        "--model".to_string(),          model.to_string_lossy().to_string(),
        "--output-srt".to_string(),
        "--output-file".to_string(),    out_stem.to_string_lossy().to_string(),
        "--print-progress".to_string(),
        "--task".to_string(),           task.to_string(),
    ];

    if let Some(lang) = language {
        if lang != "auto" {
            args.push("--language".to_string());
            args.push(lang.to_string());
        }
    }

    args.push(wav_str);

    let mut child = AsyncCommand::new(&binary)
        .args(&args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!(
            "Failed to launch whisper binary: {e}\n\
             Binary path: {}", binary.display()
        ))?;

    let stderr = child.stderr.take().expect("stderr piped");
    let mut reader = BufReader::new(stderr).lines();

    let app_clone = app.clone();
    let job_clone = job_id.to_string();
    let duration  = video_duration_secs.unwrap_or(0.0);

    let progress_task = tokio::spawn(async move {
        loop {
            let line: String = match reader.next_line().await {
                Ok(Some(l)) => l,
                _ => break,
            };
            if let Some(pct) = parse_whisper_progress_line(&line) {
                let mapped = 30.0 + (pct as f32 / 100.0) * 65.0;
                emit_progress(&app_clone, SubtitleProgress::new(
                    &job_clone, mapped, &format!("Transcribing… {pct}%"),
                ));
            } else if line.contains("-->") && duration > 0.0 {
                if let Some(ts) = parse_whisper_timestamp_secs(&line) {
                    let frac   = (ts / duration).min(1.0);
                    let mapped = 30.0 + (frac as f32) * 65.0;
                    emit_progress(&app_clone, SubtitleProgress::new(
                        &job_clone, mapped, &format!("Transcribing… {:.0}%", frac * 100.0),
                    ));
                }
            }
        }
    });

    let status = child.wait().await.map_err(|e| format!("Whisper wait error: {e}"))?;
    let _ = progress_task.await;

    if !status.success() {
        return Err(format!(
            "Whisper.cpp exited with status {:?}. Check model: {}",
            status.code(), model.display()
        ));
    }

    let srt = fs::read_to_string(&out_srt)
        .await
        .map_err(|e| format!("Could not read whisper SRT output at {out_srt}: {e}"))?;

    Ok(srt)
}

// ─────────────────────────────────────────────────────────────
//  Main public: generate subtitles
// ─────────────────────────────────────────────────────────────

pub async fn generate_subtitles_with_progress<R: Runtime>(
    app: AppHandle<R>,
    job_id: String,
    video_path: String,
    language: Option<String>,
    task: &'static str,
    video_duration_secs: Option<f64>,
) -> Result<(String, String), String> {
    emit_progress(&app, SubtitleProgress::new(&job_id, 2.0, "Starting…"));

    let wav_path = extract_audio_for_whisper(&app, &job_id, &video_path)
        .await
        .map_err(|e| { emit_progress(&app, SubtitleProgress::fail(&job_id, &e)); e })?;

    let srt = run_whisper(&app, &job_id, &wav_path, language.as_deref(), task, video_duration_secs)
        .await
        .map_err(|e| {
            let _ = std::fs::remove_file(&wav_path);
            emit_progress(&app, SubtitleProgress::fail(&job_id, &e));
            e
        })?;

    let _ = fs::remove_file(&wav_path).await;

    emit_progress(&app, SubtitleProgress::new(&job_id, 97.0, "Parsing subtitles…"));
    let vtt = srt_to_vtt(&srt);
    emit_progress(&app, SubtitleProgress::done(&job_id));

    Ok((srt, vtt))
}

// ─────────────────────────────────────────────────────────────
//  SRT → VTT
// ─────────────────────────────────────────────────────────────

pub fn srt_to_vtt(srt: &str) -> String {
    let srt = srt.trim_start_matches('\u{FEFF}').trim();

    if srt.starts_with("WEBVTT") {
        return srt.to_string();
    }

    let mut vtt = String::from("WEBVTT\n\n");

    for block in srt.split("\n\n") {
        let block = block.trim();
        if block.is_empty() { continue; }

        let lines: Vec<&str> = block.lines().collect();
        if lines.len() < 2 { continue; }

        let start_idx = if lines[0].trim().parse::<u32>().is_ok() { 1 } else { 0 };
        if start_idx >= lines.len() { continue; }

        let timing = lines[start_idx].replace(',', ".");
        let text   = lines[start_idx + 1..].join("\n");

        vtt.push_str(&timing);
        vtt.push('\n');
        vtt.push_str(&text);
        vtt.push_str("\n\n");
    }

    vtt
}

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

fn parse_whisper_progress_line(line: &str) -> Option<u32> {
    if line.contains("progress =") {
        let parts: Vec<&str> = line.split('=').collect();
        if let Some(last) = parts.last() {
            return last.trim().trim_end_matches('%').trim().parse().ok();
        }
    }
    None
}

fn parse_whisper_timestamp_secs(line: &str) -> Option<f64> {
    let start = line.find('[')?;
    let end   = line.find(" -->")?;
    let ts    = line[start + 1..end].trim();

    let parts: Vec<&str> = ts.split(':').collect();
    match parts.as_slice() {
        [h, m, s] => Some(h.parse::<f64>().ok()? * 3600.0 + m.parse::<f64>().ok()? * 60.0 + s.parse::<f64>().ok()?),
        [m, s]    => Some(m.parse::<f64>().ok()? * 60.0 + s.parse::<f64>().ok()?),
        _         => None,
    }
}

fn uuid_simple() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let t = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_nanos()).unwrap_or(0);
    format!("{t:x}")
}

#[allow(dead_code)]
pub fn ms_to_srt_time(ms: u64) -> String {
    let h   = ms / 3_600_000;
    let m   = (ms % 3_600_000) / 60_000;
    let s   = (ms % 60_000) / 1_000;
    let mss = ms % 1_000;
    format!("{h:02}:{m:02}:{s:02},{mss:03}")
}
#[allow(dead_code)]
pub fn ms_to_vtt_time(ms: u64) -> String {
    ms_to_srt_time(ms).replace(',', ".")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_srt_to_vtt_basic() {
        let srt = "1\n00:00:01,000 --> 00:00:03,500\nHello world\n\n";
        let vtt = srt_to_vtt(srt);
        assert!(vtt.starts_with("WEBVTT"));
        assert!(vtt.contains("00:00:01.000 --> 00:00:03.500"));
    }

    #[test]
    fn test_ms_to_srt_time() {
        assert_eq!(ms_to_srt_time(90500), "00:01:30,500");
    }
}