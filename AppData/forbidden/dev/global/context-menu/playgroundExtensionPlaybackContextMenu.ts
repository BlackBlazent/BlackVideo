/**
 * Playground Extension Playback Context Menu Logic
 * Handles context menu for extension built-ins
 */

import { ContextMenuOption } from './indexContextMenu';

export interface Extension {
  id: string;
  name: string;
  visible: boolean;
  iconPath: string;
  createdAt: Date;
  rating: number;
}

export type SortBy = 'name' | 'created' | 'ratings';

export interface ExtensionSettings {
  extensions: Extension[];
  sortBy: SortBy;
}

export class ExtensionContextMenuManager {
  private settings: ExtensionSettings;
  private listeners: ((settings: ExtensionSettings) => void)[] = [];

  constructor(initialExtensions?: Extension[]) {
    this.settings = {
      extensions: initialExtensions || [],
      sortBy: 'created',
    };
  }

  getSettings(): ExtensionSettings {
    return {
      extensions: [...this.settings.extensions],
      sortBy: this.settings.sortBy,
    };
  }

  toggleExtensionVisibility(extensionId: string) {
    const extension = this.settings.extensions.find(ext => ext.id === extensionId);
    if (extension) {
      extension.visible = !extension.visible;
      this.notifyListeners();
    }
  }

  setSortBy(sortBy: SortBy) {
    this.settings.sortBy = sortBy;
    this.sortExtensions();
    this.notifyListeners();
  }

  addExtension(extension: Extension) {
    this.settings.extensions.push(extension);
    this.sortExtensions();
    this.notifyListeners();
  }

  removeExtension(extensionId: string) {
    this.settings.extensions = this.settings.extensions.filter(ext => ext.id !== extensionId);
    this.notifyListeners();
  }

  private sortExtensions() {
    switch (this.settings.sortBy) {
      case 'name':
        this.settings.extensions.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'created':
        this.settings.extensions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'ratings':
        this.settings.extensions.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  subscribe(listener: (settings: ExtensionSettings) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.settings));
  }

  getContextMenuOptions(): ContextMenuOption[] {
    const extensionOptions: ContextMenuOption[] = this.settings.extensions.map(ext => ({
      id: ext.id,
      label: ext.name,
      checked: ext.visible,
      action: () => this.toggleExtensionVisibility(ext.id),
    }));

    if (extensionOptions.length === 0) {
      extensionOptions.push({
        id: 'no-extensions',
        label: 'No extensions registered',
        disabled: true,
      });
    }

    return [
      {
        id: 'show-hide-extensions',
        label: 'Show/Hide Registered Extensions',
        submenu: extensionOptions,
      },
      {
        id: 'sort',
        label: 'Sort',
        submenu: [
          {
            id: 'sort-by-name',
            label: 'By name',
            checked: this.settings.sortBy === 'name',
            action: () => this.setSortBy('name'),
          },
          {
            id: 'sort-by-created',
            label: 'Created',
            checked: this.settings.sortBy === 'created',
            action: () => this.setSortBy('created'),
          },
          {
            id: 'sort-by-ratings',
            label: 'Ratings',
            checked: this.settings.sortBy === 'ratings',
            action: () => this.setSortBy('ratings'),
          },
        ],
      },
    ];
  }
}

// Initialize with sample extension
export const extensionContextMenuManager = new ExtensionContextMenuManager([
  {
    id: 'computer-vision',
    name: 'Computer Vision',
    visible: true,
    iconPath: '/AppRegistry/extensions/compter-vision/icon.png',
    createdAt: new Date('2024-01-15'),
    rating: 4.5,
  },
]);
