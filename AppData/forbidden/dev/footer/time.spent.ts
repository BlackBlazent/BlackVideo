/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { invoke } from "@tauri-apps/api/core";

let seconds = 0;

function formatTime(seconds: number): string {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

export function startTimeSpentTracker() {
  const display = document.querySelector(".time-spent") as HTMLDivElement;
  if (!display) return;

  const interval = setInterval(() => {
    seconds++;
    display.textContent = `Time spent: ${formatTime(seconds)}`;
  }, 1000);

  window.addEventListener("beforeunload", async () => {
    const timeSpent = formatTime(seconds);
    const logText = `Session Duration: ${timeSpent}`;
    try {
      await invoke("save_time_spent_log", { log: logText });
    } catch (e) {
      console.error("Failed to save log:", e);
    }
    clearInterval(interval);
  });
}
