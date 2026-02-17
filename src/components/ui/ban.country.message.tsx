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

interface BanProps {
  countryName: string;
  countryCode: string;
}

export const BanCountryMessage: React.FC<BanProps> = ({ countryName, countryCode }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10, 10, 10, 0.98)',
      zIndex: 999999, // Cover everything
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      /*padding: '40px',*/
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#ff4d4d', fontSize: '2rem' }}>ACCESS DENIED</h1>
      <p style={{ fontSize: '1.2rem', margin: '20px 0' }}>
        The <strong>{countryName}</strong> is not allowed to use this product.
      </p>
      <p style={{ color: '#888' }}>
        Our systems detected traffic from <strong>{countryCode}</strong>. 
        Access has been permanently restricted for this territory.
      </p>
      <div style={{ marginTop: '30px', border: '1px solid #444', padding: '15px' }}>
        Please exit and uninstall the application.
      </div>
    </div>
  );
};

export default BanCountryMessage;