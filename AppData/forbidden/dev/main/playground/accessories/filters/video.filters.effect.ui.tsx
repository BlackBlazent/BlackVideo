import React, { useState, useRef } from 'react';
import { X, Minus, GripVertical, SlidersHorizontal } from 'lucide-react';
import { FiltersCategoryTabs } from './ui/filters.category.tabs';
import { VideoFiltersCard } from './ui/video.filters.card';
import '../../../../../../../src/styles/modals/video.filter.css';

export const VideoFilterEffectUI = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ w: 500, h: 350 }); // Landscape default
  const popupRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const startDrag = (e: React.MouseEvent) => {
    const startX = e.clientX + pos.x;
    const startY = e.clientY + pos.y;
    const onMove = (mE: MouseEvent) => {
      setPos({ x: startX - mE.clientX, y: startY - mE.clientY });
    };
    const stop = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', stop);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', stop);
  };

  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startW = size.w;
    const startH = size.h;
    const startX = e.clientX;
    const startY = e.clientY;

    const onResize = (mE: MouseEvent) => {
      setSize({
        w: Math.max(400, startW + (mE.clientX - startX)),
        h: Math.max(250, startH + (mE.clientY - startY))
      });
    };
    const stop = () => {
      document.removeEventListener('mousemove', onResize);
      document.removeEventListener('mouseup', stop);
    };
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stop);
  };

  return (
    <div 
      ref={popupRef}
      className={`video-filter-popup ${isMinimized ? 'minimized' : ''}`}
      style={{ right: pos.x, bottom: pos.y, width: size.w, height: isMinimized ? 'auto' : size.h }}
    >
      <div className="filter-header" onMouseDown={startDrag}>
        <div className="header-left">
          <GripVertical size={14} className="drag-icon" />
          <SlidersHorizontal size={16} className="title-icon" />
          <span>Video Filters</span>
        </div>
        <div className="header-actions" onMouseDown={e => e.stopPropagation()}>
          <button onClick={() => setIsMinimized(!isMinimized)}><Minus size={14} /></button>
          <button onClick={onClose}><X size={14} /></button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="filter-body-content">
            <FiltersCategoryTabs />
            <VideoFiltersCard />
          </div>
          <div className="resize-handle" onMouseDown={startResize} />
        </>
      )}
    </div>
  );
};