# 🚀 Quick Start Guide - YouTube Drag & Drop

## ⚡ 5-Minute Setup

### 1️⃣ Install Proxy Server (One-time)

```bash
# Navigate to your project root
cd your-blackvideo-project

# Create proxy directory
mkdir -p src-tauri/youtube-proxy
cd src-tauri/youtube-proxy

# Copy these files:
# - youtube-stream-server.js
# - package.json
# - start-proxy.bat (Windows) or start-proxy.sh (Linux/Mac)

# Install dependencies
npm install
# or
pnpm install
```

### 2️⃣ Start Proxy Server

**Windows:**
```bash
start-proxy.bat
```

**Linux/Mac:**
```bash
chmod +x start-proxy.sh
./start-proxy.sh
```

**Manual:**
```bash
node youtube-stream-server.js
```

You should see:
```
╔════════════════════════════════════════════════════════════╗
║  BlackVideo YouTube Stream Server                          ║
║  Port: 9292                                                ║
║  Status: Running                                           ║
╚════════════════════════════════════════════════════════════╝
```

### 3️⃣ Add to Your React Component

```typescript
// Playground.tsx
import { useEffect, useRef } from 'react';
import { YouTubeDragDropHandler } from './path/to/dragDropYouTube.url';

function Playground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && videoRef.current) {
      const handler = new YouTubeDragDropHandler(
        containerRef.current,
        videoRef.current
      );
      return () => handler.destroy();
    }
  }, []);

  return (
    <div ref={containerRef} id="videoContainer">
      <video ref={videoRef} id="VideoPlayer-TheaterStage" controls>
        <source id="VideoSource-Stream" src="" type="video/mp4" />
      </video>
    </div>
  );
}
```

### 4️⃣ Test It!

1. Open your BlackVideo app
2. Go to YouTube in your browser
3. Drag any video thumbnail
4. Drop it on your video player
5. Video plays! 🎉

---

## 🔥 Common Commands

```bash
# Start proxy (development)
npm start

# Start with auto-restart (requires nodemon)
npm run dev

# Check if proxy is running
curl http://localhost:9292/health

# Test with a specific video
curl http://localhost:9292/info/dQw4w9WgXcQ
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Proxy offline" | Start the proxy server |
| Port 9292 in use | Change port in both server and processor files |
| No audio | Check format filter is `'audioandvideo'` |
| CORS error | Add your origin to CORS whitelist |
| Video won't load | Check YouTube video is available in your region |

---

## 📁 File Locations

```
your-project/
├── src-tauri/
│   └── youtube-proxy/
│       ├── youtube-stream-server.js  ← Proxy server
│       ├── package.json              ← Dependencies
│       └── start-proxy.bat/sh        ← Startup scripts
│
└── AppData/forbidden/playground/theater-stage/dropper-modules/@youtube/
    ├── youtube.url.processor.ts      ← URL handler
    ├── dragDropYouTube.url.ts        ← Drag/drop logic
    └── youtube-dropper.css           ← Styles
```

---

## ✅ Verification Checklist

- [ ] Node.js installed (v16+)
- [ ] Dependencies installed (`npm install`)
- [ ] Proxy server running (port 9292)
- [ ] TypeScript files in correct location
- [ ] CSS imported in your styles
- [ ] React component using refs correctly
- [ ] Video element has correct ID
- [ ] Container element has correct ID

---

## 🎯 Next Steps

1. **Test with different videos** - Try shorts, long videos, live streams
2. **Customize styling** - Edit `youtube-dropper.css`
3. **Add error handling** - Implement retry logic
4. **Integrate with file dropper** - Use both features together
5. **Add playlist support** - Implement queue functionality

---

## 💡 Pro Tips

- **Auto-start proxy**: Add to your Tauri app startup script
- **Development**: Use `nodemon` for auto-restart on changes
- **Production**: Consider using PM2 or similar process manager
- **Security**: Never expose the proxy port publicly
- **Performance**: Implement caching for frequently accessed videos

---

## 🆘 Need Help?

1. Check console logs (browser and Node.js)
2. Verify all files are in correct locations
3. Ensure proxy server is actually running
4. Test proxy endpoints directly with curl
5. Check YouTube video availability

---

**Ready to code? Start the proxy and drop some videos! 🎬**
