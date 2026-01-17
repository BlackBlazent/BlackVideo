// aspect.ratio.ui.tsx - UI component for aspect ratio selection
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
import { X, Check, Crop } from 'lucide-react';

import '../../../../../../src/styles/modals/aspect.ratio.css';

interface AspectRatioOption {
  label: string;
  value: string;
}

interface AspectRatioUIProps {
  isVisible: boolean;
  onClose: () => void;
  onRatioSelect: (ratio: string) => void;
  buttonRef: React.RefObject<HTMLElement>;
}

const aspectRatioOptions: AspectRatioOption[] = [
  { label: 'Auto', value: 'auto' },
  { label: '1:1 Square', value: '1:1' },
  { label: '4:3 Standard', value: '4:3' },
  { label: '16:9 Wide', value: '16:9' },
  { label: '21:9 Ultra', value: '21:9' },
  { label: '9:16 Vertical', value: '9:16' },
  { label: '2.35:1 Cinema', value: '2.35:1' },
  { label: '2.76:1 Scope', value: '2.76:1' }
];

export const AspectRatioUI: React.FC<AspectRatioUIProps> = ({
  isVisible,
  onClose,
  onRatioSelect,
  buttonRef
}) => {
  const [selectedRatio, setSelectedRatio] = useState<string>('auto');
  // Changed state to use 'right' instead of 'left'
  const [position, setPosition] = useState({ top: 90, right: 20 }); 
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Calculate distance from right edge of screen
      // Align the right side of the popup with the right side of the button
      const rightPos = viewportWidth - rect.right;
      const yPos = rect.top - 380; // Offset to appear above button

      setPosition({
        top: yPos < 20 ? rect.bottom + 10 : yPos, // Flip to bottom if no space above
        right: Math.max(10, rightPos) // Ensure at least 10px from edge
      });
    }
  }, [isVisible, buttonRef]);

  const handleRatioSelect = (ratio: string) => {
    setSelectedRatio(ratio);
    onRatioSelect(ratio);
    setTimeout(() => onClose(), 150);
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      className="aspect-ratio-engine-card"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        right: `${position.right}px`, // Using right-side positioning
        zIndex: 99999
      }}
    >
      <div className="res-header">
        <div className="header-label">
          <Crop size={14} className="text-accent" />
          <span>Aspect Engine</span>
        </div>
        <button className="close-icon-btn" onClick={onClose}><X size={14} /></button>
      </div>
      
      <div className="res-content">
        <div className="res-options-list">
          {aspectRatioOptions.map((option) => (
            <div 
              className={`res-option-row ${selectedRatio === option.value ? 'active' : ''}`}
              key={option.value} 
              onClick={() => handleRatioSelect(option.value)}
            >
              <div className="res-info-main">
                <span className="res-text">{option.label}</span>
              </div>
              
              <div className="res-indicator">
                {selectedRatio === option.value ? (
                  <Check size={14} className="text-accent" />
                ) : (
                  <div className="res-dot" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};