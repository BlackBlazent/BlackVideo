// logo.script.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
let isInitialized = false;

export function initLogoPopupMechanism() {
    // Prevent multiple initializations
    if (isInitialized) return;
    
    const popup = document.getElementById("blackvideo-third-party-services");
    const logo = document.querySelector(".blackvideo-logo");
  
    if (!popup || !logo) {
        // If elements aren't ready, try again after a short delay
        setTimeout(initLogoPopupMechanism, 100);
        return;
    }
  
    const updatePopupPosition = () => {
      const rect = logo.getBoundingClientRect();
      popup.style.position = "absolute";
      popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
      popup.style.left = `${rect.left + window.scrollX}px`;
      popup.style.zIndex = "999";
    };
  
    const showPopup = () => {
      popup.style.display = "block";
      updatePopupPosition();
    };
  
    const hidePopup = () => {
      popup.style.display = "none";
    };
  
    const togglePopup = (e: Event) => {
      e.stopPropagation();
      if (popup.style.display === "block") {
        hidePopup();
      } else {
        showPopup();
      }
    };
  
    // Remove any existing listeners first
    const newLogo = logo.cloneNode(true);
    logo.parentNode?.replaceChild(newLogo, logo);
    
    // Add click event listener
    newLogo.addEventListener("click", togglePopup);
  
    window.addEventListener("resize", updatePopupPosition);
    window.addEventListener("scroll", updatePopupPosition);
  
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (!popup.contains(target) && !newLogo.contains(target)) {
        hidePopup();
      }
    });

    isInitialized = true;
}
  