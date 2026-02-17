/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

import { AmbientMode } from './utils/ambient.js';
import { AspectRatio } from './utils/aspect-ratio.js';
import { Lockscreen } from './utils/lockscreen.js';

/**
 * Settings Panel Manager
 * Manages video player settings UI and functionality
 */
export class SettingsPanel {
    constructor(videoElement, containerElement, controlsElement) {
        this.video = videoElement;
        this.container = containerElement;
        this.controls = controlsElement;
        
        // Initialize feature managers
        this.ambient = new AmbientMode(videoElement, containerElement);
        this.aspectRatio = new AspectRatio(videoElement);
        this.lockscreen = new Lockscreen(videoElement, containerElement);
        
        this.panel = null;
        this.isOpen = false;
        
        this.createPanel();
    }

    /**
     * Create settings panel UI
     */
    createPanel() {
        this.panel = document.createElement('div');
        this.panel.className = 'settings-panel';
        this.panel.style.cssText = `
            position: absolute;
            bottom: 60px;
            right: 10px;
            background: rgba(28, 28, 30, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 12px;
            min-width: 220px;
            display: none;
            z-index: 1000;
        `;

        this.panel.innerHTML = `
            <div class="settings-header" style="
                padding: 8px 12px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 8px;
            ">
                <h3 style="
                    margin: 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                ">Settings</h3>
            </div>

            <div class="settings-item ambient-toggle" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                cursor: pointer;
                border-radius: 6px;
                transition: background 0.2s ease;
            ">
                <span style="color: white; font-size: 14px;">Ambient Mode</span>
                <div class="toggle-switch" data-active="false" style="
                    width: 40px;
                    height: 22px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 11px;
                    position: relative;
                    transition: background 0.2s ease;
                ">
                    <div class="toggle-knob" style="
                        width: 18px;
                        height: 18px;
                        background: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        transition: transform 0.2s ease;
                    "></div>
                </div>
            </div>

            <div class="settings-item aspect-ratio-selector" style="
                padding: 10px 12px;
                border-radius: 6px;
            ">
                <span style="color: white; font-size: 14px; display: block; margin-bottom: 8px;">Aspect Ratio</span>
                <select class="aspect-ratio-select" style="
                    width: 100%;
                    padding: 6px 10px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    font-size: 13px;
                    cursor: pointer;
                ">
                    ${this.aspectRatio.getAllModes().map(mode => 
                        `<option value="${mode}">${mode}</option>`
                    ).join('')}
                </select>
            </div>

            <div class="settings-item lockscreen-toggle" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 12px;
                cursor: pointer;
                border-radius: 6px;
                transition: background 0.2s ease;
            ">
                <span style="color: white; font-size: 14px;">Lock Screen</span>
                <div class="toggle-switch" data-active="false" style="
                    width: 40px;
                    height: 22px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 11px;
                    position: relative;
                    transition: background 0.2s ease;
                ">
                    <div class="toggle-knob" style="
                        width: 18px;
                        height: 18px;
                        background: white;
                        border-radius: 50%;
                        position: absolute;
                        top: 2px;
                        left: 2px;
                        transition: transform 0.2s ease;
                    "></div>
                </div>
            </div>
        `;

        this.container.appendChild(this.panel);
        this.attachPanelListeners();
    }

    /**
     * Attach event listeners to panel elements
     */
    attachPanelListeners() {
        // Ambient mode toggle
        const ambientToggle = this.panel.querySelector('.ambient-toggle');
        ambientToggle.addEventListener('click', () => {
            const isEnabled = this.ambient.toggle();
            this.updateToggleState(ambientToggle.querySelector('.toggle-switch'), isEnabled);
        });

        // Aspect ratio selector
        const aspectSelect = this.panel.querySelector('.aspect-ratio-select');
        aspectSelect.addEventListener('change', (e) => {
            this.aspectRatio.setMode(e.target.value);
        });

        // Lockscreen toggle
        const lockToggle = this.panel.querySelector('.lockscreen-toggle');
        lockToggle.addEventListener('click', () => {
            const isEnabled = this.lockscreen.toggle();
            this.updateToggleState(lockToggle.querySelector('.toggle-switch'), isEnabled);
            if (isEnabled) {
                this.close(); // Close settings when locking
            }
        });

        // Hover effects
        const items = this.panel.querySelectorAll('.settings-item');
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
        });
    }

    /**
     * Update toggle switch visual state
     */
    updateToggleState(toggleSwitch, isActive) {
        toggleSwitch.dataset.active = isActive;
        const knob = toggleSwitch.querySelector('.toggle-knob');
        
        if (isActive) {
            toggleSwitch.style.background = 'rgba(0, 168, 255, 0.8)';
            knob.style.transform = 'translateX(18px)';
        } else {
            toggleSwitch.style.background = 'rgba(255, 255, 255, 0.2)';
            knob.style.transform = 'translateX(0)';
        }
    }

    /**
     * Toggle panel visibility
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
        return this.isOpen;
    }

    /**
     * Open settings panel
     */
    open() {
        this.panel.style.display = 'block';
        this.isOpen = true;
        console.log('⚙️ Settings panel opened');
    }

    /**
     * Close settings panel
     */
    close() {
        this.panel.style.display = 'none';
        this.isOpen = false;
        console.log('⚙️ Settings panel closed');
    }
}