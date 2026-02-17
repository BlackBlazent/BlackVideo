/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { Play, Star } from 'lucide-react';
import { VideoData } from '../VideoMiniPlayer';

interface VideoCardProps {
  video: VideoData;
  onSelect: (video: VideoData) => void;
}

const StreamingVideoCard: React.FC<VideoCardProps> = ({ video, onSelect }) => {
  return (
    <div className="video-card" onClick={() => onSelect(video)}>
      <div className="thumbnail-container">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="video-thumbnail" 
        />
        <div className="card-gradient-overlay"></div>
        <div className="quality-badge">HD</div>
        
        <div className="play-overlay">
          <div className="play-button-circle">
            <Play size={24} fill="white" color="white" style={{ marginLeft: '4px' }} />
          </div>
        </div>
      </div>

      <div className="card-info">
        <div className="info-top">
          <span className="year-text">{video.year}</span>
          <div className="rating-badge">
            <Star size={10} fill="currentColor" /> {video.rating}
          </div>
        </div>
        <h3 className="card-title">{video.title}</h3>
        <p className="duration-text">{video.duration}</p>
      </div>
    </div>
  );
};

export default StreamingVideoCard;