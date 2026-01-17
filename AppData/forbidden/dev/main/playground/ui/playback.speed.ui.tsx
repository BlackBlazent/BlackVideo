/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Updated playback.speed.ui.tsx

import React, { useRef, useEffect } from 'react';
import { Gauge, Check, Rabbit, Turtle, Activity } from 'lucide-react';

import '../../../../../../src/styles/modals/playback.speed.css'

interface PlaybackSpeedUIProps {
  isVisible: boolean;
  onClose: () => void;
  position?: { left: number; top: number };
}

const speedOptions = [
  { label: '0.25x', value: 0.25, icon: <Turtle size={14} /> },
  { label: '0.5x', value: 0.5, icon: <Turtle size={14} /> },
  { label: '0.75x', value: 0.75, icon: <Activity size={14} /> },
  { label: 'Normal', value: 1.0, icon: <Gauge size={14} /> },
  { label: '1.25x', value: 1.25, icon: <Activity size={14} /> },
  { label: '1.5x', value: 1.5, icon: <Rabbit size={14} /> },
  { label: '2.0x', value: 2.0, icon: <Rabbit size={14} /> },
];

export const PlaybackSpeedUI: React.FC<PlaybackSpeedUIProps> = ({ 
  isVisible, 
  onClose, 
  position = { left: 0, top: 0 } 
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Get current speed to show "Check" icon
  const video = document.getElementById('VideoPlayer-TheaterStage') as HTMLVideoElement;
  const currentSpeed = video?.playbackRate || 1.0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isVisible) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, onClose]);

  const handleSpeedChange = (speed: number) => {
    if (video) video.playbackRate = speed;
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div 
      ref={popupRef} 
      className="speed-engine-popup"
      style={{
        left: `${position.left}px`,
        top: `${position.top - 280}px`, // Adjusted to pop UPWARDS
      }}
    >
      <div className="speed-header">
        <Gauge size={12} className="text-accent" />
        <span>Playback Speed</span>
      </div>

      <div className="speed-options-list">
        {speedOptions.map((opt) => {
          const isActive = currentSpeed === opt.value;
          return (
            <button 
              key={opt.value} 
              className={`speed-option-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleSpeedChange(opt.value)}
            >
              <span className="speed-icon-box">
                {isActive ? <Check size={12} className="text-accent" /> : opt.icon}
              </span>
              <span className="speed-label">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};