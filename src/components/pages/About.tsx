/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useEffect } from 'react';
import { Layers, Target, Code2, Briefcase, Scale } from 'lucide-react';

// Import the sub-components
import ProjectOverviewUI from '../ui/about/project.overview.ui';
import VisionPhilosophyUI from '../ui/about/vision.philosophy.ui';
import DeveloperEcosystemUI from '../ui/about/developer.ecosystem.ui';
import BusinessAllianceUI from '../ui/about/business.allience.ui';
import LegalPoliciesUI from '../ui/about/legal.policies.ui';

import '../../styles/about.css';
import '../../styles/common.css';

const About = () => {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll('.about-section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <Layers size={18} /> },
    { id: 'vision', label: 'Vision & Philosophy', icon: <Target size={18} /> },
    { id: 'developers', label: 'Developer Ecosystem', icon: <Code2 size={18} /> },
    { id: 'business', label: 'Business & Alliances', icon: <Briefcase size={18} /> },
    { id: 'legal', label: 'Legal & Policies', icon: <Scale size={18} /> },
  ];

  return (
    <main className="About-Page" id="AboutArsenal">
      <aside className="about-sidebar">
        <div className="about-sidebar-header">
          <span className="brand-title">ABOUT</span>
          <span className="engine-label"></span> 
        </div>
        
        <nav className="about-nav">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`about-nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.id);
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="about-content">
        <ProjectOverviewUI />
        <VisionPhilosophyUI />
        <DeveloperEcosystemUI />
        <BusinessAllianceUI />
        <LegalPoliciesUI />
        <div className="safeSpace"></div>
      </div>
    </main>
  );
};

export default About;