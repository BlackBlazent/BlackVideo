/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export function initSettingsShortcut() {
  // We handle the keyboard shortcut here
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === ',') {
      e.preventDefault();
      // Dispatch the event that App.tsx is listening for
      window.dispatchEvent(new CustomEvent('toggle-settings-shortcut'));
    }
  });

  // Optional: If you want the button click handled here instead of React:
  const btn = document.getElementById('settings-btn');
  if (btn) {
    btn.onclick = () => {
       window.dispatchEvent(new CustomEvent('toggle-settings-shortcut'));
    };
  }
}