// src/utils/cpu.usage.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export function animateCpuUsage(containerSelector: string, usagePercent: number) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const bars = container.querySelectorAll<HTMLDivElement>(".cpu-bar-indicator");

  // Determine usage level
  let usageLevel = "good"; // green
  if (usagePercent >= 70 && usagePercent < 90) usageLevel = "medium"; // orange
  else if (usagePercent >= 90) usageLevel = "critical"; // red

  // Update bars
  bars.forEach((bar, i) => {
    const active = (i / bars.length) * 100 < usagePercent;

    // Height based on active status
    const maxHeight = 10;
    const height = active ? `${Math.random() * (maxHeight - 10) + 10}px` : "10px";
    bar.style.height = height;
    bar.style.transition = "height 0.3s ease, background-color 0.3s ease";

    // Set color
    if (usageLevel === "good") {
      bar.style.backgroundColor = active ? "#4caf50" : "#ccc";
    } else if (usageLevel === "medium") {
      bar.style.backgroundColor = active ? "#ff9800" : "#ccc";
    } else {
      bar.style.backgroundColor = active ? "#f44336" : "#ccc";
    }
  });

  // Update % text
  const percentageEl = container.querySelector(".cpu-usage-percentage");
  if (percentageEl) {
    percentageEl.textContent = `${usagePercent}%`;
  }
}
