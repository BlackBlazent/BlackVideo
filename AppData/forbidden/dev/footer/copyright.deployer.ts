// copyright.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export function updateAppCopyrightYear(): void {
    const element = document.getElementById("appCopyright");
    if (!element) return;
  
    const currentYear = new Date().getFullYear();
    element.textContent = `© BlackVideo ${currentYear}`;
  }
  