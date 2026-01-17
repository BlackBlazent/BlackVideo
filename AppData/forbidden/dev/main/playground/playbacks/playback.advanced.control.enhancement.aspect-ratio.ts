// playback.advanced.control.enhancement.aspect-ratio.ts - Scripting to work with aspect ratio
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

export class AspectRatioController {
  private static instance: AspectRatioController;
  private theaterStage: VideoTheaterStage;
  private currentRatio: string = 'auto';
  private originalVideoRatio: number = 16/9;

  private constructor() {
    this.theaterStage = VideoTheaterStage.getInstance();
    this.initialize();
  }

  public static getInstance(): AspectRatioController {
    if (!AspectRatioController.instance) {
      AspectRatioController.instance = new AspectRatioController();
    }
    return AspectRatioController.instance;
  }

  private initialize(): void {
    // Subscribe to video metadata loaded event to get original aspect ratio
    this.theaterStage.subscribe('loadedmetadata', () => {
      this.captureOriginalRatio();
    });

    // Subscribe to resize events to maintain aspect ratio
    this.theaterStage.subscribe('resize', () => {
      if (this.currentRatio !== 'auto') {
        this.applyAspectRatio(this.currentRatio);
      }
    });
  }

  private captureOriginalRatio(): void {
    this.originalVideoRatio = this.theaterStage.getVideoAspectRatio();
  }

  public setAspectRatio(ratio: string): void {
    this.currentRatio = ratio;
    this.applyAspectRatio(ratio);
  }

  private applyAspectRatio(ratio: string): void {
    const videoElement = this.theaterStage.getVideoElement();
    const containerElement = this.theaterStage.getContainerElement();

    if (!videoElement || !containerElement) {
      console.warn('Video or container element not found');
      return;
    }

    // Reset any previous transforms
    this.theaterStage.resetVideoTransform();

    if (ratio === 'auto') {
      this.applyAutoRatio();
      return;
    }

    const targetRatio = this.getRatioValue(ratio);
    if (targetRatio) {
      this.applyCustomRatio(targetRatio);
    }
  }

  private applyAutoRatio(): void {
    const videoElement = this.theaterStage.getVideoElement();
    if (!videoElement) return;

    const containerDimensions = this.theaterStage.getContainerDimensions();
    if (!containerDimensions.width) return;

    // Use the original video ratio for auto mode
    const containerWidth = containerDimensions.width;
    const maxHeight = 400;

    let newWidth = containerWidth;
    let newHeight = containerWidth / this.originalVideoRatio;

    // Ensure we don't exceed max height
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * this.originalVideoRatio;
    }

    videoElement.style.width = `${newWidth}px`;
    videoElement.style.height = `${newHeight}px`;
    videoElement.style.maxHeight = `${maxHeight}px`;
    videoElement.style.objectFit = 'contain';

    // Center video if needed
    if (newWidth < containerWidth) {
      videoElement.style.marginLeft = 'auto';
      videoElement.style.marginRight = 'auto';
      videoElement.style.display = 'block';
    }
  }

  private applyCustomRatio(targetRatio: number): void {
    const videoElement = this.theaterStage.getVideoElement();
    const containerDimensions = this.theaterStage.getContainerDimensions();

    if (!videoElement || !containerDimensions.width) return;

    const containerWidth = containerDimensions.width;
    const maxHeight = 400; // Container max-height constraint

    // Calculate dimensions based on target aspect ratio
    let newWidth = containerWidth;
    let newHeight = containerWidth / targetRatio;

    // Ensure we don't exceed max height
    if (newHeight > maxHeight) {
      newHeight = maxHeight;
      newWidth = maxHeight * targetRatio;
    }

    // Apply the calculated dimensions
    videoElement.style.width = `${newWidth}px`;
    videoElement.style.height = `${newHeight}px`;
    videoElement.style.maxHeight = `${maxHeight}px`;
    videoElement.style.objectFit = 'fill';

    // Center the video if it's smaller than container width
    if (newWidth < containerWidth) {
      videoElement.style.marginLeft = 'auto';
      videoElement.style.marginRight = 'auto';
      videoElement.style.display = 'block';
    } else {
      videoElement.style.marginLeft = '';
      videoElement.style.marginRight = '';
      videoElement.style.display = '';
    }
  }

  private getRatioValue(ratio: string): number | null {
    const ratioMap: { [key: string]: number } = {
      '1:1': 1,
      '4:3': 4/3,
      '16:9': 16/9,
      '21:9': 21/9,
      '9:16': 9/16,
      '2.35:1': 2.35,
      '2.76:1': 2.76
    };

    return ratioMap[ratio] || null;
  }

  public getCurrentRatio(): string {
    return this.currentRatio;
  }

  public reset(): void {
    this.currentRatio = 'auto';
    this.theaterStage.resetVideoTransform();
    this.applyAutoRatio();
  }

  // Utility method to get all available ratios
  public getAvailableRatios(): Array<{label: string, value: string}> {
    return [
      { label: 'Auto', value: 'auto' },
      { label: '1:1 (Square aspect ratio)', value: '1:1' },
      { label: '4:3 (Standard aspect ratio)', value: '4:3' },
      { label: '16:9 (Widescreen aspect ratio)', value: '16:9' },
      { label: '21:9 (Ultra-widescreen aspect ratio)', value: '21:9' },
      { label: '9:16 (Vertical aspect ratio)', value: '9:16' },
      { label: '2.35:1 (Cinemascope aspect ratio)', value: '2.35:1' },
      { label: '2.76:1 (Scope aspect ratio)', value: '2.76:1' }
    ];
  }
}