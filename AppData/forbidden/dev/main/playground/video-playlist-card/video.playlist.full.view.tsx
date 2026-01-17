/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState } from 'react';
import { 
  Maximize2, Minimize2, X, RefreshCw, Search, 
  LayoutGrid, AlignJustify, GripVertical, GripHorizontal,
  MoreVertical, Pin, Info 
} from 'lucide-react';

import '../../../../../../src/styles/playlist.components.css'

interface PlaylistViewboxProps {
  isMinimized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onMinimize: (e: React.MouseEvent) => void;
  onRestore: () => void;
  onClose: () => void;
  startDragging: (e: React.MouseEvent) => void;
  startResizing: (e: React.MouseEvent) => void;
}

interface VideoLibraryItem {
  id: number;
  title: string;
}

const VideoPlaylistFullView: React.FC<PlaylistViewboxProps> = ({
  isMinimized, position, size, onMinimize, onRestore, onClose, startDragging, startResizing
}) => {
  const [viewStyle, setViewStyle] = useState<'grid' | 'list'>('grid');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [videoList, setVideoList] = useState<VideoLibraryItem[]>(
    [...Array(15)].map((_, i) => ({ id: i, title: `Lisa Thailand Performance ${2024 - i}` }))
  );
  
  // DRAG STATE
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [canDrag, setCanDrag] = useState<boolean>(false);

  // --- HANDLERS ---
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!canDrag) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    setActiveDropdown(null);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newList = [...videoList];
    const item = newList.splice(draggedIndex, 1)[0];
    newList.splice(index, 0, item);
    
    setVideoList(newList);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setCanDrag(false);
  };

  if (isMinimized) {
    return (
      <div 
        onMouseDown={startDragging}
        className="playlist-capsule"
        style={{
          position: 'fixed', left: `${position.x}px`, top: `${position.y}px`,
          backgroundColor: 'var(--primary-blue)', padding: '8px 16px',
          borderRadius: '50px', cursor: 'grab', display: 'flex',
          alignItems: 'center', gap: '12px', zIndex: 9999,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)',
        }}
      >
        <GripVertical size={14} color="rgba(255,255,255,0.6)" />
        <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>Playlist ({videoList.length})</span>
        <button onClick={(e) => { e.stopPropagation(); onRestore(); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
          <Maximize2 size={14} color="white" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="viewbox-container"
      style={{
        position: 'fixed', left: `${position.x}px`, top: `${position.y}px`,
        width: `${size.width}px`, height: `${size.height}px`,
        backgroundColor: 'var(--background-dark)', border: '1px solid var(--border-medium)',
        borderRadius: '12px', display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6)', zIndex: 9998, overflow: 'hidden'
      }}
    >
      {/* HEADER Nav */}
      <div className="viewbox-header" style={{
        padding: '10px 16px', background: 'var(--background-medium)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onMouseDown={startDragging} style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'flex' }}>
            <GripHorizontal size={20} />
          </div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px' }}>Video Library</span>
          
          <div style={{ position: 'relative', marginLeft: '10px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Quick search..." 
              style={{
                backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-subtle)',
                borderRadius: '6px', padding: '7px 10px 7px 32px', color: 'var(--text-primary)',
                fontSize: '12px', width: '180px'
              }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><RefreshCw size={15} /></button>
          <div style={{ width: '1px', height: '16px', background: 'var(--border-medium)', margin: '0 4px' }} />
          <button onClick={() => setViewStyle('grid')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: viewStyle === 'grid' ? 'var(--primary-blue)' : 'var(--text-muted)' }}><LayoutGrid size={18} /></button>
          <button onClick={() => setViewStyle('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: viewStyle === 'list' ? 'var(--primary-blue)' : 'var(--text-muted)' }}><AlignJustify size={18} /></button>
          <div style={{ width: '1px', height: '16px', background: 'var(--border-medium)', margin: '0 4px' }} />
          <button onClick={onMinimize} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Minimize2 size={15} /></button>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--accent-orange)', cursor: 'pointer' }}><X size={18} /></button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="viewbox-body" style={{
        flex: 1, padding: '20px', overflowY: 'auto', display: 'grid',
        gridTemplateColumns: viewStyle === 'grid' ? 'repeat(auto-fill, minmax(200px, 1fr))' : '1fr',
        gap: '20px', alignContent: 'start'
      }}>
        {videoList.map((video, i) => (
          <div 
            key={video.id} 
            draggable={canDrag}
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDragEnd={handleDragEnd}
            className={`video-card-container ${activeDropdown === i ? 'active-engine' : ''}`}
            style={{ 
              display: 'flex', flexDirection: viewStyle === 'grid' ? 'column' : 'row', 
              gap: '12px', backgroundColor: 'var(--surface-color)',
              padding: '10px', borderRadius: '12px', border: '1px solid var(--border-subtle)',
              position: 'relative',
              opacity: draggedIndex === i ? 0.4 : 1,
              cursor: 'default'
            }}
          >
             {/* DRAG HANDLE - Restricts Grab cursor and Drag functionality here only */}
             <div 
                className="drag-handle" 
                onMouseEnter={() => setCanDrag(true)}
                onMouseLeave={() => !draggedIndex && setCanDrag(false)}
                style={{
                  position: 'absolute', top: '8px', left: '8px', zIndex: 30,
                  backgroundColor: 'rgba(0,0,0,0.75)', borderRadius: '4px',
                  padding: '4px', color: '#fff', cursor: 'grab',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)'
                }}
             >
                <GripVertical size={14} />
             </div>

             {/* Poster */}
             <div style={{ 
               position: 'relative', width: viewStyle === 'grid' ? '100%' : '180px',
               aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden',
               backgroundColor: '#000', flexShrink: 0
             }}>
                <video style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                  <source src="/media/sample.mp4" type="video/mp4" />
                </video>
                <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', padding: '2px 5px', borderRadius: '4px', fontSize: '10px', color: 'white' }}>12:45</div>
             </div>

             {/* Metadata with restored Dropdown Logic */}
             <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {video.title}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>2024</span><span>•</span><span>MP4</span>
                  </div>
                </div>

                <div className="more-context" style={{ position: 'relative', marginLeft: '8px' }}>
                  <button 
                    className="more-btn"
                    onClick={(e) => {
                      e.stopPropagation(); 
                      setActiveDropdown(activeDropdown === i ? null : i);
                    }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {activeDropdown === i && (
                    <div className="video-card-dropdown" style={{
                      position: 'absolute', bottom: '100%', right: '0', marginBottom: '8px',
                      width: '150px', backgroundColor: 'var(--background-dark)',
                      border: '1px solid var(--border-medium)', borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, overflow: 'hidden'
                    }}>
                      <div className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', fontSize: '12px', color: '#eee', cursor: 'pointer' }}>
                        <Pin size={14} /> <span>Pin to Top</span>
                      </div>
                      <div className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', fontSize: '12px', color: '#eee', cursor: 'pointer' }}>
                        <Info size={14} /> <span>Properties</span>
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
        ))}
      </div>

      <div onMouseDown={startResizing} style={{ height: '16px', width: '16px', cursor: 'nwse-resize', position: 'absolute', bottom: '0', right: '0', background: 'linear-gradient(135deg, transparent 50%, var(--border-medium) 50%)', borderBottomRightRadius: '12px', zIndex: 10 }} />
    </div>
  );
};

export default VideoPlaylistFullView;