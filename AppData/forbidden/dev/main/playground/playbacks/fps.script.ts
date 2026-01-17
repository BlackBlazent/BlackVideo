// fps.script.ts - Script to handle FPS UI popup and monitoring
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// fps.script.ts
import { VideoTheaterStage } from '../Video.Theater.Stage';

export interface FPSMonitorData {
  fps: number;
  frameTime: number;
  renderTime: number;
  timestamp: number;
}

export class FPSController {
  private static instance: FPSController;
  private videoStage: VideoTheaterStage;
  private isMonitoring: boolean = false;
  private animationId: number | null = null;
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private fpsData: FPSMonitorData = { fps: 0, frameTime: 0, renderTime: 0, timestamp: 0 };
  private observers: Array<(data: FPSMonitorData) => void> = [];

  private constructor() {
    this.videoStage = VideoTheaterStage.getInstance();
    setTimeout(() => this.initializeController(), 0);
  }

  public static getInstance(): FPSController {
    if (!FPSController.instance) {
      FPSController.instance = new FPSController();
    }
    return FPSController.instance;
  }

  private initializeController(): void {
    const stage = this.videoStage;
    stage.subscribe('play', () => this.startMonitoring());
    stage.subscribe('pause', () => this.stopMonitoring());
    stage.subscribe('ended', () => this.stopMonitoring());

    const video = stage.getVideoElement();
    if (video && !video.paused) this.startMonitoring();

    this.setupButtonListener();
  }

  private setupButtonListener(): void {
    const btn = document.getElementById('frameRateController');
    if (btn) {
      btn.removeEventListener('mousedown', this.handleFrameRateButtonClick.bind(this));
      btn.addEventListener('mousedown', this.handleFrameRateButtonClick.bind(this));
    } else {
      setTimeout(() => this.setupButtonListener(), 200);
    }
  }

  // Inside fps.script.ts -> handleFrameRateButtonClick
private handleFrameRateButtonClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation(); // CRITICAL: Prevents FrameRateUI's handleClickOutside from triggering

  const button = event.currentTarget as HTMLElement;
  const rect = button.getBoundingClientRect();
  
  // Calculate position relative to viewport (since CSS is fixed)
  const xPos = rect.left + (rect.width / 2) - 130;
  let yPos = rect.top - 340; 
  if (yPos < 20) yPos = rect.bottom + 10;

  const customEvent = new CustomEvent('toggleFPSPopup', {
    detail: { 
      position: { 
        x: Math.max(10, xPos), 
        y: Math.max(10, yPos) 
      } 
    }
  });
  window.dispatchEvent(customEvent);
}

  public startMonitoring(): void {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.monitorFrame();
  }

  public stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private monitorFrame(): void {
    if (!this.isMonitoring) return;
    const startTime = performance.now();
    this.animationId = requestAnimationFrame(() => {
      const currentTime = performance.now();
      const renderTime = currentTime - startTime;
      this.frameCount++;
      const elapsed = currentTime - this.lastFrameTime;
      if (elapsed >= 1000) {
        this.fpsData = {
          fps: (this.frameCount * 1000) / elapsed,
          frameTime: elapsed / this.frameCount,
          renderTime: renderTime,
          timestamp: currentTime
        };
        this.notifyObservers(this.fpsData);
        this.frameCount = 0;
        this.lastFrameTime = currentTime;
      }
      this.monitorFrame();
    });
  }

  public subscribe(callback: (data: FPSMonitorData) => void): void {
    this.observers.push(callback);
  }

  public unsubscribe(callback: (data: FPSMonitorData) => void): void {
    this.observers = this.observers.filter(obs => obs !== callback);
  }

  private notifyObservers(data: FPSMonitorData): void {
    this.observers.forEach(callback => callback(data));
  }

  public isActive(): boolean {
    return this.isMonitoring; 
  }
}

export const fpsController = FPSController.getInstance();