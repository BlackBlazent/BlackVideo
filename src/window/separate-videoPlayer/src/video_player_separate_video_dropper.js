/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

/**
 * Standalone Video Dropper for Separate Native Video Player Window
 * Supports drag-and-drop video files in both web and Tauri environments
 */



'use strict';

// Add this at the top of the file, right after 'use strict';

// =================CRITICAL: Global Drag Prevention=================
/**
 * This is the KEY to making drag-and-drop work in Tauri v2
 * Even with dragDropEnabled: false in config, this allows file drops
 */
window.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, false);

window.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
}, false);

// Also prevent on document level as backup
document.addEventListener('dragover', (e) => {
    e.preventDefault();
}, false);

document.addEventListener('drop', (e) => {
    e.preventDefault();
}, false);

console.log('✓ Drag-drop event prevention installed');

// =================Configuration=================
const ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mkv', 'mov', 'webm', 'avi', 'flv', 'ogg', 'm4v', 'wmv'];
const VIDEO_CONTAINER_ID = 'video-container';
const VIDEO_ELEMENT_ID = 'native-video-player';

// =================Tauri Detection=================
const isTauri = typeof window !== 'undefined' && window.__TAURI_IPC__ !== undefined;

let tauriListen = null;
let tauriConvertFileSrc = null;

/**
 * Dynamically imports Tauri APIs if running in Tauri environment
 */
async function loadTauriAPIs() {
    if (!isTauri) return;

    try {
        const eventModule = await import('https://esm.sh/@tauri-apps/api@2/event');
        tauriListen = eventModule.listen;

        const coreModule = await import('https://esm.sh/@tauri-apps/api@2/core');
        tauriConvertFileSrc = coreModule.convertFileSrc;

        console.log('✓ Tauri APIs loaded successfully');
    } catch (error) {
        console.error('❌ Failed to load Tauri APIs:', error);
    }
}

/**
 * Waits for Tauri APIs to be loaded before proceeding
 */
