// search.core.ui.tsx
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export default function SearchPreviewPopup() {
    return (
      <div id="search-popup-preview" className="search-popup-container" style={{ display: 'none' }}>
        <div className="search-popup-section">
          <div className="search-popup-heading">Videos</div>
          <div className="search-popup-item">
            <img src="/assets/defaults/default_video.png" alt="Video Thumbnail" className="search-popup-thumb" />
            <span className="search-popup-text">Sample Video.mp4</span>
          </div>
        </div>
  
        <div className="search-popup-section">
          <div className="search-popup-heading">Others</div>
          <div className="search-popup-item">
            <img src="/assets/systems/txt.png" alt="Document Icon" className="search-popup-icon" />
            <span className="search-popup-text">notes.txt</span>
          </div>
          <div className="search-popup-item">
            <img src="/assets/systems/subtitles.png" alt="Document Icon" className="search-popup-icon" />
            <span className="search-popup-text">iron-man-3-subtitle.srt</span>
          </div>
        </div>
  
        <div className="search-popup-section">
          <div className="search-popup-heading">App Settings</div>
          <div className="search-popup-item">
            <img src="/assets/systems/com.settings.png" alt="Settings Icon" className="search-popup-icon" />
            <span className="search-popup-text">Display Settings</span>
          </div>
        </div>
      </div>
    );
  }
  