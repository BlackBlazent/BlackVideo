# Context Menu System Documentation

A comprehensive, feature-rich context menu system for BlackVideo with distinctive design and smooth animations.

## 🎯 Features

- **6 Context Menu Types**:
  - Global Navigation (Header)
  - Common Main Playback Controls
  - Custom Playback (Video Submenu)
  - Playback Accessories (Hexagon Bar)
  - Extension Playback
  - Video Theater Stage

- **Advanced Functionality**:
  - Multi-level nested submenus
  - Checkable menu items
  - Disabled states
  - Keyboard navigation
  - Smooth animations
  - Viewport-aware positioning
  - Click-outside detection
  - High contrast mode support
  - Reduced motion support

- **Distinctive Design**:
  - Modern gradient backgrounds
  - Glassmorphism effects
  - Smooth transitions
  - Custom scrollbars
  - Lucide React icons
  - Hover effects with glow

## 📁 File Structure

```
project/
├── indexContextMenu.ts                                    # Central index & utilities
├── globalNavigationContextMenu.ts                         # Navigation logic
├── playgroundCommonMainPlaybackContextMenu.ts            # Common playback logic
├── playgroundCustomPlaybackContextMenu.ts                 # Custom playback logic
├── playgroundPlaybackAccessoriesContextMenu.ts           # Accessories logic
├── playgroundExtensionPlaybackContextMenu.ts             # Extension logic
├── playgroundVideoTheaterStageContextMenu.ts             # Video theater logic
├── components/ui/
│   ├── globalNavigationContextMenu.tsx                   # Navigation UI
│   ├── playgroundCommonMainPlaybackContextMenu.tsx       # Common playback UI
│   ├── playgroundCustomPlaybackContextMenu.tsx           # Custom playback UI
│   ├── playgroundPlaybackAccessoriesContextMenu.tsx      # Accessories UI
│   ├── playgroundExtensionPlaybackContextMenu.tsx        # Extension UI
│   └── playgroundVideoTheaterStageContextMenu.tsx        # Video theater UI
└── src/styles/others/
    ├── globalNavigationContextMenu.css                   # Navigation styles
    └── playgroundContextMenu.css                         # Playground styles
```

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install lucide-react
```

### 2. Copy Files

Copy all TypeScript files to your project root or appropriate directory:
- `indexContextMenu.ts`
- `globalNavigationContextMenu.ts`
- `playgroundCommonMainPlaybackContextMenu.ts`
- `playgroundCustomPlaybackContextMenu.ts`
- `playgroundPlaybackAccessoriesContextMenu.ts`
- `playgroundExtensionPlaybackContextMenu.ts`
- `playgroundVideoTheaterStageContextMenu.ts`

Copy React components to `./components/ui/`:
- All `.tsx` files from the components folder

Copy CSS files to `./src/styles/others/`:
- `globalNavigationContextMenu.css`
- `playgroundContextMenu.css`

### 3. Import in App.tsx

```tsx
import React from 'react';
import { GlobalNavigationContextMenu } from './components/ui/globalNavigationContextMenu';

function App() {
  // ... your existing code

  return (
    <div className="app">
      {/* Your existing header */}
      <header id="blackvideoTopNavigation" className="blackvideo-top-navigation">
        {/* ... existing header content ... */}
      </header>

      {/* Add context menu component */}
      <GlobalNavigationContextMenu targetElementId="blackvideoTopNavigation" />

      {/* ... rest of your app ... */}
    </div>
  );
}

export default App;
```

### 4. Import in Playground.tsx

```tsx
import React from 'react';
import { PlaygroundCommonMainPlaybackContextMenu } from './components/ui/playgroundCommonMainPlaybackContextMenu';
import { PlaygroundCustomPlaybackContextMenu } from './components/ui/playgroundCustomPlaybackContextMenu';
import { PlaygroundPlaybackAccessoriesContextMenu } from './components/ui/playgroundPlaybackAccessoriesContextMenu';
import { PlaygroundExtensionPlaybackContextMenu } from './components/ui/playgroundExtensionPlaybackContextMenu';
import { PlaygroundVideoTheaterStageContextMenu } from './components/ui/playgroundVideoTheaterStageContextMenu';

