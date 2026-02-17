# 🔧 Troubleshooting Guide - YouTube Drag & Drop

## 🚨 Common Issues and Solutions

### 1. "YouTube proxy offline" Message

**Symptoms:**
- Message appears when starting the app
- Videos won't load when dropped

**Diagnosis:**
```bash
# Check if proxy is running
curl http://localhost:9292/health

# Check if port is in use
# Windows:
netstat -ano | findstr :9292
# Linux/Mac:
lsof -i :9292
```

**Solutions:**

**A. Proxy not started**
```bash
cd src-tauri/youtube-proxy
node youtube-stream-server.js
```

**B. Port conflict (9292 in use)**
1. Change port in `youtube-stream-server.js`:
```javascript
const PORT = 9393; // Or any available port
```

2. Update `youtube.url.processor.ts`:
```typescript
const YOUTUBE_PROXY_BASE_URL = 'http://localhost:9393';
```

3. Restart proxy server

**C. Node.js not installed**
```bash
# Install Node.js from https://nodejs.org/
# Verify installation:
node --version
npm --version
```

---

### 2. Video Loads But No Audio

**Symptoms:**
- Video plays but silent
- Controls work but no sound

**Diagnosis:**
```javascript
// Check video element in console
const video = document.getElementById('VideoPlayer-TheaterStage');
console.log('Muted:', video.muted);
console.log('Volume:', video.volume);
```

**Solutions:**

**A. Check format filter in proxy server**
Edit `youtube-stream-server.js`:
```javascript
const format = ytdl.chooseFormat(info.formats, { 
  quality: 'highest',
  filter: 'audioandvideo' // ⚠️ MUST have this!
});
```

**B. Browser autoplay policy**
- Some browsers block audio on autoplay
- User must interact with the page first
- Add a "Click to enable audio" message

**C. Volume settings**
Ensure in `dragDropYouTube.url.ts`:
```typescript
this.videoElement.muted = false;
this.videoElement.volume = 1;
```

---

### 3. CORS Errors in Console

**Symptoms:**
```
Access to fetch at 'http://localhost:9292/stream/...' from origin 
'tauri://localhost' has been blocked by CORS policy
```

**Solutions:**

**A. Update CORS configuration**
Edit `youtube-stream-server.js`:
```javascript
app.use(cors({
  origin: [
    'tauri://localhost',
    'http://localhost:1420',
    'https://tauri.localhost',
    'http://localhost:3000', // Add your dev server
  ],
  credentials: true
}));
```

**B. Install cors package if missing**
```bash
npm install cors
```

---

### 4. "Failed to fetch video info" Error

**Symptoms:**
- Video info request fails
- 500 error in network tab

**Diagnosis:**
```bash
# Test directly
curl http://localhost:9292/info/dQw4w9WgXcQ
```

**Solutions:**

**A. Invalid video ID**
- Check the video ID is correct
- Video must be publicly available
- Region restrictions may apply

**B. YouTube rate limiting**
- Too many requests in short time
- Wait 5-10 minutes before trying again
- Consider implementing caching

**C. ytdl-core needs update**
```bash
cd src-tauri/youtube-proxy
npm update ytdl-core
```

**D. Video is private/restricted**
- Use a different, public video for testing
- Check video availability in your region

---

### 5. Drag & Drop Not Working

**Symptoms:**
- No visual feedback when dragging
- Drop event doesn't trigger

**Diagnosis:**
```javascript
// Check if handler is initialized
console.log(document.getElementById('videoContainer'));
console.log(document.getElementById('VideoPlayer-TheaterStage'));
```

**Solutions:**

**A. Elements not found**
- Ensure IDs match exactly: `videoContainer` and `VideoPlayer-TheaterStage`
- Check component is fully mounted before initializing

**B. Event listeners not attached**
```typescript
// Add debugging in dragDropYouTube.url.ts
private handleDragOver = (e: DragEvent): void => {
  console.log('DRAG OVER TRIGGERED'); // Add this
  e.preventDefault();
  // ...
};
```

**C. React refs not set**
```typescript
// Make sure refs are passed correctly
<div ref={containerRef} id="videoContainer">
  <video ref={videoRef} id="VideoPlayer-TheaterStage">
```

**D. Z-index issues**
```css
/* Ensure container is on top */
#videoContainer {
  position: relative;
  z-index: 1;
}
```

---

### 6. Video Stuttering or Buffering

**Symptoms:**
- Video plays but stutters
- Frequent buffering

**Solutions:**

**A. Lower video quality**
```javascript
// In youtube-stream-server.js
const format = ytdl.chooseFormat(info.formats, { 
  quality: 'highestaudio', // Lower quality
  filter: 'audioandvideo'
});
```

