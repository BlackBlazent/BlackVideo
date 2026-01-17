/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import '../../../../../../src/styles/utils/ambient.mode.css'
import '../../../../../../src/styles/utils/sleep.timer.css'

// Import the new utility
import { VideoFlipUtility } from './hidden.mini.playback.script.flip'; // Update path as needed
import { AmbientModeUtility } from './hidden.mini.playback.script.ambient';
import { SleepTimerUtility, TimerPreset } from './hidden.mini.playback.script.sleepTimer';
import { initScreenCast, toggleScreenCast } from "./hidden.mini.playback.script.screencast";
import { PlaybackBehaviorGraph } from './utils/heatmap/PlaybackBehaviorGraph';
import { VideoSubSettings } from '../customs/utils/settings/VideoSubSettings';
import { useSubSettingsUI } from '../customs/hidden.mini.playback.script.theater.setting';

// Assuming this component receives props like 'isVisible': Added: "isVisible: boolean;"
interface VideoControlsProps {
  videoId: string; isVisible: boolean; videoDuration: number;
}

const VideoControls: React.FC<VideoControlsProps> = ({ videoId, videoDuration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sleepTimerButtonRef = useRef<HTMLButtonElement | null>(null); // NEW: Ref for button to anchor menu
  const { isSettingsOpen, toggleSettings } = useSubSettingsUI();

  const [showSleepTimerMenu, setShowSleepTimerMenu] = useState(false);
  const [timerCountdown, setTimerCountdown] = useState<string | null>(null);

  // Get the utility instance
  const sleepTimerUtility = SleepTimerUtility.getInstance();

  // Handler for selecting a timer preset (Now passed to the utility)
  const handleSelectPreset = useCallback((preset: TimerPreset) => {
    sleepTimerUtility.startTimer(preset);
  }, [sleepTimerUtility]);
  
  // Handler for canceling the timer (called by the utility's DOM event listener)
  const handleCancelTimer = useCallback(() => {
    sleepTimerUtility.cancelTimer();
    // No need to hide menu here, utility calls onHide
  }, [sleepTimerUtility]);


  // Handler for the Sleep Timer button click
  const handleSleepTimerClick = () => {
    // Hide the menu *before* toggling state to allow clean DOM manipulation
    if (showSleepTimerMenu) {
        sleepTimerUtility.removeMenuFromDOM();
    }
    setShowSleepTimerMenu(prev => !prev);
  };
  
  // Register the handler with the utility on mount
  useEffect(() => {
      sleepTimerUtility.registerStartTimerHandler(handleSelectPreset);
  }, [sleepTimerUtility, handleSelectPreset]);


  // Use useLayoutEffect to inject and position the HTML immediately after state change
  useLayoutEffect(() => {
    if (showSleepTimerMenu) {
      if (sleepTimerButtonRef.current) {
        
        // Target the main video container, assuming it is the nearest parent with position: relative/absolute/fixed
        const videoContainer = document.getElementById(videoId)?.parentElement;
        if (!videoContainer) return;
        
        // Get the boundary rectangles of the button and the container
        const buttonRect = sleepTimerButtonRef.current.getBoundingClientRect();
        const containerRect = videoContainer.getBoundingClientRect();
        
        // --- 1. Calculate Responsive Bottom Position ---
        // Distance from the container's bottom edge to the button's top edge + 10px spacing
        const newBottom = containerRect.bottom - buttonRect.top + 10; 
        
        // --- 2. Calculate Responsive Right Position ---
        // Distance from the container's right edge to the button's right edge.
        // This ensures the right side of the menu aligns with the right side of the button.
        const newRight = containerRect.right - buttonRect.right;
        
        
        // --- 3. Generate HTML with calculated style ---
        
        const alignmentStyle = `
          position: absolute; 
          bottom: ${newBottom}px; 
          {/*right: ${newRight}px;*/} 
          transform: none; 
        `;

        const menuHtml = sleepTimerUtility.getMenuHtml(alignmentStyle);
        
        // --- 4. Inject Menu Node ---
        
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = menuHtml;
        const menuNode = tempContainer.firstChild as HTMLElement;
        
        // A. Remove any existing menu
        sleepTimerUtility.removeMenuFromDOM();
        
        // B. Insert the new menu node into the container's parent
        videoContainer.parentElement?.appendChild(menuNode);

        // C. The styles are already applied via alignmentStyle, no need to reset transform
        
        // D. Attach event listeners
        sleepTimerUtility.attachEventListeners(() => setShowSleepTimerMenu(false));
      }
    } else {
        // Cleanup when hiding
        sleepTimerUtility.removeMenuFromDOM();
    }
    
    // Cleanup on unmount
    return () => {
        sleepTimerUtility.removeMenuFromDOM();
    };
  }, [showSleepTimerMenu, sleepTimerUtility, videoId]);

  // ======================================= Screen Cast ============================
  // ⚠️ New: Setup Screencast functionality once component mounts
    useEffect(() => {
        // Initialize the screencast logic which handles the button click,
        // UI updates, and the actual streaming.
        initScreenCast();
        
        // Optional: Add cleanup for safety if the component unmounts fully
        // (Though the window/stream management is handled internally by stopCast)
        return () => {
            // Optional: Export stopCast from the utility and call it here if needed
            // stopCast(); 
        };
    }, []); // Run only once on mount

  // ... rest of the component (togglePlayPause, handlePrev, handleNext)

  // Callback to update the countdown state
  const timerUpdateCallback = useCallback((remainingTime: string | null) => {
      setTimerCountdown(remainingTime);
  }, []);

  useEffect(() => {
      // Subscribe to timer updates when the component mounts
      sleepTimerUtility.subscribe(timerUpdateCallback);
      
      return () => {
          // Unsubscribe when the component unmounts
          sleepTimerUtility.unsubscribe(timerUpdateCallback);
      };
  }, [sleepTimerUtility, timerUpdateCallback]);

  {/*===========================Sleep Timer State========================*/}

  // Get Ambient Mode utility instance
  const ambientModeUtility = AmbientModeUtility.getInstance();
  
  // Use state to force re-render when the active state changes (for indicator)
  const [isAmbientActive, setIsAmbientActive] = useState(ambientModeUtility.getIsActive());

  // Get the utility instance (can be done here or inside the handler)
  const videoFlipUtility = VideoFlipUtility.getInstance(); 

  // New handler function for the flip button
  const handleFlipVideo = () => {
    videoFlipUtility.flipVideo();
  };

  useEffect(() => {
    const videoElement = document.getElementById(videoId) as HTMLVideoElement;
    if (!videoElement) return;

    videoRef.current = videoElement;
    videoElement.removeAttribute('controls');

    // Set initial state from utility upon mount
    setIsAmbientActive(ambientModeUtility.getIsActive());

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);


    // Get video container
    const videoContainer = videoElement.parentElement;
    if (!videoContainer) return;

    const showControls = () => {
      setIsVisible(true);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const hideControlsDelayed = () => {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    const hideControlsImmediately = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      showControls();
    };

    const handleMouseLeave = () => {
      hideControlsImmediately();
    };

    const handleMouseMove = () => {
      showControls();
      // Auto-hide after mouse stops moving (only when playing)
      if (isPlaying) {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        hideControlsDelayed();
      }
    };

    // Add event listeners to video container
    videoContainer.addEventListener('mouseenter', handleMouseEnter);
    videoContainer.addEventListener('mouseleave', handleMouseLeave);
    videoContainer.addEventListener('mousemove', handleMouseMove);

    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoContainer.removeEventListener('mouseenter', handleMouseEnter);
      videoContainer.removeEventListener('mouseleave', handleMouseLeave);
      videoContainer.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
       // OPTIONAL: Reset flip state when the component unmounts
      // videoFlipUtility.resetFlip();
    };
  }, [videoId, isPlaying]);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  // NEW Handler for Ambient Mode
  const handleAmbientMode = () => {
    const newState = ambientModeUtility.toggleAmbientMode();
    setIsAmbientActive(newState);
  };

  function handlePrev(): void {
    throw new Error('Function not implemented.');
  }

  function handleNext(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <>
      <style>{`
        .video-submenu {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.31);
          backdrop-filter: blur(10px);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 10;
          transform: translateY(100%);
        }
        
        .video-submenu:not(.hidden) {
          opacity: 1;
          transform: translateY(0);
        }
        
        .video-submenu.hidden {
          opacity: 0;
          transform: translateY(100%);
          pointer-events: none;
        }
        #video-submenu-settings {
        width: 20px;
        height: 20px;
        }
        .right-submenu-actions, .left-submenu-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        .right-submenu-actions {
          justify-content: center;
          align-items: center;
        }
        .action-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 20%;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .playback-indicator, #video-submenu-prev, #video-submenu-next {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .playback-indicator:hover, #video-submenu-prev:hover, #video-submenu-next:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }
        
        .play-icon, .pause-icon {
          width: 20px;
          height: 20px;
        }
        
        .play-icon {
          display: ${isPlaying ? 'none' : 'block'};
        }
        
        .pause-icon {
          display: ${isPlaying ? 'block' : 'none'};
        }
        .submenu-video-hidden-utilities {
          display: flex;
          gap: 8px;
        }
        .action-hidden-util {
          background: rgba(255, 255, 255, 0.07);
          border: none;
          color: white;
          padding: 6px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .action-hidden-util:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }
        .hidden-utility-size-icon {
          width: 15px;
          height: 15px;
        }
        .sleep-timer-menu {
        display: ${showSleepTimerMenu ? 'block' : 'none'};
        }
      `}</style>

      {/* Settings Popup Integrated here */}
      <VideoSubSettings isOpen={isSettingsOpen} />

      {/* 1. Main Heatmap Graph (Above the entire controls/seekbar) */}
            <PlaybackBehaviorGraph
                videoId={videoId}
                videoDuration={videoDuration}
                showFullWidth={isVisible} 
            />

      <div className={`video-submenu ${isVisible ? '' : 'hidden'}`}>
        {/* Timer Countdown Indicator remains in the submenu */}
        {timerCountdown && (
          <div className="sleep-timer-countdown">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '4px'}}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Stopping in: **{timerCountdown}**
              {/* No need for the inline Cancel button here, as the menu handles it */}
          </div>
        )}
        <div className="right-submenu-actions">
          <button className="action-btn" onClick={toggleSettings}>
          <img 
          id="video-submenu-settings" 
          className="settings-custom-submenu" 
          src="/assets/others/sub-settings.png" 
          style={{ opacity: isSettingsOpen ? 1 : 0.7, transform: isSettingsOpen ? 'rotate(30deg)' : 'none', transition: 'all 0.3s' }}
          />
          </button>
          {/* Submenu internal tools for video playback*/}
          <div className="submenu-video-hidden-utilities">
            <button className="action-hidden-util" title='Skip Intro/Outro'>
            <img id="skip-intro-outro" className="hidden-utility-size-icon vid-skip-intro-outro" src="/assets/others/skip-intro-outro.png" alt="Skip Intro/Outro" />
          </button>
          <button ref={sleepTimerButtonRef} className="action-hidden-util" title='Sleep Timer' onClick={handleSleepTimerClick}>
            <img id="sleep-timer-util" className="hidden-utility-size-icon vid-sleep-timer-util" src="/assets/others/sleep-timer.png" alt="Sleep Timer" />
          </button>
          <button className={`action-hidden-util ${isAmbientActive ? 'active' : ''}`} title='Ambient Mode' onClick={handleAmbientMode}> {/* className="action-hidden-util" */}
            <img id="ambient-mode-util" className="hidden-utility-size-icon vid-ambient-mode-util" src="/assets/others/ambient-mode.png" alt="Ambient Mode" />
          </button>
          <button className="action-hidden-util" title='Flip Video' onClick={handleFlipVideo}>
            <img id="flip-video-util" className="hidden-utility-size-icon vid-flip-video-util" src="/assets/others/flip.png" alt="Flip Video" />
          </button>
          <button className="action-hidden-util" title='Save'>
            <img id="save-vid-util" className="hidden-utility-size-icon vid-save-to-fav-util" src="/assets/others/save.png" alt="Save to Favorites" />
          </button>
          <button id="screen-cast-util" className="action-hidden-util" title='Screen Cast' onClick={toggleScreenCast}>
            <img id="screen-cast-util" className="hidden-utility-size-icon vid-screen-cast-util" src="/assets/others/screen-cast.png" alt="Screen Cast" />
          </button>
          <button className="action-hidden-util" title='Share'>
            <img id="share-vid-util" className="hidden-utility-size-icon vid-share-this-util" src="/assets/others/share.png" alt="Share" />
          </button>
          </div>
        </div>
        {/* Previous/Next for video playback mini hide menu */}
        <div className="left-submenu-actions">
        <button id="video-submenu-prev" className="prev-btn" onClick={() => handlePrev()} aria-label="Previous">
          {/* Left Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
          </svg>
          </button>
          <button id="video-submenu-next" className="next-btn" onClick={() => handleNext()} aria-label="Next">
            {/* Right Arrow SVG */}
          <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          >
    <polyline points="9 18 15 12 9 6" />
    </svg>
    </button>
        <button className="playback-indicator" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
          <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg className="pause-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
          </svg>
        </button>
        </div>
      </div>
    </>
  );
};

export default VideoControls;