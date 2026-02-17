# Migration Guide - BlackVideo Recording System

## Overview
This guide helps you migrate from the old recording system to the new refactored version.

## Key Changes

### Architecture Changes

**Old System**:
- Single monolithic controller for all modes
- Inline mode switching logic
- Mixed concerns in one file

**New System**:
- Separate controller for each recording mode
- Clear separation of concerns
- Modular, maintainable architecture

### File Changes

| Old File | New File | Changes |
|----------|----------|---------|
| `float.render.ui.tsx` | `float.render.ui.tsx` | ✅ Added submenu navigation, drag/resize |
| `recorder.control.ui.tsx` | `recorder.control.ui.tsx` | ⚠️ Now dispatcher only |
| N/A | `ui/video.player.recorder.controller.tsx` | ✨ New - Video player controller |
| N/A | `ui/video.camera.recorder.controller.tsx` | ✨ New - Camera controller |
| N/A | `ui/video.dual.recorder.ui.controller.tsx` | ✨ New - Dual recording controller |
| `saved.captured.ts` | `saved.captured.ts` | ✅ Added Tauri integration |
| `video.recording.ts` | `video.recording.ts` | ✅ Bug fixes, better cleanup |
| N/A | `connector.ts` | ✨ New - Unified API |
| N/A | `index.ts` | ✨ New - Entry point |

## Step-by-Step Migration

### Step 1: Backup Old Files
```bash
# Create backup directory
mkdir -p backup/recorder

# Copy old files
cp -r AppData/fobidden/dev/main/playground/accessories/recorder/* backup/recorder/
cp -r src/styles/modals/video.recorder.css backup/
cp -r src/styles/modals/recorder.control.css backup/
```

### Step 2: Remove Old Files
```bash
# Remove old implementation files (keep directory structure)
rm AppData/fobidden/dev/main/playground/accessories/recorder/float.render.ui.tsx
rm AppData/fobidden/dev/main/playground/accessories/recorder/recorder.control.ui.tsx
rm AppData/fobidden/dev/main/playground/accessories/recorder/video.recording.ts
rm AppData/fobidden/dev/main/playground/accessories/recorder/saved.captured.ts
```

### Step 3: Install New Files

**Main Directory Files**:
```bash
# Copy new files to recorder directory
cp float.render.ui.tsx AppData/fobidden/dev/main/playground/accessories/recorder/
cp recorder.control.ui.tsx AppData/fobidden/dev/main/playground/accessories/recorder/
cp video.recording.ts AppData/fobidden/dev/main/playground/accessories/recorder/
cp saved.captured.ts AppData/fobidden/dev/main/playground/accessories/recorder/
cp index.ts AppData/fobidden/dev/main/playground/accessories/recorder/
cp connector.ts AppData/fobidden/dev/main/playground/accessories/recorder/
```

**UI Controllers**:
```bash
# Create ui directory if it doesn't exist
mkdir -p AppData/fobidden/dev/main/playground/accessories/recorder/ui

# Copy controller files
cp video.player.recorder.controller.tsx AppData/fobidden/dev/main/playground/accessories/recorder/ui/
cp video.camera.recorder.controller.tsx AppData/fobidden/dev/main/playground/accessories/recorder/ui/
cp video.dual.recorder.ui.controller.tsx AppData/fobidden/dev/main/playground/accessories/recorder/ui/
```

**Styles**:
```bash
# Replace CSS files
cp video.recorder.css src/styles/modals/
cp recorder.control.css src/styles/modals/
```

### Step 4: Update Imports in Playground.tsx

**Old Import** (if using HTML script):
```html
<!-- Remove from index.html -->
<script src="...recorder/float.render.ui.tsx"></script>
```

**New Import** (in Playground.tsx):
```typescript
import { initializeRecorderAccessories } from './playground/accessories/recorder';

// In your component
useEffect(() => {
  initializeRecorderAccessories();
}, []);
```

### Step 5: Add Tauri Dependencies

**In package.json**:
```json
{
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-dialog": "^2.0.0",
    "@tauri-apps/plugin-fs": "^2.0.0"
  }
}
```

**Install**:
```bash
npm install
```

### Step 6: Configure Tauri Permissions

**In src-tauri/tauri.conf.json**:
```json
{
  "permissions": [
    "dialog:allow-save",
    "fs:allow-write",
    "path:allow-download-dir"
  ]
}
```

### Step 7: Add Tauri Backend (Optional)

**In src-tauri/src/main.rs** (for auto-save to Downloads):
```rust
#[tauri::command]
fn get_downloads_path() -> String {
    dirs::download_dir()
        .and_then(|p| p.to_str().map(String::from))
        .unwrap_or_else(|| String::from(""))
}

#[tauri::command]
fn show_notification(title: String, body: String, notification_type: String) {
    // Implementation for desktop notifications
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_downloads_path,
            show_notification
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### Step 8: Test Each Mode

**Test Video Player Recording**:
1. Click recorder button
2. Select "Record Video Player"
3. Start recording
4. Play some video
5. Stop and verify save

**Test Camera Recording**:
1. Click recorder button
2. Select "Record Camera" > "Record Front"
3. Allow camera permissions
4. Start recording
5. Switch to back camera (if available)
6. Stop and verify save

**Test Dual Recording**:
1. Click recorder button
2. Select "Record Both" > "Front + Popup"
3. Allow camera permissions
4. Start recording
5. Verify both feeds are recording
6. Stop and verify save

## Breaking Changes

### API Changes

**Old**:
```typescript
onModeSelect: (mode: 'video' | 'camera' | 'both') => void
```

**New**:
```typescript
onModeSelect: (mode: 'video' | 'camera-front' | 'camera-back' | 'both-front' | 'both-back') => void
```

### Controller Changes

**Old**: Single controller component handles all modes
**New**: Dispatcher routes to specific controller

**Migration**: No code changes needed - handled internally

### CSS Class Changes

**Added Classes**:
- `.submenu-container`
- `.submenu-option`
- `.resize-handle`
- `.drag-handle`
- `.duration-bar-container`
- `.dual-recording-indicator`

**Modified Classes**:
- `.mode-option` - Added support for submenu indicator
- `.recorder-controls-overlay` - Added resize/drag support

## Rollback Plan

If you encounter issues:

```bash
# Restore old files
cp -r backup/recorder/* AppData/fobidden/dev/main/playground/accessories/recorder/
cp backup/video.recorder.css src/styles/modals/
cp backup/recorder.control.css src/styles/modals/
```

## Common Migration Issues

### Issue: "Cannot find module 'saved.captured.ts'"
**Solution**: Ensure all new files are in correct locations

### Issue: Drag/resize not working
**Solution**: Check CSS files are updated, clear browser cache

### Issue: Camera permissions denied
**Solution**: Reset browser permissions, ensure HTTPS/localhost

### Issue: Tauri save failing
**Solution**: 
1. Check Tauri is properly installed
2. Verify permissions in tauri.conf.json
3. Ensure backend commands are registered

### Issue: Duration bar not showing
**Solution**: Update recorder.control.css with latest version

## Post-Migration Checklist

- [ ] All files copied to correct locations
- [ ] Tauri dependencies installed
- [ ] Permissions configured
- [ ] Old imports removed
- [ ] New imports added to Playground.tsx
- [ ] Video player recording tested
- [ ] Camera recording tested (front)
- [ ] Camera recording tested (back)
- [ ] Dual recording tested
- [ ] Drag functionality tested
- [ ] Resize functionality tested
- [ ] Save to Downloads tested
- [ ] No console errors

## Support

If you encounter issues during migration:
1. Check console for errors
2. Verify all files are in correct locations
3. Ensure dependencies are installed
4. Test in incognito mode (clear cache)
5. Review this migration guide

## Next Steps

After successful migration:
1. Remove backup files
2. Test in production build
3. Update documentation
4. Train users on new features
5. Monitor for issues

---
**Version**: 2.0.0  
**Date**: February 2026  
**Author**: BlackVideo Development Team
