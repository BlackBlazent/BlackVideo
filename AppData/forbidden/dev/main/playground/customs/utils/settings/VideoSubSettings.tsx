/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

import React, { useEffect, useState } from 'react';
import { ToggleRight, ToggleLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { handleOpenLocalFile } from './open.file.import';
import { handleSeparateWindowPlayback } from "./open.separate.window.player";
import { PlaygroundModeUI, PlayMode } from './components/playgroundMode.ui';
import '../../../../../../../../src/styles/global.css';
import '../../../../../../../../src/styles/modals/video.subsettings.css';
import { PlaybackIntegrationUI, PlaybackKey, PlaybackSettings } from './components/playbackIntegration.ui';
import { resumePlaybackIndex } from '../settings/lib/resumePlayback/resumePlaybackIndex';

interface VideoSubSettingsProps {
  isOpen: boolean;
  states?: any;
}

export const VideoSubSettings: React.FC<VideoSubSettingsProps> = ({ isOpen }) => {
  const [resumeEnabled, setResumeEnabled] = useState<boolean>(true);
  const [rememberVolume, setRememberVolume] = useState<boolean>(false);
  const [renderMode, setRenderMode] = useState<'video' | 'canvas'>('video');
  const [showPlayground, setShowPlayground] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<PlayMode>('Standard');
  const [showIntegration, setShowIntegration] = useState<boolean>(false);
  const [playbackSettings, setPlaybackSettings] = useState<PlaybackSettings>({
    disableCommon: false,
    disableAccessories: false,
    disableExtension: false,
    disablePlaylist: false,
  });

  useEffect(() => {
    const isEnabled = resumePlaybackIndex.isResumePlaybackEnabled();
    setResumeEnabled(isEnabled);
  }, []);

  const handleResumeToggle = () => {
    const newState = !resumeEnabled;
    setResumeEnabled(newState);
    resumePlaybackIndex.setResumeEnabled(newState);
  };

  const handlePlaybackToggle = (key: PlaybackKey) => {
    setPlaybackSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="sub-settings-wrapper" style={{ position: 'absolute', top: '30px', right: '0' }}>

      {showPlayground && (
        <PlaygroundModeUI
          currentMode={currentMode}
          onSelectMode={(mode) => setCurrentMode(mode)}
        />
      )}

      {showIntegration && (
        <PlaybackIntegrationUI
          settings={playbackSettings}
          onToggle={handlePlaybackToggle}
        />
      )}

      <div className="sub-settings-popup" style={containerStyle}>
        <div style={headerStyle}>Playground Settings</div>

        {/* 1. Open File */}
        <div
          className="setting-row-item"
          style={rowStyle}
          onClick={() => handleOpenLocalFile()}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}>
            <img id="openVideoFile" className="open-video-file separate-subSettings-icon" src="/assets/others/open-video-file.png" alt="Open Video File" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Open Local File</div>
            <div style={descStyle}>Select a video from your computer</div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>

        <div style={dividerStyle} />

        {/* 2. Resume Playback */}
        <div
          className="setting-row-item"
          style={rowStyle}
          onClick={handleResumeToggle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}>
            <img id="resumePlayback" className="resume-playback separate-subSettings-icon" src="/assets/others/resume-playback.png" alt="Resume Playback" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Resume Playback</div>
            <div style={descStyle}>
              {resumeEnabled ? 'Videos will resume from where you left off' : 'Videos will start from the beginning'}
            </div>
          </div>
          {resumeEnabled
            ? <ToggleRight size={24} color="var(--primary-blue)" />
            : <ToggleLeft size={24} color="var(--text-muted)" />
          }
        </div>

        {/* 3. Remember Volume */}
        <div
          className="setting-row-item"
          style={rowStyle}
          onClick={() => setRememberVolume(!rememberVolume)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}>
            <img id="resumeVolume" className="resume-volume separate-subSettings-icon" src="/assets/others/resume-volume.png" alt="Resume Volume" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Remember Volume</div>
            <div style={descStyle}>Persist level across sessions</div>
          </div>
          {rememberVolume
            ? <ToggleRight size={24} color="var(--primary-blue)" />
            : <ToggleLeft size={24} color="var(--text-muted)" />
          }
        </div>

        <div style={dividerStyle} />

        {/* 4. Render Mode */}
        <div className="setting-row-item" style={{ ...rowStyle, cursor: 'default' }}>
          <div style={iconBox}>
            <img id="renderMode" className="render-mode separate-subSettings-icon" src="/assets/others/render-mode.png" alt="Render Mode" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Render Mode</div>
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
              <button onClick={() => setRenderMode('video')} style={renderMode === 'video' ? activeTabStyle : inactiveTabStyle}>Video</button>
              <button onClick={() => setRenderMode('canvas')} style={renderMode === 'canvas' ? activeTabStyle : inactiveTabStyle}>Canvas</button>
            </div>
          </div>
        </div>

        {/* 5. Playground Mode */}
        <div
          className="setting-row-item"
          style={{ ...rowStyle, marginTop: '4px' }}
          onClick={() => setShowPlayground(!showPlayground)}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}>
            <Gamepad2 size={16} color={showPlayground ? 'var(--primary-blue)' : 'white'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Playground Mode</div>
            <div style={{ ...descStyle, color: 'var(--primary-blue)', fontWeight: 'bold' }}>{currentMode}</div>
          </div>
          <ChevronRight
            size={14}
            color="var(--text-muted)"
            style={{ transform: showPlayground ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
          />
        </div>

        {/* 6. Separate Window */}
        <div
          className="setting-row-item"
          style={{ ...rowStyle, marginTop: '4px' }}
          onClick={handleSeparateWindowPlayback}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}>
            <img id="playSeparateWindow" className="playSeparateWindow separate-subSettings-icon" src="/assets/others/separate-playback.png" alt="Play in Separate Window" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Play in Separate Window</div>
            <div style={descStyle}>Pop out player into a standalone window</div>
          </div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>

        {/* 7. Playback Integration */}
        <div
          className="setting-row-item"
          style={{ ...rowStyle, marginTop: '4px' }}
          onClick={() => {
            setShowIntegration(!showIntegration);
            if (showPlayground) setShowPlayground(false);
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={iconBox}>
            <img
              id="playbackIntegration"
              className="playbackIntegration separate-subSettings-icon"
              src="/assets/others/playback-integration.png"
              alt="Playback Integration"
              style={{ width: '16px', height: '16px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={titleStyle}>Playback Integration</div>
            <div style={descStyle}>Configure subsystem playback nodes</div>
          </div>
          <ChevronRight
            size={14}
            color="var(--text-muted)"
            style={{ transform: showIntegration ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
          />
        </div>

      </div>
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const containerStyle: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  width: '280px',
  backgroundColor: 'rgba(18, 18, 18, 0.98)',
  height: '320px',
  backdropFilter: 'blur(15px)',
  border: '1px solid var(--border-medium)',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  overflowX: 'hidden',
  overflowY: 'auto',
  zIndex: 1000,
  userSelect: 'none',
};
const headerStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800, marginBottom: '10px', paddingLeft: '8px', letterSpacing: '1px' };
const rowStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' };
const iconBox: React.CSSProperties = { width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' };
const titleStyle: React.CSSProperties = { color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500 };
const descStyle: React.CSSProperties = { color: 'var(--text-muted)', fontSize: '10px' };
const dividerStyle: React.CSSProperties = { height: '1px', background: 'var(--border-subtle)', margin: '6px 0' };
const activeTabStyle: React.CSSProperties = { flex: 1, border: 'none', background: 'var(--primary-blue)', color: 'white', fontSize: '10px', padding: '4px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-muted)', fontSize: '10px', padding: '4px', borderRadius: '4px', cursor: 'pointer' };