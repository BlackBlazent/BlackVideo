# 🚀 Quick Implementation Guide

## 5-Minute Setup

### 1. Copy Files (2 min)

```bash
# Copy to your project
cp commonPlayback.script.ts ./scripts/
cp accessoriesPlayback.script.ts ./scripts/
cp extensionsPlayback.script.ts ./scripts/
cp playlistIntegration.script.ts ./scripts/
cp index.PlaybackIntegration.script.ts ./scripts/
cp playbackIntegration.ui.tsx ./components/
```

### 2. Update VideoSubSettings.tsx (2 min)

```tsx
// Add imports at top
import { PlaybackIntegrationUI } from './components/playbackIntegration.ui';
import { playbackIntegrationRegistry } from './scripts/index.PlaybackIntegration.script';

// Add state in component
const [showIntegration, setShowIntegration] = useState(false);
const [playbackSettings, setPlaybackSettings] = useState({
  disableCommon: false,
  disableAccessories: false,
  disableExtension: false,
  disablePlaylist: false,
});

// Add useEffect
useEffect(() => {
  const settings = playbackIntegrationRegistry.getSettings();
  setPlaybackSettings(settings);
}, []);

// Add handler
const handlePlaybackToggle = (key) => {
  playbackIntegrationRegistry.toggle(key);
  setPlaybackSettings(playbackIntegrationRegistry.getSettings());
};

// Add UI in JSX (see README for full code)
```

### 3. Update Playground.tsx (1 min)

```tsx
// Add import at top
import { playbackIntegrationRegistry } from './scripts/index.PlaybackIntegration.script';

// Add useEffect (initialization happens automatically)
useEffect(() => {
  console.log('[Playground] Playback integration initialized');
}, []);
```

### 4. Verify Class Names

Ensure these classes exist in your HTML:
- `.video-container` (video container div)
- `.video-player-theater-stage` (video element)
- `.controls-bar` (common controls)
- `.hexagon-bar` (accessories)
- `.second-icon-bar` (extensions)
- `.thumbnails-scroll` (playlist)

## ✅ Done!

Open your app and click "Playback Integration" in settings. Toggle controls to test.

---

## 🎯 Key Concepts

### How It Works

```
User clicks toggle
    ↓
Registry.toggle(key)
    ↓
Integration.disable() or .enable()
    ↓
- Hide/show DOM elements (display: none !important)
- Disable/enable buttons and inputs
- Adjust video container height
    ↓
Settings saved to localStorage
```

### Height Calculation

```
Base: 400px
+ Common disabled: +200px = 600px
+ Accessories disabled: +100px = 700px
+ Extensions disabled: +50px = 750px
+ Playlist disabled: +50px = 800px
```

### Disable vs Hide

**This system does BOTH:**
- **Hides**: `display: none !important`
- **Disables**: `disabled="true"` + `pointer-events: none`

Why? Performance! Hidden elements shouldn't consume resources.

---

## 🔥 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Controls don't hide | Check class names match exactly |
| Video doesn't expand | Verify `.video-container` class exists |
| Settings don't persist | Check localStorage is enabled |
| Buttons still clickable | Ensure disable() function runs |

---

## 💡 Pro Tips

1. **Test each toggle individually first**
2. **Check browser console for logs**
3. **Use React DevTools to verify state updates**
4. **Clear localStorage if issues persist**: `localStorage.clear()`
5. **Verify CSS isn't overriding styles**

---

## 📞 Debug Commands

```javascript
// Check current settings
playbackIntegrationRegistry.getSettings()

// Force reset
playbackIntegrationRegistry.resetAll()

// Check if controls are hidden
document.querySelector('.controls-bar').style.display

// Check video container height
document.querySelector('.video-container').style.maxHeight
```

---

## 🎨 Customization Examples

### Change Height Increments

```typescript
// In index.PlaybackIntegration.script.ts
if (this.settings.disableCommon) targetHeight += 300; // Was 200
```

### Add Animation

```typescript
// In disable() method
videoContainer.style.transition = 'max-height 0.3s ease';
videoContainer.style.setProperty('max-height', '600px', 'important');
```

### Change Toggle Icon

```tsx
// In playbackIntegration.ui.tsx
<MonitorOff size={16} /> // Change size
<MonitorOff color="#ff0000" /> // Change color
```

---

**Need help? Check the full README.md for detailed documentation!**
