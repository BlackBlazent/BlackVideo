/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Settings, SlidersHorizontal, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';

import '../../../../../../src/styles/modals/volume.css'

interface SpeakerUIProps {
  isVisible: boolean;
  onClose: () => void;
  attachTo: HTMLElement | null;
}

const SpeakerUI: React.FC<SpeakerUIProps> = ({ isVisible, onClose, attachTo }) => {
  const [volume, setVolume] = useState(100);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isSyncEnabled, setIsSyncEnabled] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Position logic
  useEffect(() => {
    if (attachTo && isVisible) {
      const rect = attachTo.getBoundingClientRect();
      setPosition({
        top: rect.top - (showAdvanced ? 320 : 240), // Adjust height based on menu
        left: rect.left + (rect.width / 2) - 80
      });
    }
  }, [attachTo, isVisible, showAdvanced]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) && 
          attachTo && !attachTo.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isVisible) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, onClose, attachTo]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
    
    // Dispatch to playback.advanced.control.enhancement.volume.ts
    window.dispatchEvent(new CustomEvent('volumeChange', { 
      detail: { volume: newVolume } 
    }));
  };

  const toggleSync = () => {
    setIsSyncEnabled(!isSyncEnabled);
    window.dispatchEvent(new CustomEvent('toggleSync'));
  };

  if (!isVisible) return null;

  const isBoosting = volume > 100;

  return (
    <div
      ref={popupRef}
      className="speaker-enhanced-ui"
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 10000,
        backgroundColor: '#111111',
        border: `1px solid ${isBoosting ? '#ef4444' : '#333'}`,
        borderRadius: '12px',
        padding: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        width: '160px',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Header with Settings Icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color: isBoosting ? '#ef4444' : '#888' }}>
          {isBoosting ? 'BOOST' : 'VOLUME'}: {volume}%
        </span>
        <Settings 
          size={14} 
          style={{ cursor: 'pointer', color: showAdvanced ? '#0ea5e9' : '#555' }} 
          onClick={() => setShowAdvanced(!showAdvanced)}
        />
      </div>

      {/* Visual Volume Bars (Visualizer Style) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', height: '30px', marginBottom: '15px' }}>
        {Array.from({ length: 20 }, (_, i) => {
          const isActive = i <= (volume / 300 * 19);
          const isDanger = i > 6; // Above 100% mark
          return (
            <div
              key={i}
              style={{
                width: '3px',
                height: `${4 + (i * 1.5)}px`,
                backgroundColor: isActive ? (isDanger ? '#ef4444' : '#0ea5e9') : '#222',
                borderRadius: '1px',
                transition: '0.1s'
              }}
            />
          );
        })}
      </div>

      {/* 300% Range Slider */}
      <div className="range-container">
        <input
          type="range"
          min="0"
          max="300"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            width: '100%',
            height: '4px',
            accentColor: isBoosting ? '#ef4444' : '#0ea5e9',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Audio Sync Switch */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: '15px',
        paddingTop: '10px',
        borderTop: '1px solid #222'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: '#aaa' }}>
          <SlidersHorizontal size={12} />
          <span>Audio Sync</span>
        </div>
        <div onClick={toggleSync} style={{ cursor: 'pointer' }}>
          {isSyncEnabled ? <ToggleRight size={20} color="#0ea5e9" /> : <ToggleLeft size={20} color="#444" />}
        </div>
      </div>

      {/* Advanced Settings (VLC Style) */}
      {showAdvanced && (
        <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#000', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ fontSize: '9px', color: '#666' }}>Delay (ms)</span>
            <input 
              type="number" 
              defaultValue="0" 
              style={{ width: '40px', background: '#222', border: 'none', color: '#fff', fontSize: '9px', textAlign: 'center' }}
            />
          </div>
          <div style={{ fontSize: '8px', color: '#444', fontStyle: 'italic' }}>
            Tools &gt; Audio Track Synchronization
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerUI;