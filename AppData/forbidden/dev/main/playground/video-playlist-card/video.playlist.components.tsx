/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useRef } from 'react';
import { MoreVertical, Pin, Info, GripVertical } from 'lucide-react';

import '../../../../../../src/styles/playlist.components.css'

interface VideoItem {
  id: string;
  title: string;
  year: string;
  src: string;
}

// Mock Data - Replace with your actual props or global state
const initialVideos: VideoItem[] = [
  { id: '1', title: 'Lisa Thailand', year: '2022', src: '/media/sample.mp4' },
  { id: '2', title: 'Blackpink World', year: '2023', src: '/media/sample2.mp4' },
];

export const VideoPlaylist: React.FC = () => {
  const [videos, setVideos] = useState(initialVideos);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // --- Drag & Drop Logic (Internal to Container) ---
  const handleDragStart = (index: number) => setDraggedItem(index);
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newVideos = [...videos];
    const item = newVideos.splice(draggedItem, 1)[0];
    newVideos.splice(index, 0, item);
    setVideos(newVideos);
    setDraggedItem(index);
  };

  return (
    <div id="playlistCardPlayContainer" className="thumbnails-list">
      {videos.map((video, index) => (
        <div
          key={video.id}
          className="thumbnail-wrapper"
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={() => setDraggedItem(null)}
        >
          <div id="videoListCard" className="thumbnail">
            {/* Drag Handle - Only drag via this cursor/icon */}
            <div className="drag-handle">
              <GripVertical size={14} />
            </div>

            <video className="video-poster-overlay">
              <source src={video.src}></source>
            </video>

            <div id="videoCaption-tzr" className="caption">
              <div className="caption-info">
                <span className="title-text">{video.title}</span>
                <span id="video-list-year" className="year">{video.year}</span>
              </div>

              {/* More Button */}
              <div className="more-context">
                <button 
                  className="more-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === video.id ? null : video.id);
                  }}
                >
                  <MoreVertical size={14} />
                </button>

                {activeDropdown === video.id && (
                  <div className="video-card-dropdown">
                    <div className="dropdown-item">
                      <Pin size={12} /> <span>Pin Video</span>
                    </div>
                    <div className="dropdown-item">
                      <Info size={12} /> <span>Properties</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};