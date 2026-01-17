// video.dropper.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
// =================Issues=================
// No Video Audio/Sound

import { VideoTheaterStage } from '../Video.Theater.Stage';

// --- TAURI API SETUP ---

/** Checks if the application is running inside a Tauri WebView environment. */
const isTauri = typeof window !== 'undefined' && window.__TAURI_IPC__ !== undefined;

let listen: any;
let convertFileSrc: (path: string) => string;

if (isTauri) {
    // Dynamic import for Tauri modules, which are only loaded in the desktop environment
    import('@tauri-apps/api/event').then(module => {
        listen = module.listen;
    });
    
    import('@tauri-apps/api/core').then(module => { 
        convertFileSrc = module.convertFileSrc;
    });
}

/**
 * Ensures the Tauri API modules (listen, convertFileSrc) are loaded 
 * before attempting to use them. This replaces the `setTimeout` retry loop.
 */
async function waitForTauriAPIs(): Promise<void> {
  // Use a minimal delay loop to wait for the dynamic imports to resolve
  while (!listen || !convertFileSrc) {
    await new Promise(res => setTimeout(res, 50));
  }
}

// ---------------------------------------------


/**
 * Manages drag-and-drop functionality for video files onto the Video Theater Stage,
 * supporting both standard web (using Blob URLs) and Tauri (using file paths).
 */
export class VideoDropper {
    private stage: VideoTheaterStage;
    private container: HTMLElement | null = null;
    private fileSourceId: string = 'VideoSource-Dropped';
    private originalSourceId: string = 'VideoSource-Stream';
    private allowedVideoExtensions: string[] = ['mp4', 'mkv', 'mov', 'webm', 'avi', 'flv', 'ogg'];


    constructor() {
        this.stage = VideoTheaterStage.getInstance();
        this.initializeDropper();
    }

    private initializeDropper(): void {
        this.container = this.stage.getContainerElement();

        if (this.container) {
            this.setupDropHandler(this.container);
        } else {
            // Check again after a delay if the container isn't immediately ready
            setTimeout(() => {
                this.container = this.stage.getContainerElement();
                if (this.container) {
                    this.setupDropHandler(this.container);
                } else {
                    console.error('VideoDropper failed to find video container after initialization delay.');
                }
            }, 3000); 
        }
    }

    /**
     * Core Logic: Sets up the appropriate drag handler based on the environment.
     */
    private setupDropHandler(container: HTMLElement): void {
        if (isTauri) {
            console.log('VideoDropper: Initializing Tauri File Drop Handler (Async).');
            container.classList.add('tauri-drop-target'); 
            
            // ⭐ IMPROVEMENT: Wait for APIs to load, then setup the listener once.
            waitForTauriAPIs().then(() => {
                this.setupTauriFileDrop();
            });

        } else {
            console.log('VideoDropper: Initializing Standard Web Drop Handler.');
            this.setupWebDragEvents(container);
        }
    }

    // --- Standard Web Drag & Drop Implementation (Uses Blob URLs) ---

    private setupWebDragEvents(container: HTMLElement): void {
        // Standard drag events are necessary for the browser to register the drop zone
        container.addEventListener('dragover', this.handleDragOver, false);
        container.addEventListener('dragenter', this.handleDragEnter, false);
        container.addEventListener('dragleave', this.handleDragLeave, false);
        container.addEventListener('drop', this.handleWebDrop, false);
    }
    
    // Drag/Enter/Leave handlers remain the same...
    private handleDragOver = (e: DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (this.container) {
            this.container.classList.add('is-drag-over');
            this.container.style.boxShadow = '0 0 10px 5px var(--primary-blue)';
            this.container.style.borderColor = 'var(--primary-blue)';
        }
    }

    private handleDragEnter = (e: DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (this.container) { this.container.classList.add('is-drag-over'); }
    }

    private handleDragLeave = (e: DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        if (this.container) { 
            this.container.classList.remove('is-drag-over');
            this.container.style.boxShadow = '';
            this.container.style.borderColor = '';
        }
    }

    private handleWebDrop = (e: DragEvent) => {
        e.preventDefault(); e.stopPropagation();

        if (this.container) {
            this.container.classList.remove('is-drag-over');
            this.container.style.boxShadow = '';
            this.container.style.borderColor = '';
        }

        const videoElement = this.stage.getVideoElement();
        if (!e.dataTransfer || !videoElement) return;

        const files = Array.from(e.dataTransfer.files);
        
        // Find by MIME type starting with 'video/' in web environment
        const videoFile = files.find(file => file.type.startsWith('video/'));

        if (videoFile) {
            this.playDroppedFileBlob(videoElement, videoFile);
        } else {
            this.displayMessage('Error: Dropped item is not a video file.');
        }
    }