function Playground() {
  // ... your existing code

  return (
    <div className="playground">
      {/* Video player container */}
      <div ref={containerRef} id="videoContainer" className="video-container">
        <video ref={videoRef} id="VideoPlayer-TheaterStage" /* ... */>
          {/* ... */}
        </video>
      </div>

      {/* Video controls */}
      <div id="videoElements" className="video-elements">
        {/* ... existing controls ... */}
      </div>

      {/* Custom video submenu */}
      <div className="video-submenu">
        {/* ... existing submenu ... */}
      </div>

      {/* Accessories */}
      <div id="accessories-built-ins" className="hexagon-bar">
        {/* ... existing accessories ... */}
      </div>

      {/* Extensions */}
      <div id="extension-built-ins" className="second-icon-bar">
        {/* ... existing extensions ... */}
      </div>

      {/* Add context menu components */}
      <PlaygroundCommonMainPlaybackContextMenu targetElementId="videoElements" />
      <PlaygroundCustomPlaybackContextMenu targetElementId="video-submenu" />
      <PlaygroundPlaybackAccessoriesContextMenu targetElementId="accessories-built-ins" />
      <PlaygroundExtensionPlaybackContextMenu targetElementId="extension-built-ins" />
      <PlaygroundVideoTheaterStageContextMenu targetElementId="videoContainer" />
    </div>
  );
}

export default Playground;
```

## 🎨 Customization

### Changing Colors

Edit the CSS files to customize the color scheme:

**globalNavigationContextMenu.css:**
```css
/* Change primary gradient colors */
.global-navigation-context-menu {
  background: linear-gradient(135deg, 
    rgba(YOUR_COLOR_1) 0%, 
    rgba(YOUR_COLOR_2) 100%);
}

/* Change accent color for checkmarks */
.menu-item-check {
  color: rgba(YOUR_ACCENT_COLOR);
}
```

**playgroundContextMenu.css:**
```css
/* Change playground gradient colors */
.playground-context-menu {
  background: linear-gradient(135deg, 
    rgba(YOUR_COLOR_1) 0%, 
    rgba(YOUR_COLOR_2) 100%);
}

