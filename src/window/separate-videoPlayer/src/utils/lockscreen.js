/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

/**
 * Lockscreen Feature
 * Prevents accidental interactions with video controls
 */
export class Lockscreen {
    constructor(videoElement, containerElement) {
        this.video = videoElement;
        this.container = containerElement;
        this.isLocked = false;
        this.lockOverlay = null;
        this.unlockButton = null;
    }

    /**
     * Toggle lockscreen on/off
     */
    toggle() {
        if (this.isLocked) {
            this.unlock();
        } else {
            this.lock();
        }
        return this.isLocked;
    }

    /**
     * Lock the screen
     */
    lock() {
        if (this.isLocked) return;

        // Create lock overlay
        this.lockOverlay = document.createElement('div');
        this.lockOverlay.className = 'lockscreen-overlay';
        this.lockOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: transparent;
            z-index: 9998;
            cursor: default;
        `;

        // Create unlock button
        this.unlockButton = document.createElement('button');
        this.unlockButton.className = 'lockscreen-unlock-btn';
        this.unlockButton.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
            <span>Tap to Unlock</span>
        `;
        this.unlockButton.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 16px;
            padding: 24px 32px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            z-index: 9999;
            transition: all 0.2s ease;
        `;

        this.unlockButton.onmouseover = () => {
            this.unlockButton.style.background = 'rgba(0, 168, 255, 0.9)';
            this.unlockButton.style.borderColor = 'rgba(0, 168, 255, 1)';
        };

        this.unlockButton.onmouseleave = () => {
            this.unlockButton.style.background = 'rgba(0, 0, 0, 0.85)';
            this.unlockButton.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        };

        this.unlockButton.onclick = () => this.unlock();

        // Add to container
        this.container.appendChild(this.lockOverlay);
        this.container.appendChild(this.unlockButton);

        this.isLocked = true;
        console.log('🔒 Screen locked');
    }

    /**
     * Unlock the screen
     */
    unlock() {
        if (!this.isLocked) return;

        if (this.lockOverlay) {
            this.lockOverlay.remove();
            this.lockOverlay = null;
        }

        if (this.unlockButton) {
            this.unlockButton.remove();
            this.unlockButton = null;
        }

        this.isLocked = false;
        console.log('🔓 Screen unlocked');
    }

    /**
     * Check if locked
     */
    isActive() {
        return this.isLocked;
    }
}