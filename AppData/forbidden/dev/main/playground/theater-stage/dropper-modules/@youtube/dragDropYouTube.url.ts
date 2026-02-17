/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { YouTubeUrlProcessor } from './youtube.url.processor';
import type { YouTubeVideoInfo } from './youtube.url.processor';

/**
 * Handles drag-and-drop for YouTube video thumbnails/links
 * Extracts URLs from drag data and plays videos using the proxy server
 */
export class YouTubeDragDropHandler {
  private container: HTMLElement;
  private videoElement: HTMLVideoElement;
  private queue: string[] = [];
  private currentPlayingIndex: number = 0;
  private isProxyReady: boolean = false;
  private sourceElementId: string = 'VideoSource-Stream';

  constructor(container: HTMLElement, videoElement: HTMLVideoElement) {
    this.container = container;
    this.videoElement = videoElement;
    
    console.log('[YouTubeDragDrop] Initializing handler...');
    
    // Check if proxy server is available
    this.checkProxyServer();
    
    // Initialize drag events
    this.initializeDragEvents();
    
    // Setup auto-play next functionality
    this.setupAutoPlayNext();
  }

  /**
   * Check if the YouTube proxy server is running
   */
  private async checkProxyServer(): Promise<void> {
    try {
      this.isProxyReady = await YouTubeUrlProcessor.checkProxyHealth();
      
      if (this.isProxyReady) {
        console.log('[YouTubeDragDrop] ✓ Proxy server is ready');
        this.displayMessage('YouTube drop support active', 'success');
      } else {
        console.warn('[YouTubeDragDrop] ⚠ Proxy server not detected');
        this.displayMessage('YouTube proxy offline. Start server first.', 'warning');
      }
    } catch (error) {
      console.error('[YouTubeDragDrop] Proxy check failed:', error);
      this.isProxyReady = false;
    }
  }

  /**
   * Initialize drag-and-drop event listeners
   */
  private initializeDragEvents(): void {
    // Prevent default drag behavior
    this.container.addEventListener('dragover', this.handleDragOver);
    this.container.addEventListener('dragenter', this.handleDragEnter);
    this.container.addEventListener('dragleave', this.handleDragLeave);
    this.container.addEventListener('drop', this.handleDrop);

    console.log('[YouTubeDragDrop] Drag events initialized');
  }

  /**
   * Handle drag over event - show visual feedback
   */
  private handleDragOver = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    // Add visual feedback
    this.container.classList.add('is-youtube-drag-over');
    this.container.style.boxShadow = '0 0 20px 5px rgba(255, 0, 0, 0.5)'; // Red for YouTube
    this.container.style.borderColor = '#FF0000';
    
