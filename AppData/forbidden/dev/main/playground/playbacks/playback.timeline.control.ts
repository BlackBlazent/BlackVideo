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

// playback.timeline.controls.ts - Timeline controls handler with resume playback integration

import { VideoTheaterStage } from '../Video.Theater.Stage';
import { SpriteThumbnailManager } from './sprite-preview/spriteThumbnailManager';
import { resumePlaybackIndex } from '../customs/utils/settings/lib/resumePlayback/resumePlaybackIndex';

export class PrimaryPlaybackTimelineController {
  private static instance: PrimaryPlaybackTimelineController;
  private videoStage: VideoTheaterStage;
  private videoElement: HTMLVideoElement | null = null;
  
  // Timeline elements
  private durationCounter: HTMLSpanElement | null = null;
  private seekBarProgress: HTMLInputElement | null = null;
  private currentDurationTotal: HTMLSpanElement | null = null;
  private hoverTimeCounter: HTMLSpanElement | null = null;
  
  // Sprite thumbnail manager
  private spriteThumbnailManager: SpriteThumbnailManager;
  
  // State management
  private isDragging: boolean = false;
  private updateInterval: number | null = null;
  private isHovering: boolean = false;
  
  // Resume playback integration
  private currentVideoPath: string | null = null;
  private hasInitializedResume: boolean = false;

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    this.spriteThumbnailManager = new SpriteThumbnailManager();
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
    this.videoStage.subscribe('canplay', this.onVideoCanPlay.bind(this));
    
