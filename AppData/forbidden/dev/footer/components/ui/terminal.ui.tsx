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
import { useTerminalResize } from '../../terminal.script';
import '../../../../../../src/styles/terminal.css';
import { ChevronUp } from 'lucide-react';

// Sub-component Imports
import { TerminalHeader } from '../../../../../../src/components/ui/terminal/header.tabs.controls';
import { CLIContentArea } from '../../../../../../src/components/ui/terminal/cli.content.playground.area';
import { SideSupportPanel } from '../../../../../../src/components/ui/terminal/aside.support.panel';

export const VideoTerminal = () => {
  const { height, isResizing, startResizing, setHeight } = useTerminalResize(35);
  const [activeTab, setActiveTab] = useState('Terminal');
  const [terminals, setTerminals] = useState([{ id: 1, name: 'powershell' }]);
  const [activeTerminalId, setActiveTerminalId] = useState(1);

  const handleMaximize = () => setHeight(window.innerHeight * 0.8);
  const handleReset = () => setHeight(35);

  const getContainerClass = () => {
    if (isResizing) return 'terminal-container resizing';
    return height <= 35 ? 'terminal-container minimized' : 'terminal-container expanded';
  };

  return (
    <div className={getContainerClass()} style={{ height: `${height}px` }}>
      {/* PULSE INDICATOR */}
      {height <= 40 && !isResizing && (
        <div className="guide-indicator-top">
          <ChevronUp size={10} color="white" strokeWidth={3} />
        </div>
      )}

      {/* Drag Handle */}
      <div 
        className={`drag-handle ${isResizing ? 'active' : ''}`}
        onMouseDown={startResizing} 
      />

      {/* COMPONENT 1: HEADER & TABS */}
      <TerminalHeader 
        height={height}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onMaximize={handleMaximize}
        onReset={handleReset}
        terminals={terminals}
        setTerminals={setTerminals}
        activeTerminalId={activeTerminalId}
        setActiveTerminalId={setActiveTerminalId}
      />

      {/* CONTENT WRAPPER */}
      <div 
        className="content-area" 
        style={{ 
          opacity: height > 60 ? 1 : 0, 
          display: height > 35 ? 'flex' : 'none' 
        }}
      >
        {/* COMPONENT 2: CLI PLAYGROUND */}
        <CLIContentArea activeTab={activeTab} />

        {/* COMPONENT 3: SIDE SUPPORT PANEL */}
        <SideSupportPanel />
      </div>
    </div>
  );
};