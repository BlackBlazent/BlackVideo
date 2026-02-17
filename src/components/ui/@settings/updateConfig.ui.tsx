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
import { Rocket, Mail } from 'lucide-react';

const UpdateConfigUI = () => (
  <div className="tab-pane animate-fade-in">
    <div className="settings-group">
      <div className="group-title-area">
        <Rocket size={22} className="group-icon" strokeWidth={2.5} />
        <h2>Engine Version</h2>
      </div>
      <div className="settings-row no-border">
        <div className="settings-info">
          <h4>BlackVideo Core</h4>
          <p>Version 1.0.0-alpha • Build 2026.01</p>
        </div>
        <span className="status-badge">LATEST</span>
      </div>
    </div>
    <button className="btn-primary full-width">Check For Updates</button>
    <div className="settings-group" style={{marginTop: '30px'}}>
      <div className="group-title-area">
        <Mail size={22} className="group-icon" strokeWidth={2.5} />
        <h2>Release Notes</h2>
      </div>
      <div className="release-note">
        <div className="release-header">
          <span className="release-version">v1.0.0-alpha</span>
          <span className="release-date">January 2026</span>
        </div>
        <ul className="release-list">
          <li>Initial release with core video processing</li>
          <li>Settings management system</li>
          <li>YouTube integration support</li>
        </ul>
      </div>
    </div>
  </div>
);

export default UpdateConfigUI;