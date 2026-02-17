/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

/**
 * Frame Capture Utility
 * Captures current video frame as image
 */
export class FrameCapture {
    constructor(videoElement) {
        this.video = videoElement;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Capture current frame as image
     * @param {string} format - 'png' or 'jpeg'
     * @param {number} quality - 0.0 to 1.0 (for jpeg)
     * @returns {Promise<string>} - Data URL of captured frame
     */
    async captureFrame(format = 'png', quality = 0.95) {
        return new Promise((resolve, reject) => {
            try {
                // Set canvas size to video dimensions
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;

                // Draw current video frame
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

                // Convert to image
                const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
                const dataUrl = this.canvas.toDataURL(mimeType, quality);

                console.log('📸 Frame captured:', this.canvas.width + 'x' + this.canvas.height);
                resolve(dataUrl);

            } catch (error) {
                console.error('❌ Frame capture failed:', error);
                reject(error);
            }
        });
    }

    /**
     * Download captured frame
     */
    async downloadFrame(filename = null) {
        try {
            const dataUrl = await this.captureFrame('png', 1.0);

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const name = filename || `frame-${timestamp}.png`;

            // Create download link
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = name;
            link.click();

            console.log('✓ Frame downloaded:', name);
            this.showNotification('📸 Frame saved!');

        } catch (error) {
            console.error('❌ Download failed:', error);
            this.showNotification('❌ Capture failed');
        }
    }

    /**
     * Show brief notification
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}