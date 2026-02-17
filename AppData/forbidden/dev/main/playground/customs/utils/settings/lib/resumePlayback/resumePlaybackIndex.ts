/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { ResumePlaybackInvoker, VideoProgress } from './resumePlaybackInvoke';

/**
 * Resume Playback Index - Manages video resume functionality
 * Integrates with playback timeline controller to save and restore video progress
 */
export class ResumePlaybackIndex {
  private static instance: ResumePlaybackIndex;
  private isEnabled: boolean = true;
  private currentVideoPath: string | null = null;
  private saveInterval: number | null = null;
  private saveIntervalTime: number = 5000; // Save every 5 seconds
  private minProgressToSave: number = 5; // Minimum 5 seconds watched before saving
  private maxProgressToResume: number = 95; // Don't resume if video is > 95% complete

  private constructor() {
    this.loadResumeEnabledState();
  }

  public static getInstance(): ResumePlaybackIndex {
    if (!ResumePlaybackIndex.instance) {
      ResumePlaybackIndex.instance = new ResumePlaybackIndex();
    }
    return ResumePlaybackIndex.instance;
  }

  /**
   * Load resume enabled state from localStorage
   */
  private loadResumeEnabledState(): void {
    try {
      const saved = localStorage.getItem('resumePlaybackEnabled');
      this.isEnabled = saved !== null ? JSON.parse(saved) : true;
      console.log('Resume playback enabled:', this.isEnabled);
    } catch (error) {
      console.error('Failed to load resume enabled state:', error);
      this.isEnabled = true;
    }
  }

  /**
   * Set resume playback enabled/disabled
   * @param enabled - Whether resume playback is enabled
   */
  public setResumeEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('resumePlaybackEnabled', JSON.stringify(enabled));
    console.log('Resume playback set to:', enabled);

