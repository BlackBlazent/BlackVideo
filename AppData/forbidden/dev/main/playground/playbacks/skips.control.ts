/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// skip.controls.ts - Skip controls logic that integrates with Video Theater Stage

import { VideoTheaterStage } from '../Video.Theater.Stage';

export class SkipControls {
  private static instance: SkipControls;
  private videoStage: VideoTheaterStage;
  private isInitialized: boolean = false;

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    this.initialize();
  }

  public static getInstance(): SkipControls {
    if (!SkipControls.instance) {
      SkipControls.instance = new SkipControls();
    }
    return SkipControls.instance;
  }

  private initialize(): void {
    // Subscribe to video events to ensure we're ready
    this.videoStage.subscribe('loadedmetadata', () => {
      this.isInitialized = true;
      console.log('Skip controls initialized with video');
    });

    this.videoStage.subscribe('canplay', () => {
      this.isInitialized = true;
    });

    // Check if video is already loaded
    const videoElement = this.videoStage.getVideoElement();
    if (videoElement && videoElement.readyState >= 1) {
      this.isInitialized = true;
    }
  }

  /**
   * Skip video by specified number of seconds
   * @param seconds - Number of seconds to skip (positive for forward, negative for backward)
   */
  public skipBySeconds(seconds: number): boolean {
    const videoElement = this.videoStage.getVideoElement();
    
    if (!videoElement || !this.isInitialized) {
      console.warn('Video not ready for skip operation');
      return false;
    }

    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;
    
    if (isNaN(duration) || duration === 0) {
      console.warn('Video duration not available');
      return false;
    }

    // Calculate new time
    let newTime = currentTime + seconds;
    
    // Clamp to valid range
    newTime = Math.max(0, Math.min(newTime, duration));
    
    // Log the skip operation
    const direction = seconds > 0 ? 'forward' : 'backward';
    const skipAmount = Math.abs(seconds);
    console.log(`Skipping ${direction} by ${skipAmount}s: ${this.formatTime(currentTime)} → ${this.formatTime(newTime)}`);
    
    // Apply the skip
    videoElement.currentTime = newTime;
    
    // Notify observers about the time change
    this.videoStage.notifyObservers('timeupdate');
    
    return true;
  }

  /**
   * Skip to a specific timestamp
   * @param timestamp - Target timestamp in seconds
   */
  public skipToTimestamp(timestamp: number): boolean {
    const videoElement = this.videoStage.getVideoElement();
    
    if (!videoElement || !this.isInitialized) {
      console.warn('Video not ready for skip operation');
      return false;
    }

    const duration = videoElement.duration;
    
    if (isNaN(duration) || duration === 0) {
      console.warn('Video duration not available');
      return false;
    }

    // Clamp to valid range
    const clampedTime = Math.max(0, Math.min(timestamp, duration));
    
    console.log(`Skipping to timestamp: ${this.formatTime(clampedTime)}`);
    
    videoElement.currentTime = clampedTime;
    this.videoStage.notifyObservers('timeupdate');
    
    return true;
  }

  /**
   * Get current video time information
   */
  public getTimeInfo(): { current: number; duration: number; formatted: { current: string; duration: string } } {
    const videoElement = this.videoStage.getVideoElement();
    
    if (!videoElement) {
      return {
        current: 0,
        duration: 0,
        formatted: { current: '0:00', duration: '0:00' }
      };
    }

    const current = videoElement.currentTime || 0;
    const duration = videoElement.duration || 0;

    return {
      current,
      duration,
      formatted: {
        current: this.formatTime(current),
        duration: this.formatTime(duration)
      }
    };
  }

  /**
   * Check if video is ready for skip operations
   */
  public isReady(): boolean {
    const videoElement = this.videoStage.getVideoElement();
    return !!(videoElement && this.isInitialized && videoElement.readyState >= 1);
  }

  /**
   * Get available skip presets
   */
  public getSkipPresets(): Array<{ label: string; seconds: number; description: string }> {
    return [
      { label: 'Quick Back', seconds: -5, description: 'Skip back 5 seconds' },
      { label: 'Quick Forward', seconds: 5, description: 'Skip forward 5 seconds' },
      { label: 'Medium Back', seconds: -10, description: 'Skip back 10 seconds' },
      { label: 'Medium Forward', seconds: 10, description: 'Skip forward 10 seconds' },
      { label: 'Long Back', seconds: -15, description: 'Skip back 15 seconds' },
      { label: 'Long Forward', seconds: 15, description: 'Skip forward 15 seconds' },
      { label: 'Extended Back', seconds: -30, description: 'Skip back 30 seconds' },
      { label: 'Extended Forward', seconds: 30, description: 'Skip forward 30 seconds' },
      { label: 'Ultra Back', seconds: -60, description: 'Skip back 1 minute' },
      { label: 'Ultra Forward', seconds: 60, description: 'Skip forward 1 minute' }
    ];
  }

  /**
   * Format seconds to MM:SS or HH:MM:SS format
   */
  private formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  }

  /**
   * Parse time string (MM:SS or HH:MM:SS) to seconds
   */
  public parseTimeString(timeStr: string): number {
    const parts = timeStr.split(':').map(part => parseInt(part, 10));
    
    if (parts.length === 2) {
      // MM:SS format
      const [minutes, seconds] = parts;
      return (minutes * 60) + seconds;
    } else if (parts.length === 3) {
      // HH:MM:SS format
      const [hours, minutes, seconds] = parts;
      return (hours * 3600) + (minutes * 60) + seconds;
    }
    
    return 0;
  }

  /**
   * Skip by percentage of total duration
   * @param percentage - Percentage to skip (0-100)
   */
  public skipByPercentage(percentage: number): boolean {
    const videoElement = this.videoStage.getVideoElement();
    
    if (!videoElement || !this.isInitialized) {
      console.warn('Video not ready for skip operation');
      return false;
    }

    const duration = videoElement.duration;
    
    if (isNaN(duration) || duration === 0) {
      console.warn('Video duration not available');
      return false;
    }

    const targetTime = (percentage / 100) * duration;
    return this.skipToTimestamp(targetTime);
  }

  /**
   * Add keyboard shortcuts for common skip operations
   */
  public setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      // Only trigger if no input elements are focused
      if (document.activeElement?.tagName === 'INPUT' || 
          document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (event.shiftKey) {
            this.skipBySeconds(-30); // Shift + Left: Skip back 30s
          } else {
            this.skipBySeconds(-10); // Left: Skip back 10s
          }
          event.preventDefault();
          break;
          
        case 'ArrowRight':
          if (event.shiftKey) {
            this.skipBySeconds(30); // Shift + Right: Skip forward 30s
          } else {
            this.skipBySeconds(10); // Right: Skip forward 10s
          }
          event.preventDefault();
          break;
          
        case 'j':
        case 'J':
          this.skipBySeconds(-10); // J: Skip back 10s (YouTube style)
          event.preventDefault();
          break;
          
        case 'l':
        case 'L':
          this.skipBySeconds(10); // L: Skip forward 10s (YouTube style)
          event.preventDefault();
          break;
      }
    });
  }
}