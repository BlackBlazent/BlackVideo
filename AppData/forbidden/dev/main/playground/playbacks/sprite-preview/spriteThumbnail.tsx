// spriteThumbnail.tsx - Video sprite thumbnail preview component

import React, { useEffect, useRef } from 'react';

interface SpriteConfig {
  url: string;
  width: number;
  height: number;
  columns: number;
  rows: number;
  interval: number; // seconds per thumbnail
}

import '../../../../../../../src/styles/others/sprite-preview.css';

interface SpriteThumbnailProps {
  spriteConfig: SpriteConfig;
  currentTime: number;
  mouseX?: number;
  mouseY?: number;
  visible: boolean;
}

export const SpriteThumbnail: React.FC<SpriteThumbnailProps> = ({
  spriteConfig,
  currentTime,
  mouseX,
  mouseY,
  visible
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!visible || !imageRef.current || !spriteConfig.url) return;

    // Calculate which thumbnail to show based on current time
    const thumbnailIndex = Math.floor(currentTime / spriteConfig.interval);
    const row = Math.floor(thumbnailIndex / spriteConfig.columns);
    const col = thumbnailIndex % spriteConfig.columns;

    // Calculate sprite position
    const offsetX = col * spriteConfig.width;
    const offsetY = row * spriteConfig.height;

    // Update thumbnail image position
    imageRef.current.style.objectPosition = `-${offsetX}px -${offsetY}px`;
  }, [currentTime, spriteConfig, visible]);

  useEffect(() => {
    if (!visible || !containerRef.current || mouseX === undefined || mouseY === undefined) return;

    // Position thumbnail container near mouse cursor
    const left = Math.max(
      10,
      Math.min(
        window.innerWidth - spriteConfig.width - 10,
        mouseX - spriteConfig.width / 2
      )
    );
    const top = mouseY - spriteConfig.height - 20;

    containerRef.current.style.left = `${left}px`;
    containerRef.current.style.top = `${top}px`;
  }, [mouseX, mouseY, visible, spriteConfig.width, spriteConfig.height]);

  if (!visible || !spriteConfig.url) return null;

  return (
    <div
      ref={containerRef}
      id="video-thumbnail-preview"
      className="video-thumbnail-preview"
      style={{
        position: 'absolute',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 1000,
        border: '2px solid #fff',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        background: '#000'
      }}
    >
      <img
        ref={imageRef}
        src={spriteConfig.url}
        alt="Video preview"
        style={{
          width: `${spriteConfig.width}px`,
          height: `${spriteConfig.height}px`,
          display: 'block',
          objectFit: 'none'
        }}
      />
    </div>
  );
};

export default SpriteThumbnail;