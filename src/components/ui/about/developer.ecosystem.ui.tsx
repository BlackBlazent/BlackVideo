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
import { Code2, Palette, Puzzle, Box } from 'lucide-react';

const DeveloperEcosystemUI = () => (
  <section id="developers" className="about-section">
    <div className="section-title-area">
      <Code2 size={22} className="section-icon" strokeWidth={2.5} />
      <h2>Developer Ecosystem</h2>
      <span className="section-badge">MODULAR</span>
    </div>
    <p className="section-text">
      BlackVideo is built as a core engine that supports deep third-party integration. We invite 
      independent creators to redefine what the player can do.
    </p>

    <div className="developer-grid">
      <div className="developer-card">
        <div className="developer-icon themes">
          <Palette size={20} strokeWidth={2.5} />
        </div>
        <h4>Themes</h4>
        <p>Redefine visual identities, from glass-morphic terminals to minimalist theaters.</p>
      </div>

      <div className="developer-card">
        <div className="developer-icon plugins">
          <Puzzle size={20} strokeWidth={2.5} />
        </div>
        <h4>Plugins & Add-ons</h4>
        <p>Enhance playback logic, metadata scraping, or integrate external API services.</p>
      </div>

      <div className="developer-card">
        <div className="developer-icon extensions">
          <Box size={20} strokeWidth={2.5} />
        </div>
        <h4>Extensions</h4>
        <p>Build entirely new functional tabs and playground modes within the core engine.</p>
      </div>
    </div>

    <div className="info-note">
      <span className="note-icon">ℹ</span>
      <p>Core architecture remains proprietary. Extensions are owned by their respective creators.</p>
    </div>
  </section>
);

export default DeveloperEcosystemUI;