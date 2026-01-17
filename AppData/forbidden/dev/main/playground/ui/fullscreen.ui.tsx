/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Monitor, Maximize, X, Zap, Keyboard } from 'lucide-react';

import '../../../../../../src/styles/modals/fullscreen.controller.css';

interface FullscreenUIProps {
  isVisible: boolean;
  onClose: () => void;
}

const FullscreenUI: React.FC<FullscreenUIProps> = ({ isVisible, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isInAppFullscreen, setIsInAppFullscreen] = useState(false);

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      const btn = document.getElementById('fullscreen-controller');
      if (isVisible && popupRef.current && !popupRef.current.contains(e.target as Node) && !btn?.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClose);
      return () => document.removeEventListener('mousedown', handleClose);
    }
  }, [isVisible, onClose]);

  // Sync state with FullscreenManager
  useEffect(() => {
    const checkState = () => {
      if (window.fullscreenManager) {
        setIsInAppFullscreen(window.fullscreenManager.isInAppFullscreen);
      }
    };
    if (isVisible) {
      checkState();
      const interval = setInterval(checkState, 500);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const toggleInApp = () => {
    if (!window.fullscreenManager) return;
    isInAppFullscreen ? window.fullscreenManager.exitInAppFullscreen() : window.fullscreenManager.enterInAppFullscreen();
    onClose();
  };

  const toggleNative = () => {
    window.fullscreenManager?.toggleNativeFullscreen();
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div ref={popupRef} id="fullscreen-popup" className="fullscreen-engine-card">
      {/* Header */}
      <div className="res-header">
        <div className="header-label">
          <Maximize size={14} className="text-accent" />
          <span>Fullscreen Engine</span>
        </div>
        <button className="close-icon-btn" onClick={onClose}><X size={14} /></button>
      </div>

      {/* Content */}
      <div className="res-content">
        <div className="res-section-label">
          <Zap size={10} />
          <span>Display Modes</span>
        </div>

        <div className="res-options-list">
          {/* Mode: In-App */}
          <div className={`res-option-row ${isInAppFullscreen ? 'active' : ''}`} onClick={toggleInApp}>
            <div className="res-info-main">
              <span className="res-text">In-App Fullscreen</span>
              <span className="res-notes">Optimized viewport window</span>
            </div>
            <div className="res-indicator">
              <Monitor size={14} className={isInAppFullscreen ? 'text-accent' : 'text-muted'} />
            </div>
          </div>

          {/* Mode: Native */}
          <div className="res-option-row" onClick={toggleNative}>
            <div className="res-info-main">
              <span className="res-text">Native Fullscreen</span>
              <span className="res-notes">Browser standard mode</span>
            </div>
            <div className="res-indicator">
              <Maximize size={14} className="text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Shortcuts */}
      {isInAppFullscreen && (
        <div className="res-footer-hint">
          <Keyboard size={10} />
          <span>Press <kbd>Shift + M</kbd> to exit</span>
        </div>
      )}
    </div>
  );
};

export default FullscreenUI;