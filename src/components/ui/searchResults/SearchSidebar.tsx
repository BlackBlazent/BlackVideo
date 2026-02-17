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
import { Search, Video, FileText, Layers, Cpu, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const SearchSidebar: React.FC<SidebarProps> = ({ activeFilter, setActiveFilter }) => {
  return (
    <aside className="search-sidebar" style={{ width: '220px', borderRight: '1px solid #333', background: '#0e0e0e' }}>
      <div className="sidebar-section">
        <div className="sidebar-label" style={{ padding: '15px 15px 5px', fontSize: '10px', color: '#666' }}>FILTERS</div>
        <SidebarItem icon={<Search size={14}/>} label="All Results" active={activeFilter === 'All'} onClick={() => setActiveFilter('All')} />
        <SidebarItem icon={<Video size={14}/>} label="Videos" active={activeFilter === 'Videos'} onClick={() => setActiveFilter('Videos')} />
        <SidebarItem icon={<FileText size={14}/>} label="Documents" active={activeFilter === 'Docs'} onClick={() => setActiveFilter('Docs')} />
        <SidebarItem icon={<Layers size={14}/>} label="Extensions" active={activeFilter === 'Ext'} onClick={() => setActiveFilter('Ext')} />
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label" style={{ padding: '15px 15px 5px', fontSize: '10px', color: '#666' }}>AI AGENTS</div>
        <SidebarItem icon={<Cpu size={14}/>} label="System Core" active={false} onClick={() => {}} />
        <SidebarItem icon={<Sparkles size={14}/>} label="Perplexity" active={false} onClick={() => {}} />
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div 
    className={`sidebar-item ${active ? 'active' : ''}`} 
    onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 15px',
      fontSize: '13px', cursor: 'pointer', color: active ? '#fff' : '#888',
      background: active ? '#1a1a1a' : 'transparent'
    }}
  >
    {icon} <span>{label}</span>
  </div>
);