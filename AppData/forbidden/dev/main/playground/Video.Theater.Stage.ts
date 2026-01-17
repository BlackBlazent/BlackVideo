/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Video.Theater.Stage.ts - Global script that targets the video stage main video player

export class VideoTheaterStage {
  private static instance: VideoTheaterStage;
  private videoElement: HTMLVideoElement | null = null;
  private containerElement: HTMLElement | null = null;
  private observers: Map<string, Function[]> = new Map();

  private constructor() {
    this.initializeStage();
  }

  public static getInstance(): VideoTheaterStage {
    if (!VideoTheaterStage.instance) {
      VideoTheaterStage.instance = new VideoTheaterStage();
    }
    return VideoTheaterStage.instance;
  }
  private initializeStage(): void {
    const maxAttempts = 20; // Increased max attempts
    let attempts = 0;

    const findElements = () => {
      const video = document.getElementById('VideoPlayer-TheaterStage');
      const container = document.getElementById('videoContainer');

      if (video instanceof HTMLVideoElement && container) {
        this.videoElement = video;
        this.containerElement = container;
        console.log('Video theater stage elements found successfully');
        this.setupVideoEventListeners();
        return true;
      } 
      
      if (attempts < maxAttempts) {
        attempts++;
        setTimeout(findElements, 200); // Increased delay
        console.log(`Attempt ${attempts} to find video elements...`);
      } else {
        console.warn('Video theater stage elements not found after maximum attempts');
      }
      return false;
    };

    const init = () => {
      // Reset elements to ensure clean state
      this.videoElement = null;
      this.containerElement = null;
      findElements();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  private setupVideoEventListeners(): void {
    if (!this.videoElement) return;

    const events = ['loadedmetadata', 'resize', 'loadstart', 'canplay'];
    
    events.forEach(event => {
      this.videoElement?.addEventListener(event, () => {
        this.notifyObservers(event);
      });
    });
  }

  // Observer pattern for extensions
  public subscribe(event: string, callback: Function): void {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event)?.push(callback);
  }

  public unsubscribe(event: string, callback: Function): void {
    const callbacks = this.observers.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  public notifyObservers(event: string): void {
    const callbacks = this.observers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(this.videoElement, this.containerElement));
    }
  }

  // Public methods for video manipulation
  public getVideoElement(): HTMLVideoElement | null {
    return this.videoElement;
  }

  public getContainerElement(): HTMLElement | null {
    return this.containerElement;
  }

  public applyVideoStyle(styles: Partial<CSSStyleDeclaration>): void {
    if (!this.videoElement) return;

    // Apply styles and force a reflow
    Object.keys(styles).forEach(key => {
      if (this.videoElement && key in this.videoElement.style) {
        (this.videoElement.style as any)[key] = (styles as any)[key];
      }
    });

    // Force a reflow to ensure styles are applied
    void this.videoElement.offsetHeight;
    
    // Notify observers about the style change
    this.notifyObservers('resize');
  }

  public getVideoAspectRatio(): number {
    if (!this.videoElement) return 16/9; // default
    
    const width = this.videoElement.videoWidth || this.videoElement.clientWidth;
    const height = this.videoElement.videoHeight || this.videoElement.clientHeight;
    
    return width / height;
  }

  public getContainerDimensions(): { width: number; height: number } {
    if (!this.containerElement) return { width: 0, height: 0 };
    
    const rect = this.containerElement.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  }

  // Reset video to original state
  public resetVideoTransform(): void {
    if (!this.videoElement) return;

    this.videoElement.style.width = '';
    this.videoElement.style.height = '';
    this.videoElement.style.objectFit = '';
    this.videoElement.style.transform = '';
  }
}