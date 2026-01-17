// pip.control.ts - Fixed Picture in Picture Controller
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { VideoTheaterStage } from '../Video.Theater.Stage';

export class PictureInPictureController {
  private static instance: PictureInPictureController;
  private theaterStage: VideoTheaterStage;
  private pipButton: HTMLButtonElement | null = null;
  private boundHandlePipClick: (e: MouseEvent) => Promise<void>;

  private constructor() {
    this.theaterStage = VideoTheaterStage.getInstance();
    this.boundHandlePipClick = this.handlePipClick.bind(this);
    this.initialize();
  }

  public static getInstance(): PictureInPictureController {
    if (!PictureInPictureController.instance) {
      PictureInPictureController.instance = new PictureInPictureController();
    }
    return PictureInPictureController.instance;
  }

  private initialize(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.waitForElements());
    } else {
      this.waitForElements();
    }
  }
  private waitForElements(): void {
    const maxAttempts = 20;
    let attempts = 0;

    const checkElements = () => {
      this.pipButton = document.getElementById('pip-controller') as HTMLButtonElement;
      const video = this.theaterStage.getVideoElement();

      if (this.pipButton && video) {
        this.setupPiPEvents();
        return true;
      } 
      
      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkElements, 200); // Increased delay
        console.log(`Attempt ${attempts} to find PiP elements...`);
      } else {
        console.warn('PiP elements not found after maximum attempts');
      }
      return false;
    };

    checkElements();
  }

  private setupPiPEvents(): void {
    const video = this.theaterStage.getVideoElement();

    if (!this.pipButton || !video) {
      console.warn("PiP setup failed - missing elements");
      return;
    }

    // Add event listener
    this.pipButton.addEventListener('click', this.boundHandlePipClick);

    // Listen for PiP events to update button state
    video.addEventListener('enterpictureinpicture', () => {
      this.updateButtonState(true);
    });

    video.addEventListener('leavepictureinpicture', () => {
      this.updateButtonState(false);
    });

    // Update initial button state
    this.updateButtonState(false);
    console.log("PiP controller initialized successfully with video and button");
  }

  private async handlePipClick(e: MouseEvent): Promise<void> {
    e.preventDefault();
    e.stopPropagation();
    await this.togglePiP();
  }

  private async togglePiP(): Promise<void> {
    const video = this.theaterStage.getVideoElement();
    
    if (!video) {
      console.warn("Video element not found");
      return;
    }

    // Check if PiP is supported
    if (!('pictureInPictureEnabled' in document) || !document.pictureInPictureEnabled) {
      console.warn("Picture-in-Picture is not supported in this browser");
      return;
    }

    try {
      if (document.pictureInPictureElement) {
        // Exit PiP
        await document.exitPictureInPicture();
      } else {
        // Enter PiP
        if (video.readyState >= 1) { // HAVE_METADATA or higher
          await video.requestPictureInPicture();
        } else {
          console.warn("Video not ready for Picture-in-Picture");
          // Try to load the video first
          if (video.paused) {
            await video.play();
            await video.requestPictureInPicture();
          }
        }
      }
    } catch (error) {
      console.error("Failed to toggle Picture-in-Picture:", error);
      
      // Handle common errors
      if (error instanceof Error) {
        if (error.name === 'InvalidStateError') {
          console.warn("Video is not ready for PiP. Try playing the video first.");
        } else if (error.name === 'NotSupportedError') {
          console.warn("Picture-in-Picture is not supported for this video.");
        }
      }
    }
  }

  private updateButtonState(isActive: boolean): void {
    if (!this.pipButton) return;

    if (isActive) {
      this.pipButton.classList.add('active');
      this.pipButton.setAttribute('aria-pressed', 'true');
      this.pipButton.title = 'Exit Picture in Picture';
    } else {
      this.pipButton.classList.remove('active');
      this.pipButton.setAttribute('aria-pressed', 'false');
      this.pipButton.title = 'Picture in Picture';
    }
  }

  // Check if PiP is currently active
  public isPiPActive(): boolean {
    return !!document.pictureInPictureElement;
  }

  // Public method to programmatically toggle PiP
  public async toggle(): Promise<void> {
    await this.togglePiP();
  }

  public cleanup(): void {
    if (this.pipButton) {
      this.pipButton.removeEventListener('click', this.boundHandlePipClick);
    }
  }
}

// Add this to console in your component to debug
console.log('PiP supported:', 'pictureInPictureEnabled' in document);
console.log('Video element:', VideoTheaterStage.getInstance().getVideoElement());
console.log('PiP button:', document.getElementById('pip-controller'));