/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Previous	Go to the previous video
// Play / Pause	Start or stop the video
// Next	Go to the next video (in a playlist)
// Reload / Restart	Restart the current video from the beginning
// Repeat	Loop the video or playlist continuously


// primary.playback.ts - Primary playback controls handler

import { VideoTheaterStage } from '../Video.Theater.Stage';

export class PrimaryPlaybackController {
  private static instance: PrimaryPlaybackController;
  private videoStage: VideoTheaterStage;
  private videoElement: HTMLVideoElement | null = null;
  private isLooping: boolean = false;
  private previousTime: number = 0;

  // Control elements
  private previousBtn: HTMLButtonElement | null = null;
  private pausePlayBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private reloadBtn: HTMLButtonElement | null = null;
  private loopBtn: HTMLButtonElement | null = null;

  // Icons for state management
  private pausePlayIcon: HTMLImageElement | null = null;
  private loopIcon: HTMLImageElement | null = null;

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    this.initializeController();
  }

  public static getInstance(): PrimaryPlaybackController {
    if (!PrimaryPlaybackController.instance) {
      PrimaryPlaybackController.instance = new PrimaryPlaybackController();
    }
    return PrimaryPlaybackController.instance;
  }

  private initializeController(): void {
    // Subscribe to video events from the stage
    this.videoStage.subscribe('loadedmetadata', this.onVideoReady.bind(this));
    this.videoStage.subscribe('canplay', this.onVideoReady.bind(this));
    
    // Initialize controls when DOM is ready
    this.initializeControls();
  }

  private initializeControls(): void {
    const maxAttempts = 15;
    let attempts = 0;

    const findControlElements = () => {
      // Get control buttons
      this.previousBtn = document.getElementById('previous-control') as HTMLButtonElement;
      this.pausePlayBtn = document.getElementById('pause-play-control') as HTMLButtonElement;
      this.nextBtn = document.getElementById('next-control') as HTMLButtonElement;
      this.reloadBtn = document.getElementById('reload-control') as HTMLButtonElement;
      this.loopBtn = document.getElementById('loop-control') as HTMLButtonElement;

      // Get control icons
      this.pausePlayIcon = document.getElementById('pause-play-icon') as HTMLImageElement;
      this.loopIcon = document.getElementById('loop-icon') as HTMLImageElement;

      if (this.previousBtn && this.pausePlayBtn && this.nextBtn && this.reloadBtn && this.loopBtn) {
        console.log('Playback control elements found successfully');
        this.setupEventListeners();
        this.updateControlStates();
        return true;
      }

      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(findControlElements, 200);
        console.log(`Attempt ${attempts} to find playback control elements...`);
      } else {
        console.warn('Playback control elements not found after maximum attempts');
      }
      return false;
    };

    const init = () => {
      findControlElements();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  private onVideoReady(): void {
    this.videoElement = this.videoStage.getVideoElement();
    if (this.videoElement) {
      console.log('Video element ready for playback control');
      this.setupVideoEventListeners();
      this.updateControlStates();
    }
  }

  private setupEventListeners(): void {
    // Previous button
    this.previousBtn?.addEventListener('click', this.handlePrevious.bind(this));
    
    // Pause/Play button
    this.pausePlayBtn?.addEventListener('click', this.handlePausePlay.bind(this));
    
    // Next button
    this.nextBtn?.addEventListener('click', this.handleNext.bind(this));
    
    // Reload button
    this.reloadBtn?.addEventListener('click', this.handleReload.bind(this));
    
    // Loop button
    this.loopBtn?.addEventListener('click', this.handleLoop.bind(this));
  }

  private setupVideoEventListeners(): void {
    if (!this.videoElement) return;

    // Listen for play/pause events to update button states
    this.videoElement.addEventListener('play', this.updatePlayPauseIcon.bind(this));
    this.videoElement.addEventListener('pause', this.updatePlayPauseIcon.bind(this));
    this.videoElement.addEventListener('ended', this.handleVideoEnded.bind(this));
    
    // Listen for time updates to handle seeking
    this.videoElement.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
  }

  private handlePrevious(): void {
    if (!this.videoElement) return;

    if (this.videoElement.currentTime > 3) {
      // If more than 3 seconds into video, restart from beginning
      this.videoElement.currentTime = 0;
    } else {
      // Otherwise, seek backward by 10 seconds
      this.videoElement.currentTime = Math.max(0, this.videoElement.currentTime - 10);
    }

    console.log('Previous action triggered');
  }

  private handlePausePlay(): void {
    if (!this.videoElement) return;

    if (this.videoElement.paused) {
      this.videoElement.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      this.videoElement.pause();
    }
  }

  private handleNext(): void {
    if (!this.videoElement) return;

    // Skip forward by 10 seconds or to end if near end
    const newTime = Math.min(
      this.videoElement.duration || 0,
      this.videoElement.currentTime + 10
    );
    this.videoElement.currentTime = newTime;

    console.log('Next action triggered');
  }

  private handleReload(): void {
    if (!this.videoElement) return;

    this.videoElement.currentTime = 0;
    this.videoElement.load(); // Reload the video
    
    // Reset any applied transformations
    this.videoStage.resetVideoTransform();
    
    console.log('Video reloaded');
  }

  private handleLoop(): void {
    this.isLooping = !this.isLooping;
    
    if (this.videoElement) {
      this.videoElement.loop = this.isLooping;
    }
    
    this.updateLoopIcon();
    console.log(`Loop ${this.isLooping ? 'enabled' : 'disabled'}`);
  }

  private handleVideoEnded(): void {
    if (!this.isLooping) {
      this.updatePlayPauseIcon();
    }
  }

  private handleTimeUpdate(): void {
    if (this.videoElement) {
      this.previousTime = this.videoElement.currentTime;
    }
  }

  private updatePlayPauseIcon(): void {
    if (!this.pausePlayIcon || !this.videoElement) return;

    if (this.videoElement.paused) {
      this.pausePlayIcon.src = '/assets/others/play.png';
      this.pausePlayIcon.alt = 'Play';
      this.pausePlayBtn?.setAttribute('aria-label', 'Play');
      this.pausePlayBtn?.setAttribute('title', 'Play');
    } else {
      this.pausePlayIcon.src = '/assets/others/pause.png';
      this.pausePlayIcon.alt = 'Pause';
      this.pausePlayBtn?.setAttribute('aria-label', 'Pause');
      this.pausePlayBtn?.setAttribute('title', 'Pause');
    }
  }

  private updateLoopIcon(): void {
    if (!this.loopIcon) return;

    if (this.isLooping) {
      this.loopIcon.src = '/assets/others/loop.active.png';
      this.loopIcon.alt = 'Loop Active';
      this.loopBtn?.setAttribute('aria-label', 'Disable Loop');
      this.loopBtn?.setAttribute('title', 'Disable Loop');
      this.loopBtn?.classList.add('active');
    } else {
      this.loopIcon.src = '/assets/others/single.loop.png';
      this.loopIcon.alt = 'Loop Video';
      this.loopBtn?.setAttribute('aria-label', 'Enable Loop');
      this.loopBtn?.setAttribute('title', 'Enable Loop');
      this.loopBtn?.classList.remove('active');
    }
  }

  private updateControlStates(): void {
    this.updatePlayPauseIcon();
    this.updateLoopIcon();
  }

  // Public methods for external control
  public play(): void {
    if (this.videoElement && this.videoElement.paused) {
      this.videoElement.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }

  public pause(): void {
    if (this.videoElement && !this.videoElement.paused) {
      this.videoElement.pause();
    }
  }

  public togglePlayPause(): void {
    this.handlePausePlay();
  }

  public seek(time: number): void {
    if (this.videoElement) {
      this.videoElement.currentTime = Math.max(0, Math.min(this.videoElement.duration || 0, time));
    }
  }

  public setLoop(enabled: boolean): void {
    if (this.isLooping !== enabled) {
      this.handleLoop();
    }
  }

  public getCurrentTime(): number {
    return this.videoElement?.currentTime || 0;
  }

  public getDuration(): number {
    return this.videoElement?.duration || 0;
  }

  public isPaused(): boolean {
    return this.videoElement?.paused ?? true;
  }

  public isLoopEnabled(): boolean {
    return this.isLooping;
  }

  // Cleanup method
  public destroy(): void {
    // Remove event listeners
    this.previousBtn?.removeEventListener('click', this.handlePrevious.bind(this));
    this.pausePlayBtn?.removeEventListener('click', this.handlePausePlay.bind(this));
    this.nextBtn?.removeEventListener('click', this.handleNext.bind(this));
    this.reloadBtn?.removeEventListener('click', this.handleReload.bind(this));
    this.loopBtn?.removeEventListener('click', this.handleLoop.bind(this));

    if (this.videoElement) {
      this.videoElement.removeEventListener('play', this.updatePlayPauseIcon.bind(this));
      this.videoElement.removeEventListener('pause', this.updatePlayPauseIcon.bind(this));
      this.videoElement.removeEventListener('ended', this.handleVideoEnded.bind(this));
      this.videoElement.removeEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    }

    console.log('Primary playback controller destroyed');
  }
}

// Export singleton instance
export const primaryPlaybackController = PrimaryPlaybackController.getInstance();