/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import './i18n/i18n'; // 🚀 This must be at the top!
import App from "./App";
import "../AppData/forbidden/dev/main/playground/accessories/chat/zephyrahChat";
import "../AppData/forbidden/dev/main/playground/customs/hidden.mini.playback.script.flip"
import "../AppData/forbidden/dev/main/playground/customs/hidden.mini.playback.script.ambient"
import "../AppData/forbidden/dev/main/playground/customs/hidden.mini.playback.script.sleepTimer"
import "../AppData/forbidden/dev/main/playground/customs/hidden.mini.playback.script.screencast"
import "../AppData/forbidden/dev/main/playground/customs/utils/heatmap/heatmap.playback.behavior.graph"

// import i18n from "./i18n";
import './core/dependencies-checker-loader'; // Safe — does not block UI
// ----------------------------------------------------
// ✅ ACTIVATE THE DIAGNOSTICS LAYER
// ----------------------------------------------------
import "./core/diagnostics/errorInspector"; 
// This import runs the code, attaching all global error listeners immediately.

// ----------------------------------------------------
// ⭐ NEW: Import Security Guards for app-wide access
// ----------------------------------------------------
import { requireCapability } from "./core/security/capabilityGuard";
import { guard } from "./core/security/stateGuard";

// Expose them globally if needed, or pass them to components/services
(window as any).requireCapability = requireCapability;
(window as any).guard = guard;

// Import the new badge initializer script
import { initializeInstallerBadge } from "../AppData/forbidden/dev/footer/user.install.badge";
// Initialize the badge counter as an early app task
initializeInstallerBadge();


// service-worker.js for cache file | Added file
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}


ReactDOM.createRoot(document.getElementById("BlackVideo-Zephyra") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
