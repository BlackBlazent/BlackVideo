# Playback Integration System

A production-grade system for managing video playback controls with dynamic theater stage expansion. Disable/enable different playback subsystems to create an immersive viewing experience.

## 📋 Overview

The Playback Integration system allows users to selectively disable playback controls to maximize video viewing area. When controls are disabled, the video theater stage automatically expands to fill the available space.

### Features

- ✅ **Common Playback Controls**: Main video controls (play, pause, timeline, etc.)
- ✅ **Accessories Bar**: Hexagon utility controls (filters, capture, OCR, etc.)
- ✅ **Extensions Bar**: Plugin and extension controls
- ✅ **Playlist**: Video thumbnail scroll
- ✅ **Dynamic Theater Expansion**: Automatic video container resizing
- ✅ **Persistent Settings**: LocalStorage-based state management
- ✅ **Performance Optimized**: Disabled controls also disable functionality

## 🏗️ Architecture

### File Structure

```
scripts/
├── commonPlayback.script.ts              # Common controls disable/enable
├── accessoriesPlayback.script.ts         # Accessories bar disable/enable
├── extensionsPlayback.script.ts          # Extensions bar disable/enable
├── playlistIntegration.script.ts         # Playlist disable/enable
└── index.PlaybackIntegration.script.ts   # Central registry & orchestration

components/
└── playbackIntegration.ui.tsx            # UI component with toggles
```

### Height Expansion Logic

| Disabled Controls | Theater Stage Height |
|-------------------|---------------------|
| None (default)    | 400px              |
| + Common          | 600px (+200px)     |
| + Accessories     | 700px (+100px)     |
| + Extensions      | 750px (+50px)      |
| + Playlist        | 800px (+50px)      |

## 🚀 Installation

### Step 1: Copy Script Files

Copy all script files to your `scripts/` directory:

```bash
scripts/
├── commonPlayback.script.ts
├── accessoriesPlayback.script.ts
├── extensionsPlayback.script.ts
├── playlistIntegration.script.ts
└── index.PlaybackIntegration.script.ts
```

### Step 2: Copy UI Component

Copy the UI component to your `components/` directory:

```bash
components/
└── playbackIntegration.ui.tsx
```

### Step 3: Update VideoSubSettings Component

Add the following imports and state to `VideoSubSettings.tsx`:

```tsx
import { PlaybackIntegrationUI } from './components/playbackIntegration.ui';
import { playbackIntegrationRegistry } from './scripts/index.PlaybackIntegration.script';

// Add state
const [showIntegration, setShowIntegration] = useState(false);
const [playbackSettings, setPlaybackSettings] = useState({
  disableCommon: false,
  disableAccessories: false,
  disableExtension: false,
  disablePlaylist: false,
});

// Load settings on mount
useEffect(() => {
  const settings = playbackIntegrationRegistry.getSettings();
  setPlaybackSettings(settings);
}, []);

// Handle toggle
const handlePlaybackToggle = (key: 'disableCommon' | 'disableAccessories' | 'disableExtension' | 'disablePlaylist') => {
  playbackIntegrationRegistry.toggle(key);
  const updatedSettings = playbackIntegrationRegistry.getSettings();
  setPlaybackSettings(updatedSettings);
};
```

Add the settings row:

```tsx
{/* 7. Playback Integration */}
<div 
  className="setting-row-item" 
  style={{...rowStyle, marginTop: '4px'}}
  onClick={() => {
    setShowIntegration(!showIntegration);
    if (showPlayground) setShowPlayground(false);
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
>
  <div style={iconBox}>
    <img 
      id="playbackIntegration" 
      className="playbackIntegration separate-subSettings-icon" 
      src="/assets/others/playback-integration.png" 
      alt="Playback Integration" 
      style={{ width: '16px', height: '16px' }}
    />
  </div>
  <div style={{ flex: 1 }}>
    <div style={titleStyle}>Playback Integration</div>
    <div style={descStyle}>Configure subsystem playback nodes</div>
  </div>
  <ChevronRight 
    size={14} 
    color="var(--text-muted)" 
    style={{ 
      transform: showIntegration ? 'rotate(180deg)' : 'rotate(0deg)', 
      transition: '0.3s' 
    }}
  />
</div>

{/* Playback Integration Popup */}
{showIntegration && (
  <PlaybackIntegrationUI 
    settings={playbackSettings}
    onToggle={handlePlaybackToggle}
  />
)}
```

### Step 4: Update Playground Component

Add initialization in `Playground.tsx`:

```tsx
import { playbackIntegrationRegistry } from './scripts/index.PlaybackIntegration.script';

// Initialize on mount
useEffect(() => {
  console.log('[Playground] Playback integration initialized');
}, []);
```

