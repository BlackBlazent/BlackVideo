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
import { 
  Layers, 
  Target, 
  Code2, 
  Briefcase, 
  Scale,
  CheckCircle2,
  Zap,
  Shield,
  Palette,
  Puzzle,
  Box
} from 'lucide-react';

const About = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Handle intersection observer to update active tab on scroll
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
    { id: 'overview', label: 'Project Overview', icon: <Layers size={18} /> },
    { id: 'vision', label: 'Vision & Philosophy', icon: <Target size={18} /> },
    { id: 'developers', label: 'Developer Ecosystem', icon: <Code2 size={18} /> },
    { id: 'business', label: 'Business & Alliances', icon: <Briefcase size={18} /> },
    { id: 'legal', label: 'Legal & Policies', icon: <Scale size={18} /> },
  ];

  return (
    <main className="About-Page" id="AboutArsenal">
      {/* Sidebar Navigation */}
      <aside className="about-sidebar">
        <div className="about-sidebar-header">
          <span className="engine-label">CORE ENGINE</span>
          <span className="brand-title">BLACKVIDEO</span>
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

        <div style={{display:'none'}} className="status-card">
          <p className="status-label">Status</p>
          <p className="status-value">
            <CheckCircle2 size={14} className="status-icon" />
            Active Implementation
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="about-content">
        {/* A. About BlackVideo */}
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
            <div className="feature-card">
              <div className="feature-icon-wrapper high-performance">
                <Zap size={24} strokeWidth={2.5} />
              </div>
              <div className="feature-content">
                <h4>High Performance</h4>
                <p>Low-latency decoding and resource-aware scheduling for smooth 4K+ playback.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper offline-first">
                <Shield size={24} strokeWidth={2.5} />
              </div>
              <div className="feature-content">
                <h4>Offline First</h4>
                <p>Your data, your files. We ensure privacy is the default, not an option.</p>
              </div>
            </div>
          </div>
        </section>

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

        {/* B. Developer Ecosystem */}
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

        {/* C. Business & Monetization */}
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

        {/* Legal Sections */}
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

        {/*<footer className="about-footer">
          &copy; {new Date().getFullYear()} BlackVideo Project. All rights reserved. V1.0.0 Stable Build.
        </footer>*/}
      </div>
    </main>
  );
};

export default About;