/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { invoke } from '@tauri-apps/api/core';

export async function updateTemperatureUI() {
  const display = document.querySelector(".temperature") as HTMLDivElement;
  if (!display) return;

  try {
    const celsius = await invoke<number>("get_cpu_temperature_command");
    if (typeof celsius === "number") {
      const fahrenheit = (celsius * 9) / 5 + 32;
      display.textContent = `Temperature ${celsius.toFixed(1)} °C | ${fahrenheit.toFixed(1)} ℉`;
    } else {
      display.textContent = "Temperature N/A";
    }
  } catch (error) {
    console.error("Failed to fetch temperature:", error);
    display.textContent = "Temperature N/A";
  }
}
