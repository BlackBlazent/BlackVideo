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
import { 
  X, Timer, ChevronLeft, ChevronRight, 
  RotateCcw, RotateCw, FastForward 
} from 'lucide-react';

import '../../../../../../src/styles/modals/skip.timeline.css'

interface SkipControlsUIProps {
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

// Condensed presets: Just the numeric values
const skipPresets = [5, 10, 15, 30, 60];

export const SkipControlsUI: React.FC<SkipControlsUIProps> = ({
  isVisible,
  onClose,
  position
}) => {
  const [customValue, setCustomValue] = useState<string>('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose();
    };
    if (isVisible) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, onClose]);

  const triggerSkip = (duration: number) => {
    import('../playbacks/skips.control').then(({ SkipControls }) => {
      SkipControls.getInstance().skipBySeconds(duration);
    });
  };

  const handleCustomAction = (dir: 'f' | 'b') => {
    const val = parseFloat(customValue);
    if (!isNaN(val) && val > 0) triggerSkip(dir === 'f' ? val : -val);
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={popupRef} 
      className="skip-popup-card"
      style={{ left: `${position.x}px`, top: `60px` }}
    >
      {/* Header */}
      <div className="skip-header">
        <div className="header-label">
          <FastForward size={14} className="text-accent" />
          <span>Skip Engine</span>
        </div>
        <button className="close-icon-btn" onClick={onClose}><X size={14} /></button>
      </div>

      <div className="skip-body">
        {/* Integrated Custom Input */}
        <div className="custom-input-wrapper">
          <button 
            className="inner-skip-btn" 
            onClick={() => handleCustomAction('b')}
            disabled={!customValue}
          >
            <RotateCcw size={14} />
          </button>
          
          <input
            type="text"
            placeholder="Seconds..."
            value={customValue}
            onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setCustomValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomAction('f')}
          />

          <button 
            className="inner-skip-btn" 
            onClick={() => handleCustomAction('f')}
            disabled={!customValue}
          >
            <RotateCw size={14} />
          </button>
        </div>

        {/* Preset Grid: Twin Buttons */}
        <div className="preset-grid">
          {skipPresets.map((sec) => (
            <div key={sec} className="twin-group">
              <button className="twin-btn left" onClick={() => triggerSkip(-sec)}>
                -{sec}s
              </button>
              <button className="twin-btn right" onClick={() => triggerSkip(sec)}>
                +{sec}s
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="skip-footer">
        <Timer size={10} />
        <span>Precision seeking active</span>
      </div>
    </div>
  );
};