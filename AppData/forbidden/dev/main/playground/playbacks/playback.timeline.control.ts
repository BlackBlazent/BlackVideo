// Duration Counter
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// scrubber / Scrub bar / Seek Bar / Timeline	Drag or click to jump to different times in the video -  that slider thing that moves as the video plays. 
// Current Total Time
// Video Sprite Thumbnails -are a technique used to display preview images of a video across its timeline on video players


// primary.playback.timeline.ts - Timeline controls handler with sprite thumbnails

import { VideoTheaterStage } from '../Video.Theater.Stage';

export class PrimaryPlaybackTimelineController {
  private static instance: PrimaryPlaybackTimelineController;
  private videoStage: VideoTheaterStage;
  private videoElement: HTMLVideoElement | null = null;
  
  // Timeline elements
  private durationCounter: HTMLSpanElement | null = null;
  private seekBarProgress: HTMLInputElement | null = null;
  private currentDurationTotal: HTMLSpanElement | null = null;
  
  // Sprite thumbnail elements
  private thumbnailContainer: HTMLDivElement | null = null;
  private thumbnailImage: HTMLImageElement | null = null;
  
  // State management
  private isDragging: boolean = false;
  private updateInterval: number | null = null;
  private spriteConfig = {
    url: '',
    width: 160,
    height: 90,
    columns: 10,
    rows: 0,
    interval: 1 // seconds per thumbnail
  };

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    this.initializeTimeline();
  }

  public static getInstance(): PrimaryPlaybackTimelineController {
    if (!PrimaryPlaybackTimelineController.instance) {
      PrimaryPlaybackTimelineController.instance = new PrimaryPlaybackTimelineController();
    }
    return PrimaryPlaybackTimelineController.instance;
  }

  private initializeTimeline(): void {
    // Subscribe to video events from the stage
    this.videoStage.subscribe('loadedmetadata', this.onVideoReady.bind(this));
    this.videoStage.subscribe('canplay', this.onVideoReady.bind(this));
    
    // Initialize timeline controls
    this.initializeTimelineControls();
    this.createThumbnailContainer();
  }

  private initializeTimelineControls(): void {
    const maxAttempts = 15;
    let attempts = 0;

    const findTimelineElements = () => {
      this.durationCounter = document.getElementById('videoTimelineDurationCounter') as HTMLSpanElement;
      this.seekBarProgress = document.getElementById('videoTimelineSeekBarProgress') as HTMLInputElement;
      this.currentDurationTotal = document.getElementById('videoTimelineCurrentDurationTotal') as HTMLSpanElement;

      if (this.durationCounter && this.seekBarProgress && this.currentDurationTotal) {
        console.log('Timeline control elements found successfully');
        this.setupTimelineEventListeners();
        this.initializeTimelineState();
        return true;
      }

      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(findTimelineElements, 200);
        console.log(`Attempt ${attempts} to find timeline control elements...`);
      } else {
        console.warn('Timeline control elements not found after maximum attempts');
      }
      return false;
    };

    const init = () => {
      findTimelineElements();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  private createThumbnailContainer(): void {
    // Create thumbnail preview container
    this.thumbnailContainer = document.createElement('div');
    this.thumbnailContainer.id = 'video-thumbnail-preview';
    this.thumbnailContainer.className = 'video-thumbnail-preview';
    this.thumbnailContainer.style.cssText = `
      position: absolute;
      display: none;
      pointer-events: none;
      z-index: 1000;
      border: 2px solid #fff;
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      background: #000;
    `;

    this.thumbnailImage = document.createElement('img');
    this.thumbnailImage.style.cssText = `
      width: ${this.spriteConfig.width}px;
      height: ${this.spriteConfig.height}px;
      display: block;
    `;

    this.thumbnailContainer.appendChild(this.thumbnailImage);
    document.body.appendChild(this.thumbnailContainer);
  }

  private onVideoReady(): void {
    this.videoElement = this.videoStage.getVideoElement();
    if (this.videoElement) {
      console.log('Video element ready for timeline control');
      this.setupVideoEventListeners();
      this.initializeSpriteConfig();
      this.updateTimelineDuration();
    }
  }

  private initializeSpriteConfig(): void {
    if (!this.videoElement) return;

    // Generate sprite URL based on video source
    const videoSource = this.videoElement.querySelector('source') as HTMLSourceElement;
    if (videoSource && videoSource.src) {
      // Replace video extension with .jpg for sprite
      this.spriteConfig.url = videoSource.src.replace(/\.(mp4|webm|ogg)$/i, '-sprite.jpg');
      console.log('Sprite URL configured:', this.spriteConfig.url);
    }
  }

  private setupTimelineEventListeners(): void {
    if (!this.seekBarProgress) return;

    // Scrubber interaction events
    this.seekBarProgress.addEventListener('input', this.handleSeekBarInput.bind(this));
    this.seekBarProgress.addEventListener('mousedown', this.handleSeekBarMouseDown.bind(this));
    this.seekBarProgress.addEventListener('mouseup', this.handleSeekBarMouseUp.bind(this));
    this.seekBarProgress.addEventListener('mousemove', this.handleSeekBarMouseMove.bind(this));
    this.seekBarProgress.addEventListener('mouseleave', this.hideThumbnail.bind(this));

    // Touch events for mobile
    this.seekBarProgress.addEventListener('touchstart', this.handleSeekBarMouseDown.bind(this));
    this.seekBarProgress.addEventListener('touchend', this.handleSeekBarMouseUp.bind(this));
    this.seekBarProgress.addEventListener('touchmove', this.handleSeekBarTouchMove.bind(this));

    // Global mouse events for drag detection
    document.addEventListener('mouseup', this.handleDocumentMouseUp.bind(this));
  }

  private setupVideoEventListeners(): void {
    if (!this.videoElement) return;

    // Video time and duration events
    this.videoElement.addEventListener('loadedmetadata', this.updateTimelineDuration.bind(this));
    this.videoElement.addEventListener('timeupdate', this.updateTimelineProgress.bind(this));
    this.videoElement.addEventListener('durationchange', this.updateTimelineDuration.bind(this));
    this.videoElement.addEventListener('play', this.startProgressTracking.bind(this));
    this.videoElement.addEventListener('pause', this.stopProgressTracking.bind(this));
    this.videoElement.addEventListener('ended', this.stopProgressTracking.bind(this));
  }

  private initializeTimelineState(): void {
    // Reset timeline to initial state
    this.updateTimeDisplay(this.durationCounter, 0);
    this.updateTimeDisplay(this.currentDurationTotal, 0);
    
    if (this.seekBarProgress) {
      this.seekBarProgress.value = '0';
      this.seekBarProgress.max = '0';
      this.updateSeekBarFill();
    }
  }

  private handleSeekBarInput(event: Event): void {
    if (!this.videoElement || !this.seekBarProgress) return;

    const target = event.target as HTMLInputElement;
    const seekTime = parseFloat(target.value);
    
    if (!this.isDragging) {
      this.videoElement.currentTime = seekTime;
    }
    
    this.updateTimeDisplay(this.durationCounter, seekTime);
    this.updateSeekBarFill();
    this.showThumbnailAtTime(seekTime);
  }

  private handleSeekBarMouseDown(_event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
    this.stopProgressTracking();
    
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
  }

  private handleSeekBarMouseUp(_event: MouseEvent | TouchEvent): void {
    if (!this.isDragging || !this.videoElement || !this.seekBarProgress) return;

    const seekTime = parseFloat(this.seekBarProgress.value);
    this.videoElement.currentTime = seekTime;
    
    this.isDragging = false;
    this.hideThumbnail();
    
    // Resume playback if it was playing before
    if (this.videoElement.paused) {
      this.videoElement.play().catch(console.error);
    }
  }

  private handleSeekBarMouseMove(event: MouseEvent): void {
    if (!this.seekBarProgress) return;

    const rect = this.seekBarProgress.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const duration = parseFloat(this.seekBarProgress.max);
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    this.showThumbnailAtTime(hoverTime, event.clientX, event.clientY);
  }

  private handleSeekBarTouchMove(event: TouchEvent): void {
    if (!this.seekBarProgress || event.touches.length === 0) return;

    const touch = event.touches[0];
    const rect = this.seekBarProgress.getBoundingClientRect();
    const percent = (touch.clientX - rect.left) / rect.width;
    const duration = parseFloat(this.seekBarProgress.max);
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    this.showThumbnailAtTime(hoverTime, touch.clientX, touch.clientY);
  }

  private handleDocumentMouseUp(): void {
    if (this.isDragging) {
      this.handleSeekBarMouseUp(new MouseEvent('mouseup'));
    }
  }

  private updateTimelineDuration(): void {
    if (!this.videoElement || !this.seekBarProgress || !this.currentDurationTotal) return;

    const duration = this.videoElement.duration || 0;
    
    this.seekBarProgress.max = duration.toString();
    this.updateTimeDisplay(this.currentDurationTotal, duration);
    
    // Calculate sprite grid rows based on duration
    this.spriteConfig.rows = Math.ceil(duration / this.spriteConfig.interval / this.spriteConfig.columns);
    
    console.log('Timeline duration updated:', this.formatTime(duration));
  }

  private updateTimelineProgress(): void {
    if (!this.videoElement || !this.seekBarProgress || !this.durationCounter || this.isDragging) return;

    const currentTime = this.videoElement.currentTime;
    
    this.seekBarProgress.value = currentTime.toString();
    this.updateTimeDisplay(this.durationCounter, currentTime);
    this.updateSeekBarFill();
  }

  private updateSeekBarFill(): void {
    if (!this.seekBarProgress) return;

    const value = parseFloat(this.seekBarProgress.value);
    const max = parseFloat(this.seekBarProgress.max);
    const percentage = max > 0 ? (value / max) * 100 : 0;

    // Apply red fill effect
    this.seekBarProgress.style.background = `linear-gradient(to right, #ff0000 0%, #ff0000 ${percentage}%, #333 ${percentage}%, #333 100%)`;
  }

  private startProgressTracking(): void {
    if (this.updateInterval) return;

    this.updateInterval = window.setInterval(() => {
      this.updateTimelineProgress();
    }, 100); // Update every 100ms for smooth progress
  }

  private stopProgressTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private showThumbnailAtTime(time: number, mouseX?: number, mouseY?: number): void {
    if (!this.thumbnailContainer || !this.thumbnailImage || !this.spriteConfig.url) return;

    const thumbnailIndex = Math.floor(time / this.spriteConfig.interval);
    const row = Math.floor(thumbnailIndex / this.spriteConfig.columns);
    const col = thumbnailIndex % this.spriteConfig.columns;

    // Calculate sprite position
    const offsetX = col * this.spriteConfig.width;
    const offsetY = row * this.spriteConfig.height;

    // Update thumbnail image
    this.thumbnailImage.src = this.spriteConfig.url;
    this.thumbnailImage.style.objectPosition = `-${offsetX}px -${offsetY}px`;
    this.thumbnailImage.style.objectFit = 'none';

    // Position thumbnail container
    if (mouseX !== undefined && mouseY !== undefined) {
      // const containerRect = this.thumbnailContainer.getBoundingClientRect();
      const left = Math.max(10, Math.min(window.innerWidth - this.spriteConfig.width - 10, mouseX - this.spriteConfig.width / 2));
      const top = mouseY - this.spriteConfig.height - 20;

      this.thumbnailContainer.style.left = `${left}px`;
      this.thumbnailContainer.style.top = `${top}px`;
    }

    this.thumbnailContainer.style.display = 'block';
  }

  private hideThumbnail(): void {
    if (this.thumbnailContainer) {
      this.thumbnailContainer.style.display = 'none';
    }
  }

  private updateTimeDisplay(element: HTMLSpanElement | null, seconds: number): void {
    if (!element) return;
    element.textContent = this.formatTime(seconds);
  }

  private formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Public API methods
  public setCurrentTime(time: number): void {
    if (this.videoElement) {
      this.videoElement.currentTime = time;
    }
  }

  public getCurrentTime(): number {
    return this.videoElement?.currentTime || 0;
  }

  public getDuration(): number {
    return this.videoElement?.duration || 0;
  }

  public setSpriteConfig(config: Partial<typeof this.spriteConfig>): void {
    this.spriteConfig = { ...this.spriteConfig, ...config };
    console.log('Sprite config updated:', this.spriteConfig);
  }

  public updateSpriteUrl(url: string): void {
    this.spriteConfig.url = url;
    console.log('Sprite URL updated:', url);
  }

  // Cleanup method
  public destroy(): void {
    // Clear intervals
    this.stopProgressTracking();

    // Remove event listeners
    if (this.seekBarProgress) {
      this.seekBarProgress.removeEventListener('input', this.handleSeekBarInput.bind(this));
      this.seekBarProgress.removeEventListener('mousedown', this.handleSeekBarMouseDown.bind(this));
      this.seekBarProgress.removeEventListener('mouseup', this.handleSeekBarMouseUp.bind(this));
      this.seekBarProgress.removeEventListener('mousemove', this.handleSeekBarMouseMove.bind(this));
      this.seekBarProgress.removeEventListener('mouseleave', this.hideThumbnail.bind(this));
    }

    document.removeEventListener('mouseup', this.handleDocumentMouseUp.bind(this));

    // Remove thumbnail container
    if (this.thumbnailContainer && this.thumbnailContainer.parentNode) {
      this.thumbnailContainer.parentNode.removeChild(this.thumbnailContainer);
    }

    console.log('Primary playback timeline controller destroyed');
  }
}

// Export singleton instance
export const primaryPlaybackTimelineController = PrimaryPlaybackTimelineController.getInstance();