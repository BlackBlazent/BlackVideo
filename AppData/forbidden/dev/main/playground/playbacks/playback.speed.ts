// playback.speed.script.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

document.addEventListener('DOMContentLoaded', () => {
    const waitForBtn = setInterval(() => {
      const speedBtn = document.getElementById('speedController');
      const popup = document.getElementById('playback-speed-popup');
  
      if (!speedBtn || !popup) return;
  
      clearInterval(waitForBtn);
  
      speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = speedBtn.getBoundingClientRect();
  
        popup.style.left = `${rect.left - popup.offsetWidth - 8}px`; // align left of button
        popup.style.top = `${rect.top}px`;
        popup.classList.toggle('hidden');
      });
    }, 100);
  });
  