```tsx
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * Example: Integrating both File Dropper and YouTube Dropper
 * This shows how to use both features simultaneously
 */

import { useEffect, useRef } from 'react';
import { VideoDropper } from './video.dropper';
import { YouTubeDragDropHandler } from '../../../AppData/forbidden/dev/main/playground/theater-stage/dropper-modules/@youtube/dragDropYouTube.url';

/**
 * Example React component showing dual dropper integration
 */
export function PlaygroundWithDualDroppers() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) {
      console.warn('Container or video element not ready');
      return;
    }

    let fileDropper: VideoDropper | null = null;
    let youtubeDropper: YouTubeDragDropHandler | null = null;

    try {
      // Initialize File Dropper (for local video files)
      console.log('[BlackVideo] Initializing File Dropper...');
      fileDropper = new VideoDropper();

      // Initialize YouTube Dropper (for YouTube links/thumbnails)
      console.log('[BlackVideo] Initializing YouTube Dropper...');
      youtubeDropper = new YouTubeDragDropHandler(
        containerRef.current,
        videoRef.current
      );

      console.log('[BlackVideo] ✓ Dual dropper system initialized');

    } catch (error) {
      console.error('[BlackVideo] Dropper initialization failed:', error);
    }

    // Cleanup on unmount
    return () => {
      console.log('[BlackVideo] Cleaning up droppers...');
      if (youtubeDropper) {
        youtubeDropper.destroy();
      }
      // FileDropper handles its own cleanup internally
    };
  }, []); // Empty dependency array - run once on mount

  return (
    <div className="playground-container">
      {/* Video Container - Drop Zone */}
      <div 
        ref={containerRef} 
        id="videoContainer" 
        className="video-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '400px',
          background: '#000',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Main Video Player */}
        <video
          ref={videoRef}
          id="VideoPlayer-TheaterStage"
          className="video-player-theater-stage video-js"
          poster="/media/poster.placeholder.png"
          aria-label="Theater Stage"
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        >
          <source
            id="VideoSource-Stream"
            className="video-source"
            src="/media/sample.mp4"
            type="video/mp4"
          />
          <track
            label="English"
            kind="subtitles"
            srcLang="en"
            src=""
            default
          />
          Your browser does not support the video tag.
        </video>

        {/* Drop Instructions Overlay (optional) */}
        <div className="drop-instructions">
          <p>Drop video files or YouTube links here</p>
        </div>
      </div>

      {/* Info Panel (optional) */}
      <div className="info-panel">
        <h3>Supported Formats</h3>
        <ul>
          <li>Local Files: MP4, MKV, MOV, WebM, AVI, FLV, OGG</li>
          <li>YouTube: Videos, Shorts, Embed URLs</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * CSS Styles for the dual dropper system
 * Add this to your stylesheet
 */
const styles = `
  .video-container {
    transition: all 0.3s ease;
  }

  /* File dropper active state */
  .video-container.is-drag-over {
    border: 3px dashed #00A8FF !important;
    box-shadow: 0 0 20px 5px rgba(0, 168, 255, 0.5) !important;
  }

  /* YouTube dropper active state */
  .video-container.is-youtube-drag-over {
    border: 3px dashed #FF0000 !important;
    box-shadow: 0 0 20px 5px rgba(255, 0, 0, 0.5) !important;
  }

  /* Tauri file dropper (for desktop app) */
  .video-container.is-drag-over-tauri {
    border: 3px dashed #FFA500 !important;
    box-shadow: 0 0 20px 5px rgba(255, 165, 0, 0.5) !important;
  }

  /* Drop instructions */
  .drop-instructions {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 0.9em;
    pointer-events: none;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  .video-container:hover .drop-instructions {
    opacity: 1;
  }

  /* Info panel */
  .info-panel {
    margin-top: 20px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .info-panel h3 {
    margin-top: 0;
    color: #00A8FF;
  }

  .info-panel ul {
    list-style: none;
    padding: 0;
  }

  .info-panel li {
    padding: 5px 0;
    color: #ccc;
  }

  .info-panel li::before {
    content: "✓ ";
    color: #4CAF50;
    font-weight: bold;
    margin-right: 8px;
  }
`;

/**
 * Alternative: Manual event coordination
 * Use this if you need more control over which dropper handles what
 */
export class UnifiedDropperCoordinator {
  private fileDropper: VideoDropper;
  private youtubeDropper: YouTubeDragDropHandler;

  constructor(
    container: HTMLElement,
    videoElement: HTMLVideoElement
  ) {
    // Initialize both droppers
    this.fileDropper = new VideoDropper();
    this.youtubeDropper = new YouTubeDragDropHandler(container, videoElement);

    console.log('[UnifiedDropper] Coordinator initialized');
  }

  /**
   * Determine which dropper should handle the event
   */
  private shouldHandleAsYouTube(dataTransfer: DataTransfer): boolean {
    const url = dataTransfer.getData('text/plain');
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  /**
   * Custom drop handler that routes to appropriate dropper
   */
  public handleDrop(event: DragEvent): void {
    if (!event.dataTransfer) return;

    // Check if it's a YouTube URL
    if (this.shouldHandleAsYouTube(event.dataTransfer)) {
      console.log('[UnifiedDropper] Routing to YouTube dropper');
      // YouTube dropper will handle it automatically
    } else {
      console.log('[UnifiedDropper] Routing to file dropper');
      // File dropper will handle it automatically
    }
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.youtubeDropper.destroy();
    // FileDropper cleanup is automatic
    console.log('[UnifiedDropper] Coordinator destroyed');
  }
}

```