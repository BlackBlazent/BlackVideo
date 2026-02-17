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
import { Target } from 'lucide-react';

const VisionPhilosophyUI = () => (
  <section id="vision" className="about-section">
    <div className="section-title-area">
      <Target size={22} className="section-icon" strokeWidth={2.5} />
      <h2>Vision & Philosophy</h2>
    </div>
    <p className="section-text">
      BlackVideo exists to return creative control to the viewer. We believe in sustainable software 
      development that respects user intent, avoids forced motion smoothing, and preserves the original 
      cinematic quality of every frame.
    </p>
  </section>
);

export default VisionPhilosophyUI;