Ensure your HTML structure includes the required class names:

```tsx
{/* Video Container */}
<div id="videoContainer" className="video-container">
  <video id="VideoPlayer-TheaterStage" className="video-player-theater-stage">
    {/* ... */}
  </video>
  
  {/* Common Controls */}
  <div id="videoFullPackPlaybackControls" className="controls-bar">
    {/* ... */}
  </div>
  
  {/* Accessories */}
  <div id="accessories-built-ins" className="hexagon-bar">
    {/* ... */}
  </div>
  
  {/* Extensions */}
  <div id="extension-built-ins" className="second-icon-bar">
    {/* ... */}
  </div>
  
  {/* Playlist */}
  <div className="thumbnails-scroll">
    {/* ... */}
  </div>
</div>
```

## 🎯 Usage

### User Interface

Users can toggle each playback subsystem from the Playback Integration popup:

1. Click "Playback Integration" in settings
2. Toggle any subsystem:
   - **Disable Common**: Hides main playback controls
   - **Disable Accessories**: Hides hexagon utility bar
   - **Disable Extension**: Hides plugin bar
   - **Disable Playlist**: Hides video thumbnails

### Programmatic Usage

```typescript
import { playbackIntegrationRegistry } from './scripts/index.PlaybackIntegration.script';

// Toggle a specific integration
playbackIntegrationRegistry.toggle('disableCommon');

// Get current settings
const settings = playbackIntegrationRegistry.getSettings();
console.log(settings.disableCommon); // true/false

// Reset all to default (enabled)
playbackIntegrationRegistry.resetAll();
```

## 🎨 Design Principles

### Visual Design
- **Modern glassmorphic UI** with subtle backdrop blur
- **Active state feedback** with color highlights
- **Smooth transitions** for all state changes
- **Lucide icons** for visual consistency
- **Responsive tooltips** for user guidance

### Performance
- **Disabled = Hidden + Non-functional**: Controls are hidden AND disabled to prevent unnecessary processing
- **LocalStorage persistence**: Settings survive page reloads
- **Singleton pattern**: Single registry manages all integrations
- **Efficient DOM queries**: Cached selectors where possible

### Code Quality
- **TypeScript throughout**: Full type safety
- **Class-based architecture**: Clean OOP design
- **Comprehensive documentation**: Inline comments and JSDoc
- **Error handling**: Try-catch for storage operations
- **Console logging**: Debug-friendly output

## 🔧 Customization

### Modify Expansion Heights

Edit the `recalculateVideoContainerHeight()` method in `index.PlaybackIntegration.script.ts`:

```typescript
private recalculateVideoContainerHeight(): void {
  let targetHeight = 400; // Base height
  
  if (this.settings.disableCommon) targetHeight += 200;      // Customize
  if (this.settings.disableAccessories) targetHeight += 100; // Customize
  if (this.settings.disableExtension) targetHeight += 50;    // Customize
  if (this.settings.disablePlaylist) targetHeight += 50;     // Customize
  
  // Apply...
}
```

### Add New Integrations

1. Create a new script file (e.g., `subtitlesPlayback.script.ts`)
2. Follow the same class structure
3. Register in `index.PlaybackIntegration.script.ts`
4. Add toggle in `playbackIntegration.ui.tsx`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Click each toggle - controls hide/show correctly
- [ ] Verify video container expands when disabled
- [ ] Check multiple toggles work together
- [ ] Reload page - settings persist
- [ ] Test button functionality when disabled
- [ ] Verify smooth animations

### Browser Console

Enable debug logs:

```javascript
localStorage.setItem('debug', 'true');
```

## 📦 Dependencies

- **React** 18+
- **TypeScript** 4.5+
- **lucide-react** (for icons)

## 🐛 Troubleshooting

### Controls not hiding?
- Check class names match exactly: `.controls-bar`, `.hexagon-bar`, etc.
- Verify scripts are imported correctly
- Check browser console for errors

### Settings not persisting?
- Ensure localStorage is available
- Check browser privacy settings
- Verify no localStorage quota issues

### Video not expanding?
- Check `.video-container` and `.video-player-theater-stage` classes exist
- Verify CSS isn't overriding `!important` styles
- Check console for height calculation logs

## 📄 License

Copyright (c) 2026 BlackVideo (Zephyra)  
All Rights Reserved.

## 🤝 Contributing

This is a production system. Follow the existing code patterns and maintain:
- TypeScript strict mode
- Comprehensive error handling
- Inline documentation
- Console logging for debugging

---

**Built with precision for BlackVideo (Zephyra)** ⚡
