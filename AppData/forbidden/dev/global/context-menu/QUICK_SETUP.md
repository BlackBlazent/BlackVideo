# 🚀 Quick Setup Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
npm install lucide-react
```

### 2. Copy Files to Your Project

Copy the entire `context-menu-system` folder structure into your project:

```
your-project/
├── indexContextMenu.ts
├── globalNavigationContextMenu.ts
├── playgroundCommonMainPlaybackContextMenu.ts
├── playgroundCustomPlaybackContextMenu.ts
├── playgroundExtensionPlaybackContextMenu.ts
├── playgroundPlaybackAccessoriesContextMenu.ts
├── playgroundVideoTheaterStageContextMenu.ts
├── components/ui/
│   ├── globalNavigationContextMenu.tsx
│   ├── playgroundCommonMainPlaybackContextMenu.tsx
│   ├── playgroundCustomPlaybackContextMenu.tsx
│   ├── playgroundExtensionPlaybackContextMenu.tsx
│   ├── playgroundPlaybackAccessoriesContextMenu.tsx
│   └── playgroundVideoTheaterStageContextMenu.tsx
└── src/styles/others/
    ├── globalNavigationContextMenu.css
    └── playgroundContextMenu.css
```

### 3. Add to App.tsx (Global Navigation)

```tsx
import { GlobalNavigationContextMenu } from './components/ui/globalNavigationContextMenu';

function App() {
  return (
    <>
      <header id="blackvideoTopNavigation" className="blackvideo-top-navigation">
        {/* Your existing header content */}
      </header>
      
      {/* Add this single line */}
      <GlobalNavigationContextMenu targetElementId="blackvideoTopNavigation" />
    </>
  );
}
```

### 4. Add to Playground.tsx (Video Player Controls)

```tsx
import { PlaygroundCommonMainPlaybackContextMenu } from './components/ui/playgroundCommonMainPlaybackContextMenu';
import { PlaygroundCustomPlaybackContextMenu } from './components/ui/playgroundCustomPlaybackContextMenu';
import { PlaygroundPlaybackAccessoriesContextMenu } from './components/ui/playgroundPlaybackAccessoriesContextMenu';
import { PlaygroundExtensionPlaybackContextMenu } from './components/ui/playgroundExtensionPlaybackContextMenu';
import { PlaygroundVideoTheaterStageContextMenu } from './components/ui/playgroundVideoTheaterStageContextMenu';

function Playground() {
  return (
    <>
      {/* Your existing video player components */}
      
      {/* Add these 5 lines */}
      <PlaygroundCommonMainPlaybackContextMenu targetElementId="videoElements" />
      <PlaygroundCustomPlaybackContextMenu targetElementId="video-submenu" />
      <PlaygroundPlaybackAccessoriesContextMenu targetElementId="accessories-built-ins" />
      <PlaygroundExtensionPlaybackContextMenu targetElementId="extension-built-ins" />
      <PlaygroundVideoTheaterStageContextMenu targetElementId="videoContainer" />
    </>
  );
}
```

## 🎯 Usage

Right-click on these elements to open context menus:

1. **Header** (blackvideoTopNavigation) - Global navigation settings
2. **Video Controls** (videoElements) - Show/hide playback controls
3. **Video Submenu** (video-submenu) - Custom playback options
4. **Accessories Bar** (accessories-built-ins) - Accessories and icon shapes
5. **Extensions Bar** (extension-built-ins) - Extension management
6. **Video Player** (VideoPlayer-TheaterStage) - Video-specific actions

## 🎨 Customization

### Change Colors

Edit `src/styles/others/globalNavigationContextMenu.css`:

```css
/* Line 8-10: Change menu background gradient */
background: linear-gradient(135deg, 
  rgba(YOUR_R, YOUR_G, YOUR_B, 0.98) 0%, 
  rgba(YOUR_R, YOUR_G, YOUR_B, 0.98) 100%);

/* Line 57: Change checkmark color */
color: rgba(YOUR_R, YOUR_G, YOUR_B, 1);
```

Edit `src/styles/others/playgroundContextMenu.css` for video player menus.

### Add Menu Options

Edit the manager files (e.g., `globalNavigationContextMenu.ts`):

```typescript
getContextMenuOptions(): ContextMenuOption[] {
  return [
    {
      id: 'my-custom-option',
      label: 'My Custom Feature',
      checked: false,
      action: () => {
        console.log('Custom action triggered');
        // Your code here
      },
    },
  ];
}
```

## 🐛 Troubleshooting

**Context menu not appearing?**
- Check that element IDs match your HTML
- Verify imports are correct
- Check browser console for errors

**Submenu not showing?**
- Submenus auto-position to stay in viewport
- Check that submenu options are defined

**Styling issues?**
- Ensure CSS files are imported
- Check z-index conflicts (menus use 999999)

## 📚 Full Documentation

See `README.md` for:
- Complete API reference
- Advanced customization
- State management details
- Accessibility features
- Performance tips

## ✨ Features Included

✅ 6 different context menu types
✅ Multi-level nested submenus
✅ Checkable menu items
✅ Smooth animations & transitions
✅ Viewport-aware positioning
✅ Keyboard navigation support
✅ High contrast mode support
✅ Reduced motion support
✅ Custom scrollbars
✅ Click-outside detection
✅ State management with managers
✅ TypeScript types included
✅ Lucide React icons
✅ Distinctive modern design

## 🎉 You're Done!

Right-click on any target element to see your new context menus in action!
