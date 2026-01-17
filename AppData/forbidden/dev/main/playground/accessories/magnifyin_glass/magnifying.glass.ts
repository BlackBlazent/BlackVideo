/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// magnifying.glass.ts - Video Magnifying Glass Feature

import { VideoTheaterStage } from '../../Video.Theater.Stage';

export class VideoMagnifyingGlass {
  private static instance: VideoMagnifyingGlass;
  private isActive: boolean = false;
  private magnifierOverlay: HTMLDivElement | null = null;
  private zoomedVideo: HTMLVideoElement | null = null;
  private originalVideo: HTMLVideoElement | null = null;
  private videoContainer: HTMLElement | null = null;
  private theaterStage: VideoTheaterStage;
  private currentZoomLevel: number = 2; // Default 2x zoom
  private magnifierSize: number = 200; // Default magnifier diameter
  private isInitialized: boolean = false;

  private constructor() {
    this.theaterStage = VideoTheaterStage.getInstance();
    this.initializeMagnifyingGlass();
  }

  public static getInstance(): VideoMagnifyingGlass {
    if (!VideoMagnifyingGlass.instance) {
      VideoMagnifyingGlass.instance = new VideoMagnifyingGlass();
    }
    return VideoMagnifyingGlass.instance;
  }

  private initializeMagnifyingGlass(): void {
    const maxAttempts = 30;
    let attempts = 0;

    const initialize = () => {
      try {
        // Get elements from theater stage
        this.originalVideo = this.theaterStage.getVideoElement();
        this.videoContainer = this.theaterStage.getContainerElement();

        // Also try direct DOM queries as fallback
        if (!this.originalVideo) {
          this.originalVideo = document.getElementById('VideoPlayer-TheaterStage') as HTMLVideoElement;
        }
        if (!this.videoContainer) {
          this.videoContainer = document.getElementById('videoContainer') as HTMLElement;
        }

        if (this.originalVideo && this.videoContainer) {
          this.setupMagnifyingGlassButton();
          this.isInitialized = true;
          console.log('Magnifying glass initialized successfully');
          return true;
        }

        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(initialize, 300);
          console.log(`Magnifying glass initialization attempt ${attempts}...`);
        } else {
          console.warn('Failed to initialize magnifying glass after maximum attempts');
        }
        return false;
      } catch (error) {
        console.error('Error initializing magnifying glass:', error);
        if (attempts < maxAttempts) {
          attempts++;
          setTimeout(initialize, 300);
        }
        return false;
      }
    };

    const init = () => {
      // Reset state
      this.isActive = false;
      this.isInitialized = false;
      this.originalVideo = null;
      this.videoContainer = null;
      initialize();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // Also listen for theater stage events
    this.theaterStage.subscribe('loadedmetadata', () => {
      if (!this.isInitialized) {
        setTimeout(init, 100);
      }
    });

    this.theaterStage.subscribe('canplay', () => {
      if (!this.isInitialized) {
        setTimeout(init, 100);
      }
    });
  }

  private setupMagnifyingGlassButton(): void {
    const button = document.getElementById('accessories-magnifying-glass-btn');
    const icon = document.getElementById('accessories-magnifying-glass-icon');

    if (!button) {
      console.warn('Magnifying glass button not found');
      return;
    }

    // Remove existing listeners to prevent duplicates
    button.replaceWith(button.cloneNode(true));
    const newButton = document.getElementById('accessories-magnifying-glass-btn');
    const newIcon = document.getElementById('accessories-magnifying-glass-icon');

    if (newButton && newIcon) {
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleMagnifyingGlass();
      });

      // Add visual feedback
      newButton.addEventListener('mouseenter', () => {
        if (newIcon) {
          newIcon.style.transform = 'scale(1.1)';
          newIcon.style.transition = 'transform 0.2s ease';
        }
      });

      newButton.addEventListener('mouseleave', () => {
        if (newIcon) {
          newIcon.style.transform = 'scale(1)';
        }
      });
    }
  }

  private toggleMagnifyingGlass(): void {
    if (!this.originalVideo || !this.videoContainer) {
      console.warn('Video elements not available for magnifying glass');
      return;
    }

    if (this.isActive) {
      this.deactivateMagnifyingGlass();
    } else {
      this.activateMagnifyingGlass();
    }
  }

  private activateMagnifyingGlass(): void {
    if (!this.originalVideo || !this.videoContainer) return;

    this.isActive = true;
    this.createMagnifierOverlay();
    this.setupVideoHoverEvents();
    this.updateButtonState(true);
    
    console.log('Magnifying glass activated');
  }

  private deactivateMagnifyingGlass(): void {
    this.isActive = false;
    this.removeMagnifierOverlay();
    this.removeVideoHoverEvents();
    this.updateButtonState(false);
    
    console.log('Magnifying glass deactivated');
  }

  private createMagnifierOverlay(): void {
    if (this.magnifierOverlay) {
      this.removeMagnifierOverlay();
    }

    // Create magnifier container
    this.magnifierOverlay = document.createElement('div');
    this.magnifierOverlay.className = 'magnifier-overlay';
    this.magnifierOverlay.style.cssText = `
      position: absolute;
      width: ${this.magnifierSize}px;
      height: ${this.magnifierSize}px;
      border: 3px solid #ffffff;
      border-radius: 50%;
      pointer-events: none;
      z-index: 10000;
      overflow: hidden;
      display: none;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    `;

    // Create zoomed video element
    this.zoomedVideo = document.createElement('video');
    this.zoomedVideo.className = 'zoomed-video';
    this.zoomedVideo.muted = true;
    this.zoomedVideo.playsInline = true;
    
    // Copy source from original video
    if (this.originalVideo?.src) {
      this.zoomedVideo.src = this.originalVideo.src;
    } else {
      // Copy source elements
      const sources = this.originalVideo?.querySelectorAll('source');
      if (sources) {
        sources.forEach(source => {
          const newSource = document.createElement('source');
          newSource.src = source.src;
          newSource.type = source.type;
          this.zoomedVideo?.appendChild(newSource);
        });
      }
    }

    this.zoomedVideo.style.cssText = `
      position: absolute;
      width: ${this.magnifierSize * this.currentZoomLevel}px;
      height: ${this.magnifierSize * this.currentZoomLevel}px;
      object-fit: cover;
      transform-origin: top left;
    `;

    this.magnifierOverlay.appendChild(this.zoomedVideo);
    document.body.appendChild(this.magnifierOverlay);

    // Sync the zoomed video with original
    this.syncZoomedVideo();
  }

  private syncZoomedVideo(): void {
    if (!this.originalVideo || !this.zoomedVideo) return;

    // Sync current time
    this.zoomedVideo.currentTime = this.originalVideo.currentTime;

    // Sync playback state
    if (this.originalVideo.paused) {
      this.zoomedVideo.pause();
    } else {
      this.zoomedVideo.play().catch(e => console.warn('Could not play zoomed video:', e));
    }

    // Set up continuous sync
    const syncInterval = setInterval(() => {
      if (!this.isActive || !this.originalVideo || !this.zoomedVideo) {
        clearInterval(syncInterval);
        return;
      }

      // Sync time (with small tolerance to avoid constant seeking)
      const timeDiff = Math.abs(this.zoomedVideo.currentTime - this.originalVideo.currentTime);
      if (timeDiff > 0.1) {
        this.zoomedVideo.currentTime = this.originalVideo.currentTime;
      }

      // Sync play/pause state
      if (this.originalVideo.paused && !this.zoomedVideo.paused) {
        this.zoomedVideo.pause();
      } else if (!this.originalVideo.paused && this.zoomedVideo.paused) {
        this.zoomedVideo.play().catch(e => console.warn('Sync play failed:', e));
      }
    }, 100);
  }

  private setupVideoHoverEvents(): void {
    if (!this.originalVideo || !this.videoContainer) return;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      if (!this.isActive || !this.magnifierOverlay || !this.zoomedVideo || !this.originalVideo) return;

      const rect = this.originalVideo.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if mouse is within video bounds
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        // Show magnifier
        this.magnifierOverlay.style.display = 'block';

        // Position magnifier (offset to avoid covering cursor)
        const offsetX = 20;
        const offsetY = 20;
        let magnifierX = e.clientX + offsetX;
        let magnifierY = e.clientY + offsetY;

        // Keep magnifier within viewport
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        if (magnifierX + this.magnifierSize > viewportWidth) {
          magnifierX = e.clientX - this.magnifierSize - offsetX;
        }
        if (magnifierY + this.magnifierSize > viewportHeight) {
          magnifierY = e.clientY - this.magnifierSize - offsetY;
        }

        this.magnifierOverlay.style.left = `${magnifierX}px`;
        this.magnifierOverlay.style.top = `${magnifierY}px`;

        // Position zoomed video to show the correct area
        const zoomedVideoX = -(x * this.currentZoomLevel - this.magnifierSize / 2);
        const zoomedVideoY = -(y * this.currentZoomLevel - this.magnifierSize / 2);

        this.zoomedVideo.style.left = `${zoomedVideoX}px`;
        this.zoomedVideo.style.top = `${zoomedVideoY}px`;
      } else {
        // Hide magnifier when outside video
        this.magnifierOverlay.style.display = 'none';
      }
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      if (this.magnifierOverlay) {
        this.magnifierOverlay.style.display = 'none';
      }
    };

    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (!this.isActive || !this.originalVideo) return;

      const rect = this.originalVideo.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;

      // Check if click is outside video bounds
      if (clickX < rect.left || clickX > rect.right || clickY < rect.top || clickY > rect.bottom) {
        this.deactivateMagnifyingGlass();
      }
    };

    // Add event listeners
    this.videoContainer.addEventListener('mousemove', handleMouseMove);
    this.videoContainer.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('click', handleClickOutside);

    // Store handlers for cleanup
    (this as any)._handleMouseMove = handleMouseMove;
    (this as any)._handleMouseLeave = handleMouseLeave;
    (this as any)._handleClickOutside = handleClickOutside;
  }

  private removeVideoHoverEvents(): void {
    if (this.videoContainer && (this as any)._handleMouseMove) {
      this.videoContainer.removeEventListener('mousemove', (this as any)._handleMouseMove);
      this.videoContainer.removeEventListener('mouseleave', (this as any)._handleMouseLeave);
    }
    if ((this as any)._handleClickOutside) {
      document.removeEventListener('click', (this as any)._handleClickOutside);
    }

    // Clean up stored handlers
    delete (this as any)._handleMouseMove;
    delete (this as any)._handleMouseLeave;
    delete (this as any)._handleClickOutside;
  }

  private removeMagnifierOverlay(): void {
    if (this.magnifierOverlay) {
      this.magnifierOverlay.remove();
      this.magnifierOverlay = null;
    }
    if (this.zoomedVideo) {
      this.zoomedVideo.pause();
      this.zoomedVideo = null;
    }
  }

  private updateButtonState(active: boolean): void {
    const button = document.getElementById('accessories-magnifying-glass-btn');
    const icon = document.getElementById('accessories-magnifying-glass-icon') as HTMLImageElement;

    if (button && icon) {
      if (active) {
        button.classList.add('active');
        icon.style.filter = 'brightness(1.2) saturate(1.2)';
        icon.style.transform = 'scale(1.1)';
      } else {
        button.classList.remove('active');
        icon.style.filter = '';
        icon.style.transform = 'scale(1)';
      }
    }
  }

  // Public methods for customization
  public setZoomLevel(zoom: number): void {
    this.currentZoomLevel = Math.max(1.5, Math.min(5, zoom)); // Clamp between 1.5x and 5x
    if (this.zoomedVideo) {
      this.zoomedVideo.style.width = `${this.magnifierSize * this.currentZoomLevel}px`;
      this.zoomedVideo.style.height = `${this.magnifierSize * this.currentZoomLevel}px`;
    }
  }

  public setMagnifierSize(size: number): void {
    this.magnifierSize = Math.max(100, Math.min(400, size)); // Clamp between 100px and 400px
    if (this.magnifierOverlay) {
      this.magnifierOverlay.style.width = `${this.magnifierSize}px`;
      this.magnifierOverlay.style.height = `${this.magnifierSize}px`;
    }
    if (this.zoomedVideo) {
      this.zoomedVideo.style.width = `${this.magnifierSize * this.currentZoomLevel}px`;
      this.zoomedVideo.style.height = `${this.magnifierSize * this.currentZoomLevel}px`;
    }
  }

  public isActivated(): boolean {
    return this.isActive;
  }

  public forceDeactivate(): void {
    if (this.isActive) {
      this.deactivateMagnifyingGlass();
    }
  }

  // Initialize method for manual initialization if needed
  public initialize(): void {
    if (!this.isInitialized) {
      this.initializeMagnifyingGlass();
    }
  }
}

// Auto-initialize when module loads
const magnifyingGlass = VideoMagnifyingGlass.getInstance();

// Export for external access
export default magnifyingGlass;