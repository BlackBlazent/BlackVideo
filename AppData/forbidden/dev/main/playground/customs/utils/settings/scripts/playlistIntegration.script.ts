/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

/**
 * Playlist Integration Script
 * Handles disabling/enabling playlist controls
 */

export class PlaylistIntegration {
  private isDisabled: boolean = false;
  private originalStyles: Map<string, string> = new Map();

  constructor() {
    this.init();
  }

  private init(): void {
    console.log('[Playlist] Integration initialized');
  }

  /**
   * Disable playlist
   * Hides the thumbnails scroll and expands video container
   */
  public disable(): void {
    if (this.isDisabled) return;

    const thumbnailsScroll = document.querySelector('.thumbnails-scroll') as HTMLElement;
    const videoContainer = document.querySelector('.video-container') as HTMLElement;
    const videoTheaterStage = document.querySelector('.video-player-theater-stage') as HTMLElement;

    if (thumbnailsScroll) {
      // Store original display style
      this.originalStyles.set('thumbnailsScroll', thumbnailsScroll.style.display || '');
      
      // Disable thumbnails scroll
      thumbnailsScroll.style.setProperty('display', 'none', 'important');
      
      // Disable all playlist functionalities
      const buttons = thumbnailsScroll.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.setAttribute('disabled', 'true');
        (btn as HTMLElement).style.pointerEvents = 'none';
      });
      
      const thumbnails = thumbnailsScroll.querySelectorAll('.thumbnail');
      thumbnails.forEach(thumb => {
        (thumb as HTMLElement).style.pointerEvents = 'none';
        thumb.setAttribute('data-disabled', 'true');
      });
    }

    // Expand video container
    if (videoContainer) {
      this.originalStyles.set('videoContainerHeight', videoContainer.style.maxHeight || '');
      videoContainer.style.setProperty('max-height', '800px', 'important');
    }

    // Expand video theater stage
    if (videoTheaterStage) {
      this.originalStyles.set('videoStageHeight', videoTheaterStage.style.maxHeight || '');
      videoTheaterStage.style.setProperty('max-height', '800px', 'important');
    }

    this.isDisabled = true;
    console.log('[Playlist] Disabled, container expanded to 800px');
  }

  /**
   * Enable playlist
   * Restores thumbnails scroll and resets video container size
   */
  public enable(): void {
    if (!this.isDisabled) return;

    const thumbnailsScroll = document.querySelector('.thumbnails-scroll') as HTMLElement;
    const videoContainer = document.querySelector('.video-container') as HTMLElement;
    const videoTheaterStage = document.querySelector('.video-player-theater-stage') as HTMLElement;

    if (thumbnailsScroll) {
      // Restore original display style
      const originalDisplay = this.originalStyles.get('thumbnailsScroll');
      thumbnailsScroll.style.display = originalDisplay || '';
      thumbnailsScroll.style.removeProperty('display');
      
      // Re-enable all playlist functionalities
      const buttons = thumbnailsScroll.querySelectorAll('button');
      buttons.forEach(btn => {
        btn.removeAttribute('disabled');
        (btn as HTMLElement).style.pointerEvents = '';
      });
      
      const thumbnails = thumbnailsScroll.querySelectorAll('.thumbnail');
      thumbnails.forEach(thumb => {
        (thumb as HTMLElement).style.pointerEvents = '';
        thumb.removeAttribute('data-disabled');
      });
    }

    // Reset video container
    if (videoContainer) {
      const originalHeight = this.originalStyles.get('videoContainerHeight');
      videoContainer.style.maxHeight = originalHeight || '';
      videoContainer.style.removeProperty('max-height');
    }

    // Reset video theater stage
    if (videoTheaterStage) {
      const originalHeight = this.originalStyles.get('videoStageHeight');
      videoTheaterStage.style.maxHeight = originalHeight || '';
      videoTheaterStage.style.removeProperty('max-height');
    }

    this.isDisabled = false;
    console.log('[Playlist] Enabled, container reset to default');
  }

  /**
   * Toggle playlist
   */
  public toggle(): void {
    if (this.isDisabled) {
      this.enable();
    } else {
      this.disable();
    }
  }

  /**
   * Get current state
   */
  public getState(): boolean {
    return this.isDisabled;
  }
}

// Export singleton instance
export const playlistIntegration = new PlaylistIntegration();
