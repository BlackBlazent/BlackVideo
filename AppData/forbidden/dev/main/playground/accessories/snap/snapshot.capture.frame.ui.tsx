/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// snapshot.capture.frame.ui.tsx
import React, { useState } from 'react';
import { X, Info, Camera, GripHorizontal } from 'lucide-react';

export const SnapCaptureUI: React.FC<any> = ({ isOpen, onClose, onSave, position }) => {
  const [uiPos, setUiPos] = useState(position);
  const [isDraggingUI, setIsDraggingUI] = useState(false);

  const startUIDrag = (e: React.MouseEvent) => {
    setIsDraggingUI(true);
    const startX = e.clientX - uiPos.left;
    const startY = e.clientY - uiPos.top;

    const onMove = (moveEvent: MouseEvent) => {
      setUiPos({ left: moveEvent.clientX - startX, top: moveEvent.clientY - startY });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setIsDraggingUI(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!isOpen) return null;

  return (
    <div className="snapshot-ui" style={{ left: uiPos.left, top: uiPos.top }}>
      <div className="snapshot-panel">
        <div className="snapshot-header drag-handle" onMouseDown={startUIDrag}>
          <div id="video-frame-tab" className="flex items-center gap-2">
            <GripHorizontal size={14} className="opacity-50" />
            <span className="snapshot-title">Capture Video Frame</span>
          </div>
          <button className="snapshot-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="snapshot-content">
          <div className="snapshot-note">
            <Info size={14} />
            <span>Shift + S for direct capture</span>
          </div>
          <p className="crop-instruction">Adjust area and save</p>
          <div className="snapshot-actions">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-save" onClick={onSave}><Camera size={14} /> Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};