    /**
     * Handles playback for the web environment using secure Blob URLs.
     */
    private playDroppedFileBlob(videoElement: HTMLVideoElement, file: File): void {
        const videoUrl = URL.createObjectURL(file);
        
        this.updateVideoSource(videoElement, videoUrl, file.type);
        
        // Audio Fixes: Muted=false and Volume=1
        videoElement.muted = false; 
        videoElement.volume = 1;

        videoElement.load(); 
        videoElement.play().catch(error => {
            console.error('Autoplay failed, user interaction may be required:', error);
            this.displayMessage('Autoplay blocked. Click to play dropped video.'); 
        });
        
        // Cleanup Blob URL resources
        const cleanup = () => URL.revokeObjectURL(videoUrl);
        videoElement.addEventListener('ended', cleanup, { once: true });
        videoElement.addEventListener('pause', cleanup, { once: true }); 
        
        this.displayMessage(`Playing: ${file.name}`);
    }


    // --- Tauri File Drop Implementation (Uses convertFileSrc) ---

    private async setupTauriFileDrop(): Promise<void> {
        
        // Listen for the Tauri window's 'tauri://file-drop' event
        await listen('tauri://file-drop', (event: { payload: string[] }) => {
            const videoElement = this.stage.getVideoElement();
            if (!videoElement) return;

            const paths = event.payload;
            
            // ⭐ IMPROVEMENT: Simplified extension check (Point 6)
            const videoPath = paths.find(p => {
                const parts = p.toLowerCase().split('.');
                const fileExt = parts.length > 1 ? parts.pop() : '';
                return this.allowedVideoExtensions.includes(fileExt || '');
            });

            if (videoPath) {
                this.playDroppedFilePath(videoElement, videoPath);
            } else {
                this.displayMessage('Error: Dropped item is not a video file.');
            }
        });
        
        // Listen for hover state to provide visual feedback
        const container = this.stage.getContainerElement();
        if (container) {
            await listen('tauri://file-drop-hover', (event: any) => {
                const rect = container.getBoundingClientRect();
                const { x, y } = event.payload;

                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    container.classList.add('is-drag-over-tauri');
                } else {
                    container.classList.remove('is-drag-over-tauri');
                }
            });
            await listen('tauri://file-drop-cancelled', () => {
                container.classList.remove('is-drag-over-tauri');
            });
        }
    }

    /**
     * Handles playback for the Tauri environment using tauri:// URLs from file paths.
     */
    private playDroppedFilePath(videoElement: HTMLVideoElement, filePath: string): void {
        
        // 1. Use Tauri's utility to convert the local file path into a web-accessible URL
        const videoUrl = convertFileSrc(filePath); 
        
        // 2. Extract MIME type (Optional, but safe practice)
        const fileExt = filePath.substring(filePath.lastIndexOf('.') + 1).toLowerCase();
        let mimeType = '';
        if (this.allowedVideoExtensions.includes(fileExt)) {
            mimeType = `video/${fileExt}`;
        }
        
        this.updateVideoSource(videoElement, videoUrl, mimeType);
        
        // Audio Fixes: Muted=false and Volume=1
        videoElement.muted = false;
        videoElement.volume = 1;

        videoElement.load();
        videoElement.play().catch(error => {
            console.error('Autoplay failed:', error);
            this.displayMessage('Autoplay blocked. Click the play button to start playback.');
        });
        
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        this.displayMessage(`Playing local file: ${fileName}`);
    }

    // --- Shared Utility Functions ---

    /**
     * Updates the video source element and removes the previous source.
     */
    private updateVideoSource(videoElement: HTMLVideoElement, url: string, type: string): void {
        // Remove the original source element temporarily
        const originalSource = document.getElementById(this.originalSourceId);
        if (originalSource) {
            originalSource.remove();
        }

        // Check for an existing dropped source or create a new one
        let droppedSource = document.getElementById(this.fileSourceId) as HTMLSourceElement;
        if (!droppedSource) {
            droppedSource = document.createElement('source');
            droppedSource.id = this.fileSourceId;
            droppedSource.classList.add('video-source');
            videoElement.prepend(droppedSource);
        }

        // Set the new video source
        droppedSource.src = url;
        if (type) {
             droppedSource.type = type;
        } else {
             droppedSource.removeAttribute('type');
        }

        // Update file name display
        const fileNameElement = document.getElementById('video-file-name');
        if (fileNameElement) {
            fileNameElement.textContent = url.substring(url.lastIndexOf('/') + 1);
        }
    }

    private displayMessage(message: string): void {
        const container = this.stage.getContainerElement();
        if (container) {
            let messageDiv = document.getElementById('dropper-message-overlay');
            if (!messageDiv) {
                messageDiv = document.createElement('div');
                messageDiv.id = 'dropper-message-overlay';
                messageDiv.style.cssText = `
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(0, 0, 0, 0.7); color: white; padding: 10px 20px; 
                    border-radius: 8px; z-index: 100; font-size: 1.2em; opacity: 1;
                    transition: opacity 0.5s ease-out; pointer-events: none;
                `;
                container.appendChild(messageDiv);
            }
            messageDiv.textContent = message;
            messageDiv.style.opacity = '1';
            
            setTimeout(() => {
                messageDiv!.style.opacity = '0';
            }, 3000);
        }
    }
}