/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export function initSearchPopupMechanism() {
    const popup = document.getElementById("search-popup-preview");
    const input = document.querySelector(".top-center input[type='search']") as HTMLInputElement;
    const searchButton = document.getElementById("globalSearch-btn");
    const container = document.querySelector(".top-center");
  
    if (!popup || !input || !searchButton || !container) return;
  
    const updatePopupPosition = () => {
      const rect = container.getBoundingClientRect();
      popup.style.position = "absolute";
      popup.style.top = `${rect.bottom + window.scrollY}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.width = `${rect.width}px`;
    };
  
    const showPopup = () => {
      popup.style.display = "block";
      updatePopupPosition();
    };
  
    const hidePopup = () => {
      popup.style.display = "none";
    };
  
  const performSearch = () => {
  const query = input.value.trim();
  if (query.length === 0) return;
  
  hidePopup(); // Hide the preview popup
  
  // Trigger the React Global Search Result Modal
  if ((window as any).triggerSearch) {
    (window as any).triggerSearch(query);
  }
};
  
    input.addEventListener("focus", showPopup);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  
    searchButton.addEventListener("click", performSearch);
  
    window.addEventListener("resize", updatePopupPosition);
    window.addEventListener("scroll", updatePopupPosition);
  
    // 🔽 Hide popup on click outside
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (!container.contains(target) && !popup.contains(target)) {
        hidePopup();
      }
    });
  }
  