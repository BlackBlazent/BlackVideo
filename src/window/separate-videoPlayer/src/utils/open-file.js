/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

const isTauri = typeof window !== 'undefined' && window.__TAURI_IPC__ !== undefined;

/**
 * Opens file dialog and loads selected video
 * @param {HTMLVideoElement} videoElement
 */
export async function openVideoFile(videoElement) {
    if (!isTauri) {
        console.log('📂 Web environment detected - using browser file picker');
        openWebFilePicker(videoElement);
        return;
    }

    console.log('📂 Tauri environment detected - using native file dialog');

    try {
        // Import Tauri APIs
        const { open } = await import('https://esm.sh/@tauri-apps/plugin-dialog@2');
        const { convertFileSrc } = await import('https://esm.sh/@tauri-apps/api@2/core');

        // Open file dialog
        const selected = await open({
            multiple: false,
            directory: false,
            title: 'Select Video File',
            filters: [{
                name: 'Video Files',
                extensions: ['mp4', 'mkv', 'webm', 'avi', 'mov', 'flv', 'wmv', 'm4v', 'ogg']
            }]
        });

        if (!selected) {
            console.log('File selection cancelled');
            return;
        }

        console.log('✓ File selected:', selected);

        // Security: Validate path
        if (selected.includes('..')) {
            throw new Error('Invalid file path - path traversal detected');
        }

        // ⭐ KEY: Convert file path to Tauri asset protocol URL
        // This is the correct way to load local files in Tauri
        const assetUrl = convertFileSrc(selected);
        
        console.log('🔄 Converted to asset URL:', assetUrl);

        // Determine MIME type from extension
        const ext = selected.split('.').pop().toLowerCase();
        const mimeType = getMimeType(ext);

        // Load the video using Tauri's asset protocol
        await loadVideoFromAssetUrl(videoElement, assetUrl, mimeType);

        console.log('✓ Video loaded successfully');

    } catch (error) {
        console.error('❌ Failed to open file:', error);
        showUserError('Failed to open file: ' + error.message);
    }
}

/**
 * Fallback for web environment
 * NOTE: This works in browser but NOT in Tauri webview due to security restrictions
 */
function openWebFilePicker(videoElement) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            showUserError('Please select a valid video file');
            return;
        }

        // ⚠️ This only works in pure browser environment, NOT in Tauri
        const blobUrl = URL.createObjectURL(file);
        
        console.log('📹 Loading video from blob URL:', blobUrl);
        
        loadVideoFromBlobUrl(videoElement, blobUrl, file.type);
    };
    
    input.click();
}

/**
 * Load video from Tauri asset:// protocol URL
 * This is the CORRECT method for Tauri v2
 */
