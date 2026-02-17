/**
 * Playground Playback Accessories Context Menu Logic
 * Handles context menu for accessories built-ins (hexagon bar)
 */

import { ContextMenuOption } from './indexContextMenu';

export interface AccessoriesVisibility {
  linkDeployer: boolean;
  aiChat: boolean;
  filters: boolean;
  magnifyingGlass: boolean;
  screenCapture: boolean;
  recorder: boolean;
  videoOCR: boolean;
}

export type IconShape = 'hexagon' | 'box' | 'triangle' | 'pentagon' | 'circle';

export interface AccessoriesSettings {
  visibility: AccessoriesVisibility;
  iconShape: IconShape;
}

const defaultSettings: AccessoriesSettings = {
  visibility: {
    linkDeployer: true,
    aiChat: true,
    filters: true,
    magnifyingGlass: true,
    screenCapture: true,
    recorder: true,
    videoOCR: true,
  },
  iconShape: 'hexagon',
};

export class AccessoriesContextMenuManager {
  private settings: AccessoriesSettings;
  private listeners: ((settings: AccessoriesSettings) => void)[] = [];

  constructor(initialSettings?: Partial<AccessoriesSettings>) {
    this.settings = {
      ...defaultSettings,
      ...initialSettings,
      visibility: {
        ...defaultSettings.visibility,
        ...(initialSettings?.visibility || {}),
      },
    };
  }

  getSettings(): AccessoriesSettings {
    return { ...this.settings, visibility: { ...this.settings.visibility } };
  }

  toggleAccessory(accessory: keyof AccessoriesVisibility) {
    this.settings.visibility[accessory] = !this.settings.visibility[accessory];
    this.notifyListeners();
  }

  setIconShape(shape: IconShape) {
    this.settings.iconShape = shape;
    this.notifyListeners();
  }

  restoreDefaults() {
    this.settings = { ...defaultSettings, visibility: { ...defaultSettings.visibility } };
    this.notifyListeners();
  }

  subscribe(listener: (settings: AccessoriesSettings) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.settings));
  }

  getContextMenuOptions(): ContextMenuOption[] {
    return [
      {
        id: 'show-hide-playbacks',
        label: 'Show/Hide Playbacks',
        submenu: [
          {
            id: 'link-deployer',
            label: 'Link Deployer',
            checked: this.settings.visibility.linkDeployer,
            action: () => this.toggleAccessory('linkDeployer'),
          },
          {
            id: 'ai-chat',
            label: 'AI Chat',
            checked: this.settings.visibility.aiChat,
            action: () => this.toggleAccessory('aiChat'),
          },
          {
            id: 'filters',
            label: 'Filters',
            checked: this.settings.visibility.filters,
            action: () => this.toggleAccessory('filters'),
          },
          {
            id: 'magnifying-glass',
            label: 'Magnifying Glass',
            checked: this.settings.visibility.magnifyingGlass,
            action: () => this.toggleAccessory('magnifyingGlass'),
          },
          {
            id: 'screen-capture',
            label: 'Screen Capture',
            checked: this.settings.visibility.screenCapture,
            action: () => this.toggleAccessory('screenCapture'),
          },
          {
            id: 'recorder',
            label: 'Recorder',
            checked: this.settings.visibility.recorder,
            action: () => this.toggleAccessory('recorder'),
          },
          {
            id: 'video-ocr',
            label: 'Video OCR',
            checked: this.settings.visibility.videoOCR,
            action: () => this.toggleAccessory('videoOCR'),
          },
        ],
      },
      {
        id: 'customize-icons',
        label: 'Customize Icons',
        submenu: [
          {
            id: 'restore-defaults',
            label: 'Restore Defaults',
            action: () => this.restoreDefaults(),
          },
          { id: 'divider-1', label: '', divider: true },
          {
            id: 'hexagon',
            label: 'Hexagon',
            checked: this.settings.iconShape === 'hexagon',
            action: () => this.setIconShape('hexagon'),
          },
          {
            id: 'box',
            label: 'Box',
            checked: this.settings.iconShape === 'box',
            action: () => this.setIconShape('box'),
          },
          {
            id: 'triangle',
            label: 'Triangle',
            checked: this.settings.iconShape === 'triangle',
            action: () => this.setIconShape('triangle'),
          },
          {
            id: 'pentagon',
            label: 'Pentagon',
            checked: this.settings.iconShape === 'pentagon',
            action: () => this.setIconShape('pentagon'),
          },
          {
            id: 'circle',
            label: 'Circle',
            checked: this.settings.iconShape === 'circle',
            action: () => this.setIconShape('circle'),
          },
        ],
      },
    ];
  }
}

export const accessoriesContextMenuManager = new AccessoriesContextMenuManager();
