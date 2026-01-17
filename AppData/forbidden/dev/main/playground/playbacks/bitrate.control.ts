/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export const setupBitratePopup = (
  buttonId: string,
  setPosition: (pos: { top: number; left: number }) => void,
  togglePopup: () => void
) => {
  const updatePosition = (button: HTMLElement) => {
    const rect = button.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 8,
      left: Math.min(rect.left + window.scrollX, window.innerWidth - 450)
    });
  };

  const button = document.getElementById(buttonId);
  if (!button) {
    console.warn(`[Bitrate Popup] Button with ID "${buttonId}" not found.`);
    return;
  }

  const handleClick = () => {
    updatePosition(button);
    togglePopup();
  };

  const handleResize = () => {
    updatePosition(button);
  };

  button.addEventListener('click', handleClick);
  window.addEventListener('resize', handleResize);

  return () => {
    button.removeEventListener('click', handleClick);
    window.removeEventListener('resize', handleResize);
  };
};
