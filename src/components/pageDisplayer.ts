/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export const pageIds = {
    playground: 'PlaygroundArsenal',
    folder: 'FolderArsenal',
    library: 'LibraryArsenal',
    toolkits: 'ToolkitsArsenal',
    settings: 'SettingsArsenal',
    extensions: 'ExtensionsArsenal',
    streaming: 'StreamingArsenal',
    about: 'AboutArsenal'
};

export function hideAllPages() {
    Object.values(pageIds).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

export function showPage(pageId: string) {
    hideAllPages();
    const element = document.getElementById(pageId);
    if (element) {
        element.style.display = 'block';
    }
}

export function initPageDisplay() {
    // Show playground by default
    showPage(pageIds.playground);
}