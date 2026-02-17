# BlackVideo Link Player - Integration Guide

## Overview
This refactored system provides a modular, extensible video link player with support for YouTube and easy integration for additional platforms.

## File Structure

```bash
accessories/links/
├── link.player.deployer.ui.tsx          # Main UI component
├── link.core.deployer.dev.ts            # Core logic and deployment
├── links.processors.ts                  # URL extraction and processing
├── import.modules.ts                    # Platform module registry
├── hybrid.config.ts                     # Configuration management
├── modules/
│   └── youtube.url.module.ts           # YouTube integration
├── utils/
│   └── filesLinkReader.ts              # File parsing utilities
└── cli/
    └── link.deployer.cli.connector.ts  # CLI interface (optional)
```

## Integration Steps

### 1. Update Playground.tsx

```typescript
import LinkDeployerUI from '../../../AppData/forbidden/dev/main/playground/accessories/links/link.player.deployer.ui';
import { DeployerData, DeployMode } from '../../../AppData/forbidden/dev/main/playground/accessories/links/link.core.deployer.dev';
import { VideoTheaterStage } from '../../../AppData/forbidden/dev/main/player/Video.Theater.Stage';

// State
const [isDeployerOpen, setIsDeployerOpen] = useState(false);

// Enhanced deploy handler
const handleDeploy = (data: DeployerData) => {
  console.log('Deployment Data:', data);
  
  if (data.mode === DeployMode.VIDEO_STAGE) {
    console.log('Deploying to Video Stage');
    // Video stage deployment is handled automatically by the core
  } else if (data.mode === DeployMode.EMBED) {
    console.log('Deploying to Embed Window');
    // Embed deployment is handled automatically by the core
  }

  setIsDeployerOpen(false);
};

const handleCancel = () => {
  console.log('Deployment cancelled');
  setIsDeployerOpen(false);
};

// Render LinkDeployer UI
<LinkDeployerUI
  isOpen={isDeployerOpen}
  onClose={() => setIsDeployerOpen(false)}
  config={{
    titleText: 'Link Player Deployer',
    urlPlaceholder: 'https://youtube.com/watch?v=... or any supported video URL',
    fileTypes: ['.txt', '.json', '.md'],
    onDeploy: handleDeploy,
    onCancel: handleCancel
  }}
/>
```

### 2. Video Stage Setup

Ensure your video stage has the required HTML structure:

```html
<div id="videoContainer">
  <video id="VideoPlayer-TheaterStage" className="video-player-theater-stage video-js">
    <source id="VideoSource-Stream" className="video-source" src="/media/sample.mp4" type="video/mp4" />
    <track label="English" kind="subtitles" srcLang="en" src="" default />
    Your browser does not support the video tag.
  </video>
</div>
```

### 3. Import Required Styles

Add to your styles directory:

```css
@import '../../../AppData/forbidden/dev/main/playground/accessories/links/link.deployer.css';
```

## Features

### 1. Dual Deployment Modes

#### **Embed Mode** (Go Button)
- Creates a popup with embedded iframe
- Suitable for quick preview
- Automatically handles YouTube embed URLs

#### **Video Stage Mode** (Play in Video Stage Button)
- Deploys directly to the main video player
- Full theater experience
- Supports playlist from file uploads

### 2. Platform Detection

The system automatically detects platforms:
- YouTube (youtube.com, youtu.be)
- Facebook (coming soon)
- Instagram (coming soon)
- Vimeo (coming soon)
- TikTok (coming soon)
- Generic URLs

### 3. File Upload Support

Upload files containing video URLs:

**JSON Format:**
```json
{
  "urls": [
    "https://youtube.com/watch?v=VIDEO_ID1",
    "https://youtube.com/watch?v=VIDEO_ID2"
  ]
}
```

**Markdown Format:**
```markdown
# My Video List
- [Video 1](https://youtube.com/watch?v=VIDEO_ID1)
- [Video 2](https://youtube.com/watch?v=VIDEO_ID2)
```

**Text Format:**
```text
https://youtube.com/watch?v=VIDEO_ID1
https://youtube.com/watch?v=VIDEO_ID2
# Comments are ignored
```

### 4. Playlist Functionality

When uploading a file with multiple URLs:
- First video plays immediately
- Subsequent videos auto-play after current video ends
- Works in both Embed and Video Stage modes

## YouTube Integration

### How It Works

