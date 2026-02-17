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
import { Check } from 'lucide-react';

// Defining the modes for consistency across components
export type PlayMode = 
  | 'Standard' | 'Theater' | 'Movie' | 'Performance' 
  | 'Smooth' | 'Audio' | 'Music' | 'Worship' 
  | 'Preach' | 'Live' | 'Study' | 'Custom';

interface PlaygroundModeUIProps {
  currentMode: PlayMode;
  onSelectMode: (mode: PlayMode) => void;
}

export const PlaygroundModeUI: React.FC<PlaygroundModeUIProps> = ({ currentMode, onSelectMode }) => {
  const modes: PlayMode[] = [
    'Standard', 'Theater', 'Movie', 'Performance', 
    'Smooth', 'Audio', 'Music', 'Worship', 
    'Preach', 'Live', 'Study', 'Custom'
  ];

  return (
    <div className="playground-side-window" style={sideWindowStyle}>
      <div style={headerStyle}>Select Mode</div>
      <div style={scrollAreaStyle}>
        {modes.map((mode) => {
          const isActive = currentMode === mode;
          return (
            <div 
              key={mode} 
              style={{
                ...modeItemStyle, 
                backgroundColor: isActive ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                color: isActive ? 'var(--primary-blue)' : 'var(--text-primary)'
              }}
              onClick={() => onSelectMode(mode)}
            >
              <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 400 }}>
                {mode}
              </span>
              {isActive && <Check size={12} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Styles ---
const sideWindowStyle: React.CSSProperties = {
  position: 'absolute', 
  right: '295px', // Positions it to the left of the main popup
  top: '0',
  width: '180px', 
  backgroundColor: 'rgba(18, 18, 18, 0.98)',
  backdropFilter: 'blur(15px)', 
  border: '1px solid var(--border-medium)',
  borderRadius: '12px', 
  padding: '12px', 
  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  zIndex: 1001, 
  animation: 'fadeIn 0.2s ease-out'
};

const headerStyle: React.CSSProperties = { 
  color: 'var(--primary-blue)', 
  fontSize: '10px', 
  fontWeight: 800, 
  marginBottom: '12px', 
  paddingLeft: '8px', 
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const scrollAreaStyle: React.CSSProperties = {
  maxHeight: '300px', 
  overflowY: 'auto', 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '2px'
};

const modeItemStyle: React.CSSProperties = {
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between',
  padding: '8px 10px', 
  borderRadius: '6px', 
  cursor: 'pointer', 
  transition: '0.2s'
};