// USAGE_EXAMPLE.tsx - Example of how to integrate the sprite thumbnail in your React app

import React, { useEffect, useState } from 'react';
import { SpriteThumbnail } from './spriteThumbnail';
import { primaryPlaybackTimelineController } from './playback.timeline.controls';
import type { SpriteConfig } from './spriteThumbnailManager';

interface ThumbnailState {
  visible: boolean;
  currentTime: number;
  mouseX?: number;
  mouseY?: number;
}

export const VideoPlayerWithThumbnails: React.FC = () => {
  const [spriteConfig, setSpriteConfig] = useState<SpriteConfig>({
    url: '',
    width: 160,
    height: 90,
    columns: 10,
    rows: 0,
    interval: 1
  });

  const [thumbnailState, setThumbnailState] = useState<ThumbnailState>({
    visible: false,
    currentTime: 0,
    mouseX: undefined,
    mouseY: undefined
  });

  useEffect(() => {
    // Get the sprite thumbnail manager from the timeline controller
    const spriteMgr = primaryPlaybackTimelineController.getSpriteThumbnailManager();

    // Register callback to listen for sprite state changes
    spriteMgr.onStateChange((state, config) => {
      setThumbnailState(state);
      setSpriteConfig(config);
    });

    // Optional: Set custom sprite configuration if needed
    // spriteMgr.setSpriteConfig({
    //   width: 180,
    //   height: 100,
    //   columns: 8,
    //   interval: 2
    // });

    // Optional: Set custom sprite URL if not auto-detected
    // spriteMgr.updateSpriteUrl('/path/to/video-sprite.jpg');

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="video-player-container">
      {/* Your video player UI here */}
      
      {/* Sprite thumbnail preview overlay */}
      <SpriteThumbnail
        spriteConfig={spriteConfig}
        currentTime={thumbnailState.currentTime}
        mouseX={thumbnailState.mouseX}
        mouseY={thumbnailState.mouseY}
        visible={thumbnailState.visible}
      />
    </div>
  );
};

export default VideoPlayerWithThumbnails;
