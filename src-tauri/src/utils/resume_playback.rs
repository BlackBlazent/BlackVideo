/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::AppHandle;
use tauri::Manager; // Tauri v2: required for app_handle.path()

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VideoProgress {
    pub video_path: String,
    pub current_time: f64,
    pub duration: f64,
    pub last_updated: i64,
    pub progress_percentage: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ResumePlaybackData {
    pub videos: HashMap<String, VideoProgress>,
}

impl Default for ResumePlaybackData {
    fn default() -> Self {
        Self {
            videos: HashMap::new(),
        }
    }
}

/// Returns current Unix timestamp in seconds using std::time (no chrono needed)
fn unix_timestamp() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs() as i64
}

/// Resolve the JSON data file path relative to the binary location.
/// Path: <binary_dir>/../../../AppData/app/database/data_center/data/memory/resumeVideoPlaybackData.json
fn get_data_file_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    // Tauri v2: use app_handle.path().app_data_dir() via the Manager trait
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {}", e))?;

    // Navigate to your custom data folder
    let data_dir = app_data_dir
        .join("app")
        .join("database")
        .join("data_center")
        .join("data")
        .join("memory"); // NOTE: your path uses "memory" (not "memor")

    // Auto-create directories if missing
    fs::create_dir_all(&data_dir)
        .map_err(|e| format!("Failed to create data directory: {}", e))?;

    Ok(data_dir.join("resumeVideoPlaybackData.json"))
}

/// Load resume playback data from disk
fn load_data(app_handle: &AppHandle) -> Result<ResumePlaybackData, String> {
    let file_path = get_data_file_path(app_handle)?;

    if !file_path.exists() {
        return Ok(ResumePlaybackData::default());
    }

    let content = fs::read_to_string(&file_path)
        .map_err(|e| format!("Failed to read resume data file: {}", e))?;

    // Gracefully fall back to empty data if JSON is malformed
    let data: ResumePlaybackData = serde_json::from_str(&content)
        .unwrap_or_else(|_| ResumePlaybackData::default());

    Ok(data)
}

/// Save resume playback data to disk
fn save_data(app_handle: &AppHandle, data: &ResumePlaybackData) -> Result<(), String> {
    let file_path = get_data_file_path(app_handle)?;

    let json_content = serde_json::to_string_pretty(data)
        .map_err(|e| format!("Failed to serialize resume data: {}", e))?;

    fs::write(&file_path, json_content)
        .map_err(|e| format!("Failed to write resume data file: {}", e))?;

    Ok(())
}

/// Save video progress to persistent storage
#[tauri::command]
pub async fn save_video_progress(
    app_handle: AppHandle,
    video_path: String,
    current_time: f64,
    duration: f64,
) -> Result<String, String> {
    let mut data = load_data(&app_handle)?;

    let progress_percentage = if duration > 0.0 {
        (current_time / duration) * 100.0
    } else {
        0.0
    };

    let video_progress = VideoProgress {
        video_path: video_path.clone(),
        current_time,
        duration,
        last_updated: unix_timestamp(),
        progress_percentage,
    };

    data.videos.insert(video_path, video_progress);
    save_data(&app_handle, &data)?;

    Ok("Video progress saved successfully".to_string())
}

/// Get video progress from persistent storage
#[tauri::command]
pub async fn get_video_progress(
    app_handle: AppHandle,
    video_path: String,
) -> Result<Option<VideoProgress>, String> {
    let data = load_data(&app_handle)?;
    Ok(data.videos.get(&video_path).cloned())
}

/// Get all video progress entries sorted by most recently watched
#[tauri::command]
pub async fn get_all_video_progress(
    app_handle: AppHandle,
) -> Result<Vec<VideoProgress>, String> {
    let data = load_data(&app_handle)?;
    let mut progress_list: Vec<VideoProgress> = data.videos.values().cloned().collect();

    // Most recently updated first
    progress_list.sort_by(|a, b| b.last_updated.cmp(&a.last_updated));

    Ok(progress_list)
}

/// Clear video progress for a specific video
#[tauri::command]
pub async fn clear_video_progress(
    app_handle: AppHandle,
    video_path: String,
) -> Result<String, String> {
    let mut data = load_data(&app_handle)?;
    data.videos.remove(&video_path);
    save_data(&app_handle, &data)?;

    Ok("Video progress cleared successfully".to_string())
}

/// Clear all video progress data
#[tauri::command]
pub async fn clear_all_video_progress(app_handle: AppHandle) -> Result<String, String> {
    let data = ResumePlaybackData::default();
    save_data(&app_handle, &data)?;

    Ok("All video progress cleared successfully".to_string())
}

/// Check if resume playback is enabled (toggle state lives in the frontend)
#[tauri::command]
pub async fn is_resume_enabled() -> Result<bool, String> {
    // Resume toggle state is persisted in TypeScript (localStorage).
    // This command exists as a backend hook for future settings integration.
    Ok(true)
}