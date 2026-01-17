/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState } from 'react';
import { 
  FileVideo, PlayCircle, Volume2, Cpu, 
  ToggleRight, ToggleLeft, ChevronRight, 
  Gamepad2, Check 
} from 'lucide-react';
import { handleOpenLocalFile } from './open.file.import';

interface VideoSubSettingsProps {
  isOpen: boolean;
  states?: any;
}

// Defining the modes based on your refactored feature design
type PlayMode = 
  | 'Standard' | 'Theater' | 'Movie' | 'Performance' 
  | 'Smooth' | 'Audio' | 'Music' | 'Worship' 
  | 'Preach' | 'Live' | 'Study' | 'Custom';

export const VideoSubSettings: React.FC<VideoSubSettingsProps> = ({ isOpen }) => {
  const [resumeEnabled, setResumeEnabled] = useState(true);
  const [rememberVolume, setRememberVolume] = useState(false);
  const [renderMode, setRenderMode] = useState<'video' | 'canvas'>('video');
  
  // Playground States
  const [showPlayground, setShowPlayground] = useState(false);
  const [currentMode, setCurrentMode] = useState<PlayMode>('Standard');

  if (!isOpen) return null;

  const modes: PlayMode[] = [
    'Standard', 'Theater', 'Movie', 'Performance', 
    'Smooth', 'Audio', 'Music', 'Worship', 
    'Preach', 'Live', 'Study', 'Custom'
  ];
          // {/*<div className="sub-settings-container" style={{ position: 'relative' }}></div>*/}
  return (
      <div className="sub-settings-popup" style={containerStyle}>
        <div style={headerStyle}>THEATER SETTINGS</div>

        {/* 1. Action: Open File */}
        <div 
          className="setting-row-item" 
          style={rowStyle} 
          onClick={handleOpenLocalFile}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}><FileVideo size={16} color="var(--primary-blue)" /></div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Open Local File</div>
            <div style={descStyle}>Select a video from your computer</div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>

        <div style={dividerStyle} />

        {/* 2. Toggle: Resume Playback */}
        <div className="setting-row-item" style={rowStyle} onClick={() => setResumeEnabled(!resumeEnabled)}>
          <div style={iconBox}><PlayCircle size={16} /></div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Resume Playback</div>
            <div style={descStyle}>Start from last timestamp</div>
          </div>
          {resumeEnabled ? 
            <ToggleRight size={24} color="var(--primary-blue)" /> : 
            <ToggleLeft size={24} color="var(--text-muted)" />
          }
        </div>

        {/* 3. Toggle: Remember Volume */}
        <div className="setting-row-item" style={rowStyle} onClick={() => setRememberVolume(!rememberVolume)}>
          <div style={iconBox}><Volume2 size={16} /></div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Remember Volume</div>
            <div style={descStyle}>Persist level across sessions</div>
          </div>
          {rememberVolume ? 
            <ToggleRight size={24} color="var(--primary-blue)" /> : 
            <ToggleLeft size={24} color="var(--text-muted)" />
          }
        </div>

        <div style={dividerStyle} />

        {/* 4. Switch: Render Mode Selection */}
        <div className="setting-row-item" style={{...rowStyle, cursor: 'default'}}>
          <div style={iconBox}><Cpu size={16} /></div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Render Mode</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
              <button 
                onClick={() => setRenderMode('video')}
                style={renderMode === 'video' ? activeTabStyle : inactiveTabStyle}
              >
                Video
              </button>
              <button 
                onClick={() => setRenderMode('canvas')}
                style={renderMode === 'canvas' ? activeTabStyle : inactiveTabStyle}
              >
                Canvas
              </button>
            </div>
          </div>
        </div>

        {/* 5. NEW: Playground Mode Side Selection */}
        <div 
          className="setting-row-item" 
          style={{...rowStyle, marginTop: '4px'}}
          onClick={() => setShowPlayground(!showPlayground)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}><Gamepad2 size={16} color={showPlayground ? "var(--primary-blue)" : "white"} /></div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Playground Mode</div>
            <div style={{...descStyle, color: 'var(--primary-blue)', fontWeight: 'bold'}}>{currentMode}</div>
          </div>
          <ChevronRight 
            size={14} 
            color="var(--text-muted)" 
            style={{ transform: showPlayground ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
          />
        </div>

        {/* SIDE WINDOW: Playground Selection */}
        {showPlayground && (
          <div className="playground-side-window" style={sideWindowStyle}>
            <div style={{...headerStyle, marginBottom: '12px', color: 'var(--primary-blue)'}}>SELECT INTENT</div>
            <div style={scrollAreaStyle}>
              {modes.map((mode) => (
                <div 
                  key={mode} 
                  style={{
                    ...modeItemStyle, 
                    backgroundColor: currentMode === mode ? 'rgba(0, 102, 255, 0.1)' : 'transparent',
                    color: currentMode === mode ? 'var(--primary-blue)' : 'var(--text-primary)'
                  }}
                  onClick={() => {
                    setCurrentMode(mode);
                    // logic for intent-driven behavior would trigger here
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: currentMode === mode ? 700 : 400 }}>{mode}</span>
                  {currentMode === mode && <Check size={12} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  );
};

// --- Styles ---
const containerStyle: React.CSSProperties = {
  position: 'absolute', right: '10px',
  width: '280px', backgroundColor: 'rgba(18, 18, 18, 0.98)',
  backdropFilter: 'blur(15px)', border: '1px solid var(--border-medium)',
  borderRadius: '12px', padding: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  zIndex: 1000, userSelect: 'none'
};

const sideWindowStyle: React.CSSProperties = {
  position: 'absolute', right: '295px', top: '0',
  width: '180px', backgroundColor: 'rgba(18, 18, 18, 0.98)',
  backdropFilter: 'blur(15px)', border: '1px solid var(--border-medium)',
  borderRadius: '12px', padding: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  zIndex: 1001, animation: 'fadeIn 0.2s ease-out'
};

const scrollAreaStyle: React.CSSProperties = {
  maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px'
};

const modeItemStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s'
};

const headerStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800, marginBottom: '10px', paddingLeft: '8px', letterSpacing: '1px' };
const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' };
const iconBox: React.CSSProperties = { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' };
const titleStyle: React.CSSProperties = { color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 };
const descStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '10px' };
const dividerStyle: React.CSSProperties = { height: '1px', background: 'var(--border-subtle)', margin: '6px 0' };
const activeTabStyle: React.CSSProperties = { flex: 1, border: 'none', background: 'var(--primary-blue)', color: 'white', fontSize: '10px', padding: '4px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', fontSize: '10px', padding: '4px', borderRadius: '4px', cursor: 'pointer' };