    // Update cursor
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  /**
   * Handle drag enter event
   */
  private handleDragEnter = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    this.container.classList.add('is-youtube-drag-over');
  };

  /**
   * Handle drag leave event - remove visual feedback
   */
  private handleDragLeave = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    
    this.container.classList.remove('is-youtube-drag-over');
    this.container.style.boxShadow = '';
    this.container.style.borderColor = '';
  };

  /**
   * Handle drop event - extract URL and play video
   */
  private handleDrop = async (e: DragEvent): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();

    // Remove visual feedback
    this.container.classList.remove('is-youtube-drag-over');
    this.container.style.boxShadow = '';
    this.container.style.borderColor = '';

    if (!this.isProxyReady) {
      this.displayMessage('YouTube proxy server is not running', 'error');
      return;
    }

    // Extract URL from drag data
    const url = this.extractUrlFromDragEvent(e);

    if (!url) {
      this.displayMessage('No URL found in dropped content', 'error');
      return;
    }

    console.log('[YouTubeDragDrop] Dropped URL:', url);

    // Check if it's a YouTube URL
    if (this.isYouTubeUrl(url)) {
      await this.handleYouTubeUrl(url);
    } else {
      this.displayMessage('Not a YouTube URL', 'warning');
    }
  };

  /**
   * Extract URL from drag event data
   * Tries multiple data types and formats
   */
  private extractUrlFromDragEvent(e: DragEvent): string | null {
    if (!e.dataTransfer) return null;

    // Try different data types
    const types = ['text/plain', 'text/uri-list', 'text/html'];
    
    for (const type of types) {
      const data = e.dataTransfer.getData(type);
      
      if (data) {
        // For HTML, extract href from anchor tags
        if (type === 'text/html') {
          const match = data.match(/href="([^"]+)"/);
          if (match) return match[1];
        }
        
        // For plain text, check if it's a URL
        if (data.startsWith('http://') || data.startsWith('https://')) {
          return data;
        }
      }
    }

    return null;
  }

  /**
   * Check if URL is from YouTube
   */
  private isYouTubeUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      return hostname === 'youtube.com' || hostname === 'youtu.be';
    } catch {
      return false;
    }
  }

  /**
   * Process and play YouTube URL
   */
  private async handleYouTubeUrl(url: string): Promise<void> {
    this.displayMessage('Processing YouTube video...', 'info');

    try {
      // Parse the URL
      const data = YouTubeUrlProcessor.process(url);
      
      if (!data || !data.videoId) {
        this.displayMessage('Could not extract video ID', 'error');
        return;
      }

      console.log('[YouTubeDragDrop] Video ID:', data.videoId);
      console.log('[YouTubeDragDrop] Is Shorts:', data.isShorts);
      console.log('[YouTubeDragDrop] Is Playlist:', data.isPlaylist);

      // Handle playlist vs single video
      if (data.isPlaylist && data.playlistId) {
        await this.handlePlaylist(data.playlistId);
      } else {
        await this.playSingleVideo(data.videoId);
      }

    } catch (error) {
      console.error('[YouTubeDragDrop] Error:', error);
      this.displayMessage('Failed to load video', 'error');
    }
  }

  /**
   * Play a single YouTube video
   */
  private async playSingleVideo(videoId: string): Promise<void> {
    try {
      // Get video info first
      const info = await YouTubeUrlProcessor.getVideoInfo(videoId);
      
      if (info) {
        console.log('[YouTubeDragDrop] Video:', info.title);
        this.displayMessage(`Loading: ${info.title}`, 'info');
      }

      // Get stream URL from proxy
      const streamUrl = await YouTubeUrlProcessor.getStreamUrl(videoId);
      
      if (!streamUrl) {
        throw new Error('Failed to get stream URL');
      }

      // Update video source
      this.updateVideoSource(streamUrl, 'video/mp4');
      
      // Configure video element
      this.videoElement.muted = false;
      this.videoElement.volume = 1;
      
      // Load and play
      this.videoElement.load();
      
      const playPromise = this.videoElement.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            const title = info?.title || 'YouTube Video';
            this.displayMessage(`Playing: ${title}`, 'success');
            console.log('[YouTubeDragDrop] ✓ Playback started');
          })
          .catch((error) => {
            console.error('[YouTubeDragDrop] Autoplay failed:', error);
            this.displayMessage('Click play to start video', 'warning');
          });
      }

      // Set queue for single video
      this.queue = [videoId];
      this.currentPlayingIndex = 0;

    } catch (error) {
      console.error('[YouTubeDragDrop] Play error:', error);
      this.displayMessage('Failed to play video', 'error');
    }
  }

  /**
   * Handle playlist (placeholder for future implementation)
   */
  private async handlePlaylist(playlistId: string): Promise<void> {
    console.warn('[YouTubeDragDrop] Playlist support coming soon');
    this.displayMessage('Playlist support not yet available', 'warning');
    
    // TODO: Implement playlist handling
    // const videoIds = await YouTubeUrlProcessor.fetchPlaylistIds(playlistId);
    // this.queue = videoIds;
    // if (this.queue.length > 0) {
    //   await this.playSingleVideo(this.queue[0]);
    // }
  }

  /**
   * Setup auto-play next video in queue
   */
  private setupAutoPlayNext(): void {
    this.videoElement.addEventListener('ended', async () => {
      if (this.currentPlayingIndex < this.queue.length - 1) {
        this.currentPlayingIndex++;
        console.log('[YouTubeDragDrop] Auto-playing next video...');
        await this.playSingleVideo(this.queue[this.currentPlayingIndex]);
      } else {
        console.log('[YouTubeDragDrop] Queue finished');
        this.displayMessage('Queue finished', 'info');
      }
    });
  }

  /**
   * Update video source element
   */
  private updateVideoSource(url: string, type: string): void {
    // Get or create source element
    let sourceElement = document.getElementById(this.sourceElementId) as HTMLSourceElement;
    
    if (!sourceElement) {
      sourceElement = document.createElement('source');
      sourceElement.id = this.sourceElementId;
      sourceElement.className = 'video-source';
      this.videoElement.prepend(sourceElement);
    }

    // Update source
    sourceElement.src = url;
    sourceElement.type = type;

    console.log('[YouTubeDragDrop] Source updated:', url);
  }

  /**
   * Display message overlay
   */
  private displayMessage(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    let messageDiv = document.getElementById('youtube-dropper-message');
    
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.id = 'youtube-dropper-message';
      messageDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.85);
        color: white;
        padding: 15px 30px;
        border-radius: 10px;
        z-index: 1000;
        font-size: 1.1em;
        font-weight: 500;
        opacity: 1;
        transition: opacity 0.5s ease-out;
        pointer-events: none;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      `;
      this.container.appendChild(messageDiv);
    }

    // Set color based on type
    const colors = {
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    };

    messageDiv.style.borderLeft = `5px solid ${colors[type]}`;
    messageDiv.textContent = message;
    messageDiv.style.opacity = '1';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (messageDiv) {
        messageDiv.style.opacity = '0';
      }
    }, 3000);
  }

  /**
   * Cleanup method
   */
  public destroy(): void {
    this.container.removeEventListener('dragover', this.handleDragOver);
    this.container.removeEventListener('dragenter', this.handleDragEnter);
    this.container.removeEventListener('dragleave', this.handleDragLeave);
    this.container.removeEventListener('drop', this.handleDrop);
    
    console.log('[YouTubeDragDrop] Handler destroyed');
  }
}
