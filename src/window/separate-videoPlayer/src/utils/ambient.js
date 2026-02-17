/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

/**
 * Ambient Mode (Ambilight Effect)
 * Creates glowing border effect around video
 */
export class AmbientMode {
    constructor(videoElement, containerElement) {
        this.video = videoElement;
        this.container = containerElement;
        this.isEnabled = false;
        this.ambientCanvas = null;
        this.animationFrame = null;
    }

    /**
     * Toggle ambient mode on/off
     */
    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
        return this.isEnabled;
    }

    /**
     * Enable ambient mode
     */
    enable() {
        if (this.isEnabled) return;

        // Create ambient canvas
        this.ambientCanvas = document.createElement('canvas');
        this.ambientCanvas.className = 'ambient-canvas';
        this.ambientCanvas.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.1);
            filter: blur(40px);
            opacity: 0.6;
            z-index: -1;
            pointer-events: none;
        `;

        this.container.style.position = 'relative';
        this.container.appendChild(this.ambientCanvas);

        this.isEnabled = true;
        this.startRendering();

        console.log('✓ Ambient mode enabled');
    }

    /**
     * Disable ambient mode
     */
    disable() {
        if (!this.isEnabled) return;

        this.stopRendering();

        if (this.ambientCanvas) {
            this.ambientCanvas.remove();
            this.ambientCanvas = null;
        }

        this.isEnabled = false;
        console.log('✓ Ambient mode disabled');
    }

    /**
     * Start rendering ambient effect
     */
    startRendering() {
        const ctx = this.ambientCanvas.getContext('2d');

        const render = () => {
            if (!this.isEnabled) return;

            // Match canvas size to video
            this.ambientCanvas.width = this.video.videoWidth || this.video.clientWidth;
            this.ambientCanvas.height = this.video.videoHeight || this.video.clientHeight;

            // Draw current frame
            ctx.drawImage(this.video, 0, 0, this.ambientCanvas.width, this.ambientCanvas.height);

            this.animationFrame = requestAnimationFrame(render);
        };

        render();
    }

    /**
     * Stop rendering
     */
    stopRendering() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }

    /**
     * Check if enabled
     */
    isActive() {
        return this.isEnabled;
    }
}