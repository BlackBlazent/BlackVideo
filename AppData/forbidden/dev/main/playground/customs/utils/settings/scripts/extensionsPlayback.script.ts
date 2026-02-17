/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * scripts/extensionsPlayback.script.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsible for disabling / enabling the Extensions bar
 * (#extension-built-ins / .second-icon-bar).
 *
 * Disable strategy
 * ─────────────────
 * 1. Inject a <style> tag that applies display:none!important to
 *    .second-icon-bar so the element is fully removed from layout.
 * 2. Set tabIndex=-1 and pointer-events:none on every button child so
 *    keyboard users and focus-traps cannot activate extension cards while hidden.
 * 3. Expand .video-container and inner <video> to max-height: 750px.
 *
 * Enable strategy
 * ────────────────
 * 1. Remove injected <style> tag.
 * 2. Restore tabIndex and pointer-events on button children.
 * 3. Restore .video-container and <video> to ORIGINAL_MAX_HEIGHT.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_ID = '__pb-extensions-disable';
const DISABLED_MAX_HEIGHT = '750px';
const ORIGINAL_MAX_HEIGHT = '400px';

const DISABLE_CSS = `
  .second-icon-bar {
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
 * Disables / re-enables keyboard and pointer access on every extension card
 * button inside the bar.
 */
function patchExtensionButtons(container: Element, disable: boolean): void {
  const buttons = container.querySelectorAll<HTMLButtonElement>('button');
  buttons.forEach((btn) => {
    if (disable) {
      btn.setAttribute('disabled', '');
      btn.setAttribute('aria-disabled', 'true');
      btn.setAttribute('data-original-tabindex', String(btn.tabIndex ?? 0));
      btn.setAttribute(
        'data-original-pe',
        btn.style.pointerEvents || ''
      );
      btn.tabIndex = -1;
      btn.style.pointerEvents = 'none';
    } else {
      btn.removeAttribute('disabled');
      btn.removeAttribute('aria-disabled');

      const originalTab = btn.getAttribute('data-original-tabindex');
      if (originalTab !== null) {
        btn.tabIndex = parseInt(originalTab, 10);
        btn.removeAttribute('data-original-tabindex');
      }

      const originalPE = btn.getAttribute('data-original-pe');
      if (originalPE !== null) {
        btn.style.pointerEvents = originalPE;
        btn.removeAttribute('data-original-pe');
      }
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
 * Disables the extensions playback bar.
 * - Hides .second-icon-bar via injected CSS
 * - Disables all button children
 * - Expands video container to DISABLED_MAX_HEIGHT
 */
export function disableExtensionsPlayback(): void {
  const bar = document.querySelector<HTMLElement>('.second-icon-bar');
  if (!bar) {
    console.warn('[ExtensionsPlayback] .second-icon-bar not found in the DOM.');
    return;
  }

  injectStyle(STYLE_ID, DISABLE_CSS);
  patchExtensionButtons(bar, true);
  setContainerHeight(DISABLED_MAX_HEIGHT);

  console.info('[ExtensionsPlayback] Disabled.');
}

/**
 * Re-enables the extensions playback bar.
 * - Removes injected CSS
 * - Restores all button children
 * - Resets video container to ORIGINAL_MAX_HEIGHT
 */
export function enableExtensionsPlayback(): void {
  const bar = document.querySelector<HTMLElement>('.second-icon-bar');

  removeStyle(STYLE_ID);
  if (bar) patchExtensionButtons(bar, false);
  setContainerHeight(ORIGINAL_MAX_HEIGHT);

  console.info('[ExtensionsPlayback] Enabled.');
}