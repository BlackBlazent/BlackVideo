// Volume	Adjust sound level
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

interface VolumeControlState {
  isVisible: boolean;
  currentVolume: number;
  isSyncEnabled: boolean;
  audioDelay: number;
  attachedElement: HTMLElement | null;
}

class PlaybackAdvancedControlEnhancement {
  private volumeState: VolumeControlState = {
    isVisible: false,
    currentVolume: 100,
    isSyncEnabled: false,
    audioDelay: 0,
    attachedElement: null
  };

  private audioCtx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('volumeChange', (e: Event) => this.handleVolumeChange(e as CustomEvent));
    window.addEventListener('toggleSync', () => this.toggleSync());
    window.addEventListener('adjustSync', (e: Event) => this.handleSyncAdjustment(e as CustomEvent));
  }

  // FIXED: Implementation of showVolumePopup
  public showVolumePopup(attachTo: HTMLElement): void {
    this.volumeState.isVisible = true;
    this.volumeState.attachedElement = attachTo;

    const showEvent = new CustomEvent('showVolumePopup', {
      detail: { 
        attachTo: attachTo,
        currentVolume: this.volumeState.currentVolume 
      }
    });
    window.dispatchEvent(showEvent);
  }

  public closeVolumePopup(): void {
    this.volumeState.isVisible = false;
    this.volumeState.attachedElement = null;
    window.dispatchEvent(new CustomEvent('hideVolumePopup'));
  }

  // ... rest of your Web Audio API (initAudioContext, applyVolumeChange, etc.) stays the same
  private initAudioContext(element: HTMLMediaElement) {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.source = this.audioCtx.createMediaElementSource(element);
      this.gainNode = this.audioCtx.createGain();
      this.source.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);
    }
  }

  private applyVolumeChange(volume: number): void {
    const video = document.querySelector('video, audio') as HTMLMediaElement;
    if (!video) return;
    if (volume <= 100) {
      if (this.gainNode) this.gainNode.gain.value = 1;
      video.volume = volume / 100;
    } else {
      this.initAudioContext(video);
      video.volume = 1;
      if (this.gainNode) this.gainNode.gain.value = volume / 100;
    }
    this.updateVolumeIcon(volume);
  }

  private handleVolumeChange(event: CustomEvent): void {
    const { volume } = event.detail;
    this.volumeState.currentVolume = Math.max(0, Math.min(300, volume));
    this.applyVolumeChange(this.volumeState.currentVolume);
  }

  private updateVolumeIcon(volume: number): void {
    const volumeIcon = document.getElementById('volume-icon') as HTMLImageElement;
    if (!volumeIcon) return;
    let iconSrc = '/assets/others/speaker.';
    if (volume === 0) iconSrc += 'mute.png';
    else if (volume < 50) iconSrc += 'low.png';
    else if (volume <= 100) iconSrc += 'full.png';
    else iconSrc += 'boost.png';
    volumeIcon.src = iconSrc;
  }

  private toggleSync() { this.volumeState.isSyncEnabled = !this.volumeState.isSyncEnabled; }
  private handleSyncAdjustment(event: CustomEvent) { this.volumeState.audioDelay = event.detail.ms; }
}

export const playbackControlEnhancement = new PlaybackAdvancedControlEnhancement();