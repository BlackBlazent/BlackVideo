/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import React, { useState } from 'react'; // useRef, useEffect
import { Search, Bell, Plus, Info, ChevronDown, Play, Star, Server } from 'lucide-react';
import VideoMiniPlayer, { VideoData } from '../ui/VideoMiniPlayer';
import '../../styles/streaming.css'

// Color variables injected into component style
const cssVariables = {
  '--primary-blue': '#0066ff',
  '--primary-blue-dark': '#004dd9',
  '--accent-green': '#6cc24a',
  '--accent-green-light': '#8fd662',
  '--accent-orange': '#ff6b35',
  '--accent-orange-light': '#f7931e',
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

// Mock Data
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
    description: 'A modern take on David Cronenberg’s 1988 thriller, featuring Jeremy Irons in dual roles as twin gynecologists. This reimagining explores the strange lives of identical twins who share everything: drugs, lovers, and an unapologetic desire to do whatever it takes.',
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
    description: 'In a world plagued by ghosts, where giant corporations employ psychic teens to battle the supernatural, only one company operates without adult supervision.',
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
    description: 'A dream holiday becomes a nightmare for a British couple who travel through America\'s national parks in order to reconnect.',
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
    description: 'A respected London surgeon\'s affair with his son\'s fiancée turns into an erotic infatuation that threatens to change their lives forever.',
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
    description: 'Erin Carter is a British teacher in Spain. Or so we think. When she finds herself caught up in a supermarket robbery, her secret past is revealed.',
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
    description: 'Justin returns from living abroad in the hope of reconnecting with the biological daughter that he gave up for adoption. His plans go awry when he finds out his father left the family cottage to his "perfect" step-sister.',
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
    description: 'An English combat nurse from 1945 is mysteriously swept back in time to 1743.',
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
    description: 'A dysfunctional family moves from the city to a small town into a house in which terrible atrocities have taken place.',
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
  
  {/*
  // Refs for the placeholder requested by user
  const aspectRatioButtonRef = useRef(null);
  const [isAspectRatioVisible, setIsAspectRatioVisible] = useState(false);
  const handleClosePopup = () => setIsAspectRatioVisible(false);
  const handleRatioSelect = () => {};
  */}

  return (
    <main 
      className="Streaming-Page w-full min-h-screen bg-[var(--background-dark)] text-[var(--text-primary)] font-sans pb-20" 
      id="StreamingArsenal"
      style={cssVariables}
    >
      {/* Navigation Bar */}
    <nav className="sticky top-0 z-40 w-full px-8 py-4 flex items-center justify-between bg-[var(--background-dark)]/80 backdrop-blur-lg border-b border-[var(--border-subtle)]">
        
        {/* Logo and Search (Combined on the Left for modern look) */}
        <div className="flex items-center gap-6">
            <span className="text-2xl font-extrabold tracking-tight">
                Arsenal<span className="text-[var(--primary-blue)]">Stream</span>
            </span>

            {/* Integrated Search Bar */}
            <div className="relative w-96 hidden lg:block">
                <input 
                    type="text" 
                    placeholder="Search movies, shows, genres..." 
                    className="w-full bg-[var(--surface-color)]/70 border border-[var(--border-subtle)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--primary-blue)] transition-colors text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
            </div>
        </div>

        {/* Right Side Icons & Platform Selector */}
        <div className="flex items-center gap-6">
            
            {/* Notifications */}
            <button className="text-[var(--text-primary)] hover:text-[var(--primary-blue)] transition-colors hidden sm:block">
                <Bell size={20} />
            </button>
            
            {/* Platform Selector Dropdown - Now just an Icon button */}
            <div className="relative">
                <button 
                    onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                    className="flex items-center gap-1 p-2 bg-[var(--surface-color)]/50 rounded-lg hover:bg-[var(--primary-blue)] transition-colors border border-[var(--border-medium)]"
                >
                    <Server size={18} className="text-[var(--primary-blue)] group-hover:text-white"/>
                    <span className="text-sm font-medium hidden md:block">{PLATFORMS.find(p => p.id === selectedPlatform)?.name}</span>
                    <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${isPlatformMenuOpen ? 'rotate-180' : ''} hidden md:block`} />
                </button>
                
                {isPlatformMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--background-medium)] border border-[var(--border-medium)] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-down">
                        {PLATFORMS.map((platform) => (
                            <button
                                key={platform.id}
                                onClick={() => {
                                    setSelectedPlatform(platform.id);
                                    setIsPlatformMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between
                                    ${selectedPlatform === platform.id 
                                        ? 'bg-[var(--primary-blue)] text-white font-semibold' 
                                        : 'text-[var(--text-secondary)] hover:bg-[var(--surface-color)]'
                                    }
                                `}
                            >
                                {platform.name}
                                {selectedPlatform === platform.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* User Avatar */}
            {/* 
            <div className="w-9 h-9 rounded-full bg-[var(--accent-orange)] border-2 border-white flex items-center justify-center font-bold text-sm">
                A
            </div>
            */}
        </div>
    </nav>

      {/* Hero Section */}
    <header className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
            <img 
                src="https://picsum.photos/1920/1080?random=hero" 
                alt="Hero" 
                className="w-full h-full object-cover object-center transform scale-105" // slight scale for better visual impact
            />
            
            {/* FIX: Stronger, Deeper Gradient for Seamless Blend */}
            <div 
                className="absolute inset-0"
                style={{
                    // Gradient fades from dark blue/black at the bottom, covers the left side for readability
                    backgroundImage: `
                        linear-gradient(to top, var(--background-dark) 0%, var(--background-dark) 45%, transparent 100%),
                        linear-gradient(to right, var(--background-dark) 0%, var(--background-dark) 35%, transparent 100%)
                    `
                }}
            ></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 md:px-16 max-w-5xl space-y-6">
            <span className="text-[var(--accent-green)] font-semibold tracking-widest text-sm uppercase drop-shadow-lg">New Season Available</span>
            <h1 className="text-6xl md:text-8xl font-black leading-none drop-shadow-xl">Lockwood & Co.</h1>
            <p className="text-[var(--text-secondary)] text-lg max-w-3xl line-clamp-3 leading-relaxed drop-shadow-md">
                In a world plagued by ghosts, where giant corporations employ psychic teens to battle the supernatural, only one company operates without adult supervision.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
                <button 
                    onClick={() => setSelectedVideo(MOCK_VIDEOS[1])}
                    className="flex items-center gap-2 px-10 py-4 bg-[var(--primary-blue)] hover:bg-[var(--primary-blue-dark)] text-white rounded-xl font-bold text-lg transition-all shadow-2xl shadow-[rgba(0,102,255,0.4)] hover:scale-[1.02]"
                >
                    <Play size={24} className="fill-current" /> Play Now
                </button>
                {/* Secondary Button: uses Glass effect for a modern subtle look */}
                <button className="flex items-center gap-2 px-8 py-4 bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:bg-white/10 text-white rounded-xl font-semibold transition-all backdrop-blur-sm">
                    <Info size={20} /> Details
                </button>
            </div>
        </div>
    </header>

      {/* Main Content Area */}
      <div className="px-6 md:px-16 mt-20 relative z-20">{/*-mt-20*/}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">TV & Movie Shows</h2>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-4 no-scrollbar"> {/* overflow-x-auto */}
            {['TV Shows', 'Genre', 'Country', 'Year', 'Rating', 'Quality', 'Recently Updated'].map((filter, index) => (
                <button 
                    key={filter} 
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                        ${index === 0 
                            ? 'bg-[var(--surface-color)] text-white border border-[var(--border-medium)]' 
                            : 'bg-[var(--background-medium)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                        }
                    `}
                >
                    {filter} <ChevronDown size={14} className="opacity-70" />
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {MOCK_VIDEOS.map((video) => (
                <div 
                    key={video.id} 
                    className="group relative flex flex-col gap-2 cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                >
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(0,102,255,0.15)] group-hover:-translate-y-2">
                        <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-[var(--primary-blue)] flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                <Play size={24} className="fill-white text-white ml-1" />
                            </div>
                        </div>

                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-bold text-[var(--accent-orange)] border border-[var(--border-subtle)]">
                            HD
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 px-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[var(--text-muted)]">{video.year}</span>
                            <div className="flex items-center gap-1 text-[var(--accent-orange)] text-xs font-semibold">
                                <Star size={10} className="fill-current" /> {video.rating}
                            </div>
                        </div>
                        <h3 className="font-semibold text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--primary-blue)] transition-colors">
                            {video.title}
                        </h3>
                        <p className="text-xs text-[var(--text-muted)] truncate">{video.duration}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Video Mini Player Integration */}
      {selectedVideo && (
        <VideoMiniPlayer 
            video={selectedVideo} 
            onClose={() => setSelectedVideo(null)} 
            recommendations={MOCK_VIDEOS.filter(v => v.id !== selectedVideo.id)}
        />
      )}

      {/* Placeholder requested by user - Logically hidden as it wasn't defined fully, but included for code completeness requirement */}
      {/* 
        <AspectRatioUI
            isVisible={isAspectRatioVisible}
            onClose={handleClosePopup}
            onRatioSelect={handleRatioSelect}
            buttonRef={aspectRatioButtonRef}
        />
      */}
    </main>
  );
};

export default Streaming;