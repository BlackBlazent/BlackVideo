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

// Define the available sleep timer options in minutes (or special string)
export type TimerPreset = number | string | 'end_of_video';

// Sleep Timer Menu Presets
const PRESETS: { label: string; value: TimerPreset }[] = [
    { label: '10 Minutes', value: 10 },
    { label: '15 Minutes', value: 15 },
    { label: '30 Minutes', value: 30 },
    { label: '1 Hour', value: 60 },
    // { label: 'End of Video', value: 'end_of_video' }, // Optional complex logic
];

/**
 * Utility to manage the video Sleep Timer countdown, state, and menu structure.
 */
export class SleepTimerUtility {
  private static instance: SleepTimerUtility;
  private videoStage: VideoTheaterStage;
  private menuElementId = 'sleep-timer-menu-popup';

  private timerEndTime: number | null = null;
  private timerInterval: number | null = null;
  private timeoutRef: NodeJS.Timeout | null = null;
  private updateCallbacks: Set<Function> = new Set();
  
  // New: Reference to the handler that starts the timer (passed from React)
  private startTimerHandler: ((preset: TimerPreset) => void) | null = null;

  private constructor() {
    // Assuming VideoTheaterStage path is correct based on context
    this.videoStage = VideoTheaterStage.getInstance(); 
  }

  public static getInstance(): SleepTimerUtility {
    if (!SleepTimerUtility.instance) {
      SleepTimerUtility.instance = new SleepTimerUtility();
    }
    return SleepTimerUtility.instance;
  }
  
  /**
   * Registers the React handler function to call when a preset is selected.
   * This bridges the HTML string's event listeners back to the React component.
   */
  public registerStartTimerHandler(handler: (preset: TimerPreset) => void): void {
      this.startTimerHandler = handler;
  }
  
  /**
   * Exposes the method to handle a preset selection from the DOM element.
   * This must be called from the attached DOM event listener.
   */
  public handlePresetSelection(preset: TimerPreset): void {
      if (this.startTimerHandler) {
          this.startTimerHandler(preset);
      } else {
          console.error("SleepTimerUtility: Start handler not registered.");
      }
  }

  /**
   * Generates the HTML string for the sleep timer menu popup.
   * This is what will be injected into the DOM by the React component.
   * @param alignmentStyle The dynamic positioning style passed from React.
   */
  public getMenuHtml(alignmentStyle: string): string {
    const isRunning = this.isTimerActive();

    // Use a unique ID for the menu element
    let html = `<div id="${this.menuElementId}" class="sleep-timer-menu" style="${alignmentStyle}">
        <h3 style="margin: 0 0 8px 0; color: white; font-size: 14px; text-align: center;">Set Sleep Timer</h3>`;

    if (isRunning) {
        // If a timer is running, show the cancel option
        html += `<button 
            class="sleep-timer-menu-item sleep-timer-menu-cancel"
            data-preset="cancel"
        >
            Cancel Timer
        </button>`;
    } else {
        // Otherwise, show the preset options
        PRESETS.forEach(preset => {
            html += `<button 
                class="sleep-timer-menu-item"
                data-preset="${preset.value}"
            >
                ${preset.label}
            </button>`;
        });
    }

    html += `</div>`;
    return html;
  }

  /**
   * Attaches click event listeners to the menu buttons after it's injected into the DOM.
   * @param onHide A callback function to hide the menu after an action.
   */
  public attachEventListeners(onHide: () => void): void {
      const menu = document.getElementById(this.menuElementId);
      if (!menu) return;

      const buttons = menu.querySelectorAll('.sleep-timer-menu-item');
      buttons.forEach(button => {
          button.addEventListener('click', (event) => {
              const preset = (event.currentTarget as HTMLElement).dataset.preset;
              
              if (preset === 'cancel') {
                  this.cancelTimer();
              } else if (preset) {
                  const presetValue: TimerPreset = isNaN(Number(preset)) ? preset : Number(preset);
                  this.handlePresetSelection(presetValue);
              }
              onHide();
          });
      });
  }

  public removeMenuFromDOM(): void {
      const menu = document.getElementById(this.menuElementId);
      if (menu) {
          menu.remove();
      }
  }
  
