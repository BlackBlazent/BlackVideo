/**
 * Playground Custom Playback Context Menu Logic
 * Handles context menu for custom video submenu controls
 */

import { ContextMenuOption } from './indexContextMenu';

export interface CustomPlaybackVisibility {
  skipIntroOutro: boolean;
  sleepTimer: boolean;
  ambient: boolean;
  flipVideo: boolean;
  save: boolean;
  screenCast: boolean;
  share: boolean;
  miniPlayback: boolean;
  reset: boolean;
  loop: boolean;
  previous: boolean;
  next: boolean;
  playPause: boolean;
}

const defaultVisibility: CustomPlaybackVisibility = {
  skipIntroOutro: true,
  sleepTimer: true,
  ambient: true,
  flipVideo: true,
  save: true,
  screenCast: true,
  share: true,
  miniPlayback: true,
  reset: true,
  loop: true,
  previous: true,
  next: true,
  playPause: true,
};

export class CustomPlaybackContextMenuManager {
  private visibility: CustomPlaybackVisibility;
  private listeners: ((visibility: CustomPlaybackVisibility) => void)[] = [];

  constructor(initialVisibility?: Partial<CustomPlaybackVisibility>) {
    this.visibility = {
      ...defaultVisibility,
      ...initialVisibility,
    };
  }

  getVisibility(): CustomPlaybackVisibility {
    return { ...this.visibility };
  }

  toggleControl(control: keyof CustomPlaybackVisibility) {
    this.visibility[control] = !this.visibility[control];
    this.notifyListeners();
  }

  subscribe(listener: (visibility: CustomPlaybackVisibility) => void) {
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
            id: 'left-side-header',
            label: '— Left Side —',
            disabled: true,
          },
          {
            id: 'skip-intro-outro',
            label: 'Skip Intro/Outro',
            checked: this.visibility.skipIntroOutro,
            action: () => this.toggleControl('skipIntroOutro'),
          },
          {
            id: 'sleep-timer',
            label: 'Sleep Timer',
            checked: this.visibility.sleepTimer,
            action: () => this.toggleControl('sleepTimer'),
          },
          {
            id: 'ambient',
            label: 'Ambient',
            checked: this.visibility.ambient,
            action: () => this.toggleControl('ambient'),
          },
          {
            id: 'flip-video',
            label: 'Flip Video',
            checked: this.visibility.flipVideo,
            action: () => this.toggleControl('flipVideo'),
          },
          {
            id: 'save',
            label: 'Save',
            checked: this.visibility.save,
            action: () => this.toggleControl('save'),
          },
          {
            id: 'screen-cast',
            label: 'Screen Cast',
            checked: this.visibility.screenCast,
            action: () => this.toggleControl('screenCast'),
          },
          {
            id: 'share',
            label: 'Share',
            checked: this.visibility.share,
            action: () => this.toggleControl('share'),
          },
          { id: 'divider-1', label: '', divider: true },
          {
            id: 'right-side-header',
            label: '— Right Side —',
            disabled: true,
          },
          {
            id: 'mini-playback',
            label: 'Mini Playback',
            checked: this.visibility.miniPlayback,
            action: () => this.toggleControl('miniPlayback'),
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
            id: 'previous',
            label: 'Previous',
            checked: this.visibility.previous,
            action: () => this.toggleControl('previous'),
          },
          {
            id: 'next',
            label: 'Next',
            checked: this.visibility.next,
            action: () => this.toggleControl('next'),
          },
          {
            id: 'play-pause',
            label: 'Play/Pause',
            checked: this.visibility.playPause,
            action: () => this.toggleControl('playPause'),
          },
        ],
      },
    ];
  }
}

export const customPlaybackContextMenuManager = new CustomPlaybackContextMenuManager();
