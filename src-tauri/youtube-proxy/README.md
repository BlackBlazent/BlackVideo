# BlackVideo YouTube Drag & Drop Feature

## 📋 Overview

This feature allows users to drag YouTube video thumbnails from their browser and drop them directly into BlackVideo's video player. The video will stream and play using the native `<video>` tag without requiring iframe manipulation.

## 🎯 Features

- ✅ Drag & drop YouTube video thumbnails from any browser
- ✅ Support for standard YouTube URLs (`youtube.com/watch`)
- ✅ Support for short URLs (`youtu.be/VIDEO_ID`)
- ✅ Support for YouTube Shorts (`youtube.com/shorts/VIDEO_ID`)
- ✅ Support for embed URLs (`youtube.com/embed/VIDEO_ID`)
- ✅ Native `<video>` tag playback (no iframe required)
- ✅ Full video controls (play, pause, seek, volume)
- ✅ Visual drag feedback
- ✅ Queue support for future playlist implementation
- ✅ Error handling and user notifications

## 🏗️ Architecture

The solution uses a **3-tier architecture**:

```
┌─────────────────┐
│  Tauri Frontend │  (React + TypeScript)
│  Video Player   │  Handles UI and drag events
└────────┬────────┘
         │
         ↓ HTTP Request
┌─────────────────┐
│  Node.js Proxy  │  (Express Server)
│  Port 9292      │  Fetches and streams video
└────────┬────────┘
         │
         ↓ ytdl-core
┌─────────────────┐
│  YouTube API    │  
│  Video Sources  │  
└─────────────────┘
```

**Why this approach?**
- YouTube blocks direct `<video>` tag access due to CORS
- `ytdl-core` requires Node.js (can't run in browser)
- Proxy server acts as middleware to bypass restrictions
- Maintains native video player experience

## 📦 File Structure

```
BlackVideo/
├── src-tauri/
│   └── youtube-proxy/          # Proxy server directory
│       ├── youtube-stream-server.js
│       ├── package.json
│       ├── start-proxy.bat     # Windows startup
│       └── start-proxy.sh      # Linux/Mac startup
│
└── AppData/forbidden/playground/theater-stage/dropper-modules/@youtube/
    ├── youtube.url.processor.ts      # URL parsing & API communication
    ├── dragDropYouTube.url.ts        # Drag & drop handler
    └── youtube-dropper.css           # Styling
```

## 🚀 Installation & Setup

### Step 1: Install Proxy Server Dependencies

Navigate to the proxy server directory:

```bash
cd src-tauri/youtube-proxy
npm install
```

Or if using pnpm (recommended):

```bash
cd src-tauri/youtube-proxy
pnpm install
```

### Step 2: Start the Proxy Server

**Windows:**
```bash
start-proxy.bat
```

**Linux/Mac:**
```bash
chmod +x start-proxy.sh
./start-proxy.sh
```

**Or manually:**
```bash
node youtube-stream-server.js
```

The server will start on `http://localhost:9292`

### Step 3: Integrate into Tauri App

1. **Copy files to your project:**
   - `youtube.url.processor.ts` → `AppData/forbidden/playground/theater-stage/dropper-modules/@youtube/`
   - `dragDropYouTube.url.ts` → `AppData/forbidden/playground/theater-stage/dropper-modules/@youtube/`
   - `youtube-dropper.css` → Your styles directory

2. **Import the CSS in your main stylesheet:**
   ```css
   @import './youtube-dropper.css';
   ```

3. **Update Playground.tsx:**

```typescript
import { useEffect, useRef } from 'react';
import { YouTubeDragDropHandler } from '../../../AppData/forbidden/dev/main/playground/theater-stage/dropper-modules/@youtube/dragDropYouTube.url';

function Playground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && videoRef.current) {
      try {
        console.log("BlackVideo: Initializing YouTube Dropper...");
        const handler = new YouTubeDragDropHandler(
          containerRef.current, 
          videoRef.current
        );

        // Cleanup on unmount
        return () => handler.destroy();
      } catch (err) {
        console.error("BlackVideo: Dropper Init Failed", err);
      }
    }
  }, []);

  return (
    <div ref={containerRef} id="videoContainer">
      <video 
        ref={videoRef} 
        id="VideoPlayer-TheaterStage" 
        className="video-player-theater-stage video-js" 
        poster="/media/poster.placeholder.png" 
        controls
      >
        <source 
          id="VideoSource-Stream" 
          className="video-source" 
          src="/media/sample.mp4" 
          type="video/mp4" 
        />
        <track 
          label="English" 
          kind="subtitles" 
          srcLang="en" 
          src="" 
          default 
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
```

## 🎮 Usage

1. **Start the proxy server** (must be running before using the app)
2. **Open BlackVideo application**
3. **Go to any YouTube video**
4. **Drag the video thumbnail** (or drag from the URL bar)
5. **Drop it onto the video player**
6. **Video will automatically load and play!**

### Supported URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/shorts/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- URLs with playlists: `?list=PLAYLIST_ID` (coming soon)

## 🔧 Configuration

### Change Proxy Port

Edit `youtube-stream-server.js`:

```javascript
const PORT = 9292; // Change to your preferred port
```

Also update `youtube.url.processor.ts`:

```typescript
const YOUTUBE_PROXY_BASE_URL = 'http://localhost:9292'; // Match the port
```

### Quality Settings

Edit the quality preference in `youtube-stream-server.js`:

```javascript
const format = ytdl.chooseFormat(info.formats, { 
  quality: 'highest',           // Options: highest, lowest, highestaudio, highestvideo
  filter: 'audioandvideo'       // Ensures both audio and video
});
```

## 🐛 Troubleshooting

### "YouTube proxy offline" message

**Cause:** The proxy server is not running.

**Solution:** 
1. Start the proxy server: `node youtube-stream-server.js`
2. Check if port 9292 is available
3. Check console for error messages

### Video won't play / No audio

**Cause:** Format selection issue.

**Solution:**
- Ensure proxy is using `filter: 'audioandvideo'`
- Check browser console for errors
- Try a different video

### "Failed to fetch video info"

**Cause:** YouTube rate limiting or video restrictions.

**Solution:**
- Wait a few minutes and try again
- Check if the video is available in your region
- Ensure stable internet connection

### CORS errors

**Cause:** Proxy server CORS configuration.

**Solution:**
- Check that your Tauri app origin is in the CORS whitelist
- Add your development URL to the CORS origins in `youtube-stream-server.js`

## 🔒 Security Notes

- The proxy server should only run locally
- Do not expose the proxy port to the internet
- YouTube's terms of service apply
- Respect content creator rights
- Consider rate limiting for production use

## 🚀 Future Enhancements

- [ ] Playlist support
- [ ] Queue management UI
- [ ] Download functionality
- [ ] Quality selector
- [ ] Subtitles/captions support
- [ ] Background playback
- [ ] Integration with other platforms (Facebook, Instagram, etc.)

## 📝 API Endpoints

### GET /stream/:videoId
Streams YouTube video content
- **Response:** Video stream (video/mp4)

### GET /info/:videoId
Get video metadata
- **Response:** JSON with title, duration, thumbnail, etc.

### GET /validate/:videoId
Validate video ID
- **Response:** `{ valid: boolean }`

### GET /health
Health check
- **Response:** `{ status: 'ok', service: 'BlackVideo YouTube Proxy' }`

## 📄 License

Copyright (c) 2026 BlackVideo (Zephyra)  
All Rights Reserved.

This source code is proprietary and confidential.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs
3. Verify proxy server is running
4. Check YouTube video availability

---

**Made with ❤️ for BlackVideo**
