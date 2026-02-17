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
import { Scale } from 'lucide-react';

const LegalPoliciesUI = () => (
  <section id="legal" className="about-section">
    <div className="section-title-area">
      <Scale size={22} className="section-icon" strokeWidth={2.5} />
      <h2>Legal & Policy</h2>
    </div>

    <div className="legal-content">
      <div className="legal-item">
        <h3>Terms & Conditions</h3>
        <p>By using this platform, you agree to our acceptable use guidelines and intellectual property rights.</p>
      </div>

      <div className="legal-item">
        <h3>Privacy Policy</h3>
        <p>We use essential cookies only for security and local preference persistence.</p>
      </div>

      <div className="disclaimer">
        <p>
          Disclaimer: BlackVideo is under active development. Features and UI are subject to change without notice. 
          All third-party trademarks belong to their respective owners.
        </p>
      </div>
    </div>
  </section>
);

export default LegalPoliciesUI;