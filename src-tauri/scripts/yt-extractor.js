/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

const ytdl = require('ytdl-core');

async function getStream(videoId) {
  try {
    const info = await ytdl.getInfo(videoId);
    // Filter for formats that have both video and audio (usually itag 18 or 22)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
    return { streamUrl: format.url, title: info.videoDetails.title };
  } catch (err) {
    return { error: err.message };
  }
}

async function getPlaylist(playlistId) {
    // Basic playlist mapping if using ytdl-core
    // Note: For full playlists, 'ytpl' is often used, but here is a placeholder for your backend logic
    return { ids: [] }; 
}

const args = process.argv.slice(2);
if (args[0] === 'video') getStream(args[1]).then(res => console.log(JSON.stringify(res)));