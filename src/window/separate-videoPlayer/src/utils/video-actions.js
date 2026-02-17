/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

/**
 * Video playback controls
 */
export class VideoActions {
    constructor(videoElement) {
        this.videoElement = videoElement;
    }

    /**
     * Refresh/reload current video
     */
    refresh() {
        const currentTime = this.videoElement.currentTime;
        
        this.videoElement.load();
        
        this.videoElement.addEventListener('loadedmetadata', () => {
            this.videoElement.currentTime = currentTime;
            this.videoElement.play().catch(e => console.warn('Autoplay prevented:', e));
        }, { once: true });

        console.log('✓ Video refreshed');
    }

    /**
     * Toggle Picture-in-Picture mode
     */
    async togglePictureInPicture() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
                console.log('✓ Exited PiP');
            } else {
                await this.videoElement.requestPictureInPicture();
                console.log('✓ Entered PiP');
            }
        } catch (error) {
            console.error('❌ PiP failed:', error);
            alert('Picture-in-Picture not supported');
        }
    }

    /**
     * Toggle fullscreen mode
     */
    async toggleFullscreen() {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
                console.log('✓ Exited fullscreen');
            } else {
                await this.videoElement.requestFullscreen();
                console.log('✓ Entered fullscreen');
            }
        } catch (error) {
            console.error('❌ Fullscreen failed:', error);
        }
    }
}