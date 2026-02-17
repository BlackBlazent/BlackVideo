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
  Zap, Shield, MessageSquareText, Cpu, FileVideo, 
  Layers, Tv, Box, Terminal, Puzzle, ShoppingBag, 
  Library
} from 'lucide-react';

const ProjectOverviewUI = () => (
  <section id="overview" className="about-section">
    <div className="section-header">
      <h1>Modern Media Experience.</h1>
      <p className="section-description">
        BlackVideo is a proprietary video player platform engineered for performance and creative flexibility. 
        Designed for local playback and community-driven content, it prioritizes a user-first experience 
        without the noise of traditional media platforms.
      </p>
    </div>
    
    <div className="feature-grid">
      {/* High Performance */}
      <div className="feature-card">
        <div className="feature-icon-wrapper high-performance">
          <Zap size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>High Performance</h4>
          <p>Low-latency hardware decoding and resource-aware scheduling for flawless 4K HDR playback.</p>
        </div>
      </div>

      {/* Offline First */}
      <div className="feature-card">
        <div className="feature-icon-wrapper offline-first">
          <Shield size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Privacy First</h4>
          <p>Local-only processing ensures your library remains private. Your data never leaves your machine.</p>
        </div>
      </div>

      {/* AI Assisted */}
      <div className="feature-card">
        <div className="feature-icon-wrapper ai-zephyra">
          <MessageSquareText size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Ask Zephyra AI</h4>
          <p>Contextual intelligence that summarizes scenes, identifies metadata, and answers queries in real-time.</p>
        </div>
      </div>

      {/* Codecs */}
      <div className="feature-card">
        <div className="feature-icon-wrapper codecs">
          <Cpu size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Advanced Codecs</h4>
          <p>Native support for AV1, HEVC, and VP9, ensuring maximum efficiency and visual fidelity.</p>
        </div>
      </div>

      {/* Formats */}
      <div className="feature-card">
        <div className="feature-icon-wrapper formats">
          <FileVideo size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Universal Formats</h4>
          <p>Comprehensive support for MKV, MP4, WebM, and professional containers without external plugins.</p>
        </div>
      </div>

      {/* Lightweight */}
      <div className="feature-card">
        <div className="feature-icon-wrapper lightweight">
          <Layers size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Minimalist Core</h4>
          <p>A lightweight binary footprint designed to run efficiently even on background-heavy systems.</p>
        </div>
      </div>

      {/* Playground */}
      <div className="feature-card">
        <div className="feature-icon-wrapper theater">
          <Tv size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Theater Stage</h4>
          <p>An immersive "Playground" environment designed for high-focus local video consumption.</p>
        </div>
      </div>

      {/* Smart Library */}
      <div className="feature-card">
        <div className="feature-icon-wrapper library">
          <Library size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Smart Library</h4>
          <p>Automated grouping and metadata enrichment to keep your local archives organized and searchable.</p>
        </div>
      </div>

      {/* MCP */}
      <div className="feature-card">
        <div className="feature-icon-wrapper mcp">
          <Box size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>MCP Integration</h4>
          <p>Full Model Context Protocol support to connect your video data with external AI agents safely.</p>
        </div>
      </div>

      {/* Built-in Terminal */}
      <div className="feature-card">
        <div className="feature-icon-wrapper terminal">
          <Terminal size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Integrated Terminal</h4>
          <p>Execute FFmpeg commands or automation scripts directly within the player environment.</p>
        </div>
      </div>

      {/* Extensions Systems */}
      <div className="feature-card">
        <div className="feature-icon-wrapper extensions">
          <Puzzle size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Extension System</h4>
          <p>Modular architecture that allows for custom playback logic and UI skinning hooks.</p>
        </div>
      </div>

      {/* Extension marketplace */}
      <div className="feature-card">
        <div className="feature-icon-wrapper marketplace">
          <ShoppingBag size={24} strokeWidth={2.5} />
        </div>
        <div className="feature-content">
          <h4>Marketplace</h4>
          <p>A community hub for downloading community-built presets, shaders, and player extensions.</p>
        </div>
      </div>

    </div>
  </section>
);

export default ProjectOverviewUI;