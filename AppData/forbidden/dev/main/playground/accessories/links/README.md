# BlackVideo Link Player System

A next-generation video platform link player built for the BlackVideo Tauri framework. Supports multiple video platforms with an extensible, modular architecture.

## ✨ Features

- **Multi-Platform Support**: YouTube (more platforms coming soon)
- **Dual Deployment Modes**: Embed popup or Video Stage theater
- **File Upload**: Process multiple URLs from .txt, .json, and .md files
- **Playlist Support**: Auto-play videos sequentially
- **Smart Detection**: Automatic platform and URL validation
- **Modern UI**: Draggable, resizable popup interface
- **Extensible**: Easy to add new platforms
- **TOS Compliant**: Respects platform terms of service

## 🚀 Quick Start

### 1. Installation

Copy all files to your BlackVideo project:

```
accessories/links/
├── link.player.deployer.ui.tsx
├── link.core.deployer.dev.ts
├── links.processors.ts
├── import.modules.ts
├── hybrid.config.ts
├── modules/
│   └── youtube.url.module.ts
└── utils/
    └── filesLinkReader.ts
```

### 2. Basic Usage

```typescript
import LinkDeployerUI from './accessories/links/link.player.deployer.ui';
import { DeployMode } from './accessories/links/link.core.deployer.dev';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDeploy = (data) => {
    console.log('Video deployed:', data);
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Link Player</button>
      
      <LinkDeployerUI
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        config={{
          titleText: 'Link Player Deployer',
          urlPlaceholder: 'Enter video URL...',
          fileTypes: ['.txt', '.json', '.md'],
          onDeploy: handleDeploy,
          onCancel: () => setIsOpen(false)
        }}
      />
    </>
  );
}
```

### 3. Video Stage Integration

Ensure your HTML has the video stage elements:

```html
<div id="videoContainer">
  <video id="VideoPlayer-TheaterStage">
    <source id="VideoSource-Stream" src="" type="video/mp4" />
  </video>
</div>
```

## 🎮 Usage

### Deploy a Single URL

1. Click the link player button
2. Enter a video URL (YouTube, Facebook, etc.)
3. Choose deployment mode:
   - **Go**: Opens in embed popup
   - **Play in Video Stage**: Plays in main theater

### Deploy Multiple URLs

1. Create a file with URLs:

**example-playlist.txt**:
```
https://youtube.com/watch?v=VIDEO1
https://youtube.com/watch?v=VIDEO2
https://youtube.com/watch?v=VIDEO3
```

2. Upload the file
3. Videos will play sequentially

## 📋 Supported Formats

### URLs
- YouTube: `youtube.com`, `youtu.be`
- Facebook: `facebook.com/videos`, `fb.watch` (coming soon)
- Instagram: `instagram.com/p`, `/reel` (coming soon)
- Vimeo: `vimeo.com` (coming soon)
- Direct video files: `.mp4`, `.webm`, `.ogg`

### Files
- **JSON**: `{"urls": ["url1", "url2"]}`
- **Markdown**: `[Title](url)`
- **Text**: One URL per line

## 🔧 Configuration

### Enable/Disable Platforms

```typescript
import { HybridConfig } from './hybrid.config';

// Disable a platform
HybridConfig.setPlatformEnabled('YouTube', false);

// Set priority (lower = higher priority)
HybridConfig.setPlatformPriority('YouTube', 10);
```

### Add Custom URL Patterns

```typescript
HybridConfig.addPlatformPattern('YouTube', /custom-pattern/);
```

## 🛠️ Development

### Adding a New Platform

1. **Create Module**:

```typescript
// modules/newplatform.url.module.ts
export class NewPlatformModule implements PlatformModule {
  public readonly name = 'NewPlatform';
  
  public extractVideoId(url: string): string | null {
    // Extract video ID from URL
  }
  
  public async process(url: string): Promise<string> {
    // Return playable URL
  }
  
  public async getEmbedData(url: string): Promise<EmbedData> {
    // Return embed data
  }
}
```

2. **Register Module**:

```typescript
// import.modules.ts
import { NewPlatformModule } from './modules/newplatform.url.module';

PlatformModules.registerModule('NewPlatform', new NewPlatformModule());
```

3. **Done!** The platform is now supported.

## 📖 API Reference

### LinkDeployerCore

```typescript
class LinkDeployerCore {
  validateUrl(url: string): boolean
  detectPlatform(url: string): string | null
  handleDeploy(mode: DeployMode): Promise<void>
  canDeploy(): boolean
}
```

### PlatformModules

```typescript
class PlatformModules {
  static getModule(platform: string): PlatformModule | null
  static isSupported(platform: string): boolean
  static processUrl(url: string): Promise<string>
  static getEmbedData(url: string): Promise<EmbedData>
}
```

### HybridConfig

```typescript
class HybridConfig {
  static registerPlatform(name, module, patterns?, priority?): void
  static detectPlatform(url: string): PlatformConfig | null
  static addEventListener(event, platform, handler): void
  static emitEvent(event, platform, data): void
}
```

## 🎨 Customization

### UI Styling

Modify `link.deployer.css` to customize:
- Colors and gradients
- Button styles
- Popup dimensions
- Animations

### Behavior

Configure in `link.core.deployer.dev.ts`:
- Deployment logic
- Playlist behavior
- Error handling
- Event emissions

## ⚠️ Important Notes

### YouTube Integration

- Uses official YouTube embed URLs
- Complies with YouTube Terms of Service
- Uses YouTube oEmbed API for metadata
- Does NOT download videos or violate copyright

### Security

- All URLs are validated
- User input is sanitized
- Only text files are accepted for upload
- CORS policies are respected

## 🐛 Troubleshooting

### Video Won't Play

1. Check video stage elements exist
2. Verify URL format is correct
3. Check browser console for errors
4. Ensure platform is supported

### Platform Not Detected

1. Verify URL matches platform patterns
2. Check platform is registered
3. Ensure platform is enabled

### File Upload Issues

1. Check file extension is accepted
2. Verify file content format
3. Check file size limits
4. Look for parsing errors in console

## 📚 Documentation

- [Integration Guide](./INTEGRATION_GUIDE.md) - Detailed setup instructions
- [API Documentation](./API.md) - Full API reference (coming soon)
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute (coming soon)

## 🗺️ Roadmap

- [x] YouTube support
- [x] File upload (.txt, .json, .md)
- [x] Playlist functionality
- [x] Dual deployment modes
- [ ] Facebook support
- [ ] Instagram support
- [ ] Vimeo support
- [ ] TikTok support
- [ ] Advanced playlist editor
- [ ] Video quality selection
- [ ] Keyboard shortcuts
- [ ] Mobile optimization

## 📄 License

Copyright (c) 2026 BlackVideo (Zephyra)  
All Rights Reserved.

This source code is the confidential and proprietary property of BlackVideo.
Unauthorized copying, modification, distribution, or use of this source code,
in whole or in part, is strictly prohibited without prior written permission
from BlackVideo.

## 🙏 Acknowledgments

Built with:
- React + TypeScript
- Lucide React Icons
- YouTube oEmbed API

---

**Made with ❤️ for BlackVideo**
