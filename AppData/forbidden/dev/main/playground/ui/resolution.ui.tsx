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
import { Monitor, X, Check, ShieldCheck, Zap } from 'lucide-react';
import { resolutionOptions, handleResolutionSelect, initResolutionController } from '../playbacks/resolution';

import '../../../../../../src/styles/modals/resolution.controller.css';

interface ResolutionUIProps {
  isVisible: boolean;
  onClose: () => void;
}

const ResolutionUI: React.FC<ResolutionUIProps> = ({ isVisible, onClose }) => {
  const [selectedResolution, setSelectedResolution] = useState<string>('1080p');

  useEffect(() => {
    initResolutionController();
  }, []);

  const handleSelectionChange = (value: string) => {
    setSelectedResolution(value);
    // Real-time update logic preserved
    handleResolutionSelect(value);
  };

  if (!isVisible) return null;

  return (
    <div id="resolution-popup" className="resolution-engine-card">
      {/* Header */}
      <div className="res-header">
        <div className="header-label">
          <Monitor size={14} className="text-accent" />
          <span>Resolution Engine</span>
        </div>
        <button className="close-icon-btn" onClick={onClose}><X size={14} /></button>
      </div>
      
      {/* Scrollable Content */}
      <div className="res-content">
        <div className="res-section-label">
          <ShieldCheck size={10} />
          <span>Quality & Format</span>
        </div>
        
        <div className="res-options-list">
          {resolutionOptions.map((option) => (
            <div 
              className={`res-option-row ${selectedResolution === option.value ? 'active' : ''}`}
              key={option.value} 
              onClick={() => handleSelectionChange(option.value)}
            >
              <div className="res-info-main">
                <span className="res-text">{option.label}</span>
                {option.notes && <span className="res-notes">{option.notes}</span>}
              </div>
              
              <div className="res-indicator">
                {selectedResolution === option.value ? (
                  <Check size={14} className="text-accent" />
                ) : (
                  <div className="res-dot" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="res-footer">
        <div className="res-status-hint">
          <Zap size={10} />
          <span>Stream optimized</span>
        </div>
        <div className="res-button-group">
          <button className="res-btn btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="res-btn btn-apply"
            onClick={() => {
              handleResolutionSelect(selectedResolution);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolutionUI;