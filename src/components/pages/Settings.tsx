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
  User, Palette, CreditCard, Puzzle, Key, 
  FileVideo, HelpCircle, Rocket 
} from 'lucide-react';

// Import UI Modules
import AccountManagementUI from '../ui/@settings/accounManagement.ui';
import PersonalizationUI from '../ui/@settings/personalization.ui';
import UpdateConfigUI from '../ui/@settings/updateConfig.ui';
import BillingManagementUI from '../ui/@settings/billingManagement.ui';
import ExtensionSystemsUI from '../ui/@settings/extensionSystems.ui';
import ApiProviderUI from '../ui/@settings/apiProvider.ui';
import VideoMetadataUI from '../ui/@settings/videoMetadata.ui';
import FaqUI from '../ui/@settings/faq.ui';

import '../../styles/settings.css';
import '../../styles/common.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');

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
      case 'account': return <AccountManagementUI />;
      case 'personalization': return <PersonalizationUI />;
      case 'billing': return <BillingManagementUI />;
      case 'extensions': return <ExtensionSystemsUI />;
      case 'api': return <ApiProviderUI />;
      case 'metadata': return <VideoMetadataUI />;
      case 'help': return <FaqUI />;
      case 'updates': return <UpdateConfigUI />;
      default: return <AccountManagementUI />;
    }
  };

  return (
    <main className="Settings-Page" id="SettingsArsenal">
      <aside className="settings-sidebar">
        <div className="settings-sidebar-header">
          <span className="prefs-title">SETTINGS</span>
          <span className="system-label"></span>
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
      </aside>

      <div className="settings-content">
        <header className="settings-header">
          <h1>{navItems.find(i => i.id === activeTab)?.label}</h1>
          <p className="settings-subtitle">BlackVideo Engine v1.0 / Configuration Hub</p>
        </header>

        <div className="settings-body">
          {renderContent()}
        </div>
        <div className="safeSpace"></div>
      </div>
    </main>
  );
};

export default Settings;