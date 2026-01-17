/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// dependencies.ui.checker.ts

let popupEl: HTMLDivElement | null = null;
let progressBar: HTMLDivElement | null = null;
let messageEl: HTMLDivElement | null = null;
let titleEl: HTMLDivElement | null = null;

/**
 * Creates a generic status popup for any app dependency scan.
 */
export function showDependencyPopup(title: string, message: string, progress = 0): void {
    if (popupEl) hidePopup();

    popupEl = document.createElement('div');
    popupEl.className = "dependency-scan-popup"; // Use your global.css for styling
    popupEl.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 350px;
        padding: 20px; background: var(--background-dark);
        border: 1px solid var(--border-medium); border-radius: 12px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.6); z-index: 99999;
        font-family: sans-serif; color: var(--text-primary);
        backdrop-filter: blur(10px); animation: slideUp 0.4s ease;
    `;

    popupEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
            <div id="dep-icon" style="font-size: 20px;">🛡️</div>
            <div style="flex: 1">
                <div id="popup-title" style="font-weight: bold; font-size: 14px;">${title}</div>
                <div id="popup-message" style="font-size: 12px; color: var(--text-muted)">${message}</div>
            </div>
        </div>
        <div style="background: var(--surface-color); height: 6px; border-radius: 3px; overflow: hidden;">
            <div id="progress-bar" style="width: ${progress}%; height: 100%; background: var(--primary-blue); transition: width 0.3s;"></div>
        </div>
    `;

    document.body.appendChild(popupEl);
    progressBar = popupEl.querySelector('#progress-bar');
    messageEl = popupEl.querySelector('#popup-message');
    titleEl = popupEl.querySelector('#popup-title');
}

export function updateDependencyStatus(progress: number, message: string, icon?: string): void {
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (messageEl) messageEl.textContent = message;
    if (icon && popupEl) {
        const iconEl = popupEl.querySelector('#dep-icon');
        if (iconEl) iconEl.textContent = icon;
    }
}

export function hidePopup(): void {
    if (popupEl) {
        popupEl.style.opacity = '0';
        setTimeout(() => { popupEl?.remove(); popupEl = null; }, 400);
    }
}