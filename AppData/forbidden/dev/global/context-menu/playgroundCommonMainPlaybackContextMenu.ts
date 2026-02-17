/**
 * Playground Common Main Playback Context Menu Logic
 * Handles context menu for main video playback controls
 */

import { ContextMenuOption } from './indexContextMenu';

export interface PlaybackControlsVisibility {
  sprite: boolean;
  heatmap: boolean;
  timelineCounter: boolean;
  timelineDuration: boolean;
  previous: boolean;
  playPause: boolean;
  reset: boolean;
  loop: boolean;
  speaker: boolean;
  closedCaptions: boolean;
  skips: boolean;
  playbackSpeed: boolean;
  frameRate: boolean;
  bitrate: boolean;
  resolution: boolean;
  pictureInPicture: boolean;
  aspectRatio: boolean;
  fullscreen: boolean;
}

const defaultVisibility: PlaybackControlsVisibility = {
  sprite: true,
  heatmap: true,
  timelineCounter: true,
  timelineDuration: true,
  previous: true,
  playPause: true,
  reset: true,
  loop: true,
  speaker: true,
  closedCaptions: true,
  skips: true,
  playbackSpeed: true,
  frameRate: true,
  bitrate: true,
  resolution: true,
  pictureInPicture: true,
  aspectRatio: true,
  fullscreen: true,
};

export class PlaybackControlsContextMenuManager {
  private visibility: PlaybackControlsVisibility;
  private listeners: ((visibility: PlaybackControlsVisibility) => void)[] = [];

  constructor(initialVisibility?: Partial<PlaybackControlsVisibility>) {
    this.visibility = {
      ...defaultVisibility,
      ...initialVisibility,
    };
  }

  getVisibility(): PlaybackControlsVisibility {
    return { ...this.visibility };
  }

  toggleControl(control: keyof PlaybackControlsVisibility) {
    this.visibility[control] = !this.visibility[control];
    this.notifyListeners();
  }

  showAll() {
    Object.keys(this.visibility).forEach(key => {
      this.visibility[key as keyof PlaybackControlsVisibility] = true;
    });
    this.notifyListeners();
  }

  hideAll() {
    Object.keys(this.visibility).forEach(key => {
      this.visibility[key as keyof PlaybackControlsVisibility] = false;
    });
    this.notifyListeners();
  }

  subscribe(listener: (visibility: PlaybackControlsVisibility) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.visibility));
  }

  getContextMenuOptions(): ContextMenuOption[] {
    return [
      {
        id: 'show-hide-playbacks',
        label: 'Show/Hide Playbacks',
        submenu: [
          {
            id: 'sprite',
            label: 'Sprite',
            checked: this.visibility.sprite,
            action: () => this.toggleControl('sprite'),
          },
          {
            id: 'heatmap',
            label: 'Heatmap',
            checked: this.visibility.heatmap,
            action: () => this.toggleControl('heatmap'),
          },
          {
            id: 'timeline-counter',
            label: 'Timeline Counter',
            checked: this.visibility.timelineCounter,
            action: () => this.toggleControl('timelineCounter'),
          },
          {
            id: 'timeline-duration',
            label: 'Timeline Duration',
            checked: this.visibility.timelineDuration,
            action: () => this.toggleControl('timelineDuration'),
          },
          {
            id: 'previous',
            label: 'Previous',
            checked: this.visibility.previous,
            action: () => this.toggleControl('previous'),
          },
          {
            id: 'play-pause',
            label: 'Play/Pause',
            checked: this.visibility.playPause,
            action: () => this.toggleControl('playPause'),
          },
          {
            id: 'reset',
            label: 'Reset',
            checked: this.visibility.reset,
            action: () => this.toggleControl('reset'),
          },
          {
            id: 'loop',
            label: 'Loop',
            checked: this.visibility.loop,
            action: () => this.toggleControl('loop'),
          },
          {
            id: 'speaker',
            label: 'Speaker',
            checked: this.visibility.speaker,
            action: () => this.toggleControl('speaker'),
          },
          {
            id: 'closed-captions',
            label: 'Close Captions',
            checked: this.visibility.closedCaptions,
            action: () => this.toggleControl('closedCaptions'),
          },
          {
            id: 'skips',
            label: 'Skips',
            checked: this.visibility.skips,
            action: () => this.toggleControl('skips'),
          },
          {
            id: 'playback-speed',
            label: 'Playback Speed',
            checked: this.visibility.playbackSpeed,
            action: () => this.toggleControl('playbackSpeed'),
          },
          {
            id: 'frame-rate',
            label: 'Frame Rate',
            checked: this.visibility.frameRate,
            action: () => this.toggleControl('frameRate'),
          },
          {
            id: 'bitrate',
            label: 'Bitrate',
            checked: this.visibility.bitrate,
            action: () => this.toggleControl('bitrate'),
          },
          {
            id: 'resolution',
            label: 'Resolution',
            checked: this.visibility.resolution,
            action: () => this.toggleControl('resolution'),
          },
          {
            id: 'picture-in-picture',
            label: 'Picture in Picture',
            checked: this.visibility.pictureInPicture,
            action: () => this.toggleControl('pictureInPicture'),
          },
          {
            id: 'aspect-ratio',
            label: 'Aspect Ratio',
            checked: this.visibility.aspectRatio,
            action: () => this.toggleControl('aspectRatio'),
          },
          {
            id: 'fullscreen',
            label: 'Fullscreen',
            checked: this.visibility.fullscreen,
            action: () => this.toggleControl('fullscreen'),
          },
        ],
      },
      {
        id: 'settings',
        label: 'Settings',
        action: () => {
          // Open settings dialog
          console.log('Open playback settings');
        },
      },
    ];
  }
}

export const playbackControlsContextMenuManager = new PlaybackControlsContextMenuManager();
