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
import { Briefcase } from 'lucide-react';

const BusinessAllianceUI = () => (
  <section id="business" className="about-section">
    <div className="section-title-area">
      <Briefcase size={22} className="section-icon" strokeWidth={2.5} />
      <h2>Business & Alliances</h2>
    </div>

    <div className="business-grid">
      <div className="business-card">
        <h4>Strategic Alliances</h4>
        <p>Collaborations with hardware vendors and codec providers for certified playback.</p>
      </div>
      <div className="business-card">
        <h4>Sponsorships</h4>
        <p>Support BlackVideo's maintenance and infrastructure through professional project backing.</p>
      </div>
    </div>

    <div className="disclosure-box">
      <h4 className="disclosure-title">Monetization Disclosure</h4>
      <p className="disclosure-text">
        The BlackVideo Core experience is ad-free. While we do not show platform-wide ads, 
        third-party extensions may include their own monetization models, subscriptions, or ads 
        under their own creator policies.
      </p>
    </div>
  </section>
);

export default BusinessAllianceUI;