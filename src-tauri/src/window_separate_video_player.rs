/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

use tauri::{AppHandle, WebviewWindowBuilder, WebviewUrl, Emitter};
use serde::Serialize;
use raw_window_handle::HasWindowHandle;

#[derive(Clone, Serialize)]
struct VideoPayload {
    video_path: String,
    timestamp: f64,
}

#[tauri::command]
pub async fn open_separate_video_window(
    app: AppHandle,
    video_path: String,
    current_time: Option<f64>
) -> Result<(), String> {
    
    // Security: Validate video path to prevent path traversal attacks
    if video_path.is_empty() {
        return Err("Invalid video path provided".to_string());
    }
    
    // Security: Sanitize path (basic validation)
    if video_path.contains("..") || (video_path.contains("://") && 
        !video_path.starts_with("http://") && 
        !video_path.starts_with("https://") && 
        !video_path.starts_with("asset://")) {
        return Err("Potentially malicious path detected".to_string());
    }

    let window_label = format!("video-player-{}", chrono::Utc::now().timestamp_millis());
    
    // Create the window with initialization script
    // Note: dragDropEnabled is controlled by tauri.conf.json or window config
    let video_window: tauri::WebviewWindow = WebviewWindowBuilder::new(
        &app,
        &window_label,
        WebviewUrl::App("video-player.html".into())
    )
    .title("Native Video Player")
    .inner_size(800.0, 450.0)
    .center()
    .resizable(true)
    .initialization_script(&format!(
        r#"
        window.__INITIAL_VIDEO_DATA__ = {{
            videoPath: "{}",
            timestamp: {}
        }};
        console.log("Injected video data:", window.__INITIAL_VIDEO_DATA__);
        "#,
        video_path.replace("\\", "\\\\").replace("\"", "\\\""),
        current_time.unwrap_or(0.0)
    ))
    .build()
    .map_err(|e| e.to_string())?;

    // Emit event as backup method
    let payload = VideoPayload {
        video_path: video_path.clone(),
        timestamp: current_time.unwrap_or(0.0),
    };
    
    video_window
        .emit("video-load", payload)
        .map_err(|e| e.to_string())?;

    // Access native window handle for future native rendering
    #[cfg(target_os = "windows")]
    {
        if let Ok(_handle) = video_window.window_handle() {
            println!("✓ Native window handle obtained (Windows) for: {}", video_path);
        }
    }

    #[cfg(target_os = "macos")]
    {
        if let Ok(_handle) = video_window.window_handle() {
            println!("✓ Native window handle obtained (macOS) for: {}", video_path);
        }
    }

    #[cfg(target_os = "linux")]
    {
        if let Ok(_handle) = video_window.window_handle() {
            println!("✓ Native window handle obtained (Linux) for: {}", video_path);
        }
    }

    Ok(())
}