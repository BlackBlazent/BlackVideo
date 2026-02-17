// fullscreen.ts - Fixed Fullscreen Management Script
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export class InAppFullscreenManager {
  public isInAppFullscreen: boolean = false;
  private targetElement: HTMLElement | null = null;

  constructor(targetElement: HTMLElement | null = null) {
    this.targetElement = targetElement;
  }

  public enterInAppFullscreen(): void {
    if (this.isInAppFullscreen) return;

    const target = this.targetElement || document.documentElement;
    target.classList.add('in-app-fullscreen');
    this.isInAppFullscreen = true;

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('inAppFullscreenChange', { 
      detail: { isFullscreen: true } 
    }));
  }

  public exitInAppFullscreen(): void {
    if (!this.isInAppFullscreen) return;

    const target = this.targetElement || document.documentElement;
    target.classList.remove('in-app-fullscreen');
    this.isInAppFullscreen = false;

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('inAppFullscreenChange', { 
      detail: { isFullscreen: false } 
    }));
  }

  public toggleInAppFullscreen(): void {
    this.isInAppFullscreen ? this.exitInAppFullscreen() : this.enterInAppFullscreen();
  }

  public setTargetElement(element: HTMLElement | null): void {
    this.targetElement = element;
  }
}