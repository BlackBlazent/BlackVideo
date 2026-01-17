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
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { 
  Palette, Keyboard, Settings as SettingsIcon, 
  RefreshCw, ChevronRight 
} from 'lucide-react';

interface SettingsShortcutProps {
  isVisible: boolean;
}

export default function SettingsShortcut({ isVisible }: SettingsShortcutProps) {
  if (!isVisible) return null;

  return (
    <div id="settings-shortcut-popup" className="shortcut-modal-overlay">
      <div className="shortcut-container">
        <div className="shortcut-header">
          <div className="header-title">
            <SettingsIcon size={14} className="icon-spin" />
            <span>Quick Config</span>
          </div>
          {/* Close button removed as per request */}
        </div>

        <div className="shortcut-body">
          <ShortcutItem 
            icon={<Palette size={18} />} 
            title="Themes" 
            desc="Change system skin" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-theme-window'))}
          />
          <ShortcutItem 
            icon={<Keyboard size={18} />} 
            title="Key Shortcuts" 
            desc="Commands & Hotkeys" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-shortcuts-window'))}
          />
          <ShortcutItem 
            icon={<SettingsIcon size={18} />} 
            title="BlackVideo Settings" 
            desc="Core preferences" 
            onClick={() => {}} 
          />
          <ShortcutItem 
            icon={<RefreshCw size={18} />} 
            title="Check for Updates" 
            desc="v2.4.0 (Stable)" 
            onClick={() => {}} 
          />
        </div>

        <div className="shortcut-footer">
          <span>Zephyra Engine v2026.1</span>
        </div>
      </div>
    </div>
  );
}

const ShortcutItem = ({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) => (
  <div className="shortcut-item" onClick={onClick}>
    <div className="item-left">
      <div className="item-icon">{icon}</div>
      <div className="item-text">
        <span className="item-title">{title}</span>
        <span className="item-desc">{desc}</span>
      </div>
    </div>
    <ChevronRight size={14} className="arrow" />
  </div>
);