The YouTube module (`youtube.url.module.ts`):
1. Extracts video IDs from various YouTube URL formats
2. Generates proper embed URLs
3. Uses YouTube's oEmbed API for metadata (compliant with TOS)
4. Never attempts to download or extract video files directly

### Supported URL Formats

```javascript
// Standard watch URL
https://www.youtube.com/watch?v=VIDEO_ID

// Short URL
https://youtu.be/VIDEO_ID

// Embed URL
https://www.youtube.com/embed/VIDEO_ID

// Old format
https://www.youtube.com/v/VIDEO_ID
```

### YouTube TOS Compliance

The implementation:
- Uses official YouTube embed URLs
- Utilizes the YouTube oEmbed API for metadata
- Never attempts direct video file extraction
- Complies with YouTube's Terms of Service

## Adding New Platforms

### 1. Create a Platform Module

```typescript
// modules/facebook.url.module.ts
import { PlatformModule, EmbedData } from './youtube.url.module';

export class FacebookModule implements PlatformModule {
  public readonly name = 'Facebook';

  public extractVideoId(url: string): string | null {
    // Implementation
  }

  public async process(url: string): Promise<string> {
    // Implementation
  }

  public async getEmbedData(url: string): Promise<EmbedData> {
    // Implementation
  }
}
```

### 2. Register the Module

```typescript
// import.modules.ts
import { FacebookModule } from './modules/facebook.url.module';

PlatformModules.registerModule('Facebook', new FacebookModule());
```

### 3. Add URL Patterns (Optional)

```typescript
// hybrid.config.ts
HybridConfig.registerPlatform('Facebook', new FacebookModule(), [
  /facebook\.com\/.*\/videos\/(\d+)/,
  /fb\.watch\/([^&\s]+)/
], 90); // Priority: 90
```

## Event System

Listen to platform events:

```typescript
import { HybridConfig } from './hybrid.config';

// Listen for video load events
HybridConfig.addEventListener('video-loaded', 'YouTube', (data) => {
  console.log('YouTube video loaded:', data);
});

// Emit custom events
HybridConfig.emitEvent('custom-event', 'YouTube', { videoId: '...' });
```

## CLI Usage (Optional)

```bash
# Process a URL
> process https://youtube.com/watch?v=VIDEO_ID

# List supported platforms
> platforms

# Detect platform
> detect https://youtube.com/watch?v=VIDEO_ID

# Extract video ID
> extract https://youtube.com/watch?v=VIDEO_ID

# Get embed data
> embed https://youtube.com/watch?v=VIDEO_ID

# Show help
> help
```

## Best Practices

1. **Always validate URLs** before processing
2. **Handle errors gracefully** with try-catch blocks
3. **Provide user feedback** during processing
4. **Test with various URL formats** for each platform
5. **Respect platform terms of service**

## Troubleshooting

### Video not playing in Video Stage

1. Check that `VideoPlayer-TheaterStage` element exists
2. Verify `VideoSource-Stream` element exists
3. Ensure `VideoTheaterStage.getInstance()` is initialized
4. Check browser console for errors

### Platform not detected

1. Verify URL format is correct
2. Check platform patterns in `hybrid.config.ts`
3. Ensure platform module is registered in `import.modules.ts`

### File upload not working

1. Check file extension is in accepted types
2. Verify file content format (JSON, Markdown, Text)
3. Check browser console for parsing errors

## Security Considerations

1. **URL Validation**: All URLs are validated before processing
2. **XSS Prevention**: User input is sanitized
3. **CORS Handling**: Embed iframes handle cross-origin properly
4. **File Safety**: Only text files (.txt, .json, .md) are accepted

## Performance Tips

1. **Lazy Load Videos**: Load videos only when needed
2. **Cache Metadata**: Store video info to reduce API calls
3. **Optimize File Parsing**: Use streaming for large files
4. **Debounce URL Input**: Prevent excessive validation

## Future Enhancements

- [ ] Support for more platforms (Facebook, Instagram, Vimeo, TikTok)
- [ ] Advanced playlist management
- [ ] Video quality selection
- [ ] Download functionality (where permitted)
- [ ] Thumbnail generation
- [ ] Search integration
- [ ] Favorites/bookmarks system
- [ ] Keyboard shortcuts
- [ ] Mobile optimization

## License

Copyright (c) 2026 BlackVideo (Zephyra)
All Rights Reserved.
