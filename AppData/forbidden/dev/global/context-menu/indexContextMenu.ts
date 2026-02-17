/**
 * Context Menu Index
 * Central registry for all context menu components
 */

export { GlobalNavigationContextMenu } from './components/globalNavigationContextMenu';
export { PlaygroundCommonMainPlaybackContextMenu } from './components/playgroundCommonMainPlaybackContextMenu';
export { PlaygroundCustomPlaybackContextMenu } from './components/playgroundCustomPlaybackContextMenu';
export { PlaygroundExtensionPlaybackContextMenu } from './components/playgroundExtensionPlaybackContextMenu';
export { PlaygroundPlaybackAccessoriesContextMenu } from './components/playgroundPlaybackAccessoriesContextMenu';
export { PlaygroundVideoTheaterStageContextMenu } from './components/playgroundVideoTheaterStageContextMenu';

// Context menu utilities
export interface ContextMenuOption {
  id: string;
  label: string;
  checked?: boolean;
  disabled?: boolean;
  submenu?: ContextMenuOption[];
  action?: () => void;
  divider?: boolean;
  icon?: string;
}

export interface ContextMenuPosition {
  x: number;
  y: number;
}

/**
 * Prevent default context menu
 */
export const preventDefaultContextMenu = (e: MouseEvent) => {
  e.preventDefault();
};

/**
 * Calculate context menu position to keep it within viewport
 */
export const calculateMenuPosition = (
  x: number,
  y: number,
  menuWidth: number,
  menuHeight: number
): ContextMenuPosition => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let posX = x;
  let posY = y;

  // Adjust horizontal position
  if (x + menuWidth > viewportWidth) {
    posX = viewportWidth - menuWidth - 10;
  }

  // Adjust vertical position
  if (y + menuHeight > viewportHeight) {
    posY = viewportHeight - menuHeight - 10;
  }

  return { x: Math.max(10, posX), y: Math.max(10, posY) };
};
