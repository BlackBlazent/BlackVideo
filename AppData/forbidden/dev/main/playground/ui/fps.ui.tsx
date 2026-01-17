/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Activity, X, Zap, Cpu, Settings2, Info } from 'lucide-react';
import { FPSController, FPSMonitorData } from '../playbacks/fps.script';
import '../../../../../../src/styles/modals/fps.controller.css';

interface FrameRateUIProps {
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const fpsStandards = ["23.976", "24", "25", "29.97", "30", "50", "60", "90", "120", "144", "240"];

const FrameRateUI: React.FC<FrameRateUIProps> = ({ isVisible, onClose, position }) => {
  const [data, setData] = useState<FPSMonitorData>({ fps: 0, frameTime: 0, renderTime: 0, timestamp: 0 });
  const [isSyncEnabled, setIsSyncEnabled] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Subscribe to FPS updates
  useEffect(() => {
    const controller = FPSController.getInstance();
    const handleUpdate = (newData: FPSMonitorData) => setData(newData);
    
    controller.subscribe(handleUpdate);
    return () => controller.unsubscribe(handleUpdate);
  }, []);

  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // If the popup isn't visible, do nothing
    if (!isVisible) return;
    
    // Check if click is on the button or inside the popup
    if (target.closest('#frameRateController') || (popupRef.current && popupRef.current.contains(target))) {
      return;
    }
    
    onClose();
  };

  // Use capture phase to ensure we catch it before other logic
  window.addEventListener('mousedown', handleClickOutside);
  return () => window.removeEventListener('mousedown', handleClickOutside);
}, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div 
      ref={popupRef} 
      className="fps-engine-card"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        display: 'block',
        visibility: 'visible',
        opacity: 1
      }}
    >
      <div className="fps-header">
        <div className="header-label">
          <Activity size={14} className="text-accent" />
          <span>Performance Engine</span>
        </div>
        <button className="close-icon-btn" onClick={(e) => { e.stopPropagation(); onClose(); }}>
          <X size={14} />
        </button>
      </div>

      <div className="fps-stats-hero">
        <div className="fps-value-main">
          {data.fps.toFixed(1)} <span className="unit">FPS</span>
        </div>
        <div className="fps-sub-stats">
          <div className="stat-item">
            <Cpu size={10} /> <span>{data.renderTime.toFixed(1)}ms Render</span>
          </div>
          <div className="stat-item">
            <Zap size={10} /> <span>{data.frameTime.toFixed(1)}ms Frame</span>
          </div>
        </div>
      </div>

      <div className="sync-toggle-row" onClick={() => setIsSyncEnabled(!isSyncEnabled)}>
        <div className="toggle-info">
          <Settings2 size={12} />
          <span>Enable FPS Sync</span>
        </div>
        <div className={`mini-switch ${isSyncEnabled ? 'on' : ''}`}></div>
      </div>

      <div className="fps-grid-label">FPS Presets (UI Only)</div>
      <div className="fps-standards-grid">
        {fpsStandards.map((val) => (
          <div key={val} className="fps-preset-chip">
            <span className="chip-val">{val}</span>
            <input type="checkbox" checked={isSyncEnabled} disabled={!isSyncEnabled} readOnly />
          </div>
        ))}
      </div>

      <div className="fps-footer">
        <Info size={10} />
        <span>Hardware acceleration active</span>
      </div>
    </div>
  );
};

export default FrameRateUI;