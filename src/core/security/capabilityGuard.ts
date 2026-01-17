// src/core/security/capabilityGuard.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// A snapshot of known browser/runtime capabilities
export const Capabilities = {
  // Check for the existence of the MediaRecorder API for recording features
  mediaRecorder: !!window.MediaRecorder,
  // Check for the WebGL context for advanced video effects or rendering
  webGL: !!window.WebGLRenderingContext,
  // Check for the Picture-in-Picture API
  pictureInPicture: "pictureInPictureEnabled" in document,
  // Check for the ability to capture screen/tab content (used for screen sharing/casting)
  screenCast: "getDisplayMedia" in navigator.mediaDevices
};

/**
 * Throws a Security Error if the requested capability is not supported by the runtime.
 * This should be wrapped in a try/catch or used with the diagnostics layer.
 */
export function requireCapability(
  name: keyof typeof Capabilities
) {
  if (!Capabilities[name]) {
    // IMPORTANT: Use the dedicated Security Error type for easy categorization
    throw new SecurityError(
      `Capability not supported: ${name}. This feature will be disabled.`
    );
  }
}

// Export a custom Error type for the security layer
export class SecurityError extends Error {
  constructor(message: string) {
    super(`[Zephyra Security] ${message}`);
    this.name = 'SecurityError';
  }
}