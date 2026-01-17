/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useNavigate } from 'react-router-dom';

export const MenuPopup = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string, pageId: string) => {
    navigate(path, { replace: true });
    
    const allPages = [
      'PlaygroundArsenal', 'FolderArsenal', 'LibraryArsenal', 
      'ToolkitsArsenal', 'SettingsArsenal', 'ExtensionsArsenal', 
      'StreamingArsenal', 'AboutArsenal'
    ];
    
    // Hide all pages
    allPages.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.style.display = 'none';
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) selectedPage.style.display = 'block';

    // Hide menu popup
    const popup = document.getElementById("menu-popup-container");
    if (popup) popup.style.display = "none";
  };

  return (
    <div id="menu-popup-container" className="menu-popup-container" style={{ display: "none" }}>
      <div className="menu-popup-section">
        <div className="menu-popup-heading">Pages</div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/', 'PlaygroundArsenal')}>
          Playground <span className="menu-popup-note">(Default Main Player)</span>
        </div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/library', 'LibraryArsenal')}>
          Library
        </div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/streaming', 'StreamingArsenal')}>
          Network / Streaming
        </div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/toolkits', 'ToolkitsArsenal')}>
          Toolkits
        </div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/folder', 'FolderArsenal')}>
          Folders
        </div>
      </div>
      <div className="menu-popup-section">
        <div className="menu-popup-heading">System</div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/extensions', 'ExtensionsArsenal')}>
          Extensions
        </div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/settings', 'SettingsArsenal')}>
          Settings
        </div>
        <div className="menu-popup-item" onClick={() => handleNavigation('/about', 'AboutArsenal')}>
          About
        </div>
      </div>
    </div>
  );
};
