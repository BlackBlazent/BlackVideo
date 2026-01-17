
// Captions / Subtitles	Toggle and select subtitle tracks
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
// Captions Start here
export interface CaptionSettings {
  fontSize: 'small' | 'medium' | 'large';
  fontStyle: 'default' | 'bold' | 'italic';
  textColor: string;
  backgroundColor: string;
  opacity: number;
  position: 'bottom' | 'top';
}

export interface CaptionControlState {
  isPopupVisible: boolean;
  settings: CaptionSettings;
  selectedLanguage: string;
  availableLanguages: string[];
}

export class CaptionControlEnhancement {
  private buttonElement: HTMLElement | null = null;
  private popupElement: HTMLElement | null = null;
  private state: CaptionControlState;
  private clickOutsideHandler: (event: MouseEvent) => void;
  private hoverOutTimer: number | null = null;

  constructor() {
    this.state = {
      isPopupVisible: false,
      settings: {
        fontSize: 'medium',
        fontStyle: 'default',
        textColor: '#ffffff',
        backgroundColor: '#000000',
        opacity: 80,
        position: 'bottom'
      },
      selectedLanguage: 'English (Auto)',
      availableLanguages: ['English (Auto)', 'Armenia', 'Russia', 'Sweden', 'Spain', 'India']
    };

    this.clickOutsideHandler = this.handleClickOutside.bind(this);
    this.init();
  }

  private init(): void {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.attachButtonListener());
    } else {
      this.attachButtonListener();
    }
  }

  private attachButtonListener(): void {
    this.buttonElement = document.getElementById('ccController');
    if (this.buttonElement) {
      this.buttonElement.addEventListener('click', this.handleButtonClick.bind(this));
      this.buttonElement.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
      this.buttonElement.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
    }
  }

  private handleButtonClick = (event: Event): void => {
    event.stopPropagation();
    this.togglePopup();
  }

  private handleMouseEnter = (): void => {
    if (this.hoverOutTimer) {
      clearTimeout(this.hoverOutTimer);
      this.hoverOutTimer = null;
    }
  }

  private handleMouseLeave = (): void => {
    this.hoverOutTimer = window.setTimeout(() => {
      if (this.state.isPopupVisible && !this.isHoveringPopup()) {
        this.hidePopup();
      }
    }, 300);
  }

  private isHoveringPopup(): boolean {
    return this.popupElement?.matches(':hover') || false;
  }

  private handleClickOutside = (event: MouseEvent): void => {
    const target = event.target as Element;
    if (this.buttonElement && this.popupElement && 
        !this.buttonElement.contains(target) && 
        !this.popupElement.contains(target)) {
      this.hidePopup();
    }
  }

  public togglePopup(): void {
    if (this.state.isPopupVisible) {
      this.hidePopup();
    } else {
      this.showPopup();
    }
  }

  public showPopup(): void {
    this.state.isPopupVisible = true;
    this.updatePopupVisibility();
    document.addEventListener('click', this.clickOutsideHandler);
  }

  public hidePopup(): void {
    this.state.isPopupVisible = false;
    this.updatePopupVisibility();
    document.removeEventListener('click', this.clickOutsideHandler);
    
    if (this.hoverOutTimer) {
      clearTimeout(this.hoverOutTimer);
      this.hoverOutTimer = null;
    }
  }

  private updatePopupVisibility(): void {
    if (this.popupElement) {
      this.popupElement.style.display = this.state.isPopupVisible ? 'block' : 'none';
    }
  }

  public setPopupElement(element: HTMLElement): void {
    this.popupElement = element;
    this.updatePopupVisibility();
    
    // Add hover listeners to popup
    if (this.popupElement) {
      this.popupElement.addEventListener('mouseenter', () => {
        if (this.hoverOutTimer) {
          clearTimeout(this.hoverOutTimer);
          this.hoverOutTimer = null;
        }
      });
      
      this.popupElement.addEventListener('mouseleave', () => {
        this.hoverOutTimer = window.setTimeout(() => {
          this.hidePopup();
        }, 300);
      });
    }
  }

  public updateSettings(newSettings: Partial<CaptionSettings>): void {
    this.state.settings = { ...this.state.settings, ...newSettings };
    this.applyCaptionSettings();
  }

  public setLanguage(language: string): void {
    this.state.selectedLanguage = language;
  }

  private applyCaptionSettings(): void {
    // This would apply the settings to actual caption elements
    // For now, we'll just store them in the state
    console.log('Caption settings applied:', this.state.settings);
  }

  public getState(): CaptionControlState {
    return { ...this.state };
  }

  public getButtonPosition(): DOMRect | null {
    return this.buttonElement?.getBoundingClientRect() || null;
  }

  public cleanup(): void {
    document.removeEventListener('click', this.clickOutsideHandler);
    if (this.hoverOutTimer) {
      clearTimeout(this.hoverOutTimer);
    }
  }
}

// Export singleton instance
export const captionControlEnhancement = new CaptionControlEnhancement();
// Cpations End here