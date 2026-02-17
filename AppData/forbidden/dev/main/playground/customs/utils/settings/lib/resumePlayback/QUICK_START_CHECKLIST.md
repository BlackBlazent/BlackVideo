# Resume Playback Quick Start Checklist

## 🚀 Quick Implementation Steps

### ✅ Phase 1: Rust Backend (5-10 minutes)

- [ ] **Step 1.1**: Add dependencies to `src-tauri/Cargo.toml`
  ```toml
  serde = { version = "1.0", features = ["derive"] }
  serde_json = "1.0"
  chrono = "0.4"
  ```

- [ ] **Step 1.2**: Create `src-tauri/src/utils/` directory
  ```bash
  mkdir -p src-tauri/src/utils
  ```

- [ ] **Step 1.3**: Copy `resume_playback.rs` to `src-tauri/src/utils/resume_playback.rs`

- [ ] **Step 1.4**: Create `src-tauri/src/utils/mod.rs`
  ```rust
  pub mod resume_playback;
  ```

- [ ] **Step 1.5**: Update `src-tauri/src/main.rs` with the commands
  - Add `mod utils;`
  - Import the functions
  - Register in `invoke_handler!`

---

### ✅ Phase 2: TypeScript Files (5 minutes)

- [ ] **Step 2.1**: Create directory structure
  ```bash
  mkdir -p AppData/forbidden/dev/main/playground/customs/settings/libs
  ```

- [ ] **Step 2.2**: Copy `resumePlaybackInvoke.ts`
  - Location: `AppData/forbidden/dev/main/playground/customs/settings/libs/resumePlaybackInvoke.ts`

- [ ] **Step 2.3**: Copy `resumePlaybackIndex.ts`
  - Location: `AppData/forbidden/dev/main/playground/customs/settings/libs/resumePlaybackIndex.ts`

---

### ✅ Phase 3: Update Existing Files (10 minutes)

- [ ] **Step 3.1**: Update `playback.timeline.controls.ts`
  - Add import: `import { resumePlaybackIndex } from '../customs/settings/libs/resumePlaybackIndex';`
  - Add `currentVideoPath` property
  - Add `setVideoSource()` method
  - Add `initializeResumePlayback()` method
  - Update `onVideoCanPlay()` to initialize resume
  - Update seek/pause handlers to save progress

- [ ] **Step 3.2**: Update `Playground.tsx`
  - Add import: `import { resumePlaybackIndex } from './customs/settings/libs/resumePlaybackIndex';`
  - Add `useEffect` to set video source when it changes
  - Call `primaryPlaybackTimelineController.setVideoSource(videoPath)` when loading videos

- [ ] **Step 3.3**: Update `VideoSubSettings.tsx`
  - Add import: `import { resumePlaybackIndex } from './customs/settings/libs/resumePlaybackIndex';`
  - Update toggle handler to call `resumePlaybackIndex.setResumeEnabled()`
  - Load initial state from `resumePlaybackIndex.isResumePlaybackEnabled()`

---

### ✅ Phase 4: Testing (5 minutes)

- [ ] **Step 4.1**: Build the app
  ```bash
  pnpm tauri build
  # or for development
  pnpm tauri dev
  ```

- [ ] **Step 4.2**: Test basic functionality
  - [ ] Play a video for 30 seconds
  - [ ] Close the app
  - [ ] Reopen the app
  - [ ] Verify video resumes from ~30 seconds

- [ ] **Step 4.3**: Test toggle
  - [ ] Disable resume playback in settings
  - [ ] Close and reopen app
  - [ ] Verify video starts from beginning

- [ ] **Step 4.4**: Test edge cases
  - [ ] Play video to completion (progress should clear)
  - [ ] Play multiple videos (each should save independently)
  - [ ] Seek to different positions (should save new position)

---

## 🔍 Verification Points

### After Phase 1 (Rust)
```bash
# Build should succeed
cd src-tauri
cargo build
```
✅ No compilation errors

### After Phase 2 (TypeScript)
```bash
# Check imports work
pnpm build
```
✅ No import/module errors

### After Phase 3 (Integration)
```bash
# Run dev server
pnpm tauri dev
```
✅ App launches without errors
✅ Console shows: "Resume playback enabled: true"

### After Phase 4 (Testing)
✅ Data file created at: `{APP_DATA_DIR}/app/database/data_center/data/memor/resumeVideoPlaybackData.json`
✅ Console logs show: "✅ Video progress saved"
✅ Console logs show: "📼 Resuming playback at XX:XX:XX"

---

## 📝 Key Files Modified

| File | Action | Description |
|------|--------|-------------|
| `src-tauri/src/main.rs` | ✏️ Modified | Register Tauri commands |
| `src-tauri/src/utils/resume_playback.rs` | ➕ Created | Rust backend logic |
| `resumePlaybackInvoke.ts` | ➕ Created | TypeScript-Rust bridge |
| `resumePlaybackIndex.ts` | ➕ Created | Resume logic controller |
| `playback.timeline.controls.ts` | ✏️ Modified | Timeline integration |
| `Playground.tsx` | ✏️ Modified | Video player integration |
| `VideoSubSettings.tsx` | ✏️ Modified | Settings toggle |

---

## 🐛 Common Issues & Quick Fixes

### Issue 1: "Command not found" error
**Fix**: Verify commands are registered in `main.rs` invoke_handler!

### Issue 2: Resume not working
**Fix**: Check console for `setVideoSource()` call before video loads

### Issue 3: Data not persisting
**Fix**: Check file permissions for app data directory

### Issue 4: TypeScript import errors
**Fix**: Verify file paths match your project structure

---

## 🎯 Success Criteria

✅ **Feature works**: Video resumes after app restart  
✅ **Toggle works**: Can enable/disable in settings  
✅ **Auto-save works**: Progress saves every 5 seconds  
✅ **No errors**: Console shows successful save/load messages  
✅ **Data persists**: JSON file contains video progress  

---

## 📊 Estimated Time

| Phase | Time | Difficulty |
|-------|------|------------|
| Phase 1: Rust Backend | 5-10 min | ⭐⭐ |
| Phase 2: TypeScript Files | 5 min | ⭐ |
| Phase 3: Integration | 10 min | ⭐⭐⭐ |
| Phase 4: Testing | 5 min | ⭐ |
| **Total** | **25-30 min** | **⭐⭐** |

---

## 🎉 Done!

Once all checkboxes are ticked, your resume playback feature is fully implemented!

**Next Steps:**
- Customize auto-save interval in `resumePlaybackIndex.ts`
- Add UI notifications for resume events
- Implement watch history feature
- Add analytics for video completion rates

---

**Copyright © 2026 BlackVideo (Zephyra). All Rights Reserved.**