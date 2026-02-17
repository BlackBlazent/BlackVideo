/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

import React from 'react';
import { ShieldOff, Puzzle, MonitorOff, ListVideo } from 'lucide-react';
import { disableCommonPlayback, enableCommonPlayback, } from '../scripts/commonPlayback.script';
import { disableAccessoriesPlayback, enableAccessoriesPlayback, } from '../scripts/accessoriesPlayback.script';
import { disableExtensionsPlayback, enableExtensionsPlayback, } from '../scripts/extensionsPlayback.script';
import { disablePlaylistPlayback, enablePlaylistPlayback, } from '../scripts/index.PlaybackIntegration.script';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlaybackKey =
  | 'disableCommon'
  | 'disableAccessories'
  | 'disableExtension'
  | 'disablePlaylist';

export interface PlaybackSettings {
  disableCommon: boolean;
  disableAccessories: boolean;
  disableExtension: boolean;
  disablePlaylist: boolean;
}

interface PlaybackIntegrationUIProps {
  settings: PlaybackSettings;
  onToggle: (key: PlaybackKey) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const PlaybackIntegrationUI: React.FC<PlaybackIntegrationUIProps> = ({
  settings,
  onToggle,
}) => {
  /**
   * Intercepts the toggle click, calls the correct enable/disable script,
   * then bubbles the state change up through onToggle so the parent
   * keeps its settings object in sync.
   */
  const handleToggle = (key: PlaybackKey) => {
    switch (key) {
      case 'disableCommon':
        settings.disableCommon ? enableCommonPlayback() : disableCommonPlayback();
        break;
      case 'disableAccessories':
        settings.disableAccessories
          ? enableAccessoriesPlayback()
          : disableAccessoriesPlayback();
        break;
      case 'disableExtension':
        settings.disableExtension
          ? enableExtensionsPlayback()
          : disableExtensionsPlayback();
        break;
      case 'disablePlaylist':
        settings.disablePlaylist
          ? enablePlaylistPlayback()
          : disablePlaylistPlayback();
        break;
    }
    onToggle(key);
  };

  return (
    <div className="playback-integration-window" style={sideWindowStyle}>
      <div style={headerStyle}>Playback Integration</div>

      <div style={scrollAreaStyle}>
        {/* Toggle: Common Playback */}
        <div
          style={itemStyle}
          onClick={() => handleToggle('disableCommon')}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.05)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.02)')
          }
        >
          <div style={iconBox}>
            <MonitorOff
              size={14}
              color={
                settings.disableCommon
                  ? 'var(--primary-blue)'
                  : 'var(--text-muted)'
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Disable Common</div>
          </div>
          <div style={toggleDot(settings.disableCommon)} />
        </div>

        {/* Toggle: Accessories Playback */}
        <div
          style={itemStyle}
          onClick={() => handleToggle('disableAccessories')}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.05)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.02)')
          }
        >
          <div style={iconBox}>
            <ShieldOff
              size={14}
              color={
                settings.disableAccessories
                  ? 'var(--primary-blue)'
                  : 'var(--text-muted)'
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Disable Accessories</div>
          </div>
          <div style={toggleDot(settings.disableAccessories)} />
        </div>

        {/* Toggle: Extension Playback */}
        <div
          style={itemStyle}
          onClick={() => handleToggle('disableExtension')}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.05)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.02)')
          }
        >
          <div style={iconBox}>
            <Puzzle
              size={14}
              color={
                settings.disableExtension
                  ? 'var(--primary-blue)'
                  : 'var(--text-muted)'
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Disable Extension</div>
          </div>
          <div style={toggleDot(settings.disableExtension)} />
        </div>

        {/* Toggle: Playlist */}
        <div
          style={itemStyle}
          onClick={() => handleToggle('disablePlaylist')}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.05)')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLDivElement).style.background =
              'rgba(255,255,255,0.02)')
          }
        >
          <div style={iconBox}>
            <ListVideo
              size={14}
              color={
                settings.disablePlaylist
                  ? 'var(--primary-blue)'
                  : 'var(--text-muted)'
              }
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={labelStyle}>Disable Playlist</div>
          </div>
          <div style={toggleDot(settings.disablePlaylist)} />
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const sideWindowStyle: React.CSSProperties = {
  position: 'absolute',
  right: '295px',
  top: '40px',
  width: '200px',
  backgroundColor: 'rgba(18, 18, 18, 0.98)',
  backdropFilter: 'blur(15px)',
  border: '1px solid var(--border-medium)',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
  zIndex: 1002,
  animation: 'fadeIn 0.2s ease-out',
};

const headerStyle: React.CSSProperties = {
  color: 'var(--primary-blue)',
  fontSize: '10px',
  fontWeight: 800,
  marginBottom: '12px',
  paddingLeft: '8px',
  letterSpacing: '1px',
  textTransform: 'uppercase',
};

const scrollAreaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: '0.2s',
  background: 'rgba(255,255,255,0.02)',
};

const iconBox: React.CSSProperties = {
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  background: 'rgba(0,0,0,0.2)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  color: 'var(--text-primary)',
  fontWeight: 500,
};

const toggleDot = (active: boolean): React.CSSProperties => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? 'var(--primary-blue)' : 'rgba(255,255,255,0.1)',
  boxShadow: active ? '0 0 8px var(--primary-blue)' : 'none',
  transition: '0.3s',
});