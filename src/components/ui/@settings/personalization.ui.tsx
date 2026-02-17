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
import { Palette, Type, Layout, Image as ImageIcon, ShieldAlert, Sticker } from 'lucide-react';

const PersonalizationUI = () => (
  <div className="tab-pane animate-fade-in">
    <div className="settings-group">
      <div className="group-title-area">
        <Palette size={22} className="group-icon" strokeWidth={2.5} />
        <h2>Visual Identity</h2>
      </div>

      {/* Themes */}
      <div className="settings-row">
        <div className="settings-info">
          <h4>Themes & colors</h4>
          <p>Customize the interface surface and accent colors.</p>
        </div>
        <div className="theme-selector">
          {['white', 'black', 'yellow', 'blue', 'pink', 'red', 'green', 'orange'].map((t) => (
             <div key={t} className={`theme-option ${t === 'black' ? 'active' : ''}`} data-theme={t}>
               <div className="theme-color" style={{ background: getHex(t) }}></div>
               <span className="theme-label">{t.charAt(0).toUpperCase() + t.slice(1)}</span>
             </div>
          ))}
        </div>
      </div>

      {/* Background Image Subsection */}
      <div className="settings-row vertical">
        <div className="settings-info">
          <h4>Background Appearance</h4>
          <p>Choose a workspace backdrop or upload your own.</p>
        </div>
        <div className="bg-management-area">
          <div className="bg-grid">
            <div className="bg-option none"><span>None</span></div>
            <div className="bg-option upload">
              <ImageIcon size={18} />
              <span>Upload</span>
            </div>
            {/* Mock Recent Data */}
            <div className="bg-option preview active" style={{backgroundImage: 'url(https://picsum.photos/id/10/100/60)'}}></div>
            <div className="bg-option preview" style={{backgroundImage: 'url(https://picsum.photos/id/11/100/60)'}}></div>
          </div>
          {/* Hidden area for future logic/expansion */}
          <div className="hidden-config-zone" style={{ display: 'none' }}>
            <input type="file" id="bg-upload-input" accept="image/*" />
          </div>
        </div>
      </div>

      {/* Density */}
      <div className="settings-row">
        <div className="settings-info">
          <h4>Interface Density</h4>
          <p>Adjust spacing and element sizes.</p>
        </div>
        <select className="select-input">
          <option>Comfortable</option>
          <option>Compact</option>
          <option>Spacious</option>
        </select>
      </div>

      {/* Typography */}
      <div className="settings-row">
        <div className="settings-info">
          <h4>Typography</h4>
          <p>Change fonts and adjust text size.</p>
        </div>
        <div className="typo-controls">
          <select className="select-input font-select">
            <option>Inter (System)</option>
            <option>JetBrains Mono</option>
            <option>Roboto</option>
          </select>
          <input type="range" className="range-slider" min="12" max="20" defaultValue="14" title="Base font size" />
        </div>
      </div>

      {/* Video Overlays (Watermark & Stickers) */}
      <div className="settings-row vertical">
        <div className="settings-info">
          <h4>Video Playback Overlays</h4>
          <p>Manage brand watermarks and decorative stickers.</p>
        </div>
        <div className="overlay-upload-grid">
          <div className="upload-box">
            <ShieldAlert size={20} />
            <div className="upload-text">
              <span className="title">Watermark (Top-Left)</span>
              <span className="sub">PNG/SVG Preferred</span>
            </div>
            <button className="mini-upload-btn">Select</button>
          </div>
          <div className="upload-box">
            <Sticker size={20} />
            <div className="upload-text">
              <span className="title">Playback Sticker</span>
              <span className="sub">Floating Overlay</span>
            </div>
            <button className="mini-upload-btn">Select</button>
          </div>
        </div>
      </div>

      {/* Flexible User interface */}
      <div className="settings-row">
        <div className="settings-info">
          <h4>Flexible User Interface</h4>
          <p>Allow realtime & interactive modification of UI components.</p>
        </div>
        <div className="status-badge">In Development</div>
      </div>
    </div>
  </div>
);

// Helper for cleaner code
const getHex = (name: string) => {
  const map: any = { white: '#fff', black: '#000', yellow: '#f8fc00', blue: '#0051ff', pink: '#e59f93', red: '#ff0000', green: '#1ce019', orange: '#ff8000' };
  return map[name];
};

export default PersonalizationUI;