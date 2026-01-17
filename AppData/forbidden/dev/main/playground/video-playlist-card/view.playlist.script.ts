/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useState, useCallback, useEffect } from 'react';

export const usePlaylistViewbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  
  // Internal state for movement
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const toggleViewbox = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (isMinimized) setIsMinimized(false);
  }, [isMinimized]);

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag trigger
    setIsMinimized(true);
  };

  const handleRestore = () => setIsMinimized(false);
  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Drag Logic
  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Resize Logic
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
      if (isResizing) {
        const newWidth = Math.max(400, e.clientX - position.x);
        const newHeight = Math.max(300, e.clientY - position.y);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, position]);

  return {
    isOpen, isMinimized, position, size,
    toggleViewbox, handleMinimize, handleRestore, handleClose,
    startDragging, startResizing
  };
};