    // Initialize timeline controls
    this.initializeTimelineControls();
    this.createHoverTimeCounter();
  }

  private initializeTimelineControls(): void {
    const maxAttempts = 15;
    let attempts = 0;

    const findTimelineElements = () => {
      this.durationCounter = document.getElementById('videoTimelineDurationCounter') as HTMLSpanElement;
      this.seekBarProgress = document.getElementById('videoTimelineSeekBarProgress') as HTMLInputElement;
      this.currentDurationTotal = document.getElementById('videoTimelineCurrentDurationTotal') as HTMLSpanElement;

      if (this.durationCounter && this.seekBarProgress && this.currentDurationTotal) {
        console.log('✅ Timeline control elements found successfully');
        this.setupTimelineEventListeners();
        this.initializeTimelineState();
        return true;
      }

      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(findTimelineElements, 200);
        console.log(`⏳ Attempt ${attempts} to find timeline control elements...`);
      } else {
        console.warn('⚠️ Timeline control elements not found after maximum attempts');
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

  private createHoverTimeCounter(): void {
    this.hoverTimeCounter = document.createElement('span');
    this.hoverTimeCounter.id = 'video-hover-time-counter';
    this.hoverTimeCounter.className = 'hover-time-counter';
    this.hoverTimeCounter.style.cssText = `
      position: absolute;
      display: none;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-size: 12px;
      font-family: monospace;
      border-radius: 4px;
      pointer-events: none;
      z-index: 999;
      white-space: nowrap;
      transform: translateX(-50%);
    `;
    document.body.appendChild(this.hoverTimeCounter);
  }

  private onVideoReady(): void {
    this.videoElement = this.videoStage.getVideoElement();
    if (this.videoElement) {
      console.log('✅ Video element ready for timeline control');
      this.setupVideoEventListeners();
      this.spriteThumbnailManager.initializeSpriteConfig(this.videoElement);
      this.updateTimelineDuration();
    }
  }

  private onVideoCanPlay(): void {
    // Initialize resume playback when video is ready to play
    if (!this.hasInitializedResume && this.videoElement && this.currentVideoPath) {
      this.initializeResumePlayback();
    }
  }

  /**
   * Initialize resume playback for current video
   */
  private async initializeResumePlayback(): Promise<void> {
    if (!this.videoElement || !this.currentVideoPath || this.hasInitializedResume) {
      return;
    }

    const duration = this.videoElement.duration;
    if (!isFinite(duration) || duration <= 0) {
      return;
    }

    try {
      await resumePlaybackIndex.initializeVideoResume(
        this.currentVideoPath,
        this.videoElement,
        duration
      );
      this.hasInitializedResume = true;
      
      // Update timeline UI to reflect resumed position
      this.updateTimelineProgress();
    } catch (error) {
      console.error('❌ Failed to initialize resume playback:', error);
    }
  }

  /**
   * Set current video source and prepare for resume
   * @param videoPath - Absolute path to the video file
   */
  public setVideoSource(videoPath: string): void {
    this.currentVideoPath = videoPath;
    this.hasInitializedResume = false;
    console.log('📹 Video source set:', videoPath);
  }

  private setupTimelineEventListeners(): void {
    if (!this.seekBarProgress) return;

    // Scrubber interaction events
    this.seekBarProgress.addEventListener('input', this.handleSeekBarInput.bind(this));
    this.seekBarProgress.addEventListener('mousedown', this.handleSeekBarMouseDown.bind(this));
    this.seekBarProgress.addEventListener('mouseup', this.handleSeekBarMouseUp.bind(this));
    this.seekBarProgress.addEventListener('mousemove', this.handleSeekBarMouseMove.bind(this));
    this.seekBarProgress.addEventListener('mouseenter', this.handleSeekBarMouseEnter.bind(this));
    this.seekBarProgress.addEventListener('mouseleave', this.handleSeekBarMouseLeave.bind(this));

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
      this.saveProgressIfEnabled();
    }
    
    this.updateTimeDisplay(this.durationCounter, seekTime);
    this.updateSeekBarFill();
    this.spriteThumbnailManager.showThumbnailAtTime(seekTime);
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
    this.spriteThumbnailManager.hideThumbnail();
    this.hideHoverTimeCounter();
    
    // Save progress after seeking
    this.saveProgressIfEnabled();
    
    // Resume playback if it was playing before
    if (this.videoElement.paused) {
      this.videoElement.play().catch(console.error);
    }
  }

  private handleSeekBarMouseEnter(): void {
    this.isHovering = true;
  }

  private handleSeekBarMouseMove(event: MouseEvent): void {
    if (!this.seekBarProgress) return;

    const rect = this.seekBarProgress.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const duration = parseFloat(this.seekBarProgress.max);
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    this.spriteThumbnailManager.showThumbnailAtTime(hoverTime, event.clientX, event.clientY);
    this.showHoverTimeCounter(hoverTime, event.clientX, rect.top);
  }

  private handleSeekBarMouseLeave(): void {
    this.isHovering = false;
    this.spriteThumbnailManager.hideThumbnail();
    this.hideHoverTimeCounter();
  }

  private handleSeekBarTouchMove(event: TouchEvent): void {
    if (!this.seekBarProgress || event.touches.length === 0) return;

    const touch = event.touches[0];
    const rect = this.seekBarProgress.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const duration = parseFloat(this.seekBarProgress.max);
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    this.spriteThumbnailManager.showThumbnailAtTime(hoverTime, touch.clientX, touch.clientY);
    this.showHoverTimeCounter(hoverTime, touch.clientX, rect.top);
  }

  private handleDocumentMouseUp(): void {
    if (this.isDragging) {
      this.handleSeekBarMouseUp(new MouseEvent('mouseup'));
    }
  }

  private showHoverTimeCounter(time: number, mouseX: number, seekBarTop: number): void {
    if (!this.hoverTimeCounter) return;

    const formattedTime = this.formatTime(time);
    this.hoverTimeCounter.textContent = formattedTime;
    
    this.hoverTimeCounter.style.left = `${mouseX}px`;
    this.hoverTimeCounter.style.top = `${seekBarTop - 30}px`;
    this.hoverTimeCounter.style.display = 'block';
  }

  private hideHoverTimeCounter(): void {
    if (this.hoverTimeCounter) {
      this.hoverTimeCounter.style.display = 'none';
    }
  }

  private updateTimelineDuration(): void {
    if (!this.videoElement || !this.seekBarProgress || !this.currentDurationTotal) return;

    const duration = this.videoElement.duration || 0;
    
    this.seekBarProgress.max = duration.toString();
    this.updateTimeDisplay(this.currentDurationTotal, duration);
    
    this.spriteThumbnailManager.updateSpriteRows(duration);
    
    console.log('⏱️ Timeline duration updated:', this.formatTime(duration));
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

    this.seekBarProgress.style.background = `linear-gradient(to right, #ff0000 0%, #ff0000 ${percentage}%, #333 ${percentage}%, #333 100%)`;
  }

  private startProgressTracking(): void {
    if (this.updateInterval) return;

    this.updateInterval = window.setInterval(() => {
      this.updateTimelineProgress();
    }, 100);
  }

  private stopProgressTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Save current progress if resume playback is enabled
   */
  private saveProgressIfEnabled(): void {
    if (!this.videoElement || !this.currentVideoPath) return;

    const currentTime = this.videoElement.currentTime;
    const duration = this.videoElement.duration;

    if (isFinite(currentTime) && isFinite(duration) && duration > 0) {
      resumePlaybackIndex.saveCurrentProgress(this.currentVideoPath, currentTime, duration)
        .catch((error: any) => console.error('Failed to save progress:', error));
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
      this.saveProgressIfEnabled();
    }
  }

  public getCurrentTime(): number {
    return this.videoElement?.currentTime || 0;
  }

  public getDuration(): number {
    return this.videoElement?.duration || 0;
  }

  public getSpriteThumbnailManager(): SpriteThumbnailManager {
    return this.spriteThumbnailManager;
  }

  public setSpriteConfig(config: Partial<Parameters<SpriteThumbnailManager['setSpriteConfig']>[0]>): void {
    this.spriteThumbnailManager.setSpriteConfig(config);
  }

  public updateSpriteUrl(url: string): void {
    this.spriteThumbnailManager.updateSpriteUrl(url);
  }

  public destroy(): void {
    this.stopProgressTracking();

    if (this.seekBarProgress) {
      this.seekBarProgress.removeEventListener('input', this.handleSeekBarInput.bind(this));
      this.seekBarProgress.removeEventListener('mousedown', this.handleSeekBarMouseDown.bind(this));
      this.seekBarProgress.removeEventListener('mouseup', this.handleSeekBarMouseUp.bind(this));
      this.seekBarProgress.removeEventListener('mousemove', this.handleSeekBarMouseMove.bind(this));
      this.seekBarProgress.removeEventListener('mouseenter', this.handleSeekBarMouseEnter.bind(this));
      this.seekBarProgress.removeEventListener('mouseleave', this.handleSeekBarMouseLeave.bind(this));
    }

    document.removeEventListener('mouseup', this.handleDocumentMouseUp.bind(this));

    if (this.hoverTimeCounter && this.hoverTimeCounter.parentNode) {
      this.hoverTimeCounter.parentNode.removeChild(this.hoverTimeCounter);
    }

    this.spriteThumbnailManager.reset();

    console.log('🧹 Primary playback timeline controller destroyed');
  }
}