  // ... (startTimer, cancelTimer, handleTimerEnd, getRemainingSeconds, formatRemainingTime, 
  // subscribe, unsubscribe, notifyUpdate, isTimerActive methods remain the same) ...

    /**
     * Sets and starts the sleep timer based on the selected preset.
     * @param preset The time in minutes or 'end_of_video'.
     */
    public startTimer(preset: TimerPreset): void {
        this.cancelTimer(); // Clear any existing timer first
        
        // ... (rest of startTimer logic remains the same) ...

        if (preset === 'end_of_video') {
            console.log("Sleep timer set to 'End of Video'.");
            return; 
        }

        const video = this.videoStage.getVideoElement();
        if (!video) {
            console.error("Video element not found for sleep timer.");
            return;
        }

        const sleepTimeMs = Number(preset) * 60 * 1000; // Use Number(preset) to handle the explicit type
        
        this.timerEndTime = Date.now() + sleepTimeMs;

        // 1. Set the final pause timeout
        this.timeoutRef = setTimeout(() => {
          this.handleTimerEnd(video);
        }, sleepTimeMs);

        // 2. Start the interval for UI countdown update
        this.timerInterval = window.setInterval(this.notifyUpdate.bind(this), 1000);

        this.notifyUpdate(); // Initial update
        console.log(`Sleep Timer set for ${preset} minutes.`);
    }

    /**
     * Clears all timers and resets the state.
     */
    public cancelTimer(): void {
        // ... (rest of cancelTimer logic remains the same) ...
        if (this.timeoutRef) {
          clearTimeout(this.timeoutRef);
          this.timeoutRef = null;
        }
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.timerEndTime = null;
        this.notifyUpdate(); // Final update to clear UI
        console.log("Sleep Timer cancelled.");
    }

    /**
     * Action to perform when the timer reaches zero.
     */
    private handleTimerEnd(video: HTMLVideoElement): void {
        this.cancelTimer(); // Clear internal timers

        // ... (rest of handleTimerEnd logic remains the same) ...
        const fadeDuration = 1000; // 1 second fade
        const steps = 20;
        let currentVolume = video.volume;

        const fadeInterval = setInterval(() => {
          currentVolume -= (video.volume / steps);
          if (currentVolume <= 0.05) { // Threshold near zero
            clearInterval(fadeInterval);
            video.volume = 0;
            
            // 2. Pause the video
            video.pause(); 
            
            // Restore volume for next playback
            video.volume = 1.0; 
          } else {
            video.volume = currentVolume;
          }
        }, fadeDuration / steps);
        
        // Fallback: Ensure pause happens if fade is slow/fails
        setTimeout(() => {
            video.pause();
        }, fadeDuration + 100);
    }
    
    // ... (getRemainingSeconds, formatRemainingTime, 
    // subscribe, unsubscribe, notifyUpdate, isTimerActive methods remain the same) ...
    
    /**
     * Calculates the remaining time in seconds.
     */
    public getRemainingSeconds(): number {
        if (!this.timerEndTime) return 0;
        
        const remainingMs = this.timerEndTime - Date.now();
        return Math.max(0, Math.floor(remainingMs / 1000));
    }

    /**
     * Formats remaining seconds into H:MM:SS string.
     */
    public formatRemainingTime(): string | null {
        const seconds = this.getRemainingSeconds();
        if (seconds <= 0) return null;

        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;

        const formattedM = m.toString().padStart(2, '0');
        const formattedS = s.toString().padStart(2, '0');

        if (h > 0) {
          return `${h}:${formattedM}:${formattedS}`;
        }
        return `${m}:${formattedS}`;
    }

    /**
     * Registers a callback function to be called on every second update.
     */
    public subscribe(callback: Function): void {
        this.updateCallbacks.add(callback);
        this.notifyUpdate();
    }

    /**
     * Unregisters a callback function.
     */
    public unsubscribe(callback: Function): void {
        this.updateCallbacks.delete(callback);
    }

    /**
     * Notifies all subscribed components of a timer update.
     */
    private notifyUpdate(): void {
        const remaining = this.formatRemainingTime();
        this.updateCallbacks.forEach(callback => callback(remaining));
    }

    /**
     * Checks if a timer is currently running.
     */
    public isTimerActive(): boolean {
        return this.timerEndTime !== null;
    }
}