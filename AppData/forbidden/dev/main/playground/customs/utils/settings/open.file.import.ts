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