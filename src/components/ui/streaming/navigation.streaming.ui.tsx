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
import { Search, Bell, Server, ChevronDown } from 'lucide-react';

interface NavigationProps {
  platforms: { id: string; name: string }[];
  selectedPlatform: string;
  isPlatformMenuOpen: boolean;
  setIsPlatformMenuOpen: (open: boolean) => void;
  setSelectedPlatform: (id: string) => void;
}

const NavigationStreaming: React.FC<NavigationProps> = ({
  platforms,
  selectedPlatform,
  isPlatformMenuOpen,
  setIsPlatformMenuOpen,
  setSelectedPlatform,
}) => {
  return (
    <nav className="streaming-nav">
      <div className="nav-left-group">
        <span className="logo-text">
          Arsenal<span style={{ color: 'var(--primary-blue)' }}>Stream</span>
        </span>

        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Search movies, shows, genres..." 
            className="search-input"
          />
          <Search className="search-icon" size={16} />
        </div>
      </div>

      <div className="nav-right-group">
        <button className="hidden sm:block" style={{ color: 'var(--text-primary)', background: 'none', border: 'none' }}>
          <Bell size={20} />
        </button>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
            className="platform-trigger"
          >
            <Server size={18} style={{ color: 'var(--primary-blue)' }}/>
            <span className="text-sm font-medium hidden md:block">
              {platforms.find(p => p.id === selectedPlatform)?.name}
            </span>
            <ChevronDown size={14} style={{ transition: 'transform 0.2s' }} className={isPlatformMenuOpen ? 'rotate-180' : ''} />
          </button>
          
          {isPlatformMenuOpen && (
            <div className="platform-dropdown">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => {
                    setSelectedPlatform(platform.id);
                    setIsPlatformMenuOpen(false);
                  }}
                  className={`platform-option ${selectedPlatform === platform.id ? 'active' : ''}`}
                >
                  {platform.name}
                  {selectedPlatform === platform.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'white' }} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationStreaming;