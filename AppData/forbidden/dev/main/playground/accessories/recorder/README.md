# BlackVideo Recording System - Refactored & Improved

## Overview
Complete video recording system for BlackVideo with three distinct recording modes:
1. **Video Player Recording** - Record video playback from the theater stage
2. **Camera Recording** - Record from front/back camera
3. **Dual Recording (PiP)** - Record both camera and display in picture-in-picture mode

## Key Improvements

### UI Enhancements
- ✅ **Draggable & Resizable** - All popup windows can be dragged and resized
- ✅ **Submenu Navigation** - Camera and Dual modes show submenu options with chevron indicators
- ✅ **Modern Icons** - All Lucide icons for clean, professional appearance
- ✅ **Smooth Animations** - Polished transitions and hover effects
- ✅ **Resize Handles** - Clear visual indicators for resizing capability

### Recording Features
- ✅ **Video Player Recording** - Follows video playback duration automatically
- ✅ **Camera Recording** - Duration bar jumps to end (Facebook Live style)
- ✅ **Dual Recording** - Duration bar jumps to end, shows both sources
- ✅ **Camera Switching** - Switch between front/back cameras (disabled during recording)
- ✅ **Tauri Integration** - Saves to OS Downloads folder using native dialogs

### Technical Improvements
- ✅ **Separate Controllers** - Each mode has its own dedicated controller component
- ✅ **Better State Management** - Cleaner separation of concerns
- ✅ **Improved Error Handling** - Clear error messages with dismiss functionality
- ✅ **Auto-cleanup** - Proper resource management and stream cleanup

## File Structure

```
AppData/fobidden/dev/main/playground/accessories/recorder/
├── float.render.ui.tsx           # Main selection popup (draggable/resizable)
├── recorder.control.ui.tsx       # Controller dispatcher
├── video.recording.ts            # Core recording logic
├── saved.captured.ts             # File saving with Tauri
├── index.ts                      # Entry point
├── connector.ts                  # Unified interface
└── ui/
    ├── video.player.recorder.controller.tsx    # Video player controls
    ├── video.camera.recorder.controller.tsx    # Camera recording controls
    └── video.dual.recorder.ui.controller.tsx   # Dual recording controls

src/styles/modals/
├── video.recorder.css            # Main popup styles
└── recorder.control.css          # Controller styles
```

## Usage

### Basic Integration

```typescript
// In your Playground.tsx or main app file
import { initializeRecorderAccessories } from './playground/accessories/recorder';

// Initialize on component mount
useEffect(() => {
  initializeRecorderAccessories();
}, []);
```

### Using RecorderConnector (Advanced)

```typescript
import { getRecorderConnector } from './playground/accessories/recorder/connector';

const connector = getRecorderConnector();

// Initialize for video recording
await connector.initialize('video');
await connector.startRecording();

// Later...
await connector.stopAndSave('my-recording');
connector.cleanup();
```

## Recording Modes

### 1. Video Player Recording
- Records video playing in `#VideoPlayer-TheaterStage`
- Duration follows video playback automatically
- Captures at 30 FPS
- Pause/Resume supported

**Controller**: `video.player.recorder.controller.tsx`

### 2. Camera Recording
- Records from device camera (front or back)
- Camera feed shown in main video stage
- Duration bar at 100% (indeterminate length)
- Switch camera button (disabled during recording)
- Stop = Auto-save

**Controller**: `video.camera.recorder.controller.tsx`

**Special Behavior**:
- Duration seek bar jumps to end immediately
- Only time counter increments
- Similar to Facebook Live recording

### 3. Dual Recording (PiP)
- Records camera + popup display simultaneously
- Camera in main stage, display in PiP overlay
- Duration bar at 100% (indeterminate length)
- Switch camera button available
- Stop = Auto-save

**Controller**: `video.dual.recorder.ui.controller.tsx`

**Special Behavior**:
- Visual indicator shows both sources
- Duration seek bar at 100%
- Time counter increments

## UI Components

### Main Selection Popup (float.render.ui.tsx)

**Features**:
- Draggable via header
- Resizable via bottom-right handle
- Submenu expansion for Camera and Dual modes
- Clean close button

**Selections**:
1. Record Video Player
2. Record Camera > [Record Front | Record Back]
3. Record Both (Dual) > [Front + Popup | Back + Popup]

### Controller Popups

**Common Features**:
- Draggable
- Resizable
- Live recording indicator
- Time counter
- Status information
- Error display

**Specific Features**:
- **Video Player**: Pause/Resume buttons
- **Camera**: Switch camera button, duration bar at 100%
- **Dual**: Dual source indicator, switch camera button

## File Saving

### Tauri Integration (saved.captured.ts)

```typescript
// Save with dialog (user chooses location)
await saveRecording(blob, 'my-video');

// Auto-save to Downloads
await autoSaveToDownloads(blob, 'my-video');
```

**Features**:
- Native file save dialogs
- Automatic Downloads folder detection
- Desktop notifications
- File size estimation
- Format detection (WEBM/MP4)

## Styling

### CSS Variables Used
```css
--background-dark
--border-medium
--text-primary
--text-secondary
--primary-blue
--surface-color
--glass-bg
--glass-border
```

### Key Animations
- `fadeIn` - Overlay appearance
- `slideUp` - Popup entrance
- `slideDown` - Submenu expansion
- `pulse` - Recording indicator

## Browser Support

**Required APIs**:
- MediaRecorder API
- getUserMedia
- Canvas captureStream
- Tauri (for desktop features)

**Tested Formats**:
- video/webm;codecs=vp9,opus (preferred)
- video/webm;codecs=vp8,opus
- video/webm
- video/mp4 (fallback)

## Known Limitations

1. **Camera switching during recording**: Disabled to prevent stream corruption
2. **Browser compatibility**: Requires modern browser with MediaRecorder support
3. **Mobile limitations**: Back camera may not be available on all devices
4. **File size**: Large recordings may consume significant memory

## Troubleshooting

### Camera not accessible
- Check browser permissions
- Ensure HTTPS or localhost
- Verify camera not in use by another app

### Recording not starting
- Check VideoTheaterStage is initialized
- Verify video element exists
- Check console for errors

### Save failing
- Ensure Tauri is properly configured
- Check file system permissions
- Verify Downloads folder exists

## Future Enhancements

- [ ] Screen recording mode
- [ ] Audio-only recording
- [ ] Recording preview before save
- [ ] Custom PiP positioning
- [ ] Recording templates
- [ ] Cloud upload integration
- [ ] Trim/edit before save

## License
Copyright (c) 2026 BlackVideo (Zephyra). All Rights Reserved.
