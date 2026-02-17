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
import { createRoot, Root } from 'react-dom/client';
import VideoPlayerRecorderController from './ui/video.player.recorder.controller';
import VideoCameraRecorderController from './ui/video.camera.recorder.controller';

type RecordingMode = 'video' | 'camera-front' | 'camera-back';

// Singleton to prevent duplicate controllers
let controllerRoot: Root | null = null;
let controllerContainer: HTMLElement | null = null;

export const initializeRecorderControls = (mode: RecordingMode) => {
  // Clean up existing controller if present
  if (controllerRoot && controllerContainer) {
    controllerRoot.unmount();
    controllerContainer.remove();
    controllerRoot = null;
    controllerContainer = null;
  }

  // Create new container
  controllerContainer = document.createElement('div');
  controllerContainer.id = 'recorder-controls-container';
  document.body.appendChild(controllerContainer);
  
  // Create root
  controllerRoot = createRoot(controllerContainer);
  
  const handleClose = () => {
    if (controllerRoot && controllerContainer) {
      controllerRoot.unmount();
      controllerContainer.remove();
      controllerRoot = null;
      controllerContainer = null;
    }
  };
  
  // Determine which controller to render based on mode
  switch (mode) {
    case 'video':
      controllerRoot.render(
        <VideoPlayerRecorderController 
          isVisible={true} 
          onClose={handleClose} 
        />
      );
      break;
      
    case 'camera-front':
    case 'camera-back':
      controllerRoot.render(
        <VideoCameraRecorderController 
          initialFacing={mode === 'camera-front' ? 'user' : 'environment'}
          isVisible={true} 
          onClose={handleClose} 
        />
      );
      break;
  }
};
