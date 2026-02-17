// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

// IMPORTANT: mod declarations must come BEFORE use statements that reference them
mod window_separate_video_player;
mod utils;

// For Resume Playback
use utils::resume_playback::{
    save_video_progress,
    get_video_progress,
    get_all_video_progress,
    clear_video_progress,
    clear_all_video_progress,
    is_resume_enabled,
};

// Video Links Dropper Player
#[tauri::command]
async fn handle_youtube_stream(video_id: String) -> Result<serde_json::Value, String> {
    let output = Command::new("node")
        .arg("scripts/yt-extractor.js")
        .arg("video")
        .arg(video_id)
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let val: serde_json::Value = serde_json::from_str(&stdout).map_err(|e| e.to_string())?;
    Ok(val)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            window_separate_video_player::open_separate_video_window,
            handle_youtube_stream,
            save_video_progress,
            get_video_progress,
            get_all_video_progress,
            clear_video_progress,
            clear_all_video_progress,
            is_resume_enabled,
        ])
        .setup(|_app| {
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
     // com_blackblazent_blackvideo_zephyra_lib::run()
}






/* 
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::Command;

// For Resume Playback
use utils::resume_playback::{
    save_video_progress,
    get_video_progress,
    get_all_video_progress,
    clear_video_progress,
    clear_all_video_progress,
    is_resume_enabled,
};

// Separate WIndow Video native Player
mod window_separate_video_player;
mod utils;

// Video Links Dropper Player
#[tauri::command]
async fn handle_youtube_stream(video_id: String) -> Result<serde_json::Value, String> {
    // Calls the node script using the system's node installation
    let output = Command::new("node")
        .arg("scripts/yt-extractor.js")
        .arg("video")
        .arg(video_id)
        .output()
        .map_err(|e| e.to_string())?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    let val: serde_json::Value = serde_json::from_str(&stdout).map_err(|e| e.to_string())?;
    Ok(val)
}

fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
    // .plugin(tauri_plugin_fs::init())
    // Register handlers BEFORE .run()
    .invoke_handler(tauri::generate_handler![
            window_separate_video_player::open_separate_video_window,
            handle_youtube_stream,
            save_video_progress,
            get_video_progress,
            get_all_video_progress,
            clear_video_progress,
            clear_all_video_progress,
            is_resume_enabled,
        ])
    .setup(|_app| {
            // This replaces the need for the manual com_blackblazent...lib::run()
            Ok(())
        })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    // com_blackblazent_blackvideo_zephyra_lib::run()
}
    */