async function loadVideoFromAssetUrl(videoElement, assetUrl, mimeType) {
    return new Promise((resolve, reject) => {
        console.log('🎬 Loading video from asset URL...');
        console.log('   URL:', assetUrl);
        console.log('   Type:', mimeType);

        // Show loading indicator
        showLoadingIndicator();

        // Clear any existing video
        videoElement.pause();
        videoElement.removeAttribute('src');
        videoElement.load();

        // Remove existing sources
        const existingSources = videoElement.querySelectorAll('source');
        existingSources.forEach(source => source.remove());

        // Create new source element
        const source = document.createElement('source');
        source.src = assetUrl;
        source.type = mimeType;

        // Insert before any track elements
        const firstTrack = videoElement.querySelector('track');
        if (firstTrack) {
            videoElement.insertBefore(source, firstTrack);
        } else {
            videoElement.appendChild(source);
        }

        // Success handler
        const onLoadedMetadata = () => {
            console.log('✓ Video metadata loaded');
            console.log('   Duration:', videoElement.duration + 's');
            console.log('   Resolution:', videoElement.videoWidth + 'x' + videoElement.videoHeight);
            
            hideLoadingIndicator();
            videoElement.style.display = 'block';
            
            // Notify other scripts
            videoElement.dispatchEvent(new CustomEvent('videoSourceChanged', {
                detail: { src: assetUrl, type: mimeType }
            }));
            
            resolve();
        };

        const onCanPlay = () => {
            console.log('✓ Video ready to play');
            
            // Auto-play
            videoElement.play().catch(e => {
                console.warn('⚠️ Autoplay blocked:', e.message);
                showPlayButton(videoElement);
            });
        };

        const onError = (e) => {
            console.error('❌ Video load error:', e);
            
            const error = videoElement.error;
            let errorMsg = 'Failed to load video';
            
            if (error) {
                console.error('   Error code:', error.code);
                console.error('   Error message:', error.message);
                
                switch (error.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        errorMsg = 'Video loading was aborted';
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        errorMsg = 'Network error - check file permissions';
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        errorMsg = 'Video decoding failed - codec not supported';
                        break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        errorMsg = 'Video format not supported';
                        break;
                }
            }
            
            hideLoadingIndicator();
            showUserError(errorMsg);
            reject(new Error(errorMsg));
        };

        // Attach listeners
        videoElement.addEventListener('loadedmetadata', onLoadedMetadata, { once: true });
        videoElement.addEventListener('canplay', onCanPlay, { once: true });
        videoElement.addEventListener('error', onError, { once: true });

        // Timeout
        const timeout = setTimeout(() => {
            console.error('❌ Video load timeout (30s)');
            hideLoadingIndicator();
            showUserError('Video load timeout - file may be inaccessible');
            reject(new Error('Timeout'));
        }, 30000);

        videoElement.addEventListener('loadedmetadata', () => clearTimeout(timeout), { once: true });

        // Load the video
        videoElement.load();
    });
}

/**
 * Load video from blob URL (browser only)
 */
function loadVideoFromBlobUrl(videoElement, blobUrl, mimeType) {
    videoElement.pause();
    videoElement.src = blobUrl;
    videoElement.load();
    
    videoElement.addEventListener('loadedmetadata', () => {
        console.log('✓ Video loaded from blob');
        videoElement.play().catch(e => {
            console.warn('Autoplay blocked:', e);
            showPlayButton(videoElement);
        });
    }, { once: true });

    videoElement.addEventListener('error', () => {
        showUserError('Failed to load video from blob URL');
    }, { once: true });

    // Cleanup
    const cleanup = () => URL.revokeObjectURL(blobUrl);
    videoElement.addEventListener('ended', cleanup, { once: true });
    videoElement.addEventListener('error', cleanup, { once: true });
}

/**
 * Get MIME type from file extension
 */
function getMimeType(extension) {
    const mimeTypes = {
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'ogg': 'video/ogg',
        'ogv': 'video/ogg',
        'mov': 'video/quicktime',
        'avi': 'video/x-msvideo',
        'wmv': 'video/x-ms-wmv',
        'flv': 'video/x-flv',
        'mkv': 'video/x-matroska',
        'm4v': 'video/x-m4v'
    };
    
    return mimeTypes[extension.toLowerCase()] || 'video/mp4';
}

/**
 * UI Helper Functions
 */
function showLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'flex';
    }
}

function hideLoadingIndicator() {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

function showUserError(message) {
    const errorDiv = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    
    if (errorDiv && errorText) {
        errorText.textContent = message;
        errorDiv.style.display = 'block';
        errorDiv.classList.add('show-error');
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
            errorDiv.classList.remove('show-error');
        }, 5000);
    } else {
        alert(message);
    }
}

function showPlayButton(videoElement) {
    if (document.getElementById('manual-play-btn')) return;
    
    const container = videoElement.parentElement;
    const btn = document.createElement('button');
    btn.id = 'manual-play-btn';
    btn.textContent = '▶ Click to Play';
    btn.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        font-size: 20px;
        font-weight: bold;
        background: rgba(0, 168, 255, 0.9);
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    btn.onclick = () => {
        videoElement.play().then(() => btn.remove());
    };
    
    container.appendChild(btn);
}