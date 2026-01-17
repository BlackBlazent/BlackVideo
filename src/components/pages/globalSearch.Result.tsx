/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Search, Video, FileText, 
  Cpu, Layers, GripHorizontal, Paperclip, Send, 
  Sparkles, MousePointer2, ChevronDown, Minus, Square, Copy
} from 'lucide-react';

interface SearchResultProps {
  query: string;
  onClose: () => void;
  isVisible: boolean;
}

export const GlobalSearchResult: React.FC<SearchResultProps> = ({ query, onClose, isVisible }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [position, setPosition] = useState({ x: 50, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  
  const modalRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
      }
      if (isResizing && !isMaximized) {
        setDimensions(prev => ({
          width: Math.max(800, prev.width + e.movementX),
          height: Math.max(500, prev.height + e.movementY)
        }));
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isMaximized]);

  if (!isVisible) return null;

  const modalStyle: React.CSSProperties = isMaximized 
    ? { top: '55px', bottom: '40px', left: '10px', right: '10px', width: 'auto', height: 'auto', borderRadius: '0' }
    : { top: position.y, left: position.x, width: dimensions.width, height: dimensions.height };

  return (
    <div className="search-result-modal" style={modalStyle} ref={modalRef}>
      {/* WINDOW FRAME / NAV */}
      <div className="search-nav drag-handle" onMouseDown={handleMouseDown}>
        <div className="nav-left">
          <GripHorizontal className="drag-handle-icon" size={14} />
          <div className="search-meta">
            <span className="search-display-name">BlackVideo Search // <strong>{query}</strong></span>
          </div>
        </div>
        
        {/* Windows Style Controls */}
        <div className="nav-right-win">
          <button className="win-ctrl-btn"><Minus size={14} /></button>
          <button className="win-ctrl-btn" onClick={() => setIsMaximized(!isMaximized)}>
            {isMaximized ? <Copy size={12} style={{transform: 'rotate(180deg)'}} /> : <Square size={12} />}
          </button>
          <button className="win-ctrl-btn win-close-btn" onClick={onClose}><X size={16} /></button>
        </div>
      </div>

      <div className="search-result-layout">
        {/* ASIDE SIDEBAR */}
        <aside className="search-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">FILTERS</div>
            <SidebarItem icon={<Search size={14}/>} label="All Results" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
            <SidebarItem icon={<Video size={14}/>} label="Videos" active={activeFilter === 'Videos'} onClick={() => setActiveFilter('Videos')} />
            <SidebarItem icon={<FileText size={14}/>} label="Documents" active={activeFilter === 'Docs'} onClick={() => setActiveFilter('Docs')} />
            <SidebarItem icon={<Layers size={14}/>} label="Extensions" active={activeFilter === 'Ext'} onClick={() => setActiveFilter('Ext')} />
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">AI AGENTS</div>
            <SidebarItem icon={<Cpu size={14}/>} label="System Core" active={false} onClick={() => {}} />
            <SidebarItem icon={<Sparkles size={14}/>} label="Perplexity" active={false} onClick={() => {}} />
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="search-main-content">
          <div className="index-section">
            <div className="section-label">SYSTEM INDEX MATCHES</div>
            <div className="horizontal-results">
              <div className="mini-card"><Video size={14} color="#3b82f6"/> {query}_render.mp4</div>
              <div className="mini-card"><FileText size={14} color="#10b981"/> metadata.json</div>
              <div className="mini-card"><Layers size={14} color="#f59e0b"/> Plugin: {query}-fx</div>
            </div>
          </div>

          {/* AI CHAT INTERFACE */}
          <div className="ai-chat-workspace">
            <div className="chat-header">
              <div className="llm-selector">
                <Sparkles size={12} color="var(--primary-blue)" />
                <span>DeepSeek-V3</span>
                <ChevronDown size={12} />
              </div>
              <span className="chat-status">Ready to process {query}</span>
            </div>

            <div className="chat-messages">
              <div className="ai-msg">
                I've analyzed the search parameters for <strong>{query}</strong>. 
                There are 3 local files and 1 extension related to this. Would you like me to generate a playback summary or check for corrupted frames?
              </div>
            </div>

            <div className="chat-input-area">
              <div className="chat-input-wrapper">
                <div className="chat-tools">
                  <button title="Tag File (@)"><Paperclip size={14} /></button>
                  <button title="Cursor Selection"><MousePointer2 size={14} /></button>
                </div>
                <input type="text" placeholder={`Message AI Agent about ${query}...`} />
                <button className="send-btn"><Send size={14} /></button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* BOTTOM RESIZE HANDLE */}
      {!isMaximized && (
        <div className="resize-handle-bottom" onMouseDown={handleResizeStart} />
      )}
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div className={`sidebar-item ${active ? 'active' : ''}`} onClick={onClick}>
    {icon} <span>{label}</span>
  </div>
);