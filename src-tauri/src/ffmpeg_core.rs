/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

//! ffmpeg_core.rs
//! 
//! Production-grade FFmpeg wrapper for BlackVideo.
//! Handles transcoding of unsupported formats to browser-compatible MP4/H.264 chunks.
//! 
//! Architecture:
//! - Input: Any FFmpeg-supported video format
//! - Output: Fragmented MP4 (fMP4) chunks for MSE playback
//! - Memory-safe with proper resource cleanup
//! - Cross-platform (Windows .dll, Linux .so, macOS .dylib)

use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use serde::{Deserialize, Serialize};

// ─────────────────────────────────────────────────────────────
//  FFmpeg Binary Resolution
// ─────────────────────────────────────────────────────────────

/// Resolves the FFmpeg binary path based on the current platform.
/// Tauri's resource resolution handles target-specific naming.
pub fn get_ffmpeg_binary() -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        PathBuf::from("bin/windows/ffmpeg-x86_64-pc-windows-msvc.exe")
    }
    
    #[cfg(target_os = "linux")]
    {
        PathBuf::from("bin/linux/ffmpeg-x86_64-unknown-linux-gnu")
    }
    
    #[cfg(target_os = "macos")]
    {
        PathBuf::from("bin/macos/ffmpeg-aarch64-apple-darwin")
    }
}

// ─────────────────────────────────────────────────────────────
//  Video Stream Info
// ─────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoStreamInfo {
    pub codec: String,
    pub width: u32,
    pub height: u32,
    pub fps: f64,
    pub duration_secs: f64,
    pub bitrate_kbps: u64,
    /// True if browser can decode natively (MP4/H.264, WebM/VP9)
    pub is_browser_compatible: bool,
}

impl VideoStreamInfo {
    /// Checks if the codec is browser-compatible
    fn is_web_native(codec: &str) -> bool {
        matches!(
            codec.to_lowercase().as_str(),
            "h264" | "avc" | "vp8" | "vp9" | "av1" | "hevc"
        )
    }
}

// ─────────────────────────────────────────────────────────────
//  FFmpeg Probe (ffprobe wrapper)
// ─────────────────────────────────────────────────────────────

/// Extracts video stream metadata using ffprobe.
/// Non-blocking, production-safe error handling.
pub async fn probe_video(file_path: &str) -> Result<VideoStreamInfo, String> {
    let ffprobe_bin = get_ffmpeg_binary()
        .parent()
        .ok_or("Invalid FFmpeg binary path")?
        .join("ffprobe");
    
    let output = tokio::task::spawn_blocking({
        let path = file_path.to_string();
        let bin = ffprobe_bin.clone();
        move || {
            Command::new(bin)
                .args([
                    "-v", "error",
                    "-select_streams", "v:0",
                    "-show_entries", "stream=codec_name,width,height,r_frame_rate,bit_rate,duration",
                    "-of", "json",
                    &path,
                ])
                .output()
        }
    })
    .await
    .map_err(|e| format!("Task panic: {}", e))?
    .map_err(|e| format!("FFprobe failed: {}", e))?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("FFprobe error: {}", stderr));
    }
    
    let stdout = String::from_utf8_lossy(&output.stdout);
    let probe_data: serde_json::Value = serde_json::from_str(&stdout)
        .map_err(|e| format!("JSON parse error: {}", e))?;
    
    let stream = probe_data["streams"]
        .as_array()
        .and_then(|arr| arr.first())
        .ok_or("No video stream found")?;
    
    let codec = stream["codec_name"]
        .as_str()
        .unwrap_or("unknown")
        .to_string();
    
    let width = stream["width"].as_u64().unwrap_or(0) as u32;
    let height = stream["height"].as_u64().unwrap_or(0) as u32;
    
    let fps = stream["r_frame_rate"]
        .as_str()
        .and_then(|s| {
            let parts: Vec<&str> = s.split('/').collect();
            if parts.len() == 2 {
                let num: f64 = parts[0].parse().ok()?;
                let den: f64 = parts[1].parse().ok()?;
                Some(num / den)
            } else {
                None
            }
        })
        .unwrap_or(0.0);
    
    let duration_secs = stream["duration"]
        .as_str()
        .and_then(|s| s.parse().ok())
        .unwrap_or(0.0);
    
    let bitrate_kbps = stream["bit_rate"]
        .as_str()
        .and_then(|s| s.parse().ok())
        .unwrap_or(0u64) / 1000;
    
    Ok(VideoStreamInfo {
        is_browser_compatible: VideoStreamInfo::is_web_native(&codec),
        codec,
        width,
        height,
        fps,
        duration_secs,
        bitrate_kbps,
    })
}

// ─────────────────────────────────────────────────────────────
//  Transcoding Pipeline (MSE-Compatible Chunks)
// ─────────────────────────────────────────────────────────────

/// Transcodes a video file to fragmented MP4 (fMP4) chunks for MSE playback.
/// 
/// Process:
/// 1. FFmpeg transcodes input → H.264 + AAC in MP4 container
/// 2. Output is fragmented (-movflags frag_keyframe+empty_moov)
/// 3. Chunks are streamed to frontend via Tauri IPC
/// 
/// Args:
/// - `file_path`: Input video file (any FFmpeg-supported format)
/// - `output_path`: Temporary output path for fMP4 chunks
/// - `start_time`: Optional seek position (seconds)
/// 
/// Returns: Path to the transcoded fMP4 file
pub async fn transcode_to_fmp4(
    file_path: &str,
    output_path: &str,
    start_time: Option<f64>,
) -> Result<String, String> {
    let ffmpeg_bin = get_ffmpeg_binary();
    
    let mut args = vec![
        "-y".to_string(), // Overwrite output
        "-loglevel".to_string(), "error".to_string(),
    ];
    
    // Optional seek (fast start)
    if let Some(t) = start_time {
        args.extend([
            "-ss".to_string(),
            t.to_string(),
        ]);
    }
    
    args.extend([
        "-i".to_string(), file_path.to_string(),
        
        // Video codec: H.264 (baseline profile for compatibility)
        "-c:v".to_string(), "libx264".to_string(),
        "-preset".to_string(), "faster".to_string(),
        "-profile:v".to_string(), "baseline".to_string(),
        "-level".to_string(), "3.0".to_string(),
        "-pix_fmt".to_string(), "yuv420p".to_string(),
        
        // Audio codec: AAC
        "-c:a".to_string(), "aac".to_string(),
        "-b:a".to_string(), "128k".to_string(),
        
        // Fragmented MP4 (critical for MSE)
        "-movflags".to_string(), "frag_keyframe+empty_moov+default_base_moof".to_string(),
        "-f".to_string(), "mp4".to_string(),
        
        output_path.to_string(),
    ]);
    
    let output = tokio::task::spawn_blocking({
        let bin = ffmpeg_bin.clone();
        move || {
            Command::new(bin)
                .args(&args)
                .stdout(Stdio::null())
                .stderr(Stdio::piped())
                .output()
        }
    })
    .await
    .map_err(|e| format!("Task panic: {}", e))?
    .map_err(|e| format!("FFmpeg exec failed: {}", e))?;
    
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("FFmpeg transcode error: {}", stderr));
    }
    
    Ok(output_path.to_string())
}

// ─────────────────────────────────────────────────────────────
//  Format Detection (Extension-Based)
// ─────────────────────────────────────────────────────────────

/// Categorizes video file based on extension.
/// Returns true if the format requires native transcoding.
pub fn requires_transcoding(file_path: &str) -> bool {
    let path = Path::new(file_path);
    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .unwrap_or("")
        .to_lowercase();
    
    // Formats that REQUIRE native decoding (not browser-native)
    matches!(
        ext.as_str(),
        // Professional formats
        "mxf" | "prores" | "dnxhd" | "dnxhr" |
        
        // Legacy broadcast
        "mpeg" | "mpg" | "m2v" | "vob" | "ts" | "trp" | "mts" | "m2ts" |
        
        // Consumer/Camera
        "avi" | "dv" | "mod" | "tod" | "avchd" |
        
        // Obsolete
        "flv" | "rm" | "rmvb" | "wmv" | "asf" | "dvr-ms" | "wtv" |
        
        // Disc formats
        "vcd" | "svcd"
    )
}

// ─────────────────────────────────────────────────────────────
//  Tests
// ─────────────────────────────────────────────────────────────

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_format_detection() {
        assert!(requires_transcoding("sample.mxf"));
        assert!(requires_transcoding("video.avi"));
        assert!(requires_transcoding("broadcast.ts"));
        assert!(!requires_transcoding("standard.mp4"));
        assert!(!requires_transcoding("web.webm"));
    }
    
    #[test]
    fn test_web_native_codec() {
        assert!(VideoStreamInfo::is_web_native("h264"));
        assert!(VideoStreamInfo::is_web_native("vp9"));
        assert!(!VideoStreamInfo::is_web_native("prores"));
        assert!(!VideoStreamInfo::is_web_native("mpeg2video"));
    }
}