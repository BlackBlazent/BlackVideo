/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * scripts/index.PlaybackIntegration.script.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Central registration / orchestration hub for all Playback Integration nodes.
 *
 * Responsibilities
 * ─────────────────
 * 1. Re-exports every individual playback disable/enable function so
 *    consuming code has a single import path.
 * 2. Owns the Playlist disable/enable logic (simple CSS injection against
 *    .thumbnails-scroll + expanding the video container to 800px).
 * 3. Exposes applyPlaybackState() — a single call that syncs every
 *    subsystem to a given PlaybackSettings snapshot.  Useful on mount
 *    to restore persisted settings without calling each function manually.
 */

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { disableCommonPlayback, enableCommonPlayback, } from './commonPlayback.script';

export { disableAccessoriesPlayback, enableAccessoriesPlayback, } from './accessoriesPlayback.script';

export { disableExtensionsPlayback, enableExtensionsPlayback, } from './extensionsPlayback.script';

// ─── Playlist ─────────────────────────────────────────────────────────────────

const PLAYLIST_STYLE_ID = '__pb-playlist-disable';
const PLAYLIST_DISABLED_MAX_HEIGHT = '800px';
const PLAYLIST_ORIGINAL_MAX_HEIGHT = '400px';

const PLAYLIST_DISABLE_CSS = `
  .thumbnails-scroll {
    display: none !important;
    pointer-events: none !important;
  }
`;

function injectStyle(id: string, css: string): void {
  let tag = document.getElementById(id) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = id;
    document.head.appendChild(tag);
  }
  tag.textContent = css;
}

function removeStyle(id: string): void {
  const tag = document.getElementById(id);
  if (tag) tag.remove();
}

/**
 * Disables all interactive controls inside the playlist container
 * (scroll buttons, playlist cards, etc.) so they cannot be triggered
 * while the bar is hidden.
 */
function patchPlaylistInteractives(
  container: Element,
  disable: boolean
): void {
  const interactives =
    container.querySelectorAll<HTMLElement>(
      'button, [role="button"], [tabindex]'
    );
  interactives.forEach((el) => {
    if (disable) {
      el.setAttribute('data-original-tabindex', String((el as any).tabIndex ?? 0));
      el.setAttribute('data-original-pe', (el as HTMLElement).style.pointerEvents || '');
      (el as any).tabIndex = -1;
      (el as HTMLElement).style.pointerEvents = 'none';
      if (el.tagName === 'BUTTON') {
        (el as HTMLButtonElement).disabled = true;
        el.setAttribute('aria-disabled', 'true');
      }
    } else {
      const originalTab = el.getAttribute('data-original-tabindex');
      if (originalTab !== null) {
        (el as any).tabIndex = parseInt(originalTab, 10);
        el.removeAttribute('data-original-tabindex');
      }
      const originalPE = el.getAttribute('data-original-pe');
      if (originalPE !== null) {
        (el as HTMLElement).style.pointerEvents = originalPE;
        el.removeAttribute('data-original-pe');
      }
      if (el.tagName === 'BUTTON') {
        (el as HTMLButtonElement).disabled = false;
        el.removeAttribute('aria-disabled');
      }
    }
  });
}

function setContainerHeight(height: string): void {
  const container = document.querySelector<HTMLElement>('.video-container');
  const video = document.querySelector<HTMLElement>(
    '.video-container .video-player-theater-stage, .video-container video'
  );

  if (container) container.style.setProperty('max-height', height, 'important');
  if (video) video.style.setProperty('max-height', height, 'important');
}

/**
 * Disables the playlist (.thumbnails-scroll).
 * - Hides the playlist via injected CSS
 * - Disables all interactive children
 * - Expands video container to 800px
 */
export function disablePlaylistPlayback(): void {
  const playlist = document.querySelector<HTMLElement>('.thumbnails-scroll');
  if (!playlist) {
    console.warn('[PlaylistPlayback] .thumbnails-scroll not found in the DOM.');
    return;
  }

  injectStyle(PLAYLIST_STYLE_ID, PLAYLIST_DISABLE_CSS);
  patchPlaylistInteractives(playlist, true);
  setContainerHeight(PLAYLIST_DISABLED_MAX_HEIGHT);

  console.info('[PlaylistPlayback] Disabled.');
}

/**
 * Re-enables the playlist.
 * - Removes injected CSS
 * - Restores all interactive children
 * - Resets video container to 400px
 */
export function enablePlaylistPlayback(): void {
  const playlist = document.querySelector<HTMLElement>('.thumbnails-scroll');

  removeStyle(PLAYLIST_STYLE_ID);
  if (playlist) patchPlaylistInteractives(playlist, false);
  setContainerHeight(PLAYLIST_ORIGINAL_MAX_HEIGHT);

  console.info('[PlaylistPlayback] Enabled.');
}

// ─── Unified State Applicator ─────────────────────────────────────────────────

import {
  disableCommonPlayback,
  enableCommonPlayback,
} from './commonPlayback.script';
import {
  disableAccessoriesPlayback,
  enableAccessoriesPlayback,
} from './accessoriesPlayback.script';
import {
  disableExtensionsPlayback,
  enableExtensionsPlayback,
} from './extensionsPlayback.script';

export interface PlaybackSettings {
  disableCommon: boolean;
  disableAccessories: boolean;
  disableExtension: boolean;
  disablePlaylist: boolean;
}

/**
 * Syncs all playback subsystems to the provided settings snapshot in one call.
 * Ideal for restoring persisted preferences on component mount.
 *
 * @example
 * applyPlaybackState({
 *   disableCommon: true,
 *   disableAccessories: false,
 *   disableExtension: false,
 *   disablePlaylist: true,
 * });
 */
export function applyPlaybackState(settings: PlaybackSettings): void {
  settings.disableCommon
    ? disableCommonPlayback()
    : enableCommonPlayback();

  settings.disableAccessories
    ? disableAccessoriesPlayback()
    : enableAccessoriesPlayback();

  settings.disableExtension
    ? disableExtensionsPlayback()
    : enableExtensionsPlayback();

  settings.disablePlaylist
    ? disablePlaylistPlayback()
    : enablePlaylistPlayback();

  console.info('[PlaybackIntegration] State applied:', settings);
}