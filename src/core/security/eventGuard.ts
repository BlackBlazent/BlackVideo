// src/core/security/eventGuard.ts
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

// Maps an event key (string) to the number of times it occurred in the current second.
const eventCounts = new Map<string, number>();

// Stores the last time the counter was reset (in seconds).
let lastResetTime = Math.floor(Date.now() / 1000);

/**
 * Resets the event counter map if a new second has passed.
 */
function checkAndReset() {
    const now = Math.floor(Date.now() / 1000);
    if (now > lastResetTime) {
        eventCounts.clear();
        lastResetTime = now;
    }
}

/**
 * Guards against excessive event firing within a single second.
 * * @param key A unique identifier for the event (e.g., "timeline:seek").
 * @param limit The maximum number of times the event can fire per second.
 */
export function guardEvent(
  key: string,
  limit = 60 // Default limit: 60 times per second (frame rate cap)
) {
  checkAndReset();
  
  const count = (eventCounts.get(key) ?? 0) + 1;
  eventCounts.set(key, count);

  if (count > limit) {
    // Use the custom Security Error type
    throw new SecurityError(
      `Event Abuse Detected: '${key}' fired ${count} times/sec. Limit: ${limit}.`
    );
  }
}