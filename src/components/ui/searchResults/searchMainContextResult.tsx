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
import { Video, FileText, Layers } from 'lucide-react';

interface MainContextProps {
  query: string;
  children?: React.ReactNode;
}

export const SearchMainContextResult: React.FC<MainContextProps> = ({ query, children }) => {
  const cardStyle = { display: 'flex', alignItems: 'center', gap: '8px', background: '#1a1a1a', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', border: '1px solid #333', color: '#eee' };

  return (
    <main className="search-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div className="index-section" style={{ padding: '20px' }}>
        <div className="section-label" style={{ fontSize: '11px', color: '#666', marginBottom: '12px' }}>SYSTEM INDEX MATCHES</div>
        <div className="horizontal-results" style={{ display: 'flex', gap: '10px' }}>
          <div className="mini-card" style={cardStyle}><Video size={14} color="#3b82f6"/> {query}_render.mp4</div>
          <div className="mini-card" style={cardStyle}><FileText size={14} color="#10b981"/> metadata.json</div>
          <div className="mini-card" style={cardStyle}><Layers size={14} color="#f59e0b"/> Plugin: {query}-fx</div>
        </div>
      </div>
      {children}
    </main>
  );
};