# Resume Playback Implementation Guide
## BlackVideo - Video Progress Persistence System

This guide explains how to implement the resume playback feature in your BlackVideo application using Tauri v2, React, TypeScript, and Vite.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Installation Steps](#installation-steps)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [API Reference](#api-reference)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The Resume Playback feature allows users to continue watching videos from where they left off, even after closing and reopening the application. This is achieved through:

- **Persistent Storage**: Using Tauri's file system to store video progress data
- **Auto-Save**: Automatically saves progress every 5 seconds during playback
- **Smart Resume**: Only resumes if video progress is meaningful (>5 seconds, <95% complete)
- **Cross-Platform**: Works on Windows, macOS, and Linux

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React UI Layer │
│  (Playground)   │
└────────┬────────┘
         │
┌────────▼────────────────────────────┐
│ PrimaryPlaybackTimelineController  │ ← Manages video timeline & UI
└────────┬────────────────────────────┘
         │
┌────────▼──────────────┐
│ ResumePlaybackIndex   │ ← Orchestrates resume logic
└────────┬──────────────┘
         │
┌────────▼────────────────┐
│ ResumePlaybackInvoker   │ ← TypeScript ↔ Rust bridge
└────────┬────────────────┘
         │ (Tauri IPC)
         │
┌────────▼────────────────┐
│ Rust Backend           │
│ (resume_playback.rs)   │ ← Persistent storage logic
└────────┬────────────────┘
         │
┌────────▼──────────────────────────────┐
│ File System                            │
│ resumeVideoPlaybackData.json          │ ← JSON data storage
└────────────────────────────────────────┘
```

---

## 📁 File Structure

Place the files in your project according to this structure:

```
BlackVideo/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs                          # ← Update this
│   │   └── utils/
│   │       └── resume_playback.rs           # ← Add this (NEW)
│   └── Cargo.toml
│
├── AppData/forbidden/dev/main/playground/
│   └── customs/settings/libs/
│       ├── resumePlaybackInvoke.ts          # ← Add this (NEW)
│       └── resumePlaybackIndex.ts           # ← Add this (NEW)
│
├── src/
│   ├── Playground.tsx                       # ← Update this
│   ├── VideoSubSettings.tsx                 # ← Update this
│   └── playback.timeline.controls.ts        # ← Update this
│
└── AppData/app/database/data_center/data/memor/
    └── resumeVideoPlaybackData.json         # ← Created automatically
```

---

## 🚀 Installation Steps

### Step 1: Add Rust Dependencies

Add these dependencies to your `src-tauri/Cargo.toml`:

```toml
[dependencies]
tauri = { version = "2.x", features = ["..." ] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
chrono = "0.4"
```

### Step 2: Create Rust Backend Module

1. Create `src-tauri/src/utils/` directory if it doesn't exist
2. Copy `resume_playback.rs` to `src-tauri/src/utils/resume_playback.rs`
3. Update `src-tauri/src/main.rs`:

```rust
mod utils;

use utils::resume_playback::{
    save_video_progress,
    get_video_progress,
    get_all_video_progress,
    clear_video_progress,
    clear_all_video_progress,
    is_resume_enabled,
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            save_video_progress,
            get_video_progress,
            get_all_video_progress,
            clear_video_progress,
            clear_all_video_progress,
            is_resume_enabled,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

4. Create `src-tauri/src/utils/mod.rs`:

```rust
pub mod resume_playback;
```

### Step 3: Add TypeScript Files

1. Copy `resumePlaybackInvoke.ts` to `AppData/forbidden/dev/main/playground/customs/settings/libs/`
2. Copy `resumePlaybackIndex.ts` to the same directory
3. Update your `playback.timeline.controls.ts` with the provided version

### Step 4: Update UI Components

1. Update `Playground.tsx` with the integration code
2. Update `VideoSubSettings.tsx` to add the toggle functionality

### Step 5: Build and Test

```bash
# Install dependencies
pnpm install

# Build Tauri app
pnpm tauri build

# Or run in dev mode
pnpm tauri dev
```

---

## ⚙️ Configuration

### Adjust Auto-Save Interval

In `resumePlaybackIndex.ts`, modify these constants:

```typescript
private saveIntervalTime: number = 5000; // Save every 5 seconds
private minProgressToSave: number = 5;    // Minimum 5 seconds watched
private maxProgressToResume: number = 95; // Don't resume if > 95% complete
```

### Data Storage Location

The JSON file is automatically created at:
```
{APP_DATA_DIR}/app/database/data_center/data/memor/resumeVideoPlaybackData.json
```

On different platforms:
- **Windows**: `C:\Users\{username}\AppData\Roaming\{app-name}\app\database\...`
- **macOS**: `~/Library/Application Support/{app-name}/app/database/...`
- **Linux**: `~/.local/share/{app-name}/app/database/...`

---

## 💡 Usage Examples

### Basic Usage

```typescript
import { primaryPlaybackTimelineController } from './playback.timeline.controls';
import { resumePlaybackIndex } from './customs/settings/libs/resumePlaybackIndex';

// When loading a video
const videoPath = '/path/to/video.mp4';
primaryPlaybackTimelineController.setVideoSource(videoPath);

// The rest is automatic! Resume playback will:
// 1. Check if there's saved progress
// 2. Resume from last position if applicable
// 3. Auto-save progress during playback
```

### Manual Control

```typescript
// Manually save progress
await resumePlaybackIndex.saveCurrentProgress(
  '/path/to/video.mp4',
  120.5,  // current time in seconds
  600     // total duration
);

// Get saved progress
const progress = await resumePlaybackIndex.getSavedProgress('/path/to/video.mp4');
if (progress) {
  console.log(`Resume from ${progress.current_time}s`);
}

// Clear progress
await resumePlaybackIndex.clearCurrentProgress();

// Enable/disable feature
resumePlaybackIndex.setResumeEnabled(false);
```

### Get All Progress Entries

```typescript
const allProgress = await resumePlaybackIndex.getAllProgress();
allProgress.forEach(video => {
  console.log(`${video.video_path}: ${video.progress_percentage}% complete`);
});
```

---

## 📚 API Reference

### Rust Commands

#### `save_video_progress`
```rust
#[tauri::command]
pub async fn save_video_progress(
    app_handle: AppHandle,
    video_path: String,
    current_time: f64,
    duration: f64,
) -> Result<String, String>
```

#### `get_video_progress`
```rust
#[tauri::command]
pub async fn get_video_progress(
    app_handle: AppHandle,
    video_path: String,
) -> Result<Option<VideoProgress>, String>
```

#### `clear_video_progress`
```rust
#[tauri::command]
pub async fn clear_video_progress(
    app_handle: AppHandle,
    video_path: String,
) -> Result<String, String>
```

### TypeScript Classes

#### `ResumePlaybackInvoker`
Static methods for communicating with Rust backend:
- `saveVideoProgress(videoPath, currentTime, duration)`
- `getVideoProgress(videoPath)`
- `getAllVideoProgress()`
- `clearVideoProgress(videoPath)`
- `clearAllVideoProgress()`

#### `ResumePlaybackIndex`
Main controller for resume functionality:
- `initializeVideoResume(videoPath, videoElement, duration)`
- `setResumeEnabled(enabled)`
- `isResumePlaybackEnabled()`
- `saveCurrentProgress(videoPath, currentTime, duration)`
- `getSavedProgress(videoPath)`
- `getAllProgress()`
- `clearCurrentProgress()`

#### `PrimaryPlaybackTimelineController`
Timeline controller with resume integration:
- `setVideoSource(videoPath)` - Set current video source
- `setCurrentTime(time)` - Seek to specific time
- `getCurrentTime()` - Get current playback time
- `getDuration()` - Get video duration

---

## 🐛 Troubleshooting

### Issue: Resume not working

**Check:**
1. Is resume playback enabled in settings?
   ```typescript
   console.log(resumePlaybackIndex.isResumePlaybackEnabled());
   ```

2. Did you call `setVideoSource()`?
   ```typescript
   primaryPlaybackTimelineController.setVideoSource(videoPath);
   ```

3. Check browser console for errors

### Issue: Progress not saving

**Check:**
1. Tauri commands are registered in `main.rs`
2. Video duration is valid (`isFinite()` and `> 0`)
3. File permissions for app data directory
4. Console logs for save confirmations

### Issue: Data file not created

**Check:**
1. App data directory exists and is writable
2. Check logs: `resumeVideoPlaybackData.json` creation errors
3. Run app with elevated permissions (if needed)

### Issue: Resume shows wrong time

**Cause:** Video duration changed or file was replaced

**Solution:**
```typescript
// Clear stale data
await resumePlaybackIndex.clearVideoProgress(videoPath);
```

---

## 🔐 Security Considerations

1. **Path Validation**: Video paths are stored as-is. Consider validating paths to prevent directory traversal
2. **Data Sanitization**: User input is serialized to JSON. Ensure proper escaping
3. **File Permissions**: Resume data is stored in app data directory with user-level permissions

---

## 🎨 Customization Ideas

### Add UI Notification

```typescript
// In resumePlaybackIndex.ts
private showResumeNotification(progress: VideoProgress): void {
  // Show toast notification
  const notification = document.createElement('div');
  notification.className = 'resume-notification';
  notification.textContent = `Resume from ${this.formatTime(progress.current_time)}?`;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}
```

### Track Watch History

```typescript
// Extend VideoProgress interface
interface VideoProgress {
  video_path: string;
  current_time: number;
  duration: number;
  last_updated: number;
  progress_percentage: number;
  watch_count: number;        // NEW
  first_watched: number;      // NEW
}
```

### Add Resume Prompt

```typescript
// Ask user if they want to resume
const shouldResume = await showConfirmDialog(
  `Resume from ${formatTime(progress.current_time)}?`
);

if (shouldResume) {
  videoElement.currentTime = progress.current_time;
}
```

---

## 📝 Data Format

### JSON Structure

```json
{
  "videos": {
    "/path/to/video1.mp4": {
      "video_path": "/path/to/video1.mp4",
      "current_time": 120.5,
      "duration": 600.0,
      "last_updated": 1708099200,
      "progress_percentage": 20.08
    },
    "/path/to/video2.mp4": {
      "video_path": "/path/to/video2.mp4",
      "current_time": 450.2,
      "duration": 900.0,
      "last_updated": 1708099300,
      "progress_percentage": 50.02
    }
  }
}
```

---

## ✅ Testing Checklist

- [ ] Resume works when reopening app
- [ ] Progress saves during playback
- [ ] Progress saves on pause
- [ ] Progress saves on seek
- [ ] Progress clears when video ends
- [ ] Toggle enable/disable works
- [ ] Multiple videos tracked correctly
- [ ] Works across app restarts
- [ ] Data persists after system reboot
- [ ] No performance impact during playback

---

## 📞 Support

For issues or questions:
1. Check console logs for errors
2. Verify all files are in correct locations
3. Ensure Tauri commands are registered
4. Test with a simple video first

---

**Copyright © 2026 BlackVideo (Zephyra). All Rights Reserved.**