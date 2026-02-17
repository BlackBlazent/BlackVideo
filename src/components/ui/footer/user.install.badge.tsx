/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

import React, { useState, useEffect } from 'react';
import { initializeInstallerBadge } from '../../../../AppData/forbidden/dev/footer/user.install.badge'; 

const UserInstallBadge: React.FC = () => {
  const [installNumber, setInstallNumber] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const getBadgeData = async () => {
      const num = await initializeInstallerBadge();
      setInstallNumber(num);
    };
    getBadgeData();
  }, []);

  if (installNumber === null) return null;

  return (
    <div 
      id="userLegacyBadge" 
      className="zephyra-badge-installer-pill"
      style={{ 
        position: 'relative', 
        display: 'inline-flex', // Ensures parent wraps the badge tightly
        cursor: 'pointer' 
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="badge-count">{installNumber}</span>

      {isHovered && (
        <div style={tooltipStyle}>
          <div style={arrowStyle} />
          <span style={labelStyle}>USER INDEX</span>
          <span style={numberStyle}>
            #{installNumber.toLocaleString()}
          </span>
          <p style={descStyle}>
            You are the <strong>{getOrdinal(installNumber)}</strong> user to install BlackVideo.
          </p>
        </div>
      )}
    </div>
  );
};

// --- HELPER ---
const getOrdinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// --- STYLES ---

const tooltipStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 'calc(100% + 12px)', // Precise spacing above badge
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#0a0a0a',
  color: '#fff',
  padding: '10px 14px',
  borderRadius: '4px',
  border: '1px solid #333',
  width: 'max-content', // Box expands to fit content
  maxWidth: '270px',    // Prevents it from becoming too wide
  textAlign: 'center',
  boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
  zIndex: 10000,
  pointerEvents: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px'
};

const labelStyle: React.CSSProperties = {
  opacity: 0.5,
  fontSize: '9px',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap'
};

const numberStyle: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '15px',
  color: '#ffd500ff',
  whiteSpace: 'nowrap'
};

const descStyle: React.CSSProperties = {
  margin: '4px 0 0',
  fontSize: '10px',
  lineHeight: '1.3',
  color: '#ccc',
  wordBreak: 'keep-all' // Prevents ugly mid-word breaks
};

const arrowStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  borderWidth: '6px',
  borderStyle: 'solid',
  borderColor: '#333 transparent transparent transparent',
};

export default UserInstallBadge;