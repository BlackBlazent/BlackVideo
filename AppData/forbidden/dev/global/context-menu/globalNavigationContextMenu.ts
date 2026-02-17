/**
 * Global Navigation Context Menu Logic
 * Handles context menu for the main navigation header
 */

import { ContextMenuOption } from './indexContextMenu';

export interface GlobalNavigationSettings {
  toolbars: {
    authorizationAccounts: boolean;
    menuBar: boolean;
    globalSearch: boolean;
    account: boolean;
    notifications: boolean;
    settings: boolean;
  };
  searchBarDesign: 'neighbor' | 'material' | 'minimalist' | 'compact' | 'expanded';
  transparency: number;
}

const defaultSettings: GlobalNavigationSettings = {
  toolbars: {
    authorizationAccounts: true,
    menuBar: true,
    globalSearch: true,
    account: true,
    notifications: true,
    settings: true,
  },
  searchBarDesign: 'neighbor',
  transparency: 100,
};

export class GlobalNavigationContextMenuManager {
  private settings: GlobalNavigationSettings;
  private listeners: ((settings: GlobalNavigationSettings) => void)[] = [];

  constructor(initialSettings?: Partial<GlobalNavigationSettings>) {
    this.settings = {
      ...defaultSettings,
      ...initialSettings,
    };
  }

  getSettings(): GlobalNavigationSettings {
    return { ...this.settings };
  }

  updateToolbarVisibility(toolbar: keyof GlobalNavigationSettings['toolbars'], visible: boolean) {
    this.settings.toolbars[toolbar] = visible;
    this.notifyListeners();
  }

  updateSearchBarDesign(design: GlobalNavigationSettings['searchBarDesign']) {
    this.settings.searchBarDesign = design;
    this.notifyListeners();
  }

  updateTransparency(value: number) {
    this.settings.transparency = Math.max(0, Math.min(100, value));
    this.notifyListeners();
  }

  restoreDefaults() {
    this.settings = { ...defaultSettings };
    this.notifyListeners();
  }

  subscribe(listener: (settings: GlobalNavigationSettings) => void) {
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
        id: 'toolbars',
        label: 'Toolbars',
        submenu: [
          {
            id: 'show-hide-toolbars',
            label: 'Show/Hide Toolbars',
            submenu: [
              {
                id: 'add-toolbars',
                label: 'Add Toolbars',
                disabled: true,
              },
              {
                id: 'authorization-accounts',
                label: 'Authorization Accounts',
                checked: this.settings.toolbars.authorizationAccounts,
                action: () => this.updateToolbarVisibility('authorizationAccounts', !this.settings.toolbars.authorizationAccounts),
              },
              {
                id: 'menu-bar',
                label: 'Menu bar',
                checked: this.settings.toolbars.menuBar,
                action: () => this.updateToolbarVisibility('menuBar', !this.settings.toolbars.menuBar),
              },
              {
                id: 'global-search',
                label: 'Global search',
                checked: this.settings.toolbars.globalSearch,
                action: () => this.updateToolbarVisibility('globalSearch', !this.settings.toolbars.globalSearch),
              },
              {
                id: 'account',
                label: 'Account',
                checked: this.settings.toolbars.account,
                action: () => this.updateToolbarVisibility('account', !this.settings.toolbars.account),
              },
              {
                id: 'notifications',
                label: 'Notifications',
                checked: this.settings.toolbars.notifications,
                action: () => this.updateToolbarVisibility('notifications', !this.settings.toolbars.notifications),
              },
              {
                id: 'settings',
                label: 'Settings',
                checked: this.settings.toolbars.settings,
                action: () => this.updateToolbarVisibility('settings', !this.settings.toolbars.settings),
              },
            ],
          },
        ],
      },
      {
        id: 'customize-search-bar',
        label: 'Customize Search Bar',
        submenu: [
          {
            id: 'restore-default',
            label: 'Restore default',
            action: () => this.restoreDefaults(),
          },
          { id: 'divider-1', label: '', divider: true },
          {
            id: 'neighbor-design',
            label: 'Neighbor Design',
            checked: this.settings.searchBarDesign === 'neighbor',
            action: () => this.updateSearchBarDesign('neighbor'),
          },
          {
            id: 'material-design',
            label: 'Material Design',
            checked: this.settings.searchBarDesign === 'material',
            action: () => this.updateSearchBarDesign('material'),
          },
          {
            id: 'minimalist-design',
            label: 'Minimalist Design',
            checked: this.settings.searchBarDesign === 'minimalist',
            action: () => this.updateSearchBarDesign('minimalist'),
          },
          {
            id: 'compact-design',
            label: 'Compact design',
            checked: this.settings.searchBarDesign === 'compact',
            action: () => this.updateSearchBarDesign('compact'),
          },
          {
            id: 'expanded-design',
            label: 'Expanded design',
            checked: this.settings.searchBarDesign === 'expanded',
            action: () => this.updateSearchBarDesign('expanded'),
          },
        ],
      },
      {
        id: 'transparency',
        label: `Transparency (${this.settings.transparency}%)`,
        disabled: true,
      },
    ];
  }
}

export const globalNavigationContextMenuManager = new GlobalNavigationContextMenuManager();