async function waitForTauriAPIs() {
    if (!isTauri) return;

    while (!tauriListen || !tauriConvertFileSrc) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// =================Video Dropper Class=================

class SeparateVideoDropper {
    constructor() {
        this.container = null;
        this.videoElement = null;
        this.isInitialized = false;

        this.initialize();
    }

    /**
     * Initialize the video dropper
     */
    async initialize() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Get elements
        this.container = document.getElementById(VIDEO_CONTAINER_ID);
        this.videoElement = document.getElementById(VIDEO_ELEMENT_ID);

        if (!this.container || !this.videoElement) {
            console.error('❌ Video dropper: Required elements not found');
            return;
        }

        // Setup drag-and-drop handlers based on environment
        if (isTauri) {
            console.log('📹 Initializing Tauri file drop handler');
            await loadTauriAPIs();
            await waitForTauriAPIs();
            await this.setupTauriFileDrop();
        } else {
            console.log('📹 Initializing Web drag-and-drop handler');
            this.setupWebDragEvents();
        }

        this.isInitialized = true;
        console.log('✓ Video dropper initialized successfully');
    }

    // =================Web Drag & Drop Implementation=================

    setupWebDragEvents() {
        this.container.addEventListener('dragover', this.handleDragOver.bind(this), false);
        this.container.addEventListener('dragenter', this.handleDragEnter.bind(this), false);
        this.container.addEventListener('dragleave', this.handleDragLeave.bind(this), false);
        this.container.addEventListener('drop', this.handleWebDrop.bind(this), false);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.addDragVisualFeedback();
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
        this.addDragVisualFeedback();
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();

        // Only remove feedback if leaving the container entirely
        const rect = this.container.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX >= rect.right ||
            e.clientY < rect.top || e.clientY >= rect.bottom) {
            this.removeDragVisualFeedback();
        }
    }

    handleWebDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.removeDragVisualFeedback();

        if (!e.dataTransfer) return;

        const files = Array.from(e.dataTransfer.files);
        const videoFile = files.find(file => file.type.startsWith('video/'));

        if (videoFile) {
            this.playVideoFromBlob(videoFile);
        } else {
            this.showMessage('❌ Not a valid video file', 'error');
        }
    }

    /**
     * Play video from File object using Blob URL (Web environment)
     */
    playVideoFromBlob(file) {
        try {
            const blobUrl = URL.createObjectURL(file);

            // Update source
            const source = this.videoElement.querySelector('source');
            if (source) {
                source.src = blobUrl;
                source.type = file.type;
            }

            // Configure audio settings
            this.videoElement.muted = false;
            this.videoElement.volume = 1;

            // Load and play
            this.videoElement.load();
            this.videoElement.play().catch(error => {
                console.warn('Autoplay prevented:', error);
                this.showMessage('▶️ Click to play', 'info');
            });

            // Cleanup blob URL on end/error
            const cleanup = () => {
                URL.revokeObjectURL(blobUrl);
                console.log('✓ Blob URL cleaned up');
            };
            this.videoElement.addEventListener('ended', cleanup, { once: true });
            this.videoElement.addEventListener('error', cleanup, { once: true });

            this.showMessage(`▶️ Playing: ${file.name}`, 'success');
            this.hideLoadingIndicator();

        } catch (error) {
            console.error('❌ Failed to play video from blob:', error);
            this.showMessage('❌ Failed to load video', 'error');
        }
    }

    // =================Tauri File Drop Implementation=================

    async setupTauriFileDrop() {
        try {
            // Listen for file drop events
            await tauriListen('tauri://file-drop', (event) => {
                const paths = event.payload;
                const videoPath = this.findVideoFile(paths);

                if (videoPath) {
                    this.playVideoFromPath(videoPath);
                } else {
                    this.showMessage('❌ Not a valid video file', 'error');
                }
            });

            // Listen for drag hover events
            await tauriListen('tauri://file-drop-hover', (event) => {
                const { x, y } = event.payload;
                const rect = this.container.getBoundingClientRect();

                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    this.addDragVisualFeedback();
                } else {
                    this.removeDragVisualFeedback();
                }
            });

            // Listen for drag cancelled events
            await tauriListen('tauri://file-drop-cancelled', () => {
                this.removeDragVisualFeedback();
            });

            console.log('✓ Tauri file drop listeners registered');

        } catch (error) {
            console.error('❌ Failed to setup Tauri file drop:', error);
        }
    }

    /**
     * Find video file from dropped paths
     */
    findVideoFile(paths) {
        return paths.find(path => {
            const ext = path.toLowerCase().split('.').pop();
            return ALLOWED_VIDEO_EXTENSIONS.includes(ext);
        });
    }

    /**
     * Play video from file path (Tauri environment)
     */
    playVideoFromPath(filePath) {
        try {
            // Security: Validate path
            if (!filePath || filePath.includes('..')) {
                throw new Error('Invalid file path');
            }

            // Convert file path to Tauri asset URL
            const videoUrl = tauriConvertFileSrc(filePath);

            // Determine MIME type from extension
            const ext = filePath.toLowerCase().split('.').pop();
            const mimeType = `video/${ext}`;

            // Update source
            const source = this.videoElement.querySelector('source');
            if (source) {
                source.src = videoUrl;
                source.type = mimeType;
            }

            // Configure audio settings
            this.videoElement.muted = false;
            this.videoElement.volume = 1;

            // Load and play
            this.videoElement.load();
            this.videoElement.play().catch(error => {
                console.warn('Autoplay prevented:', error);
                this.showMessage('▶️ Click to play', 'info');
            });

            const fileName = filePath.split(/[\\/]/).pop();
            this.showMessage(`▶️ Playing: ${fileName}`, 'success');
            this.hideLoadingIndicator();

            console.log('✓ Playing video from path:', filePath);

        } catch (error) {
            console.error('❌ Failed to play video from path:', error);
            this.showMessage('❌ Failed to load video', 'error');
        }
    }

    // =================UI Feedback Methods=================

    addDragVisualFeedback() {
        if (!this.container) return;

        this.container.classList.add('drag-over-active');
        this.container.style.borderColor = '#00a8ff';
        this.container.style.boxShadow = '0 0 20px rgba(0, 168, 255, 0.5)';
        this.container.style.backgroundColor = 'rgba(0, 168, 255, 0.05)';
    }

    removeDragVisualFeedback() {
        if (!this.container) return;

        this.container.classList.remove('drag-over-active');
        this.container.style.borderColor = '';
        this.container.style.boxShadow = '';
        this.container.style.backgroundColor = '';
    }

    showMessage(message, type = 'info') {
        let messageDiv = document.getElementById('dropper-message');

        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'dropper-message';
            messageDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                z-index: 1000;
                pointer-events: none;
                transition: opacity 0.3s ease;
                opacity: 0;
            `;
            this.container.appendChild(messageDiv);
        }

        // Set message style based on type
        const styles = {
            success: { bg: 'rgba(0, 200, 83, 0.9)', color: '#fff' },
            error: { bg: 'rgba(255, 59, 48, 0.9)', color: '#fff' },
            info: { bg: 'rgba(0, 168, 255, 0.9)', color: '#fff' }
        };

        const style = styles[type] || styles.info;
        messageDiv.style.backgroundColor = style.bg;
        messageDiv.style.color = style.color;
        messageDiv.textContent = message;
        messageDiv.style.opacity = '1';

        // Auto-hide after 3 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
        }, 3000);
    }

    hideLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// =================Auto-Initialize=================

// Initialize when script loads
(async function() {
    try {
        const dropper = new SeparateVideoDropper();
        console.log('✓ Separate video dropper ready');
        
        // Expose to window for debugging
        window.videoDropper = dropper;
    } catch (error) {
        console.error('❌ Failed to initialize video dropper:', error);
    }
})();