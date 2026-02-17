/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

/**
 * Playback Speed Controller
 * Manages video playback speed with preset options
 */
export class PlaybackSpeed {
    constructor(videoElement) {
        this.video = videoElement;
        this.speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
        this.currentSpeedIndex = 3; // Default 1x
        
        this.init();
    }

    init() {
        this.video.playbackRate = this.speeds[this.currentSpeedIndex];
    }

    /**
     * Cycle to next speed
     */
    cycleSpeed() {
        this.currentSpeedIndex = (this.currentSpeedIndex + 1) % this.speeds.length;
        const newSpeed = this.speeds[this.currentSpeedIndex];
        this.video.playbackRate = newSpeed;
        
        console.log(`⚡ Playback speed: ${newSpeed}x`);
        return newSpeed;
    }

    /**
     * Set specific speed
     */
    setSpeed(speed) {
        const index = this.speeds.indexOf(speed);
        if (index !== -1) {
            this.currentSpeedIndex = index;
            this.video.playbackRate = speed;
            console.log(`⚡ Playback speed: ${speed}x`);
            return speed;
        }
        return this.getCurrentSpeed();
    }

    /**
     * Get current speed
     */
    getCurrentSpeed() {
        return this.speeds[this.currentSpeedIndex];
    }

    /**
     * Reset to normal speed
     */
    resetSpeed() {
        this.currentSpeedIndex = 3; // 1x
        this.video.playbackRate = 1;
        console.log('⚡ Playback speed reset to 1x');
        return 1;
    }

    /**
     * Get all available speeds
     */
    getAvailableSpeeds() {
        return this.speeds;
    }
}