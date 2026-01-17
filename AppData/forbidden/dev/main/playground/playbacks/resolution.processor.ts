/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// resolution.processor.ts
import { VideoTheaterStage } from '../Video.Theater.Stage';

interface ResolutionDimension {
  width: number;
  height: number;
}

const resolutionDimensions: { [key: string]: ResolutionDimension } = {
  '144p': { width: 256, height: 144 },
  '240p': { width: 426, height: 240 },
  '360p': { width: 640, height: 360 },
  '480p': { width: 854, height: 480 },
  '540p': { width: 960, height: 540 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '1440p': { width: 2560, height: 1440 },
  '2160p': { width: 3840, height: 2160 },
  '4320p': { width: 7680, height: 4320 }
};

export class ResolutionProcessor {
  private static instance: ResolutionProcessor;
  private videoStage: VideoTheaterStage;
  private currentResolution: string = '1080p'; // Default resolution

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    this.setupResolutionHandler();
  }

  public static getInstance(): ResolutionProcessor {
    if (!ResolutionProcessor.instance) {
      ResolutionProcessor.instance = new ResolutionProcessor();
    }
    return ResolutionProcessor.instance;
  }

  private setupResolutionHandler(): void {
    // Subscribe to video events that might require resolution adjustment
    this.videoStage.subscribe('loadedmetadata', () => this.applyCurrentResolution());
    this.videoStage.subscribe('resize', () => this.applyCurrentResolution());
  }

  private calculateAspectRatioFit(resolution: ResolutionDimension): { width: number; height: number } {
    const containerDimensions = this.videoStage.getContainerDimensions();
    const containerAspectRatio = containerDimensions.width / containerDimensions.height;
    const videoAspectRatio = resolution.width / resolution.height;
    
    let width = containerDimensions.width;
    let height = containerDimensions.height;

    if (containerAspectRatio > videoAspectRatio) {
      // Container is wider than video aspect ratio
      width = height * videoAspectRatio;
    } else {
      // Container is taller than video aspect ratio
      height = width / videoAspectRatio;
    }

    return { width, height };
  }
  private applyCurrentResolution(): void {
    const videoElement = this.videoStage.getVideoElement();
    if (!videoElement) return;

    const targetResolution = resolutionDimensions[this.currentResolution];
    if (!targetResolution) return;

    // Calculate dimensions that maintain aspect ratio within container
    const fitDimensions = this.calculateAspectRatioFit(targetResolution);
    
    // Apply styles directly to the video element
    const styles = {
      width: `${fitDimensions.width}px`,
      height: `${fitDimensions.height}px`,
      objectFit: 'contain',
      maxWidth: '100%',
      maxHeight: '100%'
    };

    Object.entries(styles).forEach(([key, value]) => {
      videoElement.style.setProperty(key, value, 'important');
    });

    console.log(`Applied resolution scaling: ${this.currentResolution} (${fitDimensions.width}x${fitDimensions.height})`);
    
    // Force a reflow to ensure styles are applied
    videoElement.style.removeProperty('display');
    void videoElement.offsetHeight;
    videoElement.style.display = 'block';
  }

  public setResolution(resolution: string): void {
    if (resolutionDimensions[resolution]) {
      this.currentResolution = resolution;
      this.applyCurrentResolution();
    } else {
      console.warn(`Unsupported resolution: ${resolution}`);
    }
  }

  public getCurrentResolution(): string {
    return this.currentResolution;
  }

  public resetResolution(): void {
    this.videoStage.resetVideoTransform();
    this.currentResolution = '1080p';
  }
}