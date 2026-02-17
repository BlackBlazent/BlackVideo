/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// index.ts - Entry point for recorder accessories

import { initializeFloatingRecordUI } from './float.render.ui';
import { initializeRecorderControls } from './recorder.control.ui';
import { VideoRecorder } from './video.recording';
import { saveRecording, autoSaveToDownloads } from './saved.captured';

// Export all modules for external use
export {
    initializeFloatingRecordUI,
    initializeRecorderControls,
    VideoRecorder,
    saveRecording,
    autoSaveToDownloads
};

// Initialize the recorder UI when the module is loaded
export function initializeRecorderAccessories(): void {
    console.log('Initializing BlackVideo Recorder Accessories...');
    console.log('Supported modes: Video Player Recording, Camera Recording (Front/Back)');
    
    // Initialize the floating record UI
    initializeFloatingRecordUI();
    
    console.log('BlackVideo Recorder Accessories initialized successfully');
}

// Auto-initialize if this is being loaded directly
if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRecorderAccessories);
    } else {
        initializeRecorderAccessories();
    }
}
