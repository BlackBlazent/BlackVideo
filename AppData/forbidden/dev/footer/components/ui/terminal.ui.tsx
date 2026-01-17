/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useRef } from 'react';
import { useTerminalResize } from '../../terminal.script';
import { 
  Terminal as TerminalIcon, 
  Activity, 
  HardDrive, 
  ChevronUp, 
  X, 
  Maximize2,
  Plus,
  Trash2,
  Columns,
  MoreHorizontal,
  AlertCircle,
  Code2,
  Network,
  Database
} from 'lucide-react';

export const VideoTerminal = () => {
  // height starts at 35px; resets to 35px on close
  const { height, isResizing, startResizing, setHeight } = useTerminalResize(35);
  const [activeTab, setActiveTab] = useState('Terminal');
  const [terminals, setTerminals] = useState([{ id: 1, name: 'powershell' }]);
  const [activeTerminalId, setActiveTerminalId] = useState(1);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const path = "PS C:\\Users\\User\\BlackVideo\\@Albin_ka>";

  const handleMaximize = () => setHeight(window.innerHeight * 0.8);
  const handleReset = () => setHeight(35);

  const addTerminal = () => {
    const newId = Date.now();
    setTerminals([...terminals, { id: newId, name: 'powershell' }]);
    setActiveTerminalId(newId);
  };

  const killTerminal = (id: number) => {
    if (terminals.length > 1) {
      setTerminals(terminals.filter(t => t.id !== id));
      setActiveTerminalId(terminals[0].id);
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse-soft {
            0% { opacity: 0.2; transform: translateX(-50%) translateY(0px); }
            50% { opacity: 0.5; transform: translateX(-50%) translateY(-5px); }
            100% { opacity: 0.2; transform: translateX(-50%) translateY(0px); }
          }
          .guide-indicator-top { animation: pulse-soft 3s infinite ease-in-out; }
          .drop-item { padding: 8px 12px; font-size: 11px; color: #ccc; cursor: pointer; }
          .drop-item:hover { background: rgba(255,255,255,0.05); color: white; }
          .cursor-blink { animation: blink 1s step-end infinite; }
          @keyframes blink { 50% { opacity: 0; } }
        `}
      </style>

      <div 
        className="terminal-container" 
        style={{ 
          height: `${height}px`,
          position: 'fixed', bottom: 0, width: '100%',
          // Keep background transparent when minimized so it stays "behind" your global footer
          backgroundColor: height <= 35 && !isResizing ? 'transparent' : '#0c0c0c',
          borderTop: isResizing ? '2px solid var(--primary-blue)' : '1px solid #2b2b2b',
          zIndex: 1, display: 'flex', flexDirection: 'column',
          transition: isResizing ? 'none' : 'height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'visible' // Important for the floating indicator
        }}
      >
        {/* ORIGINAL PULSE INDICATOR (Visible only when minimized) */}
        {height <= 40 && !isResizing && (
          <div className="guide-indicator-top" style={indicatorTopStyle}>
            <ChevronUp size={10} color="white" strokeWidth={3} />
          </div>
        )}

        {/* Drag Handle - Active for manual resizing */}
        <div 
          onMouseDown={startResizing} 
          style={{
            width: '100%', height: '6px', cursor: 'n-resize', position: 'absolute',
            top: '-3px', zIndex: 101, backgroundColor: isResizing ? 'var(--primary-blue)' : 'transparent',
          }} 
        />

        {/* 🛠️ HEADER: TABS & CONTROLS (Fades out when fully closed) */}
        <div style={{...tabHeaderStyle, opacity: height > 25 ? 1 : 0}}>
          
          <div style={tabGroupStyle}>
            <TabItem label="Problems" icon={<AlertCircle size={12} color="#3b82f6"/>} active={activeTab === 'Problems'} onClick={() => setActiveTab('Problems')} count={2} />
            <TabItem label="Output" icon={<Database size={12}/>} active={activeTab === 'Output'} onClick={() => setActiveTab('Output')} />
            <TabItem label="Terminal" icon={<TerminalIcon size={12}/>} active={activeTab === 'Terminal'} onClick={() => setActiveTab('Terminal')} />
            <TabItem label="Ports" icon={<Network size={12}/>} active={activeTab === 'Ports'} onClick={() => setActiveTab('Ports')} />
            <TabItem label="Assets" icon={<HardDrive size={12}/>} active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')} />
            <TabItem label="Metrics" icon={<Activity size={12}/>} active={activeTab === 'Metrics'} onClick={() => setActiveTab('Metrics')} />
          </div>

          <div style={rightControlsStyle}>
            {/* Instance Control Box */}
            <div style={instanceControlStyle}>
              <Code2 size={12} style={{marginRight: '6px', opacity: 0.7}} />
              <span style={{fontSize: '11px', color: '#ccc', marginRight: '8px'}}>powershell</span>
              <button onClick={addTerminal} style={headerActionBtn} title="New Terminal"><Plus size={14}/></button>
              <ChevronUp size={12} style={{marginRight: '10px', opacity: 0.5}} />
              
              <div style={innerDivider} />

              <button style={headerActionBtn} title="Split Terminal"><Columns size={14}/></button>
              <button onClick={() => killTerminal(activeTerminalId)} style={headerActionBtn} title="Kill Terminal"><Trash2 size={14}/></button>
              
              <div style={{position: 'relative'}}>
                  <button onClick={() => setIsMoreOpen(!isMoreOpen)} style={headerActionBtn}><MoreHorizontal size={14}/></button>
                  {isMoreOpen && (
                      <div style={dropdownStyle}>
                          <div className="drop-item">Recent Commands</div>
                          <div className="drop-item">Scroll to Command</div>
                          <div className="drop-item">Run Active File</div>
                      </div>
                  )}
              </div>
            </div>

            <div style={divider} />

            <button onClick={handleMaximize} style={winBtnStyle} title="Maximize"><Maximize2 size={12} /></button>
            <button onClick={handleReset} style={winBtnStyle} title="Minimize"><X size={14} /></button>
          </div>
        </div>

        {/* 🟢 CONTENT AREA (Fades in when pulled up) */}
        <div style={{...contentAreaStyle, opacity: height > 60 ? 1 : 0, display: height > 35 ? 'flex' : 'none'}}>
          <div style={terminalBody}>
            <div style={{ color: '#cccccc', fontSize: '12px', lineHeight: '1.6', fontFamily: '"Cascadia Code", Consolas, monospace' }}>
              {activeTab === 'Terminal' && (
                <div>
                  <span style={{color: '#fff'}}>{path}</span>
                  <span className="cursor-blink" style={{color: '#007acc', marginLeft: '4px'}}>█</span>
                </div>
              )}
              {activeTab === 'Problems' && (
                 <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
                    <div style={{color: '#f87171', fontSize: '11px'}}>● [Codec Error] Missing H.265 dynamic library</div>
                    <div style={{color: '#fbbf24', fontSize: '11px'}}>▲ [Warning] Low disk space for video caching</div>
                 </div>
              )}
            </div>
          </div>

          {/* Language / OS Support Panel */}
          <div style={sideLanguagePanel}>
              <div style={langItem}><span style={dot('#10b981')}/> node.js</div>
              <div style={langItem}><span style={dot('#3b82f6')}/> python 3.1</div>
              <div style={langItem}><span style={dot('#f97316')}/> rustc</div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- STYLES ---

const indicatorTopStyle: React.CSSProperties = {
  position: 'absolute', left: '50%', top: '-20px', transform: 'translateX(-50%)',
  width: '20px', height: '20px', borderRadius: '50%',
  backgroundColor: 'rgba(0, 102, 255, 0.3)', backdropFilter: 'blur(4px)',
  border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 1002
};

const tabHeaderStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  background: '#181818', height: '35px', minHeight: '35px', borderBottom: '1px solid #2b2b2b', paddingLeft: '10px',
  transition: 'opacity 0.2s'
};

const tabGroupStyle: React.CSSProperties = { display: 'flex', height: '100%', alignItems: 'center', gap: '2px' };

const rightControlsStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '12px' };

const instanceControlStyle: React.CSSProperties = { 
  display: 'flex', alignItems: 'center', background: '#1e1e1e', padding: '2px 8px', borderRadius: '4px', border: '1px solid #333' 
};

const headerActionBtn: React.CSSProperties = {
  background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.2s'
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute', bottom: '30px', right: 0, background: '#252526', border: '1px solid #454545', 
  boxShadow: '0 4px 12px rgba(0,0,0,0.5)', width: '150px', zIndex: 2000, padding: '4px 0'
};

const contentAreaStyle: React.CSSProperties = { flex: 1, flexDirection: 'row', backgroundColor: '#0c0c0c', overflow: 'hidden', transition: 'opacity 0.3s' };

const terminalBody: React.CSSProperties = { flex: 1, padding: '15px', overflowY: 'auto' };

const sideLanguagePanel: React.CSSProperties = {
  width: '120px', borderLeft: '1px solid #2b2b2b', background: '#121212', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px'
};

const langItem: React.CSSProperties = { fontSize: '10px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px' };

const dot = (color: string) => ({ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: color });

const divider = { width: '1px', height: '16px', background: '#444' };
const innerDivider = { width: '1px', height: '12px', background: '#333', margin: '0 8px' };

const winBtnStyle: React.CSSProperties = { background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' };

const TabItem = ({ label, icon, active, onClick, count }: any) => (
  <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '6px', padding: '0 12px',
      fontSize: '11px', cursor: 'pointer', height: '35px',
      color: active ? '#fff' : '#858585',
      borderBottom: active ? '1px solid #fff' : 'none',
      background: active ? 'rgba(255,255,255,0.03)' : 'transparent',
      transition: '0.2s'
  }}>
    {icon} 
    <span style={{textTransform: 'capitalize'}}>{label}</span>
    {count && <span style={{background: '#007acc', color: '#fff', fontSize: '9px', padding: '0 5px', borderRadius: '10px', marginLeft: '4px'}}>{count}</span>}
  </div>
);