**B. Check internet connection**
```bash
# Test download speed
speedtest-cli
```

**C. Increase buffer size**
```javascript
// In youtube-stream-server.js
const videoStream = ytdl(videoId, { 
  format: format,
  highWaterMark: 1024 * 1024 * 5 // 5MB buffer
});
```

---

### 7. Module Import Errors

**Symptoms:**
```
Cannot find module '@tauri-apps/api/core'
Module not found: ytdl-core
```

**Solutions:**

**A. TypeScript imports**
```bash
# Install Tauri API
npm install @tauri-apps/api
```

**B. Node.js imports**
```bash
cd src-tauri/youtube-proxy
npm install ytdl-core express cors
```

**C. Path issues**
```typescript
// Use correct relative path
import { YouTubeDragDropHandler } from './path/to/dragDropYouTube.url';
```

---

### 8. Proxy Server Crashes

**Symptoms:**
- Server exits unexpectedly
- Error messages in console

**Solutions:**

**A. Check error logs**
```bash
# Run with detailed logging
DEBUG=* node youtube-stream-server.js
```

**B. Memory issues**
```bash
# Increase Node.js memory
node --max-old-space-size=4096 youtube-stream-server.js
```

**C. Use process manager**
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start youtube-stream-server.js --name youtube-proxy

# View logs
pm2 logs youtube-proxy
```

---

### 9. Seeking Not Working

**Symptoms:**
- Can't seek/skip in video
- Slider doesn't respond

**Solutions:**

**A. Range request support**
Already implemented in the server:
```javascript
// Check this section exists in youtube-stream-server.js
const range = req.headers.range;
if (range && format.contentLength) {
  // Range handling code...
}
```

**B. Check Content-Length header**
```javascript
res.setHeader('Content-Length', format.contentLength || '');
res.setHeader('Accept-Ranges', 'bytes');
```

---

### 10. Multiple Videos Not Playing in Sequence

**Symptoms:**
- Second video won't load
- Queue not working

**Solutions:**

**A. Check source element update**
```typescript
// In updateVideoSource method
const sourceElement = document.getElementById('VideoSource-Stream');
sourceElement.src = url; // Make sure this updates
this.videoElement.load(); // Must call load()
```

**B. Clear previous source**
```typescript
this.videoElement.pause();
this.videoElement.removeAttribute('src');
this.videoElement.load();
// Then set new source
```

---

## 🔍 Debugging Tools

### Browser Console Commands

```javascript
// 1. Check proxy health
fetch('http://localhost:9292/health')
  .then(r => r.json())
  .then(console.log);

// 2. Get video info
fetch('http://localhost:9292/info/VIDEO_ID')
  .then(r => r.json())
  .then(console.log);

// 3. Test video element
const video = document.getElementById('VideoPlayer-TheaterStage');
console.log({
  src: video.src,
  paused: video.paused,
  muted: video.muted,
  volume: video.volume,
  duration: video.duration,
  currentTime: video.currentTime
});

// 4. Check event listeners
getEventListeners(document.getElementById('videoContainer'));

// 5. Force play
video.play().then(
  () => console.log('✅ Playing'),
  (e) => console.error('❌ Failed:', e)
);
```

### Network Tab Inspection

1. Open DevTools → Network tab
2. Drop a YouTube video
3. Look for requests to `localhost:9292`
4. Check response status codes
5. Inspect response headers

---

## 📞 Getting Help

If you're still stuck:

1. **Check logs:**
   - Browser console (F12)
   - Node.js server output
   - Network tab in DevTools

2. **Gather information:**
   ```bash
   node --version
   npm --version
   # OS version
   # Browser version
   # Error messages (exact text)
   # Steps to reproduce
   ```

3. **Test with known-good video:**
   - Use: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
   - This video is always available worldwide

4. **Verify basic functionality:**
   - Can you access `http://localhost:9292/health`?
   - Does file dropper work?
   - Can you play local videos?

---

## ✅ Health Check Checklist

Run through this before reporting issues:

- [ ] Node.js installed and working
- [ ] Proxy dependencies installed (`npm install`)
- [ ] Proxy server running (check port 9292)
- [ ] No CORS errors in console
- [ ] Video element has correct ID
- [ ] Container element has correct ID
- [ ] React refs are set correctly
- [ ] CSS is imported
- [ ] Tested with multiple different videos
- [ ] Browser allows autoplay (or click to play)
- [ ] Internet connection is stable

---

**Still having issues? Check the GitHub issues or contact support with:**
- Exact error messages
- Steps to reproduce
- System information
- Screenshots/video of the issue
