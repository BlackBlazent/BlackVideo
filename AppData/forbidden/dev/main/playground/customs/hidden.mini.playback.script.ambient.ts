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

// Key for local storage persistence
const AMBIENT_MODE_STORAGE_KEY = 'ambientModeActive';

/**
 * Utility to manage the state and visual effects of Ambient Mode.
 */
export class AmbientModeUtility {
  private static instance: AmbientModeUtility;
  private isActive: boolean;
  private videoStage: VideoTheaterStage;
  private colorUpdateInterval: number | null = null;

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    // Initialize state from local storage or default to false
    this.isActive = localStorage.getItem(AMBIENT_MODE_STORAGE_KEY) === 'true';
    // When instantiated, ensure the initial state is applied
    this.applyState(this.isActive);
  }

  public static getInstance(): AmbientModeUtility {
    if (!AmbientModeUtility.instance) {
      AmbientModeUtility.instance = new AmbientModeUtility();
    }
    return AmbientModeUtility.instance;
  }

  /**
   * Toggles Ambient Mode on or off.
   */
  public toggleAmbientMode(): boolean {
    this.isActive = !this.isActive;
    this.applyState(this.isActive);
    
    // Persist state
    localStorage.setItem(AMBIENT_MODE_STORAGE_KEY, this.isActive.toString());

    return this.isActive;
  }

  /**
   * Applies or removes the Ambient Mode visual effects and color updates.
   */
  private applyState(active: boolean): void {
    const container = this.videoStage.getContainerElement();
    const video = this.videoStage.getVideoElement();

    if (!container || !video) {
      console.warn("Ambient Mode could not find video elements.");
      return;
    }

    if (active) {
      // 1. Add the main class to the container
      container.classList.add('ambient-active');
      
      // 2. Start the real-time color sampling loop
      this.startColorSampling();

      // 3. Add an active indicator class to the button (if needed for styling)
      const flipButton = document.getElementById('ambient-mode-util')?.parentElement;
      flipButton?.classList.add('active');

    } else {
      // 1. Remove the main class
      container.classList.remove('ambient-active');

      // 2. Stop the color sampling loop and reset colors
      this.stopColorSampling();
      this.resetAmbientColors(container);
      
      // 3. Remove active indicator class from the button
      const flipButton = document.getElementById('ambient-mode-util')?.parentElement;
      flipButton?.classList.remove('active');
    }
  }

  /**
   * Starts the color extraction loop.
   */
  private startColorSampling(): void {
    if (this.colorUpdateInterval) return;

    // Run the sampling every ~16ms (60 frames per second)
    this.colorUpdateInterval = window.setInterval(this.updateAmbientColors.bind(this), 1000 / 60);
    this.videoStage.subscribe('play', this.updateAmbientColors.bind(this));
  }

  /**
   * Stops the color extraction loop.
   */
  private stopColorSampling(): void {
    if (this.colorUpdateInterval !== null) {
      clearInterval(this.colorUpdateInterval);
      this.colorUpdateInterval = null;
    }
    this.videoStage.unsubscribe('play', this.updateAmbientColors.bind(this));
  }

  /**
   * Extracts colors from the video frame and updates the CSS variable.
   */
  private updateAmbientColors(): void {
    const video = this.videoStage.getVideoElement();
    const container = this.videoStage.getContainerElement();

    if (!video || video.paused || !container) return;

    // --- REAL-TIME EDGE COLOR EXTRACTION (Canvas/WebGL Stub) ---
    // NOTE: In a production environment, this function would use a hidden
    // Canvas or WebGL texture to read pixel data from the video element
    // edges (top/bottom/left/right 10-20px) to determine the dominant color.

    try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Simplified: Sample a color from the center-left edge (approximate)
        const sampleSize = 10;
        const x = 5; // Near the left edge
        const y = Math.floor(video.videoHeight / 2);
        
        const imageData = ctx.getImageData(x, y, sampleSize, sampleSize);
        let rTotal = 0, gTotal = 0, bTotal = 0;
        
        for (let i = 0; i < imageData.data.length; i += 4) {
            rTotal += imageData.data[i];
            gTotal += imageData.data[i + 1];
            bTotal += imageData.data[i + 2];
        }
        
        const pixelCount = imageData.data.length / 4;
        const avgR = Math.round(rTotal / pixelCount);
        const avgG = Math.round(gTotal / pixelCount);
        const avgB = Math.round(bTotal / pixelCount);

        const dominantColor = `rgb(${avgR}, ${avgG}, ${avgB})`;
        
        // -----------------------------------------------------------------

        // Set a CSS variable on the container or root
        container.style.setProperty('--ambient-color', dominantColor);

    } catch (e) {
        // This usually fails if the video is cross-origin (CORS)
        // In a real app, you'd handle CORS or fall back to a default color.
        console.error("Ambient color sampling failed (likely CORS issue):", e);
        this.stopColorSampling(); 
        this.resetAmbientColors(container);
    }
  }
  
  /**
   * Resets the ambient color variable.
   */
  private resetAmbientColors(container: HTMLElement): void {
      container.style.removeProperty('--ambient-color');
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}

// ... existing utilities like VideoFlipUtility ...