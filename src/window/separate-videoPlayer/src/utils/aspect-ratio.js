/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

/**
 * Aspect Ratio Controller
 * Manages video aspect ratio and fit modes
 */
export class AspectRatio {
    constructor(videoElement) {
        this.video = videoElement;
        this.modes = [
            { name: 'Auto', value: 'contain' },
            { name: '16:9', value: 'fill', ratio: 16/9 },
            { name: '4:3', value: 'fill', ratio: 4/3 },
            { name: '21:9', value: 'fill', ratio: 21/9 },
            { name: 'Stretch', value: 'fill' },
            { name: 'Zoom', value: 'cover' }
        ];
        this.currentModeIndex = 0;
        
        this.init();
    }

    init() {
        this.applyMode(this.modes[0]);
    }

    /**
     * Cycle to next aspect ratio mode
     */
    cycleMode() {
        this.currentModeIndex = (this.currentModeIndex + 1) % this.modes.length;
        const mode = this.modes[this.currentModeIndex];
        this.applyMode(mode);
        return mode.name;
    }

    /**
     * Set specific mode by name
     */
    setMode(modeName) {
        const mode = this.modes.find(m => m.name === modeName);
        if (mode) {
            this.currentModeIndex = this.modes.indexOf(mode);
            this.applyMode(mode);
            return mode.name;
        }
        return this.getCurrentMode().name;
    }

    /**
     * Apply aspect ratio mode
     */
    applyMode(mode) {
        this.video.style.objectFit = mode.value;

        if (mode.ratio) {
            // Calculate dimensions for specific ratio
            const container = this.video.parentElement;
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const containerRatio = containerWidth / containerHeight;

            if (containerRatio > mode.ratio) {
                // Container is wider
                this.video.style.width = (containerHeight * mode.ratio) + 'px';
                this.video.style.height = containerHeight + 'px';
            } else {
                // Container is taller
                this.video.style.width = containerWidth + 'px';
                this.video.style.height = (containerWidth / mode.ratio) + 'px';
            }
        } else {
            // Reset to auto
            this.video.style.width = '';
            this.video.style.height = '';
        }

        console.log(`📐 Aspect ratio: ${mode.name}`);
    }

    /**
     * Get current mode
     */
    getCurrentMode() {
        return this.modes[this.currentModeIndex];
    }

    /**
     * Get all modes
     */
    getAllModes() {
        return this.modes.map(m => m.name);
    }

    /**
     * Reset to auto
     */
    reset() {
        this.currentModeIndex = 0;
        this.applyMode(this.modes[0]);
        console.log('📐 Aspect ratio reset to Auto');
    }
}