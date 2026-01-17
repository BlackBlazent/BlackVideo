// src/core/diagnostics/errorInspector.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { logError } from "./errorUtils";
import { assertExists } from "./errorUtils"; // Bring in the utility helper

// Import the custom error type from the security layer
import { SecurityError } from "../security/capabilityGuard"; // Adjust path if necessary

// ----------------------------------------------------
// ⚠️ 1. RUNTIME ERROR CAPTURE (General, Sync, or Import)
// ----------------------------------------------------
window.addEventListener("error", (event: ErrorEvent) => {
  // Check if the original error object is a SecurityError
  const isSecurityError = event.error instanceof SecurityError;
  // Check specifically for common dynamic import/chunk loading issues
  const isImportError = event.message.includes("Failed to fetch") ||
                        event.message.includes("dynamically imported");

  if (isSecurityError) {
    logError({
      time: new Date().toISOString(),
      category: "Security Guard",
      message: event.message,
      source: event.filename,
      severity: "HIGH", // High, as it's an app-breaking prevention
      mustFix: true,
      hint: "A security guard was tripped. Check if you are calling an API/Feature without first checking its state or capability."
    });
  } else if (isImportError) {
    logError({
      time: new Date().toISOString(),
      category: "Import Error",
      message: event.message,
      severity: "CRITICAL",
      mustFix: true,
      hint: "Check dynamic import paths or Vite build output. This file chunk is missing."
    });
  } else {
    // General synchronous runtime error
    logError({
      time: new Date().toISOString(),
      category: "Runtime Error",
      message: event.message,
      source: event.filename,
      severity: "CRITICAL",
      mustFix: true,
      hint: "Check null/undefined access, type mismatch, or faulty DOM manipulation."
    });
  }
}, true); // Use capture phase to catch errors before they bubble up

// ----------------------------------------------------
// ⚠️ 2. PROMISE ERROR CAPTURE (Async/Await)
// ----------------------------------------------------
window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
  logError({
    time: new Date().toISOString(),
    category: "Unhandled Promise",
    message: String(event.reason),
    severity: "HIGH",
    mustFix: true,
    hint: "Wrap async code with try/catch, or add a .catch() block to the promise chain."
  });
});

// Expose assertExists for application-wide use
export { assertExists };