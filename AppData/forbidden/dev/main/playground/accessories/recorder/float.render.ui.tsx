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
import React, { useState, useRef, useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Video, Camera, X, ChevronRight, GripVertical, Maximize2 } from 'lucide-react';
import '../../../../../../../src/styles/modals/video.recorder.css'; 

interface FloatingRecordUIProps {
  isVisible: boolean;
  onClose: () => void;
  onModeSelect: (mode: 'video' | 'camera-front' | 'camera-back') => void;
}

const FloatingRecordUI: React.FC<FloatingRecordUIProps> = ({ isVisible, onClose, onModeSelect }) => {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [showCameraSubmenu, setShowCameraSubmenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 200 });
  const [size, setSize] = useState({ width: 400, height: 'auto' as number | 'auto' });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 400, height: 400 });
  
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && popupRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        const maxX = window.innerWidth - popupRef.current.offsetWidth;
        const maxY = window.innerHeight - popupRef.current.offsetHeight;
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
      
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(350, Math.min(550, resizeStart.width + deltaX));
        const newHeight = Math.max(350, Math.min(600, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (popupRef.current) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: popupRef.current.offsetWidth,
        height: popupRef.current.offsetHeight
      });
      setIsResizing(true);
    }
  };

  if (!isVisible) return null;

  const handleModeSelect = (mode: 'video' | 'camera-front' | 'camera-back') => {
    setSelectedMode(mode);
    onModeSelect(mode);
  };

  return (
    <div 
      className="floating-record-popup"
      ref={popupRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: size.height === 'auto' ? 'auto' : `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        zIndex: 9999
      }}
    >
      <div className="popup-header" onMouseDown={handleDragStart} style={{ cursor: 'grab' }}>
        <div className="header-left">
          <GripVertical style={{width: '18px', height: '18px', opacity: 'unset', position: 'relative'}} size={18} className="drag-handle" />
          <h3>Recording Mode</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      <div className="recording-modes">
        {/* Video Player Recording */}
        <div 
          className={`mode-option ${selectedMode === 'video' ? 'selected' : ''}`}
          onClick={() => handleModeSelect('video')}
        >
          <div className="mode-icon">
            <Video size={24} className="mode-lucide" />
          </div>
          <div className="mode-info">
            <h4>Record Video Player</h4>
            <p>Capture the main video playback</p>
          </div>
        </div>

        {/* Camera Recording with submenu */}
        <div className="mode-option-wrapper">
          <div 
            className={`mode-option ${selectedMode?.startsWith('camera') ? 'selected' : ''} ${showCameraSubmenu ? 'has-submenu-open' : ''}`}
            onClick={() => setShowCameraSubmenu(!showCameraSubmenu)}
          >
            <div className="mode-icon">
              <Camera size={24} className="mode-lucide" />
            </div>
            <div className="mode-info">
              <h4>Record Camera</h4>
              <p>Capture front/back camera feed</p>
            </div>
            <ChevronRight size={20} className={`submenu-indicator ${showCameraSubmenu ? 'rotated' : ''}`} />
          </div>
          
          {showCameraSubmenu && (
            <div className="submenu-container">
              <div 
                className={`submenu-option ${selectedMode === 'camera-front' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModeSelect('camera-front');
                }}
              >
                <Camera size={18} />
                <span>Record Front Camera (Selfie)</span>
              </div>
              <div 
                className={`submenu-option ${selectedMode === 'camera-back' ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleModeSelect('camera-back');
                }}
              >
                <Camera size={18} />
                <span>Record Back Camera</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="popup-actions">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>

      {/* Resize handle */}
      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
      >
        <Maximize2 size={14} />
      </div>
    </div>
  );
};

// Singleton pattern to prevent duplication
let floatingUIRoot: Root | null = null;
let floatingUIContainer: HTMLElement | null = null;

export const initializeFloatingRecordUI = () => {
  const showFloatingUI = () => {
    // Remove existing container if present
    if (floatingUIContainer) {
      floatingUIContainer.remove();
      floatingUIRoot = null;
      floatingUIContainer = null;
    }

    // Create new container
    floatingUIContainer = document.createElement('div');
    floatingUIContainer.id = 'floating-record-ui-container';
    document.body.appendChild(floatingUIContainer);
    
    // Create root
    floatingUIRoot = createRoot(floatingUIContainer);
    
    floatingUIRoot.render(
      <FloatingRecordUI
        isVisible={true}
        onClose={() => {
          if (floatingUIRoot && floatingUIContainer) {
            floatingUIRoot.unmount();
            floatingUIContainer.remove();
            floatingUIRoot = null;
            floatingUIContainer = null;
          }
        }}
        onModeSelect={(mode) => {
          console.log('Selected recording mode:', mode);
          
          // Import and initialize the controller
          import('./recorder.control.ui').then(({ initializeRecorderControls }) => {
            initializeRecorderControls(mode);
          });
          
          // Close the mode selection popup
          if (floatingUIRoot && floatingUIContainer) {
            floatingUIRoot.unmount();
            floatingUIContainer.remove();
            floatingUIRoot = null;
            floatingUIContainer = null;
          }
        }}
      />
    );
  };

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addRecordingButtonListener);
  } else {
    addRecordingButtonListener();
  }
};

if (typeof window !== 'undefined') {
  initializeFloatingRecordUI();
}