export const primaryPlaybackTimelineController = PrimaryPlaybackTimelineController.getInstance();














































































// playback.timeline.controls.ts - Timeline controls handler with sprite thumbnails and hover time counter
/*
import { VideoTheaterStage } from '../Video.Theater.Stage';
import { SpriteThumbnailManager } from './sprite-preview/spriteThumbnailManager';

export class PrimaryPlaybackTimelineController {
  private static instance: PrimaryPlaybackTimelineController;
  private videoStage: VideoTheaterStage;
  private videoElement: HTMLVideoElement | null = null;
  
  // Timeline elements
  private durationCounter: HTMLSpanElement | null = null;
  private seekBarProgress: HTMLInputElement | null = null;
  private currentDurationTotal: HTMLSpanElement | null = null;
  private hoverTimeCounter: HTMLSpanElement | null = null; // NEW: Hover time display
  
  // Sprite thumbnail manager (separated functionality)
  private spriteThumbnailManager: SpriteThumbnailManager;
  
  // State management
  private isDragging: boolean = false;
  private updateInterval: number | null = null;
  private isHovering: boolean = false; // NEW: Track hover state

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    this.spriteThumbnailManager = new SpriteThumbnailManager();
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
    this.createHoverTimeCounter(); // NEW: Create hover time counter
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

  // NEW: Create hover time counter element
  private createHoverTimeCounter(): void {
    this.hoverTimeCounter = document.createElement('span');
    this.hoverTimeCounter.id = 'video-hover-time-counter';
    this.hoverTimeCounter.className = 'hover-time-counter';
    this.hoverTimeCounter.style.cssText = `
      position: absolute;
      display: none;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-size: 12px;
      font-family: monospace;
      border-radius: 4px;
      pointer-events: none;
      z-index: 999;
      white-space: nowrap;
      transform: translateX(-50%);
    `;
    document.body.appendChild(this.hoverTimeCounter);
  }

  private onVideoReady(): void {
    this.videoElement = this.videoStage.getVideoElement();
    if (this.videoElement) {
      console.log('Video element ready for timeline control');
      this.setupVideoEventListeners();
      this.spriteThumbnailManager.initializeSpriteConfig(this.videoElement);
      this.updateTimelineDuration();
    }
  }

  private setupTimelineEventListeners(): void {
    if (!this.seekBarProgress) return;

    // Scrubber interaction events
    this.seekBarProgress.addEventListener('input', this.handleSeekBarInput.bind(this));
    this.seekBarProgress.addEventListener('mousedown', this.handleSeekBarMouseDown.bind(this));
    this.seekBarProgress.addEventListener('mouseup', this.handleSeekBarMouseUp.bind(this));
    this.seekBarProgress.addEventListener('mousemove', this.handleSeekBarMouseMove.bind(this));
    this.seekBarProgress.addEventListener('mouseenter', this.handleSeekBarMouseEnter.bind(this)); // NEW
    this.seekBarProgress.addEventListener('mouseleave', this.handleSeekBarMouseLeave.bind(this));

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
    this.spriteThumbnailManager.showThumbnailAtTime(seekTime);
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
    this.spriteThumbnailManager.hideThumbnail();
    this.hideHoverTimeCounter(); // NEW: Hide hover counter
    
    // Resume playback if it was playing before
    if (this.videoElement.paused) {
      this.videoElement.play().catch(console.error);
    }
  }

  // NEW: Handle mouse enter on seek bar
  private handleSeekBarMouseEnter(): void {
    this.isHovering = true;
  }

  private handleSeekBarMouseMove(event: MouseEvent): void {
    if (!this.seekBarProgress) return;

    const rect = this.seekBarProgress.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const duration = parseFloat(this.seekBarProgress.max);
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    // Show sprite thumbnail
    this.spriteThumbnailManager.showThumbnailAtTime(hoverTime, event.clientX, event.clientY);
    
    // NEW: Show hover time counter
    this.showHoverTimeCounter(hoverTime, event.clientX, rect.top);
  }

  private handleSeekBarMouseLeave(): void {
    this.isHovering = false;
    this.spriteThumbnailManager.hideThumbnail();
    this.hideHoverTimeCounter(); // NEW: Hide hover counter
  }

  private handleSeekBarTouchMove(event: TouchEvent): void {
    if (!this.seekBarProgress || event.touches.length === 0) return;

    const touch = event.touches[0];
    const rect = this.seekBarProgress.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const duration = parseFloat(this.seekBarProgress.max);
    const hoverTime = Math.max(0, Math.min(duration, percent * duration));
    
    this.spriteThumbnailManager.showThumbnailAtTime(hoverTime, touch.clientX, touch.clientY);
    this.showHoverTimeCounter(hoverTime, touch.clientX, rect.top); // NEW
  }

  private handleDocumentMouseUp(): void {
    if (this.isDragging) {
      this.handleSeekBarMouseUp(new MouseEvent('mouseup'));
    }
  }

  // NEW: Show hover time counter at mouse position
  private showHoverTimeCounter(time: number, mouseX: number, seekBarTop: number): void {
    if (!this.hoverTimeCounter) return;

    const formattedTime = this.formatTime(time);
    this.hoverTimeCounter.textContent = formattedTime;
    
    // Position above the seek bar
    this.hoverTimeCounter.style.left = `${mouseX}px`;
    this.hoverTimeCounter.style.top = `${seekBarTop - 30}px`; // 30px above seek bar
    this.hoverTimeCounter.style.display = 'block';
  }

  // NEW: Hide hover time counter
  private hideHoverTimeCounter(): void {
    if (this.hoverTimeCounter) {
      this.hoverTimeCounter.style.display = 'none';
    }
  }

  private updateTimelineDuration(): void {
    if (!this.videoElement || !this.seekBarProgress || !this.currentDurationTotal) return;

    const duration = this.videoElement.duration || 0;
    
    this.seekBarProgress.max = duration.toString();
    this.updateTimeDisplay(this.currentDurationTotal, duration);
    
    // Update sprite thumbnail manager with video duration
    this.spriteThumbnailManager.updateSpriteRows(duration);
    
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

  // Public API for sprite thumbnail management
  public getSpriteThumbnailManager(): SpriteThumbnailManager {
    return this.spriteThumbnailManager;
  }

  public setSpriteConfig(config: Partial<Parameters<SpriteThumbnailManager['setSpriteConfig']>[0]>): void {
    this.spriteThumbnailManager.setSpriteConfig(config);
  }

  public updateSpriteUrl(url: string): void {
    this.spriteThumbnailManager.updateSpriteUrl(url);
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
      this.seekBarProgress.removeEventListener('mouseenter', this.handleSeekBarMouseEnter.bind(this));
      this.seekBarProgress.removeEventListener('mouseleave', this.handleSeekBarMouseLeave.bind(this));
    }

    document.removeEventListener('mouseup', this.handleDocumentMouseUp.bind(this));

    // Remove hover time counter
    if (this.hoverTimeCounter && this.hoverTimeCounter.parentNode) {
      this.hoverTimeCounter.parentNode.removeChild(this.hoverTimeCounter);
    }

    // Reset sprite thumbnail manager
    this.spriteThumbnailManager.reset();

    console.log('Primary playback timeline controller destroyed');
  }
}

// Export singleton instance
export const primaryPlaybackTimelineController = PrimaryPlaybackTimelineController.getInstance();
*/