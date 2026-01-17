/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export function initUserPopup() {
    const button = document.getElementById("userProfile-btn");
    const popup = document.getElementById("user-popup-portal");
  
    if (!button || !popup) return;
  
    const toggle = () => {
      const isVisible = popup.style.display === "block";
      popup.style.display = isVisible ? "none" : "block";
      if (!isVisible) updatePosition();
    };
  
    const updatePosition = () => {
      const rect = button.getBoundingClientRect();
      const popupWidth = popup.offsetWidth;
  
      popup.style.position = "absolute";
      popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
  
      // Place to the left if it would overflow on the right
      let left = rect.left + window.scrollX;
      if (left + popupWidth > window.innerWidth) {
        left = window.innerWidth - popupWidth - 16; // 16px margin
      }
  
      popup.style.left = `${left}px`;
    };
  
    const handleClickOutside = (e: MouseEvent) => {
      if (!popup.contains(e.target as Node) && !button.contains(e.target as Node)) {
        popup.style.display = "none";
      }
    };
  
    button.addEventListener("click", toggle);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    document.addEventListener("mousedown", handleClickOutside);
  }
  