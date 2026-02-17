# BlackVideo Recording System - Installation Instructions

## Quick Start

### File Installation Map

Copy files to your BlackVideo project as follows:

```
organized_output/
├── main/                          → AppData/fobidden/dev/main/playground/accessories/recorder/
│   ├── float.render.ui.tsx
│   ├── recorder.control.ui.tsx
│   ├── video.recording.ts
│   ├── saved.captured.ts
│   ├── index.ts
│   └── connector.ts
│
├── ui/                            → AppData/fobidden/dev/main/playground/accessories/recorder/ui/
│   ├── video.player.recorder.controller.tsx
│   ├── video.camera.recorder.controller.tsx
│   └── video.dual.recorder.ui.controller.tsx
│
├── styles/                        → src/styles/modals/
│   ├── video.recorder.css
│   └── recorder.control.css
│
└── docs/                          → (Reference documentation)
    ├── README.md
    └── MIGRATION_GUIDE.md
```

## Step-by-Step Installation

### 1. Install Dependencies

```bash
npm install @tauri-apps/api @tauri-apps/plugin-dialog @tauri-apps/plugin-fs lucide-react
```

### 2. Copy Main Files

```bash
# From organized_output/main/ to your recorder directory
cp organized_output/main/* AppData/fobidden/dev/main/playground/accessories/recorder/
```

### 3. Copy UI Controllers

```bash
# Create ui directory if needed
mkdir -p AppData/fobidden/dev/main/playground/accessories/recorder/ui

# Copy UI controllers
cp organized_output/ui/* AppData/fobidden/dev/main/playground/accessories/recorder/ui/
```

### 4. Copy Styles

```bash
# To your styles directory
cp organized_output/styles/* src/styles/modals/
```

### 5. Update Playground.tsx

Add this import and initialization:

```typescript
import { initializeRecorderAccessories } from './playground/accessories/recorder';

// In your component
useEffect(() => {
  initializeRecorderAccessories();
}, []);
```

### 6. Configure Tauri (if not already configured)

**tauri.conf.json**:
```json
{
  "permissions": [
    "dialog:allow-save",
    "fs:allow-write",
    "fs:allow-read",
    "path:allow-download-dir"
  ]
}
```

### 7. Add Backend Commands (Optional - for auto-save)

**src-tauri/Cargo.toml**:
```toml
[dependencies]
tauri = { version = "2.0", features = ["dialog", "fs"] }
dirs = "5.0"
```

**src-tauri/src/main.rs**:
```rust
use tauri::Manager;

#[tauri::command]
fn get_downloads_path() -> String {
    dirs::download_dir()
        .and_then(|p| p.to_str().map(String::from))
        .unwrap_or_else(|| String::from(""))
}

#[tauri::command]
fn show_notification(title: String, body: String, _notification_type: String) -> Result<(), String> {
    println!("Notification: {} - {}", title, body);
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_downloads_path,
            show_notification
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 8. Verify Installation

Check that all files are in place:

```bash
# Check main files
ls AppData/fobidden/dev/main/playground/accessories/recorder/

# Expected output:
# float.render.ui.tsx
# recorder.control.ui.tsx
# video.recording.ts
# saved.captured.ts
# index.ts
# connector.ts
# ui/

# Check UI controllers
ls AppData/fobidden/dev/main/playground/accessories/recorder/ui/

# Expected output:
# video.player.recorder.controller.tsx
# video.camera.recorder.controller.tsx
# video.dual.recorder.ui.controller.tsx

# Check styles
ls src/styles/modals/

# Should include:
# video.recorder.css
# recorder.control.css
```

### 9. Build and Test

```bash
# Development
npm run dev

# Production
npm run build
```

## Verification Checklist

Test each feature:

- [ ] Recording button shows popup
- [ ] Popup is draggable by header
- [ ] Popup is resizable from bottom-right corner
- [ ] "Record Camera" shows submenu
- [ ] "Record Both" shows submenu
- [ ] Video player recording works
- [ ] Camera recording (front) works
- [ ] Camera recording (back) works
- [ ] Dual recording works
- [ ] Camera switch button works
- [ ] Files save to Downloads folder
- [ ] No console errors

## Troubleshooting

### Issue: Module not found errors
**Fix**: Check import paths match your project structure

### Issue: Styles not applying
**Fix**: 
1. Clear browser cache
2. Check CSS files are imported
3. Verify CSS custom properties exist

### Issue: Tauri commands not working
**Fix**:
1. Rebuild Rust backend: `cd src-tauri && cargo clean && cargo build`
2. Restart dev server
3. Check command registration in main.rs

### Issue: Camera permissions denied
**Fix**:
1. Allow camera in browser settings
2. Use HTTPS or localhost
3. Check for conflicting camera usage

## Production Deployment

Before deploying to production:

1. **Test all recording modes** thoroughly
2. **Test on target platforms** (Windows, macOS, Linux)
3. **Optimize bundle size** if needed
4. **Configure permissions** properly in Tauri
5. **Add error tracking** for production issues

## Support Files

- **README.md**: Complete system documentation
- **MIGRATION_GUIDE.md**: Upgrade from old version

## Additional Configuration

### Custom CSS Variables

If your app uses different CSS custom properties, update these in the CSS files:

```css
/* In video.recorder.css and recorder.control.css */
--background-dark
--border-medium
--text-primary
--text-secondary
--primary-blue
--surface-color
```

### Custom Video Element ID

If your video element has a different ID, update in `video.recording.ts`:

```typescript
// Change this line:
videoElement = document.getElementById('VideoPlayer-TheaterStage') as HTMLVideoElement;

// To your ID:
videoElement = document.getElementById('YOUR-VIDEO-ID') as HTMLVideoElement;
```

## Next Steps

1. Read README.md for full feature documentation
2. Read MIGRATION_GUIDE.md if upgrading from old version
3. Test all features in your development environment
4. Deploy to staging for user acceptance testing
5. Deploy to production

---

**Need Help?** Check the documentation files or review the source code comments.
