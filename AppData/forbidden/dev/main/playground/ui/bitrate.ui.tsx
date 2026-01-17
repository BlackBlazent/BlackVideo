// File: bitrate.ui.tsx
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { Settings, X, Activity, SignalMedium } from 'lucide-react';

import '../../../../../../src/styles/modals/bitrate.controller.css'

interface BitrateUIProps {
  isVisible: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

const BitrateUI: React.FC<BitrateUIProps> = ({ isVisible, onClose, position }) => {
  if (!isVisible) return null;

  const bitrateOptions = [
    { label: 'Default', detail: 'Auto-optimized' },
    { label: '2160p', detail: '35-68 Mbps' },
    { label: '1440p', detail: '16-35 Mbps' },
    { label: '1080p', detail: '8-16 Mbps' },
    { label: '720p', detail: '5-12 Mbps' },
    { label: '480p', detail: '1.5-4 Mbps' },
    { label: '360p', detail: '1 Mbps' },
  ];

  return (
    <div
      className="bitrate-engine-card"
      style={{ 
        top: '70px', 
        left: Math.min(position.left, window.innerWidth - 300), // Narrower width for optimization
        position: 'fixed', 
        zIndex: 9999 
      }}
    >
      {/* Header */}
      <div className="bitrate-header">
        <div className="header-label">
          <SignalMedium size={14} className="text-accent" />
          <span>Bitrate Engine</span>
        </div>
        <button className="close-icon-btn" onClick={onClose}><X size={14} /></button>
      </div>

      {/* Future Update Note */}
      <div className="bitrate-note">
        <Activity size={12} />
        <span>Control available in future update</span>
      </div>

      {/* Bitrate List */}
      <div className="bitrate-list">
        {bitrateOptions.map((opt, index) => (
          <label key={opt.label} className="bitrate-item">
            <input type="radio" name="bitrate" defaultChecked={index === 0} />
            <div className="bitrate-info">
              <span className="bitrate-label">{opt.label}</span>
              <span className="bitrate-detail">{opt.detail}</span>
            </div>
            <div className="custom-radio-check"></div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BitrateUI;
