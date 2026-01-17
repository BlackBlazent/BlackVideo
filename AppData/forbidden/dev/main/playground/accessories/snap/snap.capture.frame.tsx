/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// snap.capture.frame.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SnapCaptureUI } from './snapshot.capture.frame.ui';
import { processFrameCapture, downloadImage } from './snapshot.capture.frame';
import { notifier } from '../../../../../../../scripts/global.notifier.store';
import { SaveCaptureFrame } from '../../../../global/modules/savedCaptureFrame';
import '../../../../../../../src/styles/modals/snap.capture.frame.css';

export const SnapCaptureController = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const [videoRect, setVideoRect] = useState<DOMRect | null>(null);
  
  const dragStart = useRef({ x: 0, y: 0 });
  const initialCrop = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // 1. Unified Save Logic (Production Ready)
  const onSaveAction = useCallback(async () => {
    const video = document.querySelector('video');
    if (!video) return;

    try {
      // Process the capture
      const { dataUri } = await processFrameCapture(video, cropArea);
      
      // Trigger download and get the high-res filename
      const fileName = downloadImage(dataUri);

      // Trigger Global Notifier with the Preview UI
      notifier.notify(
        "Frame Captured",
        <SaveCaptureFrame imageSrc={dataUri} fileName={fileName} />,
        "saved"
      );
    } catch (err) {
      console.error("Capture Error:", err);
      notifier.notify("Capture Error", "Failed to process video frame.", "error");
    }
  }, [cropArea]);

  const updateVideoRect = useCallback(() => {
    const video = document.querySelector('video');
    if (video) setVideoRect(video.getBoundingClientRect());
  }, []);

  // 2. Lifecycle & Shortcut Listeners
  useEffect(() => {
    if (isOpen) {
      updateVideoRect();
      window.addEventListener('resize', updateVideoRect);
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.shiftKey && e.key.toUpperCase() === 'S') {
          e.preventDefault();
          onSaveAction();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      
      return () => {
        window.removeEventListener('resize', updateVideoRect);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, updateVideoRect, onSaveAction]);

  // 3. Mouse Interaction Logic
  const handleMouseDown = (e: React.MouseEvent, action: 'drag' | string) => {
    e.preventDefault();
    e.stopPropagation();
    dragStart.current = { x: e.clientX, y: e.clientY };
    initialCrop.current = { ...cropArea };
    
    if (action === 'drag') setIsDragging(true);
    else setIsResizing(action);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging && !isResizing) return;
      if (!videoRect) return;

      const deltaX = e.clientX - dragStart.current.x;
      const deltaY = e.clientY - dragStart.current.y;

      setCropArea(() => {
        let { x, y, width, height } = initialCrop.current;

        if (isDragging) {
          x = Math.max(0, Math.min(x + deltaX, videoRect.width - width));
          y = Math.max(0, Math.min(y + deltaY, videoRect.height - height));
        } else {
          if (isResizing?.includes('e')) width = Math.max(20, width + deltaX);
          if (isResizing?.includes('s')) height = Math.max(20, height + deltaY);
          if (isResizing?.includes('w')) {
            const newX = Math.max(0, x + deltaX);
            width += (x - newX);
            x = newX;
          }
          if (isResizing?.includes('n')) {
            const newY = Math.max(0, y + deltaY);
            height += (y - newY);
            y = newY;
          }
        }
        return { x, y, width, height };
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, videoRect]);

  if (!isOpen || !videoRect) return null;

  return (
    <>
      <div className="crop-overlay-wrapper" style={{ 
        left: videoRect.left, 
        top: videoRect.top, 
        width: videoRect.width, 
        height: videoRect.height 
      }}>
        <div 
          className="crop-selection-box"
          onMouseDown={(e) => handleMouseDown(e, 'drag')}
          style={{ left: cropArea.x, top: cropArea.y, width: cropArea.width, height: cropArea.height }}
        >
          {['nw', 'ne', 'sw', 'se', 'n', 's', 'w', 'e'].map(handle => (
            <div 
              key={handle} 
              className={`crop-handle ${handle}`} 
              onMouseDown={(e) => handleMouseDown(e, handle)}
            />
          ))}
        </div>
      </div>

      <SnapCaptureUI 
        isOpen={isOpen} 
        onClose={onClose} 
        position={{ left: videoRect.left, top: videoRect.bottom + 10 }}
        onSave={onSaveAction} // Linked to the new logic
      />
    </>
  );
};