    // Stop saving if disabled
    if (!enabled) {
      this.stopAutoSave();
    }
  }

  /**
   * Get resume playback enabled state
   */
  public isResumePlaybackEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Initialize resume playback for a video
   * @param videoPath - Absolute path to the video file
   * @param videoElement - HTML video element
   * @param duration - Video duration in seconds
   */
  public async initializeVideoResume(
    videoPath: string,
    videoElement: HTMLVideoElement,
    duration: number
  ): Promise<void> {
    if (!this.isEnabled) {
      console.log('Resume playback is disabled');
      return;
    }

    this.currentVideoPath = videoPath;

    try {
      // Get saved progress
      const progress = await ResumePlaybackInvoker.getVideoProgress(videoPath);

      if (progress && this.shouldResumeFromProgress(progress, duration)) {
        // Set video to saved time
        videoElement.currentTime = progress.current_time;
        console.log(`📼 Resuming playback at ${this.formatTime(progress.current_time)} (${progress.progress_percentage.toFixed(1)}%)`);
        
        // Show user notification (optional - you can implement UI notification)
        this.showResumeNotification(progress);
      } else {
        console.log('No valid resume point found, starting from beginning');
      }

      // Start auto-save interval
      this.startAutoSave(videoPath, videoElement, duration);
    } catch (error) {
      console.error('Failed to initialize video resume:', error);
    }
  }

  /**
   * Check if video should resume from saved progress
   */
  private shouldResumeFromProgress(progress: VideoProgress, currentDuration: number): boolean {
    // Don't resume if current time is too early (< 5 seconds)
    if (progress.current_time < this.minProgressToSave) {
      return false;
    }

    // Don't resume if video is almost complete (> 95%)
    if (progress.progress_percentage > this.maxProgressToResume) {
      return false;
    }

    // Don't resume if duration changed significantly (different video with same path)
    if (Math.abs(progress.duration - currentDuration) > 5) {
      return false;
    }

    return true;
  }

  /**
   * Start auto-saving video progress
   */
  private startAutoSave(videoPath: string, videoElement: HTMLVideoElement, duration: number): void {
    // Clear any existing interval
    this.stopAutoSave();

    // Save progress periodically
    this.saveInterval = window.setInterval(() => {
      if (this.isEnabled && !videoElement.paused && !videoElement.ended) {
        this.saveProgress(videoPath, videoElement.currentTime, duration);
      }
    }, this.saveIntervalTime);

    // Also save on pause and seek
    videoElement.addEventListener('pause', () => this.handlePause(videoPath, videoElement, duration));
    videoElement.addEventListener('seeked', () => this.handleSeek(videoPath, videoElement, duration));
    videoElement.addEventListener('ended', () => this.handleEnded(videoPath));
  }

  /**
   * Stop auto-saving
   */
  private stopAutoSave(): void {
    if (this.saveInterval !== null) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
  }

  /**
   * Handle video pause event
   */
  private handlePause(videoPath: string, videoElement: HTMLVideoElement, duration: number): void {
    if (this.isEnabled) {
      this.saveProgress(videoPath, videoElement.currentTime, duration);
    }
  }

  /**
   * Handle video seek event
   */
  private handleSeek(videoPath: string, videoElement: HTMLVideoElement, duration: number): void {
    if (this.isEnabled) {
      this.saveProgress(videoPath, videoElement.currentTime, duration);
    }
  }

  /**
   * Handle video ended event
   */
  private async handleEnded(videoPath: string): Promise<void> {
    if (this.isEnabled) {
      // Clear progress when video completes
      try {
        await ResumePlaybackInvoker.clearVideoProgress(videoPath);
        console.log('Video completed, progress cleared');
      } catch (error) {
        console.error('Failed to clear progress on video end:', error);
      }
    }
  }

  /**
   * Save video progress
   */
  private async saveProgress(videoPath: string, currentTime: number, duration: number): Promise<void> {
    // Only save if video has been watched for at least minProgressToSave seconds
    if (currentTime < this.minProgressToSave) {
      return;
    }

    try {
      await ResumePlaybackInvoker.saveVideoProgress(videoPath, currentTime, duration);
    } catch (error) {
      console.error('Failed to save video progress:', error);
    }
  }

  /**
   * Manually save current progress (called from external components)
   */
  public async saveCurrentProgress(videoPath: string, currentTime: number, duration: number): Promise<void> {
    if (!this.isEnabled) return;
    await this.saveProgress(videoPath, currentTime, duration);
  }

  /**
   * Get saved progress for a video
   */
  public async getSavedProgress(videoPath: string): Promise<VideoProgress | null> {
    try {
      return await ResumePlaybackInvoker.getVideoProgress(videoPath);
    } catch (error) {
      console.error('Failed to get saved progress:', error);
      return null;
    }
  }

  /**
   * Clear progress for current video
   */
  public async clearCurrentProgress(): Promise<void> {
    if (this.currentVideoPath) {
      try {
        await ResumePlaybackInvoker.clearVideoProgress(this.currentVideoPath);
        console.log('Current video progress cleared');
      } catch (error) {
        console.error('Failed to clear current progress:', error);
      }
    }
  }

  /**
   * Get all saved video progress
   */
  public async getAllProgress(): Promise<VideoProgress[]> {
    try {
      return await ResumePlaybackInvoker.getAllVideoProgress();
    } catch (error) {
      console.error('Failed to get all progress:', error);
      return [];
    }
  }

  /**
   * Show resume notification to user (implement your own UI)
   */
  private showResumeNotification(progress: VideoProgress): void {
    // You can implement a toast notification or UI element here
    // For now, just console log
    console.log(`💡 Resume available: ${this.formatTime(progress.current_time)} / ${this.formatTime(progress.duration)}`);
  }

  /**
   * Format time in HH:MM:SS
   */
  private formatTime(seconds: number): string {
    if (!isFinite(seconds)) return '00:00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Cleanup and destroy instance
   */
  public destroy(): void {
    this.stopAutoSave();
    this.currentVideoPath = null;
    console.log('Resume playback index destroyed');
  }
}

// Export singleton instance
export const resumePlaybackIndex = ResumePlaybackIndex.getInstance();
