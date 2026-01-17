// menu.script.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { showPage, pageIds } from '../../../../../../src/components/pageDisplayer';

export function initMenuPopupMechanism() {
    const popup = document.getElementById("menu-popup-container");
    const menuBtn = document.getElementById("menuAction-btn");
    const menuContainer = document.querySelector(".menu-btn");
  
    if (!popup || !menuBtn || !menuContainer) return;

    const handlePageChange = (pageId: string) => {
        showPage(pageId);
    };

    window.addEventListener('popstate', () => {
        const path = window.location.pathname;
        switch(path) {
            case '/':
                handlePageChange(pageIds.playground);
                break;
            case '/folder':
                handlePageChange(pageIds.folder);
                break;
            case '/library':
                handlePageChange(pageIds.library);
                break;
            case '/toolkits':
                handlePageChange(pageIds.toolkits);
                break;
            case '/settings':
                handlePageChange(pageIds.settings);
                break;
            case '/extensions':
                handlePageChange(pageIds.extensions);
                break;
            case '/streaming':
                handlePageChange(pageIds.streaming);
                break;
            case '/about':
                handlePageChange(pageIds.about);
                break;
        }
    });
  
    const updatePopupPosition = () => {
      const rect = menuContainer.getBoundingClientRect();
      popup.style.position = "absolute";
      popup.style.top = `${rect.bottom + window.scrollY}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.minWidth = `180px`;
      popup.style.zIndex = "999";
    };
  
    const showPopup = () => {
      popup.style.display = "block";
      updatePopupPosition();
    };
  
    const hidePopup = () => {
      popup.style.display = "none";
    };
  
    const togglePopup = () => {
      if (popup.style.display === "block") {
        hidePopup();
      } else {
        showPopup();
      }
    };
  
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent document click from triggering
      togglePopup();
    });
  
    window.addEventListener("resize", updatePopupPosition);
    window.addEventListener("scroll", updatePopupPosition);
  
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (!menuContainer.contains(target) && !popup.contains(target)) {
        hidePopup();
      }
    });
  }
