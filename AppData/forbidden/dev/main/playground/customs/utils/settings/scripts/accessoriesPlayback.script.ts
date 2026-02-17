/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * scripts/accessoriesPlayback.script.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsible for disabling / enabling the Accessories bar
 * (#accessories-built-ins / .hexagon-bar).
 *
 * Disable strategy
 * ─────────────────
 * 1. Inject a <style> tag that applies display:none!important to .hexagon-bar.
 * 2. Remove all click/pointer-events on the inner hexagon items so no
 *    handler fires while hidden (uses a capture-phase abort-signal approach
 *    via a data attribute flag to remain framework-agnostic).
 * 3. Expand .video-container and inner <video> to max-height: 700px.
 *
 * Enable strategy
 * ────────────────
 * 1. Remove injected <style> tag.
 * 2. Restore pointer interaction.
 * 3. Restore .video-container and <video> to their natural max-height.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_ID = '__pb-accessories-disable';
const DISABLED_MAX_HEIGHT = '700px';
const ORIGINAL_MAX_HEIGHT = '400px';

const DISABLE_CSS = `
  .hexagon-bar {
    display: none !important;
    pointer-events: none !important;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
 * Strips pointer-events from every direct hexagon child so that even if
 * the CSS is overridden externally no accidental clicks reach the handlers.
 */
function patchHexagons(container: Element, disable: boolean): void {
  const hexagons =
    container.querySelectorAll<HTMLElement>('.hexagon, .hexagon-inner');
  hexagons.forEach((el) => {
    if (disable) {
      el.setAttribute('data-pe-original', el.style.pointerEvents || '');
      el.style.pointerEvents = 'none';
    } else {
      const original = el.getAttribute('data-pe-original') ?? '';
      el.style.pointerEvents = original;
      el.removeAttribute('data-pe-original');
    }
  });
}

/** Adjusts the video container and inner video element max-height. */
function setContainerHeight(height: string): void {
  const container = document.querySelector<HTMLElement>('.video-container');
  const video = document.querySelector<HTMLElement>(
    '.video-container .video-player-theater-stage, .video-container video'
  );

  if (container) container.style.setProperty('max-height', height, 'important');
  if (video) video.style.setProperty('max-height', height, 'important');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Disables the accessories playback bar.
 * - Hides .hexagon-bar via injected CSS
 * - Removes pointer-events from every hexagon item
 * - Expands video container to DISABLED_MAX_HEIGHT
 */
export function disableAccessoriesPlayback(): void {
  const bar = document.querySelector<HTMLElement>('.hexagon-bar');
  if (!bar) {
    console.warn('[AccessoriesPlayback] .hexagon-bar not found in the DOM.');
    return;
  }

  injectStyle(STYLE_ID, DISABLE_CSS);
  patchHexagons(bar, true);
  setContainerHeight(DISABLED_MAX_HEIGHT);

  console.info('[AccessoriesPlayback] Disabled.');
}

/**
 * Re-enables the accessories playback bar.
 * - Removes injected CSS
 * - Restores pointer-events on hexagon items
 * - Resets video container to ORIGINAL_MAX_HEIGHT
 */
export function enableAccessoriesPlayback(): void {
  const bar = document.querySelector<HTMLElement>('.hexagon-bar');

  removeStyle(STYLE_ID);
  if (bar) patchHexagons(bar, false);
  setContainerHeight(ORIGINAL_MAX_HEIGHT);

  console.info('[AccessoriesPlayback] Enabled.');
}