/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, MousePointer2, Type, Search, GripVertical, Power, ChevronDown } from 'lucide-react';
import { highlightColors, processVideoFrameOCR } from './video.ocr';
import '../../../../../../../src/styles/modals/video.ocr.css';

const VideoOCRUI = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [activeColor, setActiveColor] = useState(highlightColors[0]);
  const [detectedText, setDetectedText] = useState("");
  const [lang, setLang] = useState("English");

  // Draggable and Resizable States
  const [pos, setPos] = useState({ x: 30, y: 100 });
  const [size, setSize] = useState({ w: 320, h: 'auto' as number | string });
  const popupRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // --- DRAG LOGIC ---
  const startDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...pos };

    const onMove = (moveEvent: MouseEvent) => {
      setPos({
        x: startPos.x - (moveEvent.clientX - startX),
        y: startPos.y - (moveEvent.clientY - startY),
      });
    };

    const stopMove = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', stopMove);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stopMove);
  };

  // --- RESIZE LOGIC ---
  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = popupRef.current?.offsetWidth || 320;

    const onResize = (moveEvent: MouseEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX);
      if (newWidth > 200 && newWidth < 600) setSize(s => ({ ...s, w: newWidth }));
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', onResize);
      document.removeEventListener('mouseup', stopResize);
    };

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize);
  };

  // --- OCR SELECTION LOGIC ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isActive) return;
    setIsSelecting(true);
    setSelectionRect({ x: e.clientX, y: e.clientY, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) return;
    setSelectionRect(prev => ({
      ...prev,
      w: e.clientX - prev.x,
      h: e.clientY - prev.y
    }));
  };

  const handleMouseUp = async () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (Math.abs(selectionRect.w) > 10) {
      const result = await processVideoFrameOCR(selectionRect);
      setDetectedText(result.text);
    }
  };

  return (
    <div 
      className="video-ocr-container" 
      onMouseMove={handleMouseMove} 
      onMouseUp={handleMouseUp}
      style={{ pointerEvents: isSelecting ? 'auto' : 'none' }}
    >
      {isSelecting && (
        <div 
          className="ocr-bounding-box"
          style={{
            left: selectionRect.w < 0 ? selectionRect.x + selectionRect.w : selectionRect.x,
            top: selectionRect.h < 0 ? selectionRect.y + selectionRect.h : selectionRect.y,
            width: Math.abs(selectionRect.w),
            height: Math.abs(selectionRect.h),
            borderColor: activeColor,
            boxShadow: `0 0 15px ${activeColor}`
          }}
        />
      )}

      <div 
        ref={popupRef}
        className={`ocr-popup ${isMinimized ? 'minimized' : ''} ${!isActive ? 'system-disabled' : ''}`}
        style={{ 
          bottom: `${pos.y}px`, 
          right: `${pos.x}px`, 
          width: isMinimized ? '200px' : `${size.w}px`,
          pointerEvents: 'auto'
        }}
      >
        <div className="ocr-header">
          <div className="header-left">
            <div className="drag-handle" onMouseDown={startDrag}><GripVertical size={14} /></div>
            <Type size={16} className="title-icon" style={{ color: 'var(--primary-blue)' }} />
            <span>OCR Engine</span>
          </div>
          <div className="header-actions">
            <button onClick={() => setIsMinimized(!isMinimized)}><Minus size={14} /></button>
            <button onClick={onClose}><X size={14} /></button>
          </div>
        </div>

        {!isMinimized && (
          <div className="ocr-content">
            <div className="control-bar">
              <button className={`enable-btn ${isActive ? 'on' : ''}`} onClick={() => setIsActive(!isActive)}>
                <Power size={12} />
                {isActive ? 'System Live' : 'Enable OCR'}
              </button>
              <div className="translate-dropdown">
                <span>{lang}</span>
                <ChevronDown size={12} />
                <select onChange={(e) => setLang(e.target.value)} value={lang}>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </div>

            <div className="search-bar">
              <Search size={14} className="text-muted" />
              <input type="text" placeholder="Search text..." />
            </div>

            <div className="text-output">
              <p>{detectedText || (isActive ? "Ready to scan..." : "Enable OCR...")}</p>
            </div>

            <div className="tool-bar">
              <div className="color-grid">
                {highlightColors.map(color => (
                  <button 
                    key={color} 
                    className={`color-dot ${activeColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setActiveColor(color)}
                  />
                ))}
              </div>
              <button 
                className={`cursor-btn ${isActive ? 'pulse' : ''}`} 
                onMouseDown={handleMouseDown}
              >
                <MousePointer2 size={16} style={{ color: isActive ? activeColor : 'var(--text-muted)' }} />
              </button>
            </div>
          </div>
        )}
        <div className="resize-handle" onMouseDown={startResize} />
      </div>
    </div>
  );
};

export default VideoOCRUI;