/* Change hover effect colors */
.context-menu-item::before {
  background: linear-gradient(90deg, 
    rgba(YOUR_HOVER_COLOR_1) 0%, 
    rgba(YOUR_HOVER_COLOR_2) 100%);
}
```

### Modifying Menu Options

Edit the TypeScript logic files to add/remove menu options:

```typescript
// Example: Adding a new option in globalNavigationContextMenu.ts
getContextMenuOptions(): ContextMenuOption[] {
  return [
    // ... existing options
    {
      id: 'my-new-option',
      label: 'My New Feature',
      checked: false,
      action: () => {
        console.log('New feature triggered');
        // Your custom logic here
      },
    },
  ];
}
```

### Changing Animations

Modify animation timing in CSS:

```css
@keyframes contextMenuSlideIn {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Apply custom timing */
.global-navigation-context-menu {
  animation: contextMenuSlideIn 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
```

## 🔧 API Reference

### Context Menu Managers

Each context menu has a manager class that handles state and options:

#### GlobalNavigationContextMenuManager

```typescript
import { globalNavigationContextMenuManager } from './globalNavigationContextMenu';

// Get current settings
const settings = globalNavigationContextMenuManager.getSettings();

// Update toolbar visibility
globalNavigationContextMenuManager.updateToolbarVisibility('menuBar', false);

// Update search bar design
globalNavigationContextMenuManager.updateSearchBarDesign('material');

// Update transparency
globalNavigationContextMenuManager.updateTransparency(80);

// Restore defaults
globalNavigationContextMenuManager.restoreDefaults();

// Subscribe to changes
const unsubscribe = globalNavigationContextMenuManager.subscribe((settings) => {
  console.log('Settings updated:', settings);
});
```

#### PlaybackControlsContextMenuManager

```typescript
import { playbackControlsContextMenuManager } from './playgroundCommonMainPlaybackContextMenu';

// Get visibility state
const visibility = playbackControlsContextMenuManager.getVisibility();

// Toggle a control
playbackControlsContextMenuManager.toggleControl('fullscreen');

// Show all controls
playbackControlsContextMenuManager.showAll();

// Hide all controls
playbackControlsContextMenuManager.hideAll();
```

#### AccessoriesContextMenuManager

```typescript
import { accessoriesContextMenuManager } from './playgroundPlaybackAccessoriesContextMenu';

// Get settings
const settings = accessoriesContextMenuManager.getSettings();

// Toggle accessory
accessoriesContextMenuManager.toggleAccessory('linkDeployer');

// Change icon shape
accessoriesContextMenuManager.setIconShape('circle');

// Restore defaults
accessoriesContextMenuManager.restoreDefaults();
```

## 🎯 Usage Examples

### Example 1: Programmatically Hide a Control

```typescript
import { playbackControlsContextMenuManager } from './playgroundCommonMainPlaybackContextMenu';

// Hide the fullscreen button
playbackControlsContextMenuManager.toggleControl('fullscreen');

// Subscribe to changes and update UI
playbackControlsContextMenuManager.subscribe((visibility) => {
  const fullscreenBtn = document.getElementById('fullscreen-controller');
  if (fullscreenBtn) {
    fullscreenBtn.style.display = visibility.fullscreen ? 'block' : 'none';
  }
});
```

### Example 2: Custom Menu Action

```typescript
import { videoTheaterContextMenuManager } from './playgroundVideoTheaterStageContextMenu';

// Override the copy link action
const originalOptions = videoTheaterContextMenuManager.getContextMenuOptions();
const copyLinkOption = originalOptions.find(opt => opt.id === 'copy-link');
if (copyLinkOption) {
  copyLinkOption.action = () => {
    const videoUrl = 'https://your-custom-url.com/video';
    navigator.clipboard.writeText(videoUrl);
    alert('Custom video link copied!');
  };
}
```

### Example 3: Dynamic Extension Management

```typescript
import { extensionContextMenuManager } from './playgroundExtensionPlaybackContextMenu';

// Add a new extension
extensionContextMenuManager.addExtension({
  id: 'my-extension',
  name: 'My Custom Extension',
  visible: true,
  iconPath: '/path/to/icon.png',
  createdAt: new Date(),
  rating: 5.0,
});

// Change sort order
extensionContextMenuManager.setSortBy('ratings');
```

## 🐛 Troubleshooting

### Context Menu Not Appearing

1. **Check element ID**: Ensure the `targetElementId` matches your HTML element
2. **Check z-index**: Context menus use `z-index: 999999` and `999998`
3. **Check imports**: Verify all imports are correct
4. **Check CSS**: Ensure CSS files are imported

### Right-Click Not Working

1. **Event propagation**: Ensure no parent elements are stopping event propagation
2. **Check target**: The context menu only triggers on the specified element
3. **Console errors**: Check browser console for JavaScript errors

### Submenu Not Showing

1. **Viewport space**: Submenus auto-position to stay in viewport
2. **Check options**: Verify submenu options are defined in the manager
3. **Click detection**: Ensure you're clicking on items with submenus

## 📝 Best Practices

1. **Performance**: Context menus are lightweight but avoid creating unnecessary instances
2. **Accessibility**: Test with keyboard navigation (Tab, Enter, Escape)
3. **Mobile**: Consider touch events for mobile support
4. **State Management**: Use the manager classes to maintain consistent state
5. **Testing**: Test on different screen sizes and resolutions

## 🎨 Design Philosophy

This context menu system follows these principles:

- **Distinctive**: Avoids generic AI aesthetics with unique gradients and animations
- **Functional**: Production-ready with proper event handling and state management
- **Accessible**: Supports keyboard navigation, high contrast, and reduced motion
- **Performant**: Efficient rendering with CSS animations and proper cleanup
- **Extensible**: Easy to add new options and customize behavior

## 📄 License

This context menu system is provided as part of the BlackVideo project.

## 🤝 Contributing

To contribute improvements:

1. Modify the TypeScript logic files for new features
2. Update React components for UI changes
3. Enhance CSS for visual improvements
4. Update this README with your changes

## 📞 Support

For issues or questions:

1. Check the Troubleshooting section
2. Review the API Reference
3. Examine the example integrations
4. Check browser console for errors

---

**Happy Coding! 🚀**
