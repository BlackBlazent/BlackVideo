// src/core/security/devTripwire.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

/**
 * Executes a function only when the application is running in development mode.
 * Uses Vite's environment variable injection.
 */
export function devOnly(fn: () => void) {
  // Check if Vite's environment is set to development
  if (import.meta.env.DEV) {
    fn();
  }
}