/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 *
 * YouTube Stream Proxy Server
 * Handles YouTube video streaming via ytdl-core to bypass CORS restrictions
 */

const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();
const PORT = 9292; // Choose a port that doesn't conflict

// Enable CORS for your Tauri app
app.use(cors({
  origin: ['tauri://localhost', 'http://localhost:1420', 'https://tauri.localhost'],
  credentials: true
}));

app.use(express.json());

/**
 * GET /stream/:videoId
 * Streams YouTube video content
 */
app.get('/stream/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const quality = req.query.quality || 'highestaudio'; // Default to audio+video or highest available

  try {
    console.log(`[YouTube Proxy] Streaming video: ${videoId}`);

    // Validate YouTube ID
    if (!ytdl.validateID(videoId)) {
      return res.status(400).json({ error: 'Invalid YouTube video ID' });
    }

    // Get video info first
    const info = await ytdl.getInfo(videoId);
    
    // Choose format with both audio and video
    // Try to get a format that has both audio and video (like format 18)
    const format = ytdl.chooseFormat(info.formats, { 
      quality: 'highest',
      filter: 'audioandvideo' // Important: ensures we get both audio and video
    });

    console.log(`[YouTube Proxy] Selected format: ${format.itag} - ${format.qualityLabel} - ${format.mimeType}`);

    // Set appropriate headers
    res.setHeader('Content-Type', format.mimeType || 'video/mp4');
    res.setHeader('Content-Length', format.contentLength || '');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    // Handle range requests for seeking
    const range = req.headers.range;
    if (range && format.contentLength) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : parseInt(format.contentLength) - 1;
      const chunksize = (end - start) + 1;

      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${format.contentLength}`);
      res.setHeader('Content-Length', chunksize);

      // Stream with range
      const videoStream = ytdl(videoId, {
        format: format,
        range: { start, end }
      });

      videoStream.pipe(res);
    } else {
      // Stream entire video
      const videoStream = ytdl(videoId, { format: format });
      videoStream.pipe(res);
    }

  } catch (error) {
    console.error('[YouTube Proxy] Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to stream video',
      details: error.message 
    });
  }
});

/**
 * GET /info/:videoId
 * Get video metadata (title, duration, thumbnail, etc.)
 */
app.get('/info/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    if (!ytdl.validateID(videoId)) {
      return res.status(400).json({ error: 'Invalid YouTube video ID' });
    }

    const info = await ytdl.getInfo(videoId);
    const videoDetails = info.videoDetails;

    res.json({
      videoId: videoDetails.videoId,
      title: videoDetails.title,
      duration: videoDetails.lengthSeconds,
      thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url,
      author: videoDetails.author.name,
      views: videoDetails.viewCount,
      isLive: videoDetails.isLiveContent,
      description: videoDetails.description
    });

  } catch (error) {
    console.error('[YouTube Proxy] Error fetching info:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch video info',
      details: error.message 
    });
  }
});

/**
 * GET /validate/:videoId
 * Quick validation endpoint
 */
app.get('/validate/:videoId', (req, res) => {
  const { videoId } = req.params;
  res.json({ valid: ytdl.validateID(videoId) });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'BlackVideo YouTube Proxy' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║  BlackVideo YouTube Stream Server                          ║
║  Port: ${PORT}                                              ║
║  Status: Running                                           ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n[YouTube Proxy] Shutting down gracefully...');
  process.exit(0);
});
