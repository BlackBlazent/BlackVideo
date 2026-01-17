/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  CreditCard, 
  Puzzle, 
  Key, 
  FileVideo, 
  HelpCircle, 
  Rocket,
  Construction,
  Youtube,
  Twitter,
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

  // Navigation Items with Lucide Icons
  const navItems = [
    { id: 'account', label: 'Account Management', icon: <User size={18} /> },
    { id: 'personalization', label: 'Personalization', icon: <Palette size={18} /> },
    { id: 'billing', label: 'Billing & Subscription', icon: <CreditCard size={18} /> },
    { id: 'extensions', label: 'Extensions & Plugins', icon: <Puzzle size={18} /> },
    { id: 'api', label: 'API Provider', icon: <Key size={18} /> },
    { id: 'metadata', label: 'Video Metadata', icon: <FileVideo size={18} /> },
    { id: 'help', label: 'FAQ & Help', icon: <HelpCircle size={18} /> },
    { id: 'updates', label: 'Updates', icon: <Rocket size={18} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="tab-pane animate-fade-in">
            <div className="settings-group">
              <div className="group-title-area">
                <ShieldCheck size={22} className="group-icon" strokeWidth={2.5} />
                <h2>BlackVideo ID</h2>
              </div>
              
              <div className="settings-row">
                <div className="settings-info">
                  <h4>Profile Identity</h4>
                  <p>How you appear across the BlackVideo ecosystem.</p>
                </div>
                <div className="button-group">
                  <button className="btn-secondary">Change Avatar</button>
                  <button className="btn-secondary">Edit Name</button>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-info">
                  <h4>Security Email</h4>
                  <p className="email-text">user@blackvideo.core</p>
                </div>
                <button className="btn-secondary">Update</button>
              </div>
            </div>

            <div className="settings-group">
              <div className="group-title-area">
                <Key size={22} className="group-icon" strokeWidth={2.5} />
                <h2>Ecosystem Authorization</h2>
              </div>
              
              <div className="account-card">
                <div className="auth-icon-wrapper youtube">
                  <Youtube size={22} strokeWidth={2.5} />
                </div>
                <div className="account-info">
                  <h4>YouTube Integration</h4>
                  <p>Manage remote uploads and data scraping.</p>
                </div>
                <button className="btn-primary">Link Account</button>
              </div>

              <div className="account-card connected">
                <div className="auth-icon-wrapper twitter">
                  <Twitter size={22} strokeWidth={2.5} />
                </div>
                <div className="account-info">
                  <h4>X (Twitter)</h4>
                  <p className="connected-text">
                    <CheckCircle2 size={14} className="check-icon" />
                    Connected as @BlackVideo_User
                  </p>
                </div>
                <button className="btn-secondary">Manage</button>
              </div>
            </div>
          </div>
        );

      case 'personalization':
        return (
          <div className="tab-pane animate-fade-in">
            <div className="settings-group">
              <div className="group-title-area">
                <Palette size={22} className="group-icon" strokeWidth={2.5} />
                <h2>Visual Identity</h2>
              </div>
              
              <div className="settings-row">
                <div className="settings-info">
                  <h4>Engine Theme</h4>
                  <p>Customize the interface surface and accent colors.</p>
                </div>
                <div className="theme-selector">
                  <div className="theme-option active" data-theme="blue">
                    <div className="theme-color" style={{background: '#0066ff'}}></div>
                    <span className="theme-label">Classic Blue</span>
                  </div>
                  <div className="theme-option" data-theme="green">
                    <div className="theme-color" style={{background: '#6cc24a'}}></div>
                    <span className="theme-label">Forest Green</span>
                  </div>
                  <div className="theme-option" data-theme="orange">
                    <div className="theme-color" style={{background: '#ff6b35'}}></div>
                    <span className="theme-label">Cyber Orange</span>
                  </div>
                </div>
              </div>

              <div className="settings-row">
                <div className="settings-info">
                  <h4>Interface Density</h4>
                  <p>Adjust spacing and element sizes.</p>
                </div>
                <select className="select-input">
                  <option>Comfortable</option>
                  <option>Compact</option>
                  <option>Spacious</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'updates':
        return (
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

      default:
        return (
          <div className="tab-pane animate-fade-in construction-pane">
            <div className="construction-content">
              <Construction size={56} className="construction-icon" />
              <h2>Under Construction</h2>
              <p>This settings module is being prepared for the next release.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="Settings-Page" id="SettingsArsenal">
      <aside className="settings-sidebar">
        <div className="settings-sidebar-header">
          <span className="system-label">SYSTEM</span>
          <span className="prefs-title">PREFS</span>
        </div>

        <nav className="settings-nav">
          {navItems.map((item) => (
            <div
              key={item.id}
              className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={{display:'none'}} className="license-card">
          <p className="license-label">License Type</p>
          <p className="license-value">Proprietary Developer</p>
        </div>
      </aside>

      <div className="settings-content">
        <header className="settings-header">
          <h1>{navItems.find(i => i.id === activeTab)?.label}</h1>
          <p className="settings-subtitle">BlackVideo Engine v1.0 / Configuration Hub</p>
        </header>

        <div className="settings-body">
          {renderContent()}
        </div>
      </div>
    </main>
  );
};

export default Settings;