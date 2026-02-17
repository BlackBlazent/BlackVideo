/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

const isTauri = typeof window !== 'undefined' && window.__TAURI_IPC__ !== undefined;

/**
 * Window management utilities
 */
export class WindowControls {
    constructor() {
        this.currentWindow = null;
        this.init();
    }

    async init() {
        if (!isTauri) return;

        try {
            const { getCurrentWindow } = await import('https://esm.sh/@tauri-apps/api@2/window');
            this.currentWindow = getCurrentWindow();
        } catch (error) {
            console.error('Failed to get current window:', error);
        }
    }

    /**
     * Duplicate current window with same video
     */
    async duplicateWindow() {
        if (!isTauri) {
            console.warn('Window duplication only available in Tauri');
            return;
        }

        try {
            const { invoke } = await import('https://esm.sh/@tauri-apps/api@2/core');
            
            // Get current video data
            const videoElement = document.getElementById('native-video-player');
            const currentSrc = videoElement?.currentSrc || '';
            const currentTime = videoElement?.currentTime || 0;

            if (!currentSrc) {
                alert('No video loaded to duplicate');
                return;
            }

            // Create new window via Rust command
            await invoke('open_separate_video_window', {
                videoPath: currentSrc,
                currentTime: currentTime
            });

            console.log('✓ Window duplicated');

        } catch (error) {
            console.error('❌ Failed to duplicate window:', error);
            alert(`Failed to duplicate window: ${error.message}`);
        }
    }
}