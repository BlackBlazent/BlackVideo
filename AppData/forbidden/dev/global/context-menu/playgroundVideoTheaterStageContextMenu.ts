/**
 * Playground Video Theater Stage Context Menu Logic
 * Handles context menu for main video player
 */

import { ContextMenuOption } from './indexContextMenu';

export type FitMode = 'fit-to-window' | 'fullscreen';

export class VideoTheaterContextMenuManager {
  private fitMode: FitMode = 'fit-to-window';
  private listeners: ((fitMode: FitMode) => void)[] = [];

  getFitMode(): FitMode {
    return this.fitMode;
  }

  setFitMode(mode: FitMode) {
    this.fitMode = mode;
    this.notifyListeners();
    
    // Apply fit mode
    if (mode === 'fullscreen') {
      this.enterFullscreen();
    } else {
      this.fitToWindow();
    }
  }

  private fitToWindow() {
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
      videoContainer.style.width = '100%';
      videoContainer.style.height = 'auto';
      videoContainer.style.maxWidth = '100%';
      videoContainer.style.maxHeight = '100vh';
    }
  }

  private enterFullscreen() {
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    }
  }

  copyVideoLink() {
    const video = document.getElementById('VideoPlayer-TheaterStage') as HTMLVideoElement;
    if (video && video.src) {
      navigator.clipboard.writeText(video.src).then(() => {
        console.log('Video link copied to clipboard');
      }).catch(err => {
        console.error('Failed to copy video link:', err);
      });
    }
  }

  openEditMetadata() {
    // This would open a metadata editor dialog
    console.log('Open video metadata editor');
  }

  subscribe(listener: (fitMode: FitMode) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.fitMode));
  }

  getContextMenuOptions(): ContextMenuOption[] {
    return [
      {
        id: 'copy-link',
        label: 'Copy Link',
        action: () => this.copyVideoLink(),
      },
      {
        id: 'edit-metadata',
        label: 'Edit Video Metadata',
        action: () => this.openEditMetadata(),
      },
      {
        id: 'fit',
        label: 'Fit',
        submenu: [
          {
            id: 'fit-to-window',
            label: 'Fit to windowscreen',
            checked: this.fitMode === 'fit-to-window',
            action: () => this.setFitMode('fit-to-window'),
          },
          {
            id: 'fullscreen',
            label: 'Fullscreen',
            checked: this.fitMode === 'fullscreen',
            action: () => this.setFitMode('fullscreen'),
          },
        ],
      },
    ];
  }
}

export const videoTheaterContextMenuManager = new VideoTheaterContextMenuManager();
