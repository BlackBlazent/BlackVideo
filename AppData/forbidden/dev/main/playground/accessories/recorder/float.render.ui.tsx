/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// float.render.ui.tsx - Floating popup UI for recording mode selection
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface FloatingRecordUIProps {
  isVisible: boolean;
  onClose: () => void;
  onModeSelect: (mode: 'video' | 'camera' | 'both') => void;
}

const FloatingRecordUI: React.FC<FloatingRecordUIProps> = ({ isVisible, onClose, onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState<'video' | 'camera' | 'both' | null>(null);

  if (!isVisible) return null;

  const handleModeSelect = (mode: 'video' | 'camera' | 'both') => {
    setSelectedMode(mode);
    onModeSelect(mode);
  };

  return (
    <div className="floating-record-overlay">
      <div className="floating-record-popup">
        <div className="popup-header">
          <h3>Recording Mode</h3>
          <button className="close-btn" onClick={onClose}>
            <span>×</span>
          </button>
        </div>
        
        <div className="recording-modes">
          <div 
            className={`mode-option ${selectedMode === 'video' ? 'selected' : ''}`}
            onClick={() => handleModeSelect('video')}
          >
            <div className="mode-icon">
              <span className="mode-emoji">🎥</span>
            </div>
            <div className="mode-info">
              <h4>Record Video Player</h4>
              <p>Capture the main video playback</p>
            </div>
          </div>

          <div 
            className={`mode-option ${selectedMode === 'camera' ? 'selected' : ''}`}
            onClick={() => handleModeSelect('camera')}
          >
            <div className="mode-icon">
              <span className="mode-emoji">📱</span>
            </div>
            <div className="mode-info">
              <h4>Record Camera</h4>
              <p>Capture front/back camera feed</p>
            </div>
          </div>

          <div 
            className={`mode-option ${selectedMode === 'both' ? 'selected' : ''}`}
            onClick={() => handleModeSelect('both')}
          >
            <div className="mode-icon">
              <span className="mode-emoji">📹</span>
            </div>
            <div className="mode-info">
              <h4>Record Both</h4>
              <p>Picture-in-picture recording</p>
            </div>
          </div>
        </div>

        <div className="popup-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Standalone initialization function
export const initializeFloatingRecordUI = () => {
  let isUIVisible = false;
  let floatingUIRoot: any = null;

  const createFloatingUIContainer = () => {
    const container = document.createElement('div');
    container.id = 'floating-record-ui-container';
    document.body.appendChild(container);
    return container;
  };

  const showFloatingUI = () => {
    if (!floatingUIRoot) {
      const container = createFloatingUIContainer();
      floatingUIRoot = createRoot(container);
    }

    isUIVisible = true;
    
    floatingUIRoot.render(
      <FloatingRecordUI
        isVisible={isUIVisible}
        onClose={() => {
          isUIVisible = false;
          floatingUIRoot.render(
            <FloatingRecordUI 
              isVisible={false} 
              onClose={() => {}} 
              onModeSelect={() => {}} 
            />
          );
        }}
        onModeSelect={(mode) => {
          console.log('Selected recording mode:', mode);
          // Import and initialize recorder controls
          import('./recorder.control.ui.tsx').then(({ initializeRecorderControls }) => {
            initializeRecorderControls(mode);
          });
          
          isUIVisible = false;
          floatingUIRoot.render(
            <FloatingRecordUI 
              isVisible={false} 
              onClose={() => {}} 
              onModeSelect={() => {}} 
            />
          );
        }}
      />
    );
  };

  // Add event listener to the recording button
  const addRecordingButtonListener = () => {
    const recordingBtn = document.getElementById('accessories-screen-record-btn');
    if (recordingBtn) {
      recordingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showFloatingUI();
      });
      console.log('Recording button listener added successfully');
    } else {
      console.warn('Recording button not found, retrying...');
      setTimeout(addRecordingButtonListener, 500);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRecordingButtonListener);
  } else {
    addRecordingButtonListener();
  }


// Add CSS styles
const addFloatingStyles = () => {
  if (document.getElementById('floating-record-ui-styles')) return;

  const style = document.createElement('style');
  style.id = 'floating-record-ui-styles';
  style.textContent = `.floating-record-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
      }

      .floating-record-popup {
        background: var(--background-dark);
        border: 1px solid var(--border-medium);
        border-radius: 16px;
        padding: 24px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease-out;
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-subtle);
      }

      .popup-header h3 {
        color: var(--text-primary);
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        color: var(--text-primary);
        background: var(--surface-color);
      }

      .recording-modes {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .mode-option {
        display: flex;
        align-items: center;
        padding: 16px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .mode-option:hover {
        background: var(--surface-color);
        border-color: var(--border-medium);
        transform: translateY(-1px);
      }

      .mode-option.selected {
        background: var(--primary-blue);
        border-color: var(--primary-blue);
        color: white;
      }

      .mode-icon {
        width: 48px;
        height: 48px;
        background: var(--background-medium);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
      }

      .mode-option.selected .mode-icon {
        background: rgba(255, 255, 255, 0.2);
      }

      .mode-icon img {
        width: 24px;
        height: 24px;
        opacity: 0.8;
      }

      .mode-info h4 {
        margin: 0 0 4px 0;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 16px;
      }

      .mode-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
      }

      .mode-option.selected .mode-info h4,
      .mode-option.selected .mode-info p {
        color: white;
      }

      .popup-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .cancel-btn {
        padding: 8px 16px;
        background: var(--surface-color);
        color: var(--text-secondary);
        border: 1px solid var(--border-medium);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .cancel-btn:hover {
        background: var(--background-medium);
        color: var(--text-primary);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }`;
  document.head.appendChild(style);
};

addFloatingStyles();
};

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
initializeFloatingRecordUI();
}


  {/*
  // Add CSS styles
  const addStyles = () => {
    if (document.getElementById('floating-record-ui-styles')) return;

    const style = document.createElement('style');
    style.id = 'floating-record-ui-styles';
    style.textContent = `
      .floating-record-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease-out;
      }

      .floating-record-popup {
        background: var(--background-dark);
        border: 1px solid var(--border-medium);
        border-radius: 16px;
        padding: 24px;
        min-width: 400px;
        max-width: 500px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease-out;
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 1px solid var(--border-subtle);
      }

      .popup-header h3 {
        color: var(--text-primary);
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .close-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 24px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all 0.2s ease;
      }

      .close-btn:hover {
        color: var(--text-primary);
        background: var(--surface-color);
      }

      .recording-modes {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 24px;
      }

      .mode-option {
        display: flex;
        align-items: center;
        padding: 16px;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .mode-option:hover {
        background: var(--surface-color);
        border-color: var(--border-medium);
        transform: translateY(-1px);
      }

      .mode-option.selected {
        background: var(--primary-blue);
        border-color: var(--primary-blue);
        color: white;
      }

      .mode-icon {
        width: 48px;
        height: 48px;
        background: var(--background-medium);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        flex-shrink: 0;
      }

      .mode-option.selected .mode-icon {
        background: rgba(255, 255, 255, 0.2);
      }

      .mode-icon img {
        width: 24px;
        height: 24px;
        opacity: 0.8;
      }

      .mode-info h4 {
        margin: 0 0 4px 0;
        color: var(--text-primary);
        font-weight: 600;
        font-size: 16px;
      }

      .mode-info p {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
      }

      .mode-option.selected .mode-info h4,
      .mode-option.selected .mode-info p {
        color: white;
      }

      .popup-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }

      .cancel-btn {
        padding: 8px 16px;
        background: var(--surface-color);
        color: var(--text-secondary);
        border: 1px solid var(--border-medium);
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
      }

      .cancel-btn:hover {
        background: var(--background-medium);
        color: var(--text-primary);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  };

  addStyles();
};

// Auto-initialize when this module is imported
if (typeof window !== 'undefined') {
  initializeFloatingRecordUI();
}
*/}