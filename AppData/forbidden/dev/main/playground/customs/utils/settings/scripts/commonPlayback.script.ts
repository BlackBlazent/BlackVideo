/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * scripts/commonPlayback.script.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Responsible for disabling / enabling the Common playback bar
 * (#videoFullPackPlaybackControls / .controls-bar).
 *
 * Disable strategy
 * ─────────────────
 * 1. Inject a <style> tag with id="__pb-common-disable" that applies
 *    display:none!important to .controls-bar so the element is removed
 *    from layout and receives no pointer events.
 * 2. Patch every interactive element inside the bar with the HTML attribute
 *    `disabled` and `aria-disabled="true"` so no keyboard / screen-reader
 *    path can trigger the underlying handlers even while hidden.
 * 3. Expand .video-container and the inner <video> to max-height: 600px.
 *
 * Enable strategy
 * ────────────────
 * 1. Remove the injected <style> tag — restores original CSS cascade.
 * 2. Remove all `disabled` / `aria-disabled` patches.
 * 3. Restore .video-container and <video> to their original max-height.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_ID = '__pb-common-disable';
const DISABLED_MAX_HEIGHT = '600px';
const ORIGINAL_MAX_HEIGHT = '400px';

// CSS injected when common playback is disabled
const DISABLE_CSS = `
  .controls-bar {
    display: none !important;
    pointer-events: none !important;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Injects or updates the disable <style> block. */
function injectStyle(id: string, css: string): void {
  let tag = document.getElementById(id) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement('style');
    tag.id = id;
    document.head.appendChild(tag);
  }
  tag.textContent = css;
}

/** Removes the disable <style> block if it exists. */
function removeStyle(id: string): void {
  const tag = document.getElementById(id);
  if (tag) tag.remove();
}

/**
 * Patches every button / input inside the controls bar with `disabled`
 * and `aria-disabled` so native browser focus/keyboard handling is blocked.
 */
function patchInteractiveElements(container: Element, disable: boolean): void {
  const interactive = container.querySelectorAll<
    HTMLButtonElement | HTMLInputElement | HTMLSelectElement
  >('button, input, select, textarea');

  interactive.forEach((el) => {
    if (disable) {
      el.setAttribute('disabled', '');
      el.setAttribute('aria-disabled', 'true');
      // Persist original tabIndex to restore later
      if (!el.hasAttribute('data-original-tabindex')) {
        el.setAttribute(
          'data-original-tabindex',
          String(el.tabIndex ?? 0)
        );
      }
      el.tabIndex = -1;
    } else {
      el.removeAttribute('disabled');
      el.removeAttribute('aria-disabled');
      const original = el.getAttribute('data-original-tabindex');
      if (original !== null) {
        el.tabIndex = parseInt(original, 10);
        el.removeAttribute('data-original-tabindex');
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
 * Disables the common playback controls bar.
 * - Hides .controls-bar via injected CSS
 * - Disables all interactive children
 * - Expands video container to DISABLED_MAX_HEIGHT
 */
export function disableCommonPlayback(): void {
  const bar = document.querySelector<HTMLElement>('.controls-bar');
  if (!bar) {
    console.warn('[CommonPlayback] .controls-bar not found in the DOM.');
    return;
  }

  injectStyle(STYLE_ID, DISABLE_CSS);
  patchInteractiveElements(bar, true);
  setContainerHeight(DISABLED_MAX_HEIGHT);

  console.info('[CommonPlayback] Disabled.');
}

/**
 * Re-enables the common playback controls bar.
 * - Removes injected CSS (restores original styles)
 * - Re-enables all interactive children
 * - Resets video container to ORIGINAL_MAX_HEIGHT
 */
export function enableCommonPlayback(): void {
  const bar = document.querySelector<HTMLElement>('.controls-bar');

  removeStyle(STYLE_ID);
  if (bar) patchInteractiveElements(bar, false);
  setContainerHeight(ORIGINAL_MAX_HEIGHT);

  console.info('[CommonPlayback] Enabled.');
}