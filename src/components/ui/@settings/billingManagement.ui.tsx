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
  CreditCard, 
  History, 
  Package, 
  Zap, 
  CheckCircle2, 
  Download, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

const BillingManagementUI = () => {
  return (
    <div className="tab-pane animate-fade-in billing-page">
      
      {/* 1. Subscription Status Summary */}
      <div className="settings-group active-plan-summary">
        <div className="group-title-area">
          <Zap size={22} className="group-icon highlight" strokeWidth={2.5} />
          <h2>Subscription Status</h2>
        </div>
        <div className="status-card">
          <div className="status-main">
            <div className="plan-badge">PRO PLAN</div>
            <h3>Active since Jan 2026</h3>
            <p>Your next renewal is on <strong>March 12, 2026</strong> for <strong>$19.99</strong>.</p>
          </div>
          <div className="status-actions">
            <button className="btn-secondary">Pause Subscription</button>
            <button className="btn-danger-outline">Cancel</button>
          </div>
        </div>
      </div>

      {/* 2. Usage Metering */}
      <div className="settings-group">
        <div className="group-title-area">
          <Package size={22} className="group-icon" strokeWidth={2.5} />
          <h2>Usage Metering</h2>
        </div>
        <div className="usage-container">
          <div className="usage-item">
            <div className="usage-info">
              <span>Cloud Storage</span>
              <span>85GB / 100GB</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{width: '85%'}}></div></div>
          </div>
          <div className="usage-item">
            <div className="usage-info">
              <span>API Calls</span>
              <span>2.4k / 10k</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{width: '24%'}}></div></div>
          </div>
        </div>
      </div>

      {/* 3. Pricing Plans Table */}
      <div className="settings-group">
        <div className="group-title-area">
          <CheckCircle2 size={22} className="group-icon" strokeWidth={2.5} />
          <h2>Available Plans</h2>
        </div>
        <div className="pricing-grid">
          <div className="price-card">
            <h4>Free</h4>
            <div className="price">$0<span>/mo</span></div>
            <ul>
              <li>720p Rendering</li>
              <li>Basic Stickers</li>
            </ul>
            <button className="btn-secondary" disabled>Current Plan</button>
          </div>
          <div className="price-card featured">
            <div className="popular-tag">Popular</div>
            <h4>Pro</h4>
            <div className="price">$19<span>/mo</span></div>
            <ul>
              <li>4K Rendering</li>
              <li>Unlimited Watermarks</li>
              <li>Priority Support</li>
            </ul>
            <button className="btn-primary">Manage Pro</button>
          </div>
          <div className="price-card">
            <h4>Studio</h4>
            <div className="price">$49<span>/mo</span></div>
            <ul>
              <li>Team Collaboration</li>
              <li>White-label Exports</li>
            </ul>
            <button className="btn-secondary">Upgrade <ArrowRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* 4. Payment Methods */}
      <div className="settings-group">
        <div className="group-title-area">
          <CreditCard size={22} className="group-icon" strokeWidth={2.5} />
          <h2>Payment Methods</h2>
        </div>
        <div className="payment-list">
          <div className="payment-method-item">
            <div className="card-brand">VISA</div>
            <div className="card-details">
              <span>•••• •••• •••• 4242</span>
              <span>Expires 12/28</span>
            </div>
            <span className="default-badge">Primary</span>
            <button className="icon-btn-text">Remove</button>
          </div>
          <button className="add-method-btn">
            <Plus size={16} /> Add New Method
          </button>
        </div>
      </div>

      {/* 5. Billing Address */}
      <div className="settings-group">
        <div className="group-title-area">
          <AlertCircle size={22} className="group-icon" strokeWidth={2.5} />
          <h2>Billing Information</h2>
        </div>
        <div className="billing-form-grid">
          <div className="input-field">
            <label>Billing Email</label>
            <input type="email" placeholder="billing@company.com" />
          </div>
          <div className="input-field">
            <label>Tax ID / VAT</label>
            <input type="text" placeholder="US-1234567" />
          </div>
          <div className="input-field full">
            <label>Full Address</label>
            <textarea placeholder="123 Zephyra St, San Francisco, CA"></textarea>
          </div>
        </div>
      </div>

      {/* 6. Invoicing History */}
      <div className="settings-group">
        <div className="group-title-area">
          <History size={22} className="group-icon" strokeWidth={2.5} />
          <h2>Payment History</h2>
        </div>
        <table className="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Feb 12, 2026</td>
              <td>$19.99</td>
              <td><span className="status-paid">Paid</span></td>
              <td><button className="download-btn"><Download size={14} /></button></td>
            </tr>
            <tr>
              <td>Jan 12, 2026</td>
              <td>$19.99</td>
              <td><span className="status-paid">Paid</span></td>
              <td><button className="download-btn"><Download size={14} /></button></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BillingManagementUI;