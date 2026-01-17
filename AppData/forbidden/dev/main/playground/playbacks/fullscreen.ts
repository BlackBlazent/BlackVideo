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

// Add type declaration for window.fullscreenManager
declare global {
  interface Window {
    fullscreenManager?: FullscreenManager;
  }
}

interface FullscreenState {
  isInAppFullscreen: boolean;
  isNativeFullscreen: boolean;
  isPopupVisible: boolean;
}

export class FullscreenManager {
  private static instance: FullscreenManager;
  private state: FullscreenState = {
    isInAppFullscreen: false,
    isNativeFullscreen: false,
    isPopupVisible: false
  };
  
  private fullscreenButton: HTMLElement | null = null;
  private videoContainer: HTMLElement | null = null;
  private playgroundPage: HTMLElement | null = null;
  private videoElements: HTMLElement | null = null;
  private eventListeners: Map<string, EventListener> = new Map();
  private originalStyles: Map<HTMLElement, string> = new Map();
  private elementCheckInterval: number | null = null;
  private controlsHideTimeout: number | null = null;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): FullscreenManager {
    if (!FullscreenManager.instance) {
      FullscreenManager.instance = new FullscreenManager();
    }
    return FullscreenManager.instance;
  }

  private initialize(): void {
    const init = () => {
      this.findElements();
      this.setupEventListeners();
      this.checkInitialState();
      this.startElementWatcher();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  private findElements(): void {
    this.fullscreenButton = document.getElementById('fullscreen-controller');
    this.videoContainer = document.querySelector('.video-container') as HTMLElement;
    this.playgroundPage = document.querySelector('.Playground-Page') as HTMLElement;
    this.videoElements = document.getElementById('videoElements');

    const foundElements = {
      fullscreenButton: !!this.fullscreenButton,
      videoContainer: !!this.videoContainer,
      playgroundPage: !!this.playgroundPage,
      videoElements: !!this.videoElements
    };

    console.log('Fullscreen elements status:', foundElements);

    if (this.fullscreenButton) {
      console.log('Fullscreen button found, setting up click handler');
      this.setupButtonHandler();
    }
  }

  private startElementWatcher(): void {
    // Watch for elements that might be added dynamically
    this.elementCheckInterval = window.setInterval(() => {
      if (!this.fullscreenButton) {
        const button = document.getElementById('fullscreen-controller');
        if (button) {
          console.log('Fullscreen button found via watcher');
          this.fullscreenButton = button;
          this.setupButtonHandler();
        }
      }
      
      if (!this.videoContainer) {
        const container = document.querySelector('.video-container') as HTMLElement;
        if (container) {
          console.log('Video container found via watcher');
          this.videoContainer = container;
        }
      }
      
      if (!this.playgroundPage) {
        const page = document.querySelector('.Playground-Page') as HTMLElement;
        if (page) {
          console.log('Playground page found via watcher');
          this.playgroundPage = page;
        }
      }

      if (!this.videoElements) {
        const elements = document.getElementById('videoElements');
        if (elements) {
          console.log('Video elements found via watcher');
          this.videoElements = elements;
        }
      }
    }, 1000);
  }

  private setupButtonHandler(): void {
    if (!this.fullscreenButton) return;

    const handleFullscreenClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Fullscreen button clicked');
      this.togglePopup();
    };

    this.fullscreenButton.addEventListener('click', handleFullscreenClick);
    this.eventListeners.set('fullscreen-click', handleFullscreenClick);

    console.log('Button handlers attached');
  }

  private setupEventListeners(): void {
    // Global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'M') {
        if (this.state.isInAppFullscreen) {
          this.exitInAppFullscreen();
          this.showPopup();
        }
      }
      
      // ESC key handling
      if (e.key === 'Escape') {
        if (this.state.isInAppFullscreen) {
          this.exitInAppFullscreen();
        }
        this.hidePopup();
      }
    };

    // Fullscreen change detection (for native fullscreen)
    const handleFullscreenChange = () => {
      const isFullscreen = !!(document.fullscreenElement || 
                             (document as any).webkitFullscreenElement || 
                             (document as any).mozFullScreenElement);
      this.state.isNativeFullscreen = isFullscreen;
      console.log('Native fullscreen state changed:', isFullscreen);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    this.eventListeners.set('keydown', handleKeyDown as EventListener);
    this.eventListeners.set('fullscreenchange', handleFullscreenChange as EventListener);
  }

  private checkInitialState(): void {
    if (this.playgroundPage) {
      const hasFullscreenStyles = this.playgroundPage.style.padding === '0px' || 
                                  this.playgroundPage.style.padding === '0';
      this.state.isInAppFullscreen = hasFullscreenStyles;
    }
  }

  public togglePopup(): void {
    console.log('Toggling popup, current state:', this.state.isPopupVisible);
    
    if (this.state.isPopupVisible) {
      this.hidePopup();
    } else {
      this.showPopup();
    }
  }

  public showPopup(): void {
    // Prevent rapid show/hide cycles
    if (this.state.isPopupVisible) {
      console.log('Popup already visible, skipping show');
      return;
    }

    console.log('Showing popup');
    this.state.isPopupVisible = true;
    this.dispatchEvent('popup-show');
  }

  public hidePopup(): void {
    if (!this.state.isPopupVisible) {
      console.log('Popup already hidden, skipping hide');
      return;
    }

    console.log('Hiding popup');
    this.state.isPopupVisible = false;
    this.dispatchEvent('popup-hide');
  }

  public enterInAppFullscreen(): void {
    if (this.state.isInAppFullscreen) return;

    console.log('Entering in-app fullscreen');
    this.saveOriginalStyles();
    this.applyInAppFullscreenStyles();
    this.state.isInAppFullscreen = true;
    this.hidePopup();
    
    console.log('Entered In-App Fullscreen mode');
  }

  public exitInAppFullscreen(): void {
    if (!this.state.isInAppFullscreen) return;

    console.log('Exiting in-app fullscreen');
    this.restoreOriginalStyles();
    this.removeInAppFullscreenEventListeners();
    this.state.isInAppFullscreen = false;
    
    console.log('Exited In-App Fullscreen mode');
  }

  private saveOriginalStyles(): void {
    const elements = [
      this.playgroundPage,
      this.videoContainer,
      this.videoContainer?.querySelector('video') as HTMLElement,
      this.videoElements,
      document.querySelector('.controls-bar') as HTMLElement,
      document.querySelector('.hexagon-bar') as HTMLElement,
      document.querySelector('.thumbnails-scroll') as HTMLElement
    ].filter(Boolean);

    elements.forEach(element => {
      if (element) {
        this.originalStyles.set(element, element.style.cssText);
        console.log(`Saved original styles for element:`, element.className || element.id);
      }
    });
  }

  private applyInAppFullscreenStyles(): void {
    // Apply styles to playground page
    if (this.playgroundPage) {
      this.playgroundPage.style.padding = '0px';
      console.log('Applied playground page styles');
    }

    // Apply styles to video container
    if (this.videoContainer) {
      Object.assign(this.videoContainer.style, {
        position: 'fixed',
        width: '100%',
        height: '90vh',
        right: '0px',
        maxHeight: '90vh',
        borderRadius: '0px',
        zIndex: '1000',
        top: '0px',
        left: '0px'
      });
      console.log('Applied video container styles');
    }

    // Apply styles to video element
    const video = this.videoContainer?.querySelector('video') as HTMLVideoElement;
    if (video) {
      Object.assign(video.style, {
        width: 'inherit',
        height: 'inherit'
      });
      console.log('Applied video element styles');
    }

    // Apply styles to video elements (controls) - FIXED: Proper initial hiding
    if (this.videoElements) {
      Object.assign(this.videoElements.style, {
        bottom: '50px',
        position: 'fixed',
        width: '100%',
        padding: '10px',
        zIndex: '1001',
        opacity: '0', // Start hidden
        visibility: 'visible',
        transition: 'opacity 0.3s ease',
        pointerEvents: 'auto' // Ensure controls are still clickable
      });

      console.log('Applied video elements styles - controls hidden initially');
      this.setupInAppFullscreenEventListeners();
    }

    // Apply transparent backgrounds to other elements
    const transparentElements = [
      '.controls-bar',
      '.hexagon-bar',
      '.thumbnails-scroll'
    ];

    transparentElements.forEach(selector => {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) {
        Object.assign(element.style, {
          background: 'rgba(255, 255, 255, 0)',
          backdropFilter: 'blur(0.1px)',
          borderRadius: '0px'
        });
        console.log(`Applied transparent styles to: ${selector}`);
      }
    });
  }

  private setupInAppFullscreenEventListeners(): void {
    if (!this.videoContainer || !this.videoElements) {
      console.log('Missing video container or elements for event listeners');
      return;
    }

    // Clear any existing timeout
    if (this.controlsHideTimeout) {
      clearTimeout(this.controlsHideTimeout);
    }

    const showControls = () => {
      if (this.videoElements && this.state.isInAppFullscreen) {
        console.log('Showing controls on hover');
        this.videoElements.style.opacity = '1';
        // Clear hide timeout when showing
        if (this.controlsHideTimeout) {
          clearTimeout(this.controlsHideTimeout);
          this.controlsHideTimeout = null;
        }
      }
    };

    const hideControls = () => {
      if (this.videoElements && this.state.isInAppFullscreen) {
        // Add small delay before hiding to prevent flickering
        this.controlsHideTimeout = window.setTimeout(() => {
          if (this.videoElements) {
            console.log('Hiding controls after hover end');
            this.videoElements.style.opacity = '0';
          }
        }, 150);
      }
    };

    // Add listeners to both video container and video elements
    this.videoContainer.addEventListener('mouseenter', showControls);
    this.videoContainer.addEventListener('mouseleave', hideControls);
    this.videoElements.addEventListener('mouseenter', showControls);
    this.videoElements.addEventListener('mouseleave', hideControls);

    // Store listeners for cleanup
    this.eventListeners.set('inapp-show', showControls);
    this.eventListeners.set('inapp-hide', hideControls);
    this.eventListeners.set('inapp-container-enter', showControls);
    this.eventListeners.set('inapp-container-leave', hideControls);

    console.log('In-app fullscreen event listeners attached');
  }

  private removeInAppFullscreenEventListeners(): void {
    const showControls = this.eventListeners.get('inapp-show');
    const hideControls = this.eventListeners.get('inapp-hide');

    if (showControls && hideControls && this.videoContainer && this.videoElements) {
      this.videoContainer.removeEventListener('mouseenter', showControls as EventListener);
      this.videoContainer.removeEventListener('mouseleave', hideControls as EventListener);
      this.videoElements.removeEventListener('mouseenter', showControls as EventListener);
      this.videoElements.removeEventListener('mouseleave', hideControls as EventListener);

      this.eventListeners.delete('inapp-show');
      this.eventListeners.delete('inapp-hide');
      this.eventListeners.delete('inapp-container-enter');
      this.eventListeners.delete('inapp-container-leave');

      console.log('In-app fullscreen event listeners removed');
    }

    // Clear any pending hide timeout
    if (this.controlsHideTimeout) {
      clearTimeout(this.controlsHideTimeout);
      this.controlsHideTimeout = null;
    }
  }

  private restoreOriginalStyles(): void {
    console.log('Restoring original styles for', this.originalStyles.size, 'elements');
    this.originalStyles.forEach((originalStyle, element) => {
      if (element) {
        element.style.cssText = originalStyle;
        console.log(`Restored styles for element:`, element.className || element.id);
      }
    });
    this.originalStyles.clear();
  }

  public async toggleNativeFullscreen(): Promise<void> {
    try {
      if (!document.fullscreenElement) {
        if (this.videoContainer && this.videoContainer.requestFullscreen) {
          await this.videoContainer.requestFullscreen();
          this.state.isNativeFullscreen = true;
          console.log('Entered native fullscreen');
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          this.state.isNativeFullscreen = false;
          console.log('Exited native fullscreen');
        }
      }
    } catch (error) {
      console.error('Native fullscreen failed:', error);
    }
    
    this.hidePopup();
  }

  // Integration with VideoTheaterStage
  public integrateWithTheaterStage(): void {
    try {
      const VideoTheaterStage = (window as any).VideoTheaterStage;
      if (VideoTheaterStage) {
        const theaterStage = VideoTheaterStage.getInstance();
        
        theaterStage.subscribe('resize', () => {
          if (this.state.isInAppFullscreen) {
            console.log('Theater stage resized in fullscreen mode');
          }
        });

        console.log('Successfully integrated with VideoTheaterStage');
      }
    } catch (error) {
      console.log('VideoTheaterStage not available, continuing without integration');
    }
  }

  // Custom event dispatcher for React integration
  private dispatchEvent(eventName: string, detail?: any): void {
    const event = new CustomEvent(`fullscreen-${eventName}`, { detail });
    document.dispatchEvent(event);
    console.log('Dispatched event:', `fullscreen-${eventName}`);
  }

  // Public getters
  public get isInAppFullscreen(): boolean {
    return this.state.isInAppFullscreen;
  }

  public get isNativeFullscreen(): boolean {
    return this.state.isNativeFullscreen;
  }

  public get isPopupVisible(): boolean {
    return this.state.isPopupVisible;
  }

  // Cleanup method
  public destroy(): void {
    if (this.elementCheckInterval) {
      clearInterval(this.elementCheckInterval);
    }

    if (this.controlsHideTimeout) {
      clearTimeout(this.controlsHideTimeout);
    }

    // Remove all event listeners
    this.eventListeners.forEach((listener, key) => {
      if (key.includes('fullscreen')) {
        const eventType = key.split('-')[1];
        this.fullscreenButton?.removeEventListener(eventType, listener);
      } else {
        document.removeEventListener(key, listener);
      }
    });

    // Restore styles if in fullscreen
    if (this.state.isInAppFullscreen) {
      this.exitInAppFullscreen();
    }

    this.eventListeners.clear();
    this.originalStyles.clear();
  }
}

// Auto-initialize when script loads
let fullscreenManager: FullscreenManager;

const initializeFullscreenManager = () => {
  fullscreenManager = FullscreenManager.getInstance();
  fullscreenManager.integrateWithTheaterStage();
  
  // Make it globally available for debugging (with proper typing)
  window.fullscreenManager = fullscreenManager;
  
  console.log('Fullscreen manager initialized');
};

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeFullscreenManager);
} else {
  initializeFullscreenManager();
}

// Export for module usage
export default FullscreenManager;