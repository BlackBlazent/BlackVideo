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
import { Info, Play } from 'lucide-react';
import VideoMiniPlayer, { VideoData } from '../ui/VideoMiniPlayer';
import NavigationStreaming from '../ui/streaming/navigation.streaming.ui';
import CategoryStreamingTabs from '../ui/streaming/category.streaming.tabs.ui';
import StreamingVideoCard from '../ui/streaming/streaming.video.card.ui';
import '../../styles/streaming.css';
import '../../styles/common.css';

const cssVariables = {
  '--primary-blue': '#0066ff',
  '--primary-blue-dark': '#004dd9',
  '--accent-green': '#6cc24a',
  '--background-dark': '#121212',
  '--background-medium': '#1e1e1e',
  '--surface-color': '#2a2a2a',
  '--border-subtle': 'rgba(255, 255, 255, 0.05)',
  '--border-medium': 'rgba(255, 255, 255, 0.1)',
  '--text-primary': '#ffffff',
  '--text-secondary': '#e0e0e0',
  '--text-muted': '#888888',
  '--glass-bg': 'rgba(255, 255, 255, 0.05)',
  '--glass-border': 'rgba(255, 255, 255, 0.1)',
} as React.CSSProperties;

const PLATFORMS = [
  { id: 'tmdb', name: 'TMDb API' },
  { id: 'omdb', name: 'OMDb API' },
  { id: 'tvmaze', name: 'TVMaze' },
  { id: 'trakt', name: 'Trakt.tv' },
  { id: 'justwatch', name: 'JustWatch' },
];

const MOCK_VIDEOS: VideoData[] = [
  {
    id: '1',
    title: 'Dead Ringers',
    thumbnail: 'https://picsum.photos/400/600?random=1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    year: '2023',
    rating: 5.6,
    duration: '1h 45m',
    genre: 'Drama, Thriller',
    description: 'A modern take on David Cronenberg’s 1988 thriller...',
    cast: ['Rachel Weisz', 'Britne Oldford', 'Poppy Liu'],
    country: 'USA',
    production: 'Amazon Studios',
    channelName: 'Prime Video',
    views: '2.4M',
    postedDate: '2 days ago'
  },
  {
    id: '2',
    title: 'Lockwood & Co',
    thumbnail: 'https://picsum.photos/400/600?random=2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    year: '2023',
    rating: 7.4,
    duration: '45m',
    genre: 'Adventure, Supernatural',
    description: 'In a world plagued by ghosts...',
    cast: ['Ruby Stokes', 'Cameron Chapman', 'Ali Hadji-Heshmati'],
    country: 'UK',
    production: 'Complete Fiction',
    channelName: 'Netflix',
    views: '5M',
    postedDate: '1 week ago'
  },
  {
    id: '3',
    title: 'Wilderness',
    thumbnail: 'https://picsum.photos/400/600?random=3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    year: '2023',
    rating: 6.3,
    duration: '50m',
    genre: 'Drama, Thriller',
    description: 'A dream holiday becomes a nightmare...',
    cast: ['Jenna Coleman', 'Oliver Jackson-Cohen'],
    country: 'UK',
    production: 'Firebird Pictures',
    channelName: 'Prime Video',
    views: '1.1M',
    postedDate: '3 days ago'
  },
  {
    id: '4',
    title: 'Obsession',
    thumbnail: 'https://picsum.photos/400/600?random=4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    year: '2023',
    rating: 5.1,
    duration: '42m',
    genre: 'Romance, Mystery',
    description: 'A respected London surgeon\'s affair...',
    cast: ['Richard Armitage', 'Charlie Murphy'],
    country: 'UK',
    production: 'Moonage Pictures',
    channelName: 'Netflix',
    views: '3.8M',
    postedDate: '5 days ago'
  },
  {
    id: '5',
    title: 'Who is Erin Carter?',
    thumbnail: 'https://picsum.photos/400/600?random=5',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    year: '2023',
    rating: 6.5,
    duration: '55m',
    genre: 'Action, Crime',
    description: 'Erin Carter is a British teacher in Spain...',
    cast: ['Evin Ahmad', 'Sean Teale'],
    country: 'UK',
    production: 'Left Bank Pictures',
    channelName: 'Netflix',
    views: '900K',
    postedDate: '1 day ago'
  },
  {
    id: '6',
    title: 'The Lake',
    thumbnail: 'https://picsum.photos/400/600?random=6',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    year: '2023',
    rating: 7.4,
    duration: '30m',
    genre: 'Comedy, Drama',
    description: 'Justin returns from living abroad...',
    cast: ['Jordan Gavaris', 'Julia Stiles'],
    country: 'Canada',
    production: 'Amaze',
    channelName: 'Prime Video',
    views: '1.5M',
    postedDate: '2 weeks ago'
  },
  {
    id: '7',
    title: 'Outlander',
    thumbnail: 'https://picsum.photos/400/600?random=7',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    year: '2014',
    rating: 8.4,
    duration: '60m',
    genre: 'Drama, Fantasy, Romance',
    description: 'An English combat nurse...',
    cast: ['Caitriona Balfe', 'Sam Heughan'],
    country: 'USA/UK',
    production: 'Sony Pictures',
    channelName: 'Starz',
    views: '10M+',
    postedDate: '1 month ago'
  },
  {
    id: '8',
    title: 'Shining Vale',
    thumbnail: 'https://picsum.photos/400/600?random=8',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    year: '2022',
    rating: 6.9,
    duration: '30m',
    genre: 'Comedy, Horror',
    description: 'A dysfunctional family moves...',
    cast: ['Courteney Cox', 'Greg Kinnear'],
    country: 'USA',
    production: 'Warner Bros.',
    channelName: 'Starz',
    views: '800K',
    postedDate: '4 days ago'
  },
];

const Streaming: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0].id);
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);

  return (
    <div id="StreamingArsenal" style={cssVariables}>
      <main className="Streaming-Page">
        
        <NavigationStreaming 
          platforms={PLATFORMS}
          selectedPlatform={selectedPlatform}
          isPlatformMenuOpen={isPlatformMenuOpen}
          setIsPlatformMenuOpen={setIsPlatformMenuOpen}
          setSelectedPlatform={setSelectedPlatform}
        />

        <header className="hero-header">
          <div style={{ position: 'absolute', inset: 0 }}>
            <img src="https://picsum.photos/1920/1080?random=hero" alt="Hero" className="hero-img" />
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-content">
            <span className="hero-badge">New Season Available</span>
            <h1 className="hero-title">Lockwood & Co.</h1>
            <p className="hero-description">In a world plagued by ghosts...</p>
            <div className="hero-actions">
              <button onClick={() => setSelectedVideo(MOCK_VIDEOS[1])} className="btn-primary-stream">
                <Play size={24} fill="currentColor" /> Play Now
              </button>
              <button className="btn-glass"><Info size={20} /> Details</button>
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <h2 className="section-title">TV & Movie Shows</h2>
          
          <CategoryStreamingTabs />

          <div className="video-grid">
            {MOCK_VIDEOS.map((video) => (
              <StreamingVideoCard 
                key={video.id} 
                video={video} 
                onSelect={setSelectedVideo} 
              />
            ))}
          </div>
        </div>

        <div className="safeSpace"></div>
        
        {selectedVideo && (
          <VideoMiniPlayer 
            video={selectedVideo} 
            onClose={() => setSelectedVideo(null)} 
            recommendations={MOCK_VIDEOS.filter((v) => v.id !== selectedVideo.id)}
          />
        )}
      </main>
    </div>
  );
};

export default Streaming;