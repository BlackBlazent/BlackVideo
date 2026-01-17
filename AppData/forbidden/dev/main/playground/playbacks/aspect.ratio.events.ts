// Button Click Events Script - Fixed version without hover conflicts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { AspectRatioController } from './playback.advanced.control.enhancement.aspect-ratio';

export class AspectRatioButtonHandler {
  private static instance: AspectRatioButtonHandler;
  private aspectRatioController: AspectRatioController;
  private isPopupVisible: boolean = false;
  private buttonElement: HTMLElement | null = null;

  private constructor() {
    this.aspectRatioController = AspectRatioController.getInstance();
    this.initialize();
  }

  public static getInstance(): AspectRatioButtonHandler {
    if (!AspectRatioButtonHandler.instance) {
      AspectRatioButtonHandler.instance = new AspectRatioButtonHandler();
    }
    return AspectRatioButtonHandler.instance;
  }

  private initialize(): void {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupButtonEvents());
    } else {
      this.setupButtonEvents();
    }
  }

  private setupButtonEvents(): void {
    this.buttonElement = document.getElementById('aspect-ratio-controller');
    if (!this.buttonElement) return;

    // Toggle on Click only
    this.buttonElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePopup();
    });

    // Global click handler to hide popup
    document.addEventListener('click', (e) => {
      const target = e.target as Node;
      const popup = document.querySelector('.aspect-ratio-engine-card');
      
      if (this.isPopupVisible && 
          this.buttonElement && 
          !this.buttonElement.contains(target) && 
          (!popup || !popup.contains(target))) {
        this.hidePopup();
      }
    });
  }

  private togglePopup(): void {
    this.isPopupVisible ? this.hidePopup() : this.showPopup();
  }

  private showPopup(): void {
    this.isPopupVisible = true;
    const event = new CustomEvent('aspectRatioPopupShow', {
      detail: { visible: true, buttonElement: this.buttonElement }
    });
    document.dispatchEvent(event);
    this.buttonElement?.classList.add('active');
  }

  private hidePopup(): void {
    this.isPopupVisible = false;
    const event = new CustomEvent('aspectRatioPopupHide', { detail: { visible: false } });
    document.dispatchEvent(event);
    this.buttonElement?.classList.remove('active');
  }

  public handleRatioSelection(ratio: string): void {
    this.aspectRatioController.setAspectRatio(ratio);
    window.dispatchEvent(new Event('resize'));
    this.hidePopup();
  }

  public cleanup(): void {}
}