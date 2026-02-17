/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

import { openVideoFile } from './utils/open-file.js';
import { TrackManager } from './utils/track-manager.js';
import { WindowControls } from './utils/window-controls.js';
import { VideoActions } from './utils/video-actions.js';

/**
 * Context Menu Controller
 * Manages right-click menu for native video player
 */
class ContextMenu {
    constructor() {
        this.menuElement = null;
        this.trackSubmenu = null;
        this.videoElement = null;
        this.isVisible = false;
        
        // Initialize managers
        this.trackManager = null;
        this.windowControls = null;
        this.videoActions = null;
        
        this.init();
    }

    async init() {
        // Wait for DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        this.videoElement = document.getElementById('native-video-player');
        
        if (!this.videoElement) {
            console.error('❌ Video element not found');
            return;
        }

        // Initialize managers
        this.trackManager = new TrackManager(this.videoElement);
        this.windowControls = new WindowControls();
        this.videoActions = new VideoActions(this.videoElement);

        this.createMenu();
        this.attachEventListeners();

        console.log('✓ Context menu initialized');
    }

    createMenu() {
        // Create main menu
        this.menuElement = document.createElement('div');
        this.menuElement.className = 'context-menu';
        this.menuElement.id = 'video-context-menu';
        
        this.menuElement.innerHTML = `
            <div class="context-menu-item" data-action="open-file">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/open-video-file.png" alt="Open video" /></span>
                <span class="context-menu-item-label">Open File</span>
                <span class="context-menu-item-shortcut">Ctrl+O</span>
            </div>
            
            <div class="context-menu-separator"></div>
            
            <div class="context-menu-item has-submenu" data-action="tracks">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/subtitle.png" alt="Add subtitles" /></span>
                <span class="context-menu-item-label">Subtitles</span>
            </div>
            
            <div class="context-menu-separator"></div>
            
            <div class="context-menu-item" data-action="refresh">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/refresh.png" alt="Refresh" /></span>
                <span class="context-menu-item-label">Refresh</span>
                <span class="context-menu-item-shortcut">F5</span>
            </div>
            
            <div class="context-menu-item" data-action="pip">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/pip.png" alt="Picture in Picture" /></span>
                <span class="context-menu-item-label">Picture in Picture</span>
                <span class="context-menu-item-shortcut">P</span>
            </div>
            
            <div class="context-menu-item" data-action="fullscreen">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/fullscreen.png" alt="Fullscreen" /></span>
                <span class="context-menu-item-label">Fullscreen</span>
                <span class="context-menu-item-shortcut">F</span>
            </div>
            
            <div class="context-menu-separator"></div>
            
            <div class="context-menu-item" data-action="duplicate">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/duplicate-window.png" alt="Duplicate window" /></span>
                <span class="context-menu-item-label">Duplicate Window</span>
                <span class="context-menu-item-shortcut">Ctrl+D</span>
            </div>
        `;

        // Create track submenu
        this.trackSubmenu = document.createElement('div');
        this.trackSubmenu.className = 'track-submenu';
        this.trackSubmenu.innerHTML = `
            <div class="context-menu-item" data-track-action="load">
                <span class="context-menu-item-icon"><img style="width: 16px; height: 16px;" src="assets/others/subtitle-filled.png" alt="Open subtitle" /></span>
                <span class="context-menu-item-label">Load Subtitle File...</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="track-item" data-track-action="disable">
                <span class="track-item-check"></span>
                <span>Disable</span>
            </div>
        `;

        // Append to document
        document.body.appendChild(this.menuElement);
        
        // Find tracks item and append submenu
        const tracksItem = this.menuElement.querySelector('[data-action="tracks"]');
        tracksItem.appendChild(this.trackSubmenu);
    }

    attachEventListeners() {
        // Right-click on video
        this.videoElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.show(e.clientX, e.clientY);
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!this.menuElement.contains(e.target)) {
                this.hide();
            }
        });

        // ESC to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hide();
            }
        });

        // Menu item clicks
        this.menuElement.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (!item || item.classList.contains('disabled')) return;

            const action = item.dataset.action;
            
            if (action === 'tracks') {
                // Toggle submenu
                this.trackSubmenu.classList.toggle('visible');
                return;
            }

            this.handleAction(action);
            this.hide();
        });

        // Track submenu clicks
        this.trackSubmenu.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const item = e.target.closest('[data-track-action]');
            if (!item) return;

            const action = item.dataset.trackAction;
            this.handleTrackAction(action);
            this.hide();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                this.handleAction('open-file');
            } else if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                this.handleAction('duplicate');
            } else if (e.key === 'f' || e.key === 'F') {
                this.handleAction('fullscreen');
            } else if (e.key === 'p' || e.key === 'P') {
                this.handleAction('pip');
            } else if (e.key === 'F5') {
                e.preventDefault();
                this.handleAction('refresh');
            }
        });
    }

    show(x, y) {
        // Update track list
        this.updateTrackList();

        // Position menu
        this.menuElement.style.left = `${x}px`;
        this.menuElement.style.top = `${y}px`;
        
        // Show menu
        this.menuElement.classList.add('visible');
        this.isVisible = true;

        // Adjust position if off-screen
        requestAnimationFrame(() => {
            const rect = this.menuElement.getBoundingClientRect();
            
            if (rect.right > window.innerWidth) {
                this.menuElement.style.left = `${x - rect.width}px`;
            }
            
            if (rect.bottom > window.innerHeight) {
                this.menuElement.style.top = `${y - rect.height}px`;
            }
        });
    }

    hide() {
        this.menuElement.classList.remove('visible');
        this.trackSubmenu.classList.remove('visible');
        this.isVisible = false;
    }

    async handleAction(action) {
        try {
            switch (action) {
                case 'open-file':
                    await openVideoFile(this.videoElement);
                    break;
                    
                case 'refresh':
                    this.videoActions.refresh();
                    break;
                    
                case 'pip':
                    await this.videoActions.togglePictureInPicture();
                    break;
                    
                case 'fullscreen':
                    await this.videoActions.toggleFullscreen();
                    break;
                    
                case 'duplicate':
                    await this.windowControls.duplicateWindow();
                    break;
                    
                default:
                    console.warn('Unknown action:', action);
            }
        } catch (error) {
            console.error(`❌ Failed to execute action ${action}:`, error);
        }
    }

    async handleTrackAction(action) {
        try {
            switch (action) {
                case 'load':
                    await this.trackManager.loadSubtitleFile();
                    break;
                    
                case 'disable':
                    this.trackManager.disableAllTracks();
                    break;
                    
                default:
                    // Track selection by index
                    const trackIndex = parseInt(action);
                    if (!isNaN(trackIndex)) {
                        this.trackManager.setActiveTrack(trackIndex);
                    }
            }
        } catch (error) {
            console.error(`❌ Failed to execute track action ${action}:`, error);
        }
    }

    updateTrackList() {
        const tracks = this.trackManager.getTracks();
        const trackListContainer = this.trackSubmenu;
        
        // Remove old track items (keep load and disable)
        const oldItems = trackListContainer.querySelectorAll('.track-item:not([data-track-action="disable"])');
        oldItems.forEach(item => item.remove());

        // Add current tracks
        tracks.forEach((track, index) => {
            const trackItem = document.createElement('div');
            trackItem.className = 'track-item';
            trackItem.dataset.trackAction = index.toString();
            
            if (track.mode === 'showing') {
                trackItem.classList.add('active');
            }
            
            trackItem.innerHTML = `
                <span class="track-item-check"></span>
                <span>${track.label || `Track ${index + 1}`}</span>
            `;
            
            trackListContainer.appendChild(trackItem);
        });
    }
}

// Auto-initialize
(function() {
    new ContextMenu();
})();

export default ContextMenu;