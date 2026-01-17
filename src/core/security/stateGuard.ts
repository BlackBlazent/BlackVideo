// src/core/security/stateGuard.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { SecurityError } from "./capabilityGuard";

/**
 * Asserts that a condition is true. If false, a SecurityError is thrown,
 * preventing a crash due to an invalid application state or race condition.
 * * @param condition The required condition (must be true to proceed).
 * @param message The error message if the condition is false.
 */
export function guard(
  condition: boolean,
  message: string
) {
  if (!condition) {
    // Use the custom Security Error type
    throw new SecurityError(
      `State guard tripped: ${message}`
    );
  }
}