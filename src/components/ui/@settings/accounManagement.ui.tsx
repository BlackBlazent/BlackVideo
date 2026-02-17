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
  ShieldCheck, Key, Youtube, Twitter, CheckCircle2, 
  Video, Facebook, Twitch, Lock, Trash2, User, Copy 
} from 'lucide-react';

const AccountManagementUI = () => {
  const platforms = [
    { id: 'yt', name: 'YouTube', icon: <Youtube size={20} />, color: 'youtube', connected: false },
    { id: 'tw', name: 'X (Twitter)', icon: <Twitter size={20} />, color: 'twitter', connected: true, username: '@BlackVideo_User' },
    { id: 'fb', name: 'Facebook', icon: <Facebook size={20} />, color: 'facebook', connected: false },
    { id: 'tk', name: 'TikTok', icon: <Video size={20} />, color: 'tiktok', connected: false },
    { id: 'th', name: 'Twitch', icon: <Twitch size={20} />, color: 'twitch', connected: false },
  ];

  return (
    <div className="tab-pane animate-fade-in account-page">
      
      {/* 1. Profile Identity Section */}
      <div className="settings-group">
        <div className="group-title-area">
          <User size={22} className="group-icon color-blue" strokeWidth={2.5} />
          <h2>BlackVideo ID</h2>
        </div>
        
        <div className="profile-hero">
          <div className="avatar-wrapper">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zephyra" alt="Profile" />
            <button className="avatar-edit">Edit</button>
          </div>
          <div className="profile-meta">
            <div className="meta-row">
              <label>Full Name</label>
              <div className="meta-value">Zephyra Admin <button className="text-btn">Edit</button></div>
            </div>
            <div className="meta-row">
              <label>Username</label>
              <div className="meta-value">@zephyra_core</div>
            </div>
            <div className="meta-row">
              <label>User ID</label>
              <div className="meta-value mono">BV-99283-X <Copy size={12} className="copy-icon" /></div>
            </div>
          </div>
        </div>

        <div className="settings-row">
          <div className="settings-info">
            <h4>Security Email</h4>
            <p className="email-text">user@blackvideo.core</p>
          </div>
          <button className="btn-secondary">Update Email</button>
        </div>
      </div>

      {/* 2. Password & Security */}
      <div className="settings-group">
        <div className="group-title-area">
          <Lock size={22} className="group-icon color-orange" strokeWidth={2.5} />
          <h2>Security & Password</h2>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Account Password</h4>
            <p>Last changed 3 months ago.</p>
          </div>
          <button className="btn-secondary">Change Password</button>
        </div>
        <div className="settings-row">
          <div className="settings-info">
            <h4>Two-Factor Authentication</h4>
            <p>Add an extra layer of security to your account.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* 3. Ecosystem Authorization */}
      <div className="settings-group">
        <div className="group-title-area">
          <Key size={22} className="group-icon color-purple" strokeWidth={2.5} />
          <h2>Ecosystem Authorization</h2>
        </div>
        <div className="platforms-grid">
          {platforms.map((p) => (
            <div key={p.id} className={`account-card ${p.connected ? 'connected' : ''}`}>
              <div className={`auth-icon-wrapper ${p.color}`}>
                {p.icon}
              </div>
              <div className="account-info">
                <h4>{p.name}</h4>
                {p.connected ? (
                  <p className="connected-text">
                    <CheckCircle2 size={12} className="check-icon" /> {p.username}
                  </p>
                ) : (
                  <p>Not linked</p>
                )}
              </div>
              <button className={p.connected ? "btn-secondary-sm" : "btn-primary-sm"}>
                {p.connected ? 'Manage' : 'Link'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Danger Zone (Bottom) */}
      <div className="settings-group danger-zone">
        <div className="group-title-area">
          <Trash2 size={22} className="group-icon color-red" strokeWidth={2.5} />
          <h2>Danger Zone</h2>
        </div>
        <div className="settings-row border-none">
          <div className="settings-info">
            <h4 className="text-red">Delete Account</h4>
            <p>Permanently remove your data and subscriptions. This cannot be undone.</p>
          </div>
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagementUI;