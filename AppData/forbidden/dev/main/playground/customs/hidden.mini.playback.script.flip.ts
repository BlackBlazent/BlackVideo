/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Settings =>
// Skip Intro/Outro
// Sleep Timer
// Ambient Mode

// Save
// Screencast
// Share


import { VideoTheaterStage } from '../Video.Theater.Stage';

// Flip Video
// Define the flip states
type FlipState = 'default' | 'horizontal' | 'vertical' | 'both';

/**
 * Utility to handle flipping the video element using CSS transforms.
 * It cycles through default, horizontal flip, vertical flip, and both.
 */
export class VideoFlipUtility {
  private static instance: VideoFlipUtility;
  private flipState: FlipState = 'default';
  private videoStage: VideoTheaterStage;

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
  }

  public static getInstance(): VideoFlipUtility {
    if (!VideoFlipUtility.instance) {
      VideoFlipUtility.instance = new VideoFlipUtility();
    }
    return VideoFlipUtility.instance;
  }

  /**
   * Cycles the flip state and applies the corresponding CSS transform.
   */
  public flipVideo(): FlipState {
    let newTransform = '';

    switch (this.flipState) {
      case 'default':
        this.flipState = 'horizontal';
        // Flip horizontally: scaleX(-1)
        newTransform = 'scaleX(-1)';
        break;
      case 'horizontal':
        this.flipState = 'vertical';
        // Flip vertically: scaleY(-1)
        newTransform = 'scaleY(-1)';
        break;
      case 'vertical':
        this.flipState = 'both';
        // Flip both (180 degree rotation): scaleX(-1) scaleY(-1) or rotate(180deg)
        // Using both for explicit flip effect
        newTransform = 'scaleX(-1) scaleY(-1)'; 
        break;
      case 'both':
      default:
        this.flipState = 'default';
        // Reset to default
        newTransform = 'none';
        break;
    }

    // Apply the transform using the reusable VideoTheaterStage method
    this.videoStage.applyVideoStyle({
      transform: newTransform,
      // Add transition for a smoother effect (optional, but recommended)
      transition: 'transform 0.3s ease-in-out', 
    });

    console.log(`Video flipped to state: ${this.flipState} with transform: ${newTransform}`);
    return this.flipState;
  }

  /**
   * Resets the video flip state to default.
   */
  public resetFlip(): void {
    this.flipState = 'default';
    this.videoStage.applyVideoStyle({
      transform: 'none',
      transition: 'transform 0.3s ease-in-out', 
    });
  }

  public getCurrentFlipState(): FlipState {
    return this.flipState;
  }
}

// ... other utility classes can be added here ...