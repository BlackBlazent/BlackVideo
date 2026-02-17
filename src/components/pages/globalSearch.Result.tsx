import React, { useState, useRef, useEffect } from 'react';
import { X, GripHorizontal, Minus, Square, Copy } from 'lucide-react';
import { SearchSidebar } from '../ui/searchResults/SearchSidebar';
import { SearchMainContextResult } from '../ui/searchResults/searchMainContextResult';
import { SearchChatSupport } from '../ui/searchResults/searchChatSupport';

interface SearchResultProps {
  query: string;
  onClose: () => void;
  isVisible: boolean;
}

export const GlobalSearchResult: React.FC<SearchResultProps> = ({ query, onClose, isVisible }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [position, setPosition] = useState({ x: 50, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const modalRef = useRef<HTMLDivElement>(null);

  // Drag & Resize Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition(prev => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
      }
      if (isResizing && !isMaximized) {
        setDimensions(prev => ({
          width: Math.max(800, prev.width + e.movementX),
          height: Math.max(500, prev.height + e.movementY)
        }));
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
  }, [isDragging, isResizing, isMaximized]);

  if (!isVisible) return null;

  const controlBtnStyle = { background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '5px' };

  return (
    <div 
      className="search-result-modal" 
      ref={modalRef}
      style={{
        position: 'fixed', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
        backgroundColor: '#0a0a0a', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        ...(isMaximized 
          ? { top: '55px', bottom: '40px', left: '10px', right: '10px', width: 'auto', height: 'auto', borderRadius: '0' }
          : { top: position.y, left: position.x, width: dimensions.width, height: dimensions.height, borderRadius: '8px' }
        )
      }}
    >
      {/* WINDOW FRAME / NAV */}
      <div 
        className="search-nav search-frame-drag-handle" 
        onMouseDown={() => setIsDragging(true)}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '45px', minHeight: '45px',
          padding: '0 15px', background: '#161616', borderBottom: '1px solid #333', cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none'
        }}
      >
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GripHorizontal size={16} style={{ color: '#666' }} />
          <span style={{ color: '#fff', fontSize: '13px' }}>
            BlackVideo Search // <strong style={{ color: '#3b82f6' }}>{query}</strong>
          </span>
        </div>
        
        <div className="nav-right-win" style={{ display: 'flex', gap: '4px' }}>
          <button style={controlBtnStyle}><Minus size={14} /></button>
          <button style={controlBtnStyle} onClick={() => setIsMaximized(!isMaximized)}>
            {isMaximized ? <Copy size={12} style={{transform: 'rotate(180deg)'}} /> : <Square size={12} />}
          </button>
          <button style={{ ...controlBtnStyle, color: '#ff5f57' }} onClick={onClose}><X size={16} /></button>
        </div>
      </div>

      {/* COMPONENT PLACEHOLDERS */}
      <div className="search-result-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SearchSidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        
        <SearchMainContextResult query={query}>
          <SearchChatSupport query={query} />
        </SearchMainContextResult>
      </div>

      {/* BOTTOM RESIZE HANDLE */}
      {!isMaximized && (
        <div 
          className="resize-handle-bottom" 
          onMouseDown={(e) => { e.preventDefault(); setIsResizing(true); }} 
          style={{ height: '5px', cursor: 'ns-resize', position: 'absolute', bottom: 0, left: 0, right: 0 }} 
        />
      )}
    </div>
  );
};