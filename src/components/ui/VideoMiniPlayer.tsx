/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  ThumbsUp, 
  Share2, 
  MoreHorizontal, 
  Check,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  GripHorizontal
} from 'lucide-react';

export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl?: string;
  year: string;
  rating: number;
  duration: string;
  genre: string;
  description: string;
  cast: string[];
  country: string;
  production: string;
  channelName?: string;
  subscribers?: string;
  views?: string;
  postedDate?: string;
}

interface VideoMiniPlayerProps {
  video: VideoData;
  onClose: () => void;
  recommendations: VideoData[];
}

// Helper for formatting seconds to MM:SS
const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoMiniPlayer: React.FC<VideoMiniPlayerProps> = ({ video, onClose, recommendations }) => {
  // Window State
  const [isMaximized, setIsMaximized] = useState(false); // CSS Maximize (fills window)
  const [isMinimized, setIsMinimized] = useState(false); // Minimized to tray
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 900, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Video Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resize State
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Center the window on mount
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    setPosition({ 
        x: Math.max(0, (w - 900) / 2), 
        y: Math.max(0, (h - 600) / 2) 
    });
  }, []);

  // --- Window Drag Logic ---
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;
        setSize({
            width: Math.max(400, resizeStartRef.current.w + deltaX),
            height: Math.max(300, resizeStartRef.current.h + deltaY)
        });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, dragOffset]);

  // --- Window Resize Logic ---
  const handleResizeStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsResizing(true);
      resizeStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          w: size.width,
          h: size.height
      };
  };

  // --- Fullscreen Logic ---
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const toggleFullscreen = async () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
        try {
            await playerContainerRef.current.requestFullscreen();
        } catch (err) {
            console.error("Error attempting to enable fullscreen:", err);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
  };

  // Keyboard support for fullscreen escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (isMaximized) setIsMaximized(false);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized]);


  // --- Video Logic ---
  const togglePlay = () => {
      if (videoRef.current) {
          if (isPlaying) videoRef.current.pause();
          else videoRef.current.play();
          setIsPlaying(!isPlaying);
      }
  };

  const handleTimeUpdate = () => {
      if (videoRef.current) {
          setCurrentTime(videoRef.current.currentTime);
          setDuration(videoRef.current.duration || 0);
      }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (videoRef.current) {
          videoRef.current.currentTime = time;
          setCurrentTime(time);
      }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = parseFloat(e.target.value);
      setVolume(vol);
      if (videoRef.current) {
          videoRef.current.volume = vol;
          setIsMuted(vol === 0);
      }
  };
  
  const toggleMute = () => {
      if (videoRef.current) {
          const newMuted = !isMuted;
          setIsMuted(newMuted);
          videoRef.current.muted = newMuted;
          if (newMuted) setVolume(0);
          else {
              setVolume(1);
              videoRef.current.volume = 1;
          }
      }
  }

  const handleMouseMoveControls = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };


  // --- Minimized View ---
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 bg-[var(--surface-color)] border border-[var(--border-medium)] shadow-2xl rounded-lg overflow-hidden z-50 flex flex-col animate-fade-in-up">
        <div className="h-8 bg-[var(--background-medium)] flex items-center justify-between px-3 border-b border-[var(--border-subtle)]">
          <span className="text-xs text-[var(--text-secondary)] truncate w-48">{video.title}</span>
          <div className="flex gap-2">
            <button onClick={handleMaximize} className="text-[var(--text-muted)] hover:text-white">
              <Maximize2 size={12} />
            </button>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--accent-orange)]">
              <X size={12} />
            </button>
          </div>
        </div>
        <div className="relative aspect-video bg-black group cursor-pointer" onClick={handleMaximize}>
             <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
             <div className="absolute inset-0 flex items-center justify-center">
                 <Play className="fill-white text-white drop-shadow-lg" size={32} />
             </div>
        </div>
      </div>
    );
  }

  // --- Main Window View ---
  const windowStyle = isMaximized 
    ? { top: 0, left: 0, width: '100vw', height: '100vh', borderRadius: 0 } 
    : { top: position.y, left: position.x, width: size.width, height: size.height, borderRadius: '0.75rem' };

  return (
    <>
      {/* Backdrop (Only when not maximized to give focus context, optional) */}
      {!isMaximized && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      )}
      
      <div 
        className="fixed z-50 bg-[var(--background-dark)] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[var(--border-medium)] overflow-hidden transition-all duration-75"
        style={windowStyle}
      >
        {/* Header / Draggable Area */}
        <div 
            className="h-12 flex items-center justify-between px-4 bg-[var(--surface-color)] border-b border-[var(--border-subtle)] select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
        >
            <div className="flex items-center gap-2">
                <GripHorizontal className="text-[var(--text-muted)]" size={16} />
                <h3 className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-blue)] animate-pulse"></span>
                    {video.title}
                </h3>
            </div>
            
            <div className="flex items-center gap-4" onMouseDown={(e) => e.stopPropagation()}>
                <button onClick={handleMinimize} className="text-[var(--text-muted)] hover:text-white transition-colors p-1 rounded hover:bg-[var(--glass-bg)]">
                    <Minus size={18} />
                </button>
                <button onClick={handleMaximize} className="text-[var(--text-muted)] hover:text-white transition-colors p-1 rounded hover:bg-[var(--glass-bg)]">
                    {isMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--accent-orange)] transition-colors p-1 rounded hover:bg-[var(--glass-bg)]">
                    <X size={18} />
                </button>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-[var(--background-dark)]">
            
            {/* Left Column: Player & Details */}
            <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
                
                {/* Video Player */}
                <div 
                    ref={playerContainerRef}
                    className="w-full bg-black relative group flex-shrink-0"
                    onMouseMove={handleMouseMoveControls}
                    onMouseLeave={() => setShowControls(false)}
                >
                    <video 
                        ref={videoRef}
                        src={video.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                        className="w-full h-full max-h-[70vh] object-contain mx-auto"
                        onClick={togglePlay}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                    />
                    
                    {/* Custom Controls */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Progress Bar */}
                        <div className="relative w-full h-1.5 bg-white/30 rounded-full cursor-pointer group/progress mb-4">
                             <input 
                                type="range" 
                                min="0" 
                                max={duration || 100} 
                                value={currentTime} 
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                             />
                             <div 
                                className="absolute top-0 left-0 h-full bg-[var(--primary-blue)] rounded-full z-10" 
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                             />
                             <div 
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity z-20 pointer-events-none"
                                style={{ left: `${(currentTime / duration) * 100}%` }}
                             />
                        </div>

                        <div className="flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="hover:text-[var(--primary-blue)] transition-colors">
                                    {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current" />}
                                </button>
                                
                                <div className="flex items-center gap-2 group/volume">
                                    <button onClick={toggleMute}>
                                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                    </button>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1" 
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/30 rounded-lg accent-[var(--primary-blue)]"
                                    />
                                </div>

                                <span className="text-xs font-medium font-mono">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            <button onClick={toggleFullscreen} className="hover:text-[var(--primary-blue)] transition-colors">
                                <Maximize size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video Info Section */}
                <div className="p-6 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{video.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                            <span className="flex items-center gap-1 text-[var(--accent-green)]">
                                <Check size={14} /> 98% Match
                            </span>
                            <span>{video.year}</span>
                            <span className="px-1.5 py-0.5 border border-[var(--border-medium)] rounded text-xs">{video.rating}+</span>
                            <span>{video.duration}</span>
                            <span className="px-2 py-0.5 bg-[var(--glass-bg)] rounded text-xs text-white/80">HD</span>
                        </div>
                    </div>

                    {/* Actions & Channel */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-y border-[var(--border-subtle)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--primary-blue)] to-[var(--primary-blue-dark)] flex items-center justify-center text-sm font-bold shadow-lg">
                                {video.channelName ? video.channelName[0] : 'S'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                                    {video.channelName || "StreamOriginals"} 
                                    <span className="text-[var(--text-muted)] text-xs ml-1">★</span>
                                </h4>
                                <p className="text-xs text-[var(--text-muted)]">{video.subscribers || "1.2M"} subscribers</p>
                            </div>
                            <button className="ml-4 px-4 py-1.5 bg-[var(--text-primary)] text-black text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[var(--text-secondary)] transition-colors">
                                Subscribe
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--surface-color)] text-sm transition-colors border border-[var(--border-subtle)]">
                                <ThumbsUp size={16} /> Like
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--surface-color)] text-sm transition-colors border border-[var(--border-subtle)]">
                                <Share2 size={16} /> Share
                            </button>
                            <button className="p-2 rounded-full bg-[var(--glass-bg)] hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Description Grid */}
                    <div className="grid md:grid-cols-3 gap-8 pb-8">
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-[var(--text-secondary)]">Description</h3>
                            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                                {video.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4">
                                {video.genre.split(', ').map(g => (
                                    <span key={g} className="px-3 py-1 bg-[var(--surface-color)] text-xs rounded-full text-[var(--primary-blue)] border border-[var(--border-subtle)]">
                                        #{g.toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                             <div className="flex flex-col">
                                <span className="text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Cast</span>
                                <span className="text-[var(--text-secondary)]">{video.cast.join(', ')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Country</span>
                                <span className="text-[var(--text-secondary)]">{video.country}</span>
                            </div>
                             <div className="flex flex-col">
                                <span className="text-[var(--text-muted)] mb-1 uppercase text-xs tracking-wider">Production</span>
                                <span className="text-[var(--text-secondary)]">{video.production}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Sidebar Recommendations */}
            <div className="w-full md:w-80 bg-[var(--background-medium)] border-t md:border-t-0 md:border-l border-[var(--border-subtle)] overflow-y-auto custom-scrollbar flex-shrink-0 flex flex-col h-auto md:h-full">
                <div className="p-4 sticky top-0 bg-[var(--background-medium)] z-10 border-b border-[var(--border-subtle)] flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[var(--text-secondary)]">Up Next</h3>
                    <div className="flex items-center gap-2">
                         <span className="text-xs text-[var(--text-muted)]">Autoplay</span>
                         <div className="w-8 h-4 bg-[var(--primary-blue)] rounded-full relative cursor-pointer">
                             <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                         </div>
                    </div>
                </div>
                
                <div className="p-4 space-y-3 flex-1">
                    {recommendations.map((rec) => (
                        <div key={rec.id} className="flex gap-2 group cursor-pointer hover:bg-[var(--surface-color)] p-2 rounded-lg transition-colors">
                            <div className="relative w-32 h-20 rounded-md overflow-hidden flex-shrink-0 border border-[var(--border-subtle)]">
                                <img src={rec.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={rec.title} />
                                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white font-medium">{rec.duration}</span>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                     <Play size={16} className="fill-white text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 min-w-0 justify-center">
                                <h4 className="text-sm font-medium text-[var(--text-secondary)] truncate group-hover:text-[var(--primary-blue)] transition-colors leading-tight">
                                    {rec.title}
                                </h4>
                                <p className="text-xs text-[var(--text-muted)] truncate">{rec.channelName || "StreamOriginals"}</p>
                                <p className="text-[10px] text-[var(--text-muted)]">{rec.views || "100K views"} • {rec.year}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Resize Handle (Bottom Right) */}
        {!isMaximized && (
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 hover:bg-[var(--primary-blue)] rounded-tl transition-colors"
                onMouseDown={handleResizeStart}
            >
                <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-[var(--text-muted)]"></div>
            </div>
        )}
      </div>
    </>
  );
};

export default VideoMiniPlayer;