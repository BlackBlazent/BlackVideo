/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// open.file.import.ts

import { VideoTheaterStage } from '../../../Video.Theater.Stage';

/**
 * Opens the native OS file picker and loads the selected video into
 * the Theater Stage. Calls onFileLoaded(nativePath) after the video
 * element src is set so the caller (Playground) can wire resume playback.
 *
 * @param onFileLoaded  Optional callback — receives the native file path
 *                      so resume playback can key off it persistently.
 */
export const handleOpenLocalFile = (onFileLoaded?: (nativePath: string) => void) => {
  const stage = VideoTheaterStage.getInstance();
  const videoElement = stage.getVideoElement();

  if (!videoElement) {
    console.error('❌ Video element not found in Theater Stage');
    return;
  }

  // Create a hidden file input — no Tauri dialog dep needed here
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';

  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    // Blob URL for immediate in-browser playback
    const blobUrl = URL.createObjectURL(file);

    videoElement.src = blobUrl;
    videoElement.load();

    videoElement.play().catch(err => {
      console.warn('⚠️ Auto-play blocked or failed:', err);
    });

    console.log('▶️ Now playing:', file.name);

    // FIX: was console.log`Now playing: ${file.name}`) — broken backtick syntax
    // that caused a parse error crashing the entire module.

    // Hand the native path back to Playground for resume persistence.
    // In a browser file input inside Tauri, the File object gets a .path
    // property injected by Tauri containing the real OS path.
    const nativePath: string | undefined = (file as any).path;

    if (nativePath && onFileLoaded) {
      onFileLoaded(nativePath);
    } else if (!nativePath) {
      // Blob-only context: playback works but resume won't persist across restarts
      // because there's no stable native path to key the JSON entry off.
      console.warn('⚠️ No native path on selected file — resume will not persist this session');
    }
  };

  input.click();
};

/*
// open.file.import.ts
import { VideoTheaterStage } from '../../../Video.Theater.Stage';

export const handleOpenLocalFile = () => {
  const stage = VideoTheaterStage.getInstance();
  const videoElement = stage.getVideoElement();

  if (!videoElement) {
    console.error("Video element not found in Theater Stage");
    return;
  }

  // Create hidden file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';

  input.onchange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      // Create local URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Update the stage video element
      videoElement.src = fileUrl;
      videoElement.load();
      
      // Attempt to play immediately
      videoElement.play().catch(err => {
        console.warn("Auto-play blocked or failed:", err);
      });

      console.log(`Now playing: ${file.name}`);
    }
  };

  input.click();
};
*/