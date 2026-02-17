/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
// import { open } from '@tauri-apps/plugin-dialog';
// import { convertFileSrc } from '@tauri-apps/api/core';
import VideoControls from '../../../AppData/forbidden/dev/main/playground/customs/video.controls'; // Added for custom controls | Recent
import LinkDeployerUI from '../../../AppData/forbidden/dev/main/playground/accessories/links/link.player.deployer.ui';
import { initializeRecorderAccessories } from '../../../AppData/forbidden/dev/main/playground/accessories/recorder';
import { VideoFilterEffectUI } from '../../../AppData/forbidden/dev/main/playground/accessories/filters/video.filters.effect.ui';
import { DeployerData, DeployMode } from '../../../AppData/forbidden/dev/main/playground/accessories/links/link.core.deployer.dev';
/*import VideoTheaterManager from '../../../AppData/forbidden/dev/main/playground/accessories/links/links.processors';*/
import { handleOpenLocalFile } from '../../../AppData/forbidden/dev/main/playground/customs/utils/settings/open.file.import';
import SpeakerUI from '../../../AppData/forbidden/dev/main/playground/ui/speaker.ui';
import { playbackControlEnhancement } from '../../../AppData/forbidden/dev/main/playground/playbacks/playback.advanced.control.enhancement.volume';
import { captionControlEnhancement } from '../../../AppData/forbidden/dev/main/playground/playbacks/playback.advanced.control.enhancement.caption';
import CaptionSubtitleUI from '../../../AppData/forbidden/dev/main/playground/ui/caption.subtitle.ui';
import { AspectRatioUI } from '../../../AppData/forbidden/dev/main/playground/ui/aspect.ratio.ui';
import { AspectRatioButtonHandler } from '../../../AppData/forbidden/dev/main/playground/playbacks/aspect.ratio.events'; // Adjust path as needed
import { VideoTheaterStage } from '../../../AppData/forbidden/dev/main/playground/Video.Theater.Stage';
import { PictureInPictureController } from '../../../AppData/forbidden/dev/main/playground/playbacks/picture.in.picture';
import ResolutionUI from '../../../AppData/forbidden/dev/main/playground/ui/resolution.ui';
import { PrimaryPlaybackController } from '../../../AppData/forbidden/dev/main/playground/playbacks/primary.video.controls';
import { PrimaryPlaybackTimelineController, primaryPlaybackTimelineController } from '../../../AppData/forbidden/dev/main/playground/playbacks/playback.timeline.control';
import { SpriteThumbnail } from '../../../AppData/forbidden/dev/main/playground/playbacks/sprite-preview/spriteThumbnail';
import type { SpriteConfig } from '../../../AppData/forbidden/dev/main/playground/playbacks/sprite-preview/spriteThumbnailManager';
import FullscreenUI from '../../../AppData/forbidden/dev/main/playground/ui/fullscreen.ui';
import '../../../AppData/forbidden/dev/main/playground/playbacks/fullscreen';
import { PlaybackSpeedUI } from '../../../AppData/forbidden/dev/main/playground/ui/playback.speed.ui';
import FrameRateUI from '../../../AppData/forbidden/dev/main/playground/ui/fps.ui'; 
import { fpsController } from '../../../AppData/forbidden/dev/main/playground/playbacks/fps.script'; 
import { SkipControlsUI } from '../../../AppData/forbidden/dev/main/playground/ui/skip.controls.ui';
import { SkipControls } from '../../../AppData/forbidden/dev/main/playground/playbacks/skips.control';
import BitrateUI from '../../../AppData/forbidden/dev/main/playground/ui/bitrate.ui';
import { setupBitratePopup } from '../../../AppData/forbidden/dev/main/playground/playbacks/bitrate.control';
import { SnapCaptureController } from '../../../AppData/forbidden/dev/main/playground/accessories/snap/snap.capture.frame';
import { VideoDropper } from '../../../AppData/forbidden/dev/main/playground/theater-stage/video.dropper';
import { YouTubeDragDropHandler } from '../../../AppData/forbidden/dev/main/playground/theater-stage/dropper-modules/@youtube/dragDropYouTube.url';
import VideoOCRUI from '../../../AppData/forbidden/dev/main/playground/accessories/video_orc/video.ocr.ui';
import { initExtensionSystem } from '../../../AppData/forbidden/dev/main/playground/extension/extensionCardCaller';
import ExtensionModalFrame from '../../../AppData/forbidden/dev/main/playground/extension/extension.modalFrame.ui';
import { VideoPlaylist } from '../../../AppData/forbidden/dev/main/playground/video-playlist-card/video.playlist.components';
import { usePlaylistViewbox } from '../../../AppData/forbidden/dev/main/playground/video-playlist-card/view.playlist.script';
import VideoPlaylistFullView from '../../../AppData/forbidden/dev/main/playground/video-playlist-card/video.playlist.full.view';
import { PlaygroundCommonMainPlaybackContextMenu } from '../../../AppData/forbidden/dev/global/context-menu/components/playgroundCommonMainPlaybackContextMenu';
import { PlaygroundCustomPlaybackContextMenu } from '../../../AppData/forbidden/dev/global/context-menu/components/playgroundCustomPlaybackContextMenu';
import { PlaygroundPlaybackAccessoriesContextMenu } from '../../../AppData/forbidden/dev/global/context-menu/components/playgroundPlaybackAccessoriesContextMenu';
import { PlaygroundExtensionPlaybackContextMenu } from '../../../AppData/forbidden/dev/global/context-menu/components/playgroundExtensionPlaybackContextMenu';
import { PlaygroundVideoTheaterStageContextMenu } from '../../../AppData/forbidden/dev/global/context-menu/components/playgroundVideoTheaterStageContextMenu';
// Import managers for state management
import { playbackControlsContextMenuManager } from '../../../AppData/forbidden/dev/global/context-menu/playgroundCommonMainPlaybackContextMenu';
import { customPlaybackContextMenuManager } from '../../../AppData/forbidden/dev/global/context-menu/playgroundCustomPlaybackContextMenu';
import { accessoriesContextMenuManager } from '../../../AppData/forbidden/dev/global/context-menu/playgroundPlaybackAccessoriesContextMenu';
// import { extensionContextMenuManager } from '../../../AppData/forbidden/dev/global/context-menu/playgroundExtensionPlaybackContextMenu';
// Resume Playback
import { resumePlaybackIndex } from '../../../AppData/forbidden/dev/main/playground/customs/utils/settings/lib/resumePlayback/resumePlaybackIndex';

// Playback Integration — individual node scripts
// import { disableCommonPlayback, enableCommonPlayback, } from '../../../AppData/forbidden/dev/main/playground/customs/utils/settings/scripts/commonPlayback.script';
// import { disableAccessoriesPlayback, enableAccessoriesPlayback, } from '../../../AppData/forbidden/dev/main/playground/customs/utils/settings/scripts/accessoriesPlayback.script';
// import { disableExtensionsPlayback, enableExtensionsPlayback, } from '../../../AppData/forbidden/dev/main/playground/customs/utils/settings/scripts/extensionsPlayback.script';
// Playback Integration — registration hub (also owns Playlist logic)
import { applyPlaybackState, disablePlaylistPlayback, enablePlaylistPlayback, type PlaybackSettings, } from '../../../AppData/forbidden/dev/main/playground/customs/utils/settings/scripts/index.PlaybackIntegration.script';



interface ThumbnailState {
  visible: boolean;
  currentTime: number;
  mouseX?: number;
  mouseY?: number;
}

const Playground = () => {

  // ========================================================================
  // !Blank | Old openfile
  // ========================================================================
  useEffect(() => {
    // Initialize the singleton stage when playground mounts
    const stage = VideoTheaterStage.getInstance();
    
    return () => {
      // Optional: Cleanup if necessary
    };
  }, []);

  // ========================================================================
  // Video Playlist Card Display
  // ========================================================================
  const { 
  isOpen, isMinimized, position, size, 
  toggleViewbox, handleMinimize, handleRestore, handleClose,
  startDragging, startResizing // 👈 Add these two
} = usePlaylistViewbox();
  // ========================================================================
  // Playback Control Group (Primary Playback + Timeline)
  // ========================================================================
  const playbackControllerRef = useRef<PrimaryPlaybackController | null>(null);
  const timelineControllerRef = useRef<PrimaryPlaybackTimelineController | null>(null);
  
  useEffect(() => {
    // Initialize primary playback controller
    playbackControllerRef.current = PrimaryPlaybackController.getInstance();
    console.log('Primary playback controller initialized in Playground');

    // Initialize timeline controller
    timelineControllerRef.current = PrimaryPlaybackTimelineController.getInstance();
    timelineControllerRef.current.setSpriteConfig({
      width: 160,
      height: 90,
      columns: 10,
      interval: 1
    });
    console.log('Timeline controller initialized');

    return () => {
      if (playbackControllerRef.current) {
        playbackControllerRef.current.destroy();
      }
      if (timelineControllerRef.current) {
        timelineControllerRef.current.destroy();
      }
    };
  }, []);

  const handleTimelineSeekBarProgress = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    // Added
    const seekTime = parseFloat(event.target as unknown as HTMLInputElement["value"]);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }

    console.log('Timeline seek bar progress:', (event.target as HTMLInputElement).value);
  }, []);

  // ========================================================================
  // Sprite Manager
  // ========================================================================

  // Sprite thumbnail state
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

  // Initialize sprite thumbnail manager
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

    // Cleanup on unmount
    return () => {
      primaryPlaybackTimelineController.destroy();
    };
  }, []);

  // ========================================================================
  // Volume Control Group
  // ========================================================================
const [isVolumePopupVisible, setIsVolumePopupVisible] = useState(false);
const [volumeAttachedElement, setVolumeAttachedElement] = useState<HTMLElement | null>(null);
// const handleCloseVolumePopup = () => playbackControlEnhancement.closeVolumePopup();
const handleCloseVolumePopup = () => {
  playbackControlEnhancement.closeVolumePopup();
};

useEffect(() => {
  const volumeController = document.getElementById('volumeController');
  if (volumeController) {
    const handleVolumeClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      
      // Toggle logic
      if (isVolumePopupVisible) {
        handleCloseVolumePopup();
      } else {
        playbackControlEnhancement.showVolumePopup(volumeController as HTMLElement);
      }
    };
    volumeController.addEventListener('click', handleVolumeClick as any);
    return () => volumeController.removeEventListener('click', handleVolumeClick as any);
  }
}, [isVolumePopupVisible]);

useEffect(() => {
  const handleVolumeShow = (event: any) => {
    setIsVolumePopupVisible(true);
    setVolumeAttachedElement(event.detail.attachTo);
  };
  const handleVolumeHide = () => {
    setIsVolumePopupVisible(false);
  };
  
  window.addEventListener('showVolumePopup', handleVolumeShow);
  window.addEventListener('hideVolumePopup', handleVolumeHide);
  return () => {
    window.removeEventListener('showVolumePopup', handleVolumeShow);
    window.removeEventListener('hideVolumePopup', handleVolumeHide);
  };
}, []);


  // ========================================================================
  // Caption Control Group
  // ========================================================================
  const [isCaptionPopupVisible, setIsCaptionPopupVisible] = useState(false);
  
  useEffect(() => {
    const ccButton = document.getElementById('ccController');
    if (ccButton) {
      const handleCaptionClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (isCaptionPopupVisible) {
          captionControlEnhancement.hidePopup();
        } else {
          const popupElement = document.querySelector('.caption-subtitle-popup') as HTMLElement;
          if (popupElement) captionControlEnhancement.setPopupElement(popupElement);
          captionControlEnhancement.showPopup();
        }
      };
      ccButton.addEventListener('click', handleCaptionClick);
      return () => ccButton.removeEventListener('click', handleCaptionClick);
    }
  }, [isCaptionPopupVisible]);

  useEffect(() => {
    const originalShowPopup = captionControlEnhancement.showPopup.bind(captionControlEnhancement);
    const originalHidePopup = captionControlEnhancement.hidePopup.bind(captionControlEnhancement);

    captionControlEnhancement.showPopup = () => {
      originalShowPopup();
      setIsCaptionPopupVisible(true);
    };
    captionControlEnhancement.hidePopup = () => {
      originalHidePopup();
      setIsCaptionPopupVisible(false);
    };

    return () => captionControlEnhancement.cleanup();
  }, []);

  const handleCloseCaptionPopup = () => captionControlEnhancement.hidePopup();

  // ========================================================================
  // Skips Control Group
  // ========================================================================

  // Add these state variables to your component
const [isSkipControlsVisible, setIsSkipControlsVisible] = useState(false);
const [skipControlsPosition, setSkipControlsPosition] = useState({ x: 0, y: 0 });

// Add this useEffect to initialize the skip controls and button event listener
useEffect(() => {
  // Initialize skip controls
  const skipControls = SkipControls.getInstance();
  
  // Optional: Setup keyboard shortcuts
  skipControls.setupKeyboardShortcuts();

  // Setup button click handler
  const handleSkipControlsButton = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const button = target.closest('#skipsController') as HTMLButtonElement;
    
    if (button) {
      event.preventDefault();
      event.stopPropagation();
      
      // Calculate popup position relative to button
      const buttonRect = button.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Default position: below and to the left of the button
      let x = buttonRect.left;
      let y = buttonRect.bottom + 8;
      
      // Adjust if popup would go off-screen
      const popupWidth = 400; // Approximate popup width
      const popupHeight = 600; // Approximate popup height
      
      // Adjust horizontal position
      if (x + popupWidth > viewportWidth) {
        x = buttonRect.right - popupWidth;
      }
      if (x < 8) {
        x = 8;
      }
      
      // Adjust vertical position
      if (y + popupHeight > viewportHeight) {
        y = buttonRect.top - popupHeight - 8;
      }
      if (y < 8) {
        y = 8;
      }
      
      setSkipControlsPosition({ x, y });
      setIsSkipControlsVisible(true);
    }
  };

  // Add event listener for the skip controls button
  document.addEventListener('click', handleSkipControlsButton);

  // Cleanup
  return () => {
    document.removeEventListener('click', handleSkipControlsButton);
  };
}, []);

// Add this handler function
const handleCloseSkipControls = () => {
  setIsSkipControlsVisible(false);
};


  // ========================================================================
  // Aspect Ratio & Resolution Group
  // ========================================================================
  // Keep your existing state and refs
const [isAspectRatioVisible, setIsAspectRatioVisible] = useState(false);
const [isResolutionPopupVisible, setIsResolutionPopupVisible] = useState(false);
const aspectRatioButtonRef = useRef<HTMLButtonElement>(null);
const buttonHandlerRef = useRef<AspectRatioButtonHandler | null>(null);

// ADD THIS: The Listeners (This connects the singleton clicks to React)
useEffect(() => {
  const handleShow = () => setIsAspectRatioVisible(true);
  const handleHide = () => setIsAspectRatioVisible(false);

  // Listen for the events dispatched by AspectRatioButtonHandler
  document.addEventListener('aspectRatioPopupShow', handleShow);
  document.addEventListener('aspectRatioPopupHide', handleHide);

  // Initialize the singleton handler instance
  buttonHandlerRef.current = AspectRatioButtonHandler.getInstance();

  return () => {
    document.removeEventListener('aspectRatioPopupShow', handleShow);
    document.removeEventListener('aspectRatioPopupHide', handleHide);
  };
}, []);

// Keep your existing handlers (They are still needed for the UI to talk back)
const handleRatioSelect = (ratio: string) => {
  if (buttonHandlerRef.current) {
    buttonHandlerRef.current.handleRatioSelection(ratio);
  }
};

const handleClosePopup = () => {
  setIsAspectRatioVisible(false);
  // We notify the handler so it can remove the 'active' class from the button
  const event = new CustomEvent('aspectRatioPopupHide', { detail: { visible: false } });
  document.dispatchEvent(event);
};

const handleResolutionButtonClick = () => setIsResolutionPopupVisible(!isResolutionPopupVisible);

  // ========================================================================
  // Picture-in-Picture Group
  // ========================================================================
  useEffect(() => {
    VideoTheaterStage.getInstance();
    buttonHandlerRef.current = AspectRatioButtonHandler.getInstance();
    const pipController = PictureInPictureController.getInstance();

    const handlePopupShow = () => setIsAspectRatioVisible(true);
    const handlePopupHide = () => setIsAspectRatioVisible(false);

    document.addEventListener('aspectRatioPopupShow', handlePopupShow);
    document.addEventListener('aspectRatioPopupHide', handlePopupHide);

    return () => {
      document.removeEventListener('aspectRatioPopupShow', handlePopupShow);
      document.removeEventListener('aspectRatioPopupHide', handlePopupHide);
      pipController.cleanup();
    };
  }, []);

  // ========================================================================
  // Bitrate Group
  // ========================================================================

  const [isBitratePopupVisible, setBitratePopupVisible] = useState(false);
const [bitratePopupPosition, setBitratePopupPosition] = useState({ top: 0, left: 0 });

const handleCloseBitratePopup = () => {
  setBitratePopupVisible(false);
};

useEffect(() => {
  const cleanup = setupBitratePopup('bitrateController', setBitratePopupPosition, () => {
    setBitratePopupVisible(prev => !prev);
  });

  // Clean up listeners on unmount
  return () => {
    if (typeof cleanup === 'function') cleanup();
  };
}, []);


  // ========================================================================
  // Playbackspeed Group
  // ========================================================================

const [isPlaybackSpeedPopupVisible, setPlaybackSpeedPopupVisible] = useState(false);
const [popupPosition, setPopupPosition] = useState({ left: 0, top: 0 });
const speedButtonRef = useRef<HTMLElement | null>(null);

const handleClosePlaybackSpeedPopup = () => {
  setPlaybackSpeedPopupVisible(false);
};

const handleSpeedButtonClick = (e: Event) => {
  e.stopPropagation();
  
  const speedBtn = e.target as HTMLElement;
  const rect = speedBtn.getBoundingClientRect();
  
  // Calculate position (left-aligned to button)
  setPopupPosition({
    left: rect.left - 200 - 8, // Assuming popup width ~200px
    top: rect.top
  });
  
  setPlaybackSpeedPopupVisible(prev => !prev);
};

useEffect(() => {
  const speedBtn = document.getElementById('speedController');
  if (speedBtn) {
    speedButtonRef.current = speedBtn;
    speedBtn.addEventListener('click', handleSpeedButtonClick);
  }
  
  return () => {
    if (speedButtonRef.current) {
      speedButtonRef.current.removeEventListener('click', handleSpeedButtonClick);
    }
  };
}, []);

  // ========================================================================
  // FPS Group
  // ========================================================================
const [isFrameRatePopupVisible, setIsFrameRatePopupVisible] = useState(false);
  const [fpsPopupPosition, setFpsPopupPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // This handler reacts to the window event dispatched by fps.script.ts
    const handleToggleFPSPopup = (event: any) => {
      const { position } = event.detail;
      
      setFpsPopupPosition(position);
      setIsFrameRatePopupVisible(prev => !prev);
    };

    window.addEventListener('toggleFPSPopup', handleToggleFPSPopup);

    return () => {
      window.removeEventListener('toggleFPSPopup', handleToggleFPSPopup);
    };
  }, []);

  const handleCloseFrameRatePopup = () => {
    setIsFrameRatePopupVisible(false);
    
    // 2. THIS IS WHERE fpsController IS READ (Fixes your error)
    // We check if it exists and is currently active before stopping it
    if (fpsController && fpsController.isActive()) {
      fpsController.stopMonitoring();
    }
  };


  // ========================================================================
  // VideoTheaterManager Group | Link Deployer
  // ========================================================================

  {/*useEffect(() => {
    const videoManager = new VideoTheaterManager();
    return () => {
      videoManager.destroy();
    };
  }, []);*/}

  // State
const [isDeployerOpen, setIsDeployerOpen] = useState(false);

// Enhanced deploy handler
const handleDeploy = (data: DeployerData) => {
  console.log('Deployment Data:', data);
  
  if (data.mode === DeployMode.VIDEO_STAGE) {
    console.log('Deploying to Video Stage');
    // Video stage deployment is handled automatically by the core
  } else if (data.mode === DeployMode.EMBED) {
    console.log('Deploying to Embed Window');
    // Embed deployment is handled automatically by the core
  }

  setIsDeployerOpen(false);
};

const handleCancel = () => {
  console.log('Deployment cancelled');
  setIsDeployerOpen(false);
};




  // ========================================================================
  // Fullscreen Group
  // ========================================================================
  const [isFullscreenPopupVisible, setIsFullscreenPopupVisible] = useState(false);

useEffect(() => {
  let showTimeout: NodeJS.Timeout;
  let hideTimeout: NodeJS.Timeout;

  const handlePopupShow = () => {
    console.log('Received popup show event');
    
    // Clear any pending hide timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    
    // Add small delay to prevent rapid toggling
    showTimeout = setTimeout(() => {
      setIsFullscreenPopupVisible(true);
    }, 10);
  };

  const handlePopupHide = () => {
    console.log('Received popup hide event');
    
    // Clear any pending show timeout
    if (showTimeout) {
      clearTimeout(showTimeout);
    }
    
    // Add small delay to allow for mouse transitions
    hideTimeout = setTimeout(() => {
      setIsFullscreenPopupVisible(false);
    }, 50);
  };

  document.addEventListener('fullscreen-popup-show', handlePopupShow);
  document.addEventListener('fullscreen-popup-hide', handlePopupHide);

  return () => {
    // Clear timeouts on cleanup
    if (showTimeout) clearTimeout(showTimeout);
    if (hideTimeout) clearTimeout(hideTimeout);
    
    document.removeEventListener('fullscreen-popup-show', handlePopupShow);
    document.removeEventListener('fullscreen-popup-hide', handlePopupHide);
  };
}, []);

// Enhanced close handler
const handleFullscreenPopupClose = () => {
  console.log('Manual popup close triggered');
  setIsFullscreenPopupVisible(false);
  
  // Also notify the fullscreen manager
  if (window.fullscreenManager) {
    window.fullscreenManager.hidePopup();
  }
};

 // =========================================================================
  // 1. Resume Playback
  // =========================================================================
  //
  // onVideoSourceLoaded is declared first so every section below can safely
  // reference it. Previously the user's local ordering caused TypeScript to
  // report "used before declaration" because useCallback closures capture
  // the binding at parse time in strict mode.
  //
  // Flow: loadVideoFile / drop → onVideoSourceLoaded(nativePath)
  //   → primaryPlaybackTimelineController.setVideoSource(nativePath)
  //     → canplay fires → initializeResumePlayback()
  //       → reads JSON → sets currentTime → starts auto-save
  // =========================================================================

  const onVideoSourceLoaded = useCallback((nativePath: string) => {
    primaryPlaybackTimelineController.setVideoSource(nativePath);
    console.log('📼 Resume playback keyed to:', nativePath);
  }, []);


  
  // =========================================================================
  // 2. Open File
  // =========================================================================
  //
  // Wraps handleOpenLocalFile (owned by open.file.import.ts) and passes
  // onVideoSourceLoaded so resume is wired after the file is picked.
  // This wrapper is what VideoSubSettings "Open Local File" row calls —
  // onClick={() => handleOpenLocalFile()} in VideoSubSettings passes NO
  // callback intentionally because VideoSubSettings has no access to
  // onVideoSourceLoaded. Resume wiring from the settings row is handled
  // by the drop/dialog paths that go through Playground.
  // =========================================================================

  const handleOpenFile = useCallback(() => {
    handleOpenLocalFile(onVideoSourceLoaded);
  }, [onVideoSourceLoaded]);

  // =========================================================================
  // 3. Drag-and-Drop
  // =========================================================================

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const videoFile = files.find(f =>
      /\.(mp4|mkv|mov|avi|webm|flv|ts|m4v|wmv|3gp)$/i.test(f.name)
    );

    if (!videoFile) {
      console.warn('⚠️ Dropped file is not a supported video format');
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const nativePath: string | undefined = (videoFile as any).path;
    const blobUrl = URL.createObjectURL(videoFile);

    video.src = blobUrl;
    video.load();
    video.play().catch(err => console.warn('⚠️ Auto-play blocked:', err));

    if (nativePath) {
      onVideoSourceLoaded(nativePath);
      console.log('📂 Dropped file loaded:', videoFile.name);
    } else {
      console.warn('⚠️ No native path on dropped file — resume will not persist this session');
    }
  }, [onVideoSourceLoaded]);

  // =========================================================================
  // 4. Lifecycle
  // =========================================================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onError = (e: Event) => console.error('❌ Video element error:', e);
    video.addEventListener('error', onError);

    return () => {
      video.removeEventListener('error', onError);
      primaryPlaybackTimelineController.destroy();
      resumePlaybackIndex.destroy();
    };
  }, []);


   // =========================Accessories Core Features======================
  // 1. Accessories Integration
  //=========================================================================
  
  // ========================================================================
  // Video OCR
  // ========================================================================
  const [isSnapActive, setIsSnapActive] = useState(false);
  const [isOCRVisible, setIsOCRVisible] = useState(false);

  // OPTIONAL: Automatically open when playground starts
  useEffect(() => {
    // setIsOCRVisible(true); // Uncomment if you want it open by default
  }, []);

  const toggleOCR = () => setIsOCRVisible(!isOCRVisible);

  // ========================================================================
  // 1. Recording
  //=========================================================================

  useEffect(() => {
  initializeRecorderAccessories();
}, []);

   // ========================================================================
  // 1. Video Filters
  //=========================================================================
   const [isFilterOpen, setIsFilterOpen] = useState(false);

  // =========================Extensions Core Features======================
  // 1. Extensions Integration
  //=========================================================================

  const [activeExtensions, setActiveExtensions] = useState<any[]>([]);

  useEffect(() => {
  initExtensionSystem();

  const handleOpen = (e: any) => {
    setActiveExtensions(prev => {
      // Check if extension ID already exists in the state array
      const exists = prev.find(ext => ext.id === e.detail.id);
      if (exists) return prev; // Return existing state if found (no duplicate)
      
      return [...prev, e.detail];
    });
  };

  window.addEventListener('OPEN_EXTENSION', handleOpen);
  return () => window.removeEventListener('OPEN_EXTENSION', handleOpen);
}, []);

  // =========================All Theater Core Features======================
  // 1. Video File Dropper
  //=========================================================================

  // ========================================================================
  // Video File dragged dropper
  // ========================================================================
  useEffect(() => {
        // Initialize the Singleton (which starts the element finding process)
        VideoTheaterStage.getInstance(); 
        
        // Initialize the Dropper module
        const dropper = new VideoDropper();
        
        // Optionally, return a cleanup function
        // return () => { 
        //     // If you added cleanup/unsubscribe methods to VideoDropper, call them here.
        // };

    }, []);

  // ========================================================================
  // Playback Integration
  // ========================================================================
  const [playbackSettings, setPlaybackSettings] = useState<PlaybackSettings>({
  disableCommon: false,
  disableAccessories: false,
  disableExtension: false,
  disablePlaylist: false,
});

// ─── 3. Restore on Mount ──────────────────────────────────────────────────────
//
// If you persist settings (e.g., localStorage or a server profile),
// rehydrate them here. applyPlaybackState() calls every enable/disable
// function in one shot so the DOM reflects the saved state immediately.

useEffect(() => {
  applyPlaybackState(playbackSettings);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // run once on mount

  // ========================================================================
  // Video link dragged dropper
  // ========================================================================

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && videoRef.current) {
      try {
        console.log("BlackVideo: Initializing YouTube Dropper...");
        const handler = new YouTubeDragDropHandler(
          containerRef.current, 
          videoRef.current
        );

        // Cleanup on unmount
        return () => handler.destroy();
      } catch (err) {
        console.error("BlackVideo: Dropper Init Failed", err);
      }
    }
  }, []);

  // ========================================================================
  // Context-Menu
  // ========================================================================
  // Subscribe to playback controls visibility changes
  useEffect(() => {
    const unsubscribe = playbackControlsContextMenuManager.subscribe((visibility) => {
      console.log('Playback controls visibility updated:', visibility);
      
      // Apply visibility changes to control elements
      const controlElements = {
        sprite: document.querySelector('.sprite-preview'),
        heatmap: document.querySelector('.heatmap-indicator'),
        timelineCounter: document.getElementById('videoTimelineDurationCounter'),
        timelineDuration: document.getElementById('videoTimelineCurrentDurationTotal'),
        previous: document.getElementById('previous-control'),
        playPause: document.getElementById('pause-play-control'),
        reset: document.getElementById('reload-control'),
        loop: document.getElementById('loop-control'),
        speaker: document.getElementById('volumeController'),
        closedCaptions: document.getElementById('ccController'),
        skips: document.getElementById('skipsController'),
        playbackSpeed: document.getElementById('speedController'),
        frameRate: document.getElementById('frameRateController'),
        bitrate: document.getElementById('bitrateController'),
        resolution: document.getElementById('resolution-controller'),
        pictureInPicture: document.getElementById('pip-controller'),
        aspectRatio: document.getElementById('aspect-ratio-controller'),
        fullscreen: document.getElementById('fullscreen-controller'),
      };

      Object.entries(visibility).forEach(([key, visible]) => {
        const element = controlElements[key as keyof typeof controlElements];
        if (element) {
          (element as HTMLElement).style.display = visible ? '' : 'none';
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to custom playback visibility changes
  useEffect(() => {
    const unsubscribe = customPlaybackContextMenuManager.subscribe((visibility) => {
      console.log('Custom playback visibility updated:', visibility);
      
      // Apply visibility changes to custom control elements
      const customElements = {
        skipIntroOutro: document.getElementById('skip-intro-outro'),
        sleepTimer: document.getElementById('sleep-timer-util'),
        ambient: document.getElementById('ambient-mode-util'),
        flipVideo: document.getElementById('flip-video-util'),
        save: document.getElementById('save-vid-util'),
        screenCast: document.getElementById('screen-cast-util'),
        share: document.getElementById('share-vid-util'),
        reset: document.querySelector('.video-submenu .reset-btn'),
        loop: document.querySelector('.video-submenu .loop-btn'),
        previous: document.getElementById('video-submenu-prev'),
        next: document.getElementById('video-submenu-next'),
        playPause: document.querySelector('.video-submenu .playback-indicator'),
      };

      Object.entries(visibility).forEach(([key, visible]) => {
        const element = customElements[key as keyof typeof customElements];
        if (element) {
          (element as HTMLElement).style.display = visible ? '' : 'none';
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to accessories settings changes
  useEffect(() => {
    const unsubscribe = accessoriesContextMenuManager.subscribe((settings) => {
      console.log('Accessories settings updated:', settings);
      
      // Apply visibility changes
      const accessoryElements = {
        linkDeployer: document.querySelector('.hexagon:nth-child(1)'),
        aiChat: document.querySelector('.hexagon:nth-child(2)'),
        filters: document.querySelector('.hexagon:nth-child(3)'),
        magnifyingGlass: document.getElementById('magnifying-glass-placeholder'),
        screenCapture: document.getElementById('screen-capture-placeholder'),
        recorder: document.getElementById('recording-accessories'),
        videoOCR: document.getElementById('video-ocr-accessories'),
      };

      Object.entries(settings.visibility).forEach(([key, visible]) => {
        const element = accessoryElements[key as keyof typeof accessoryElements];
        if (element) {
          (element as HTMLElement).style.display = visible ? '' : 'none';
        }
      });

      // Apply icon shape changes
      const hexagonBar = document.getElementById('accessories-built-ins');
      if (hexagonBar) {
        hexagonBar.className = `${settings.iconShape}-bar`;
      }
    });

    return () => unsubscribe();
  }, []);


  // ========================================================================
  // UI Rendering
  // ========================================================================
  return (
    <main className="Playground-Page" id="PlaygroundArsenal">
      <div ref={containerRef} id="videoContainer" className="video-container">
        <video ref={videoRef} id="VideoPlayer-TheaterStage" className="video-player-theater-stage video-js" poster="/media/poster.placeholder.png" aria-label="Theater Stage" data-setup='{}'>
          <source id="VideoSource-Stream" className="video-source" src="/media/sample.mp4" type="video/mp4" />
          <track label="English" kind="subtitles" srcLang="en" src="" default />
          Your browser does not support the video tag.
        </video>
        {/*<VideoTheaterStage />*/}
        <div id="video-file-name" className="video-file-name tooltip"></div>
        <VideoControls videoId="VideoPlayer-TheaterStage" isVisible={false} videoDuration={0}/>
      </div>
      {/* Sprite Thumbnail Preview Overlay */}
        <SpriteThumbnail
          spriteConfig={spriteConfig}
          currentTime={thumbnailState.currentTime}
          mouseX={thumbnailState.mouseX}
          mouseY={thumbnailState.mouseY}
          visible={thumbnailState.visible}
        />
      <div id="videoElements" className="video-elements">
        <div id="videoFullPackPlaybackControls" className="controls-bar" role="group" aria-label="Video controls">
          <span id="videoTimelineDurationCounter" className="time">00:00:00</span>
          <input id="videoTimelineSeekBarProgress" className="scrubber-bar" type="range" min="0" max="100" defaultValue="0" aria-label="Video progress" step={0.01} onChange={handleTimelineSeekBarProgress} />
          <span id="videoTimelineCurrentDurationTotal" className="time">00:00:00</span>
          <div id="videoPlaybackControlsEssentials" className="video-playback-controls buttons">
            <button id="previous-control" className="control-previous-ztr" aria-label="Previous" title="Previous">
              <i id="previous-btn" className="previous-action action-toggle-icons">
                <img id="previous-icon" className="previous-icon icons-group-styles" src="/assets/others/previous.png" alt="Previous" />
              </i>
            </button>
            <button id="pause-play-control" className="control-pause-play-ztr" aria-label="Pause" title="Pause">
              <i id="pause-play-btn" className="pause-paly-action action-toggle-icons">
                <img id="pause-play-icon" className="pause-play-icon icons-group-styles" src="/assets/others/pause.png" alt="Pause" />
              </i>
            </button>
            <button id="next-control" className="control-next-ztr" aria-label="Next" title="Next">
              <i id="next-btn" className="next-action action-toggle-icons">
                <img id="next-icon" className="next-icon icons-group-styles" src="/assets/others/next.png" alt="Next" />
              </i>
            </button>
            <button id="reload-control" className="control-reload-ztr" aria-label="Reload" title="Reload">
              <i id="reload-btn" className="reload-action action-toggle-icons">
                <img id="reload-icon" className="reload-icon icons-group-styles" src="/assets/others/reset.png" alt="Reload" />
              </i>
            </button>
            <button id="loop-control" className="control-loop-ztr" aria-label="Repeat" title="Repeat">
              <i id="loop-btn" className="loop-action action-toggle-icons">
                <img id="loop-icon" className="loop-icon icons-group-styles" src="/assets/others/single.loop.png" alt="Loop Video" />
              </i>
            </button>
            <button id="volumeController" className="control-volume-ztr" aria-label="Volume" title="Volume">
              <i id="volume-btn" className="volume-action action-toggle-icons">
                <img id="volume-icon" className="volume-icon icons-group-styles" src="/assets/others/speaker.half.png" alt="Volume" />
              </i>
            </button>
            <button id="ccController" className="control-caption-ztr" aria-label="CC" title="Closed Captions">
              <i id="cc-btn" className="cc-action action-toggle-icons">
                <img id="cc-icon" className="cc-icon icons-group-styles" src="/assets/others/caption.png" alt="" />
              </i>
            </button>
            <button id="skipsController" className="control-skips-ztr" aria-label="Skips" title="Skips">
              <i id="skips-btn" className="skips-action action-toggle-icons">
                <img id="skips-icon" className="skips-icon icons-group-styles" src="/assets/others/skips.png" alt="Skip Elements" />
              </i>
            </button>
            <button id="speedController" className="control-playback-speed-ztr" aria-label="Speed" title="Playback Speeds">
              <i id="speed-btn" className="speed-action action-toggle-icons">
                <img id="speed-icon" className="speed-icon icons-group-styles" src="/assets/others/playback.speed.png" alt="Playback Speed" />
              </i>
            </button>
            <button id="frameRateController" className="control-frame-rate-ztr" aria-label="Frame Rate" title="Frame Rate" onClick={(e) => {e.stopPropagation();}}>
              <i id="frame-rate-btn" className="frame-rate-action action-toggle-icons">
                <img id="frame-rate-icon" className="frame-rate-icon icons-group-styles" src="/assets/others/fps.png" alt="Frame Rate" />
              </i>
            </button>
            <button id="bitrateController" className="control-bitrate-ztr" aria-label="Bitrate" title="Bitrate">
              <i id="bitrate-btn" className="bitrate-action action-toggle-icons">
                <img id="bitrate-icon" className="bitrate-icon icons-group-styles" src="/assets/others/bitrate.png" alt="Bitrate" />
              </i>
            </button>
            <button id="resolution-controller" className="control-resolution-ztr" aria-label="Resolution" title="Resolutions" onClick={handleResolutionButtonClick}>
              <i id="resolution-btn" className="resolution-action action-toggle-icons">
                <img id="resolution-icon" className="resolution-icon icons-group-styles" src="/assets/others/resolution.png" alt="Resolutions" />
              </i>
            </button>
            <button id="pip-controller" className="control-pip-ztr" aria-label="Picture in picture" title="Picture in picture">
              <i id="pip-btn" className="pip-action action-toggle-icons">
                <img id="pip-icon" className="pip-icon icons-group-styles" src="/assets/others/pip.png" alt="Picture in picture" />
              </i>
            </button>
            <button id="aspect-ratio-controller" className="control-aspect-ratio-ztr" aria-label="Aspect Ratio" title="Aspect Ratio">
              <i id="aspect-ratio-btn" className="aspect-ratio-action action-toggle-icons">
                <img id="aspect-ratio-icon" className="aspect-ratio-icon icons-group-styles" src="/assets/others/aspect-ratio.png" alt="Aspect Ratio" />
              </i>
            </button>
            <button id="fullscreen-controller" className="control-fullscreen-ztr" aria-label="Fullscreen" title="Fullscreen">
              <i id="fullscreen-btn" className="fullscreen-action action-toggle-icons">
                <img id="fullscreen-icon" className="fullscreen-icon icons-group-styles" src="/assets/others/fullscreen.png" alt="Fullscreen" />
              </i>
            </button>
          </div>
        </div>
        <div id="accessories-built-ins" className="hexagon-bar" aria-label="Accessories built-ins">
          {/*Accessories Built-ins*/}
          <div className="hexagon" title="Deploy link to play" onClick={() => setIsDeployerOpen(true)}>
            <div id="accessories-control-btn-link-placeholder" className="hexagon-inner">
              <i id="accessories-link-player-btn" className="accessories-link-player-btn open-deployer-btn action-toggle-icons">
                <img id="accessories-link-player-icon" className="accessories-link-player-icon accessories-group-icon-styles" src="/assets/common/link.png" alt="Deploy link to play" />
              </i>
            </div>
          </div>
          <div className="hexagon" title="Ask AI">
            <div id="accessories-control-btn-ask-ai-placeholder" className="hexagon-inner">
              <i id="accessories-ask-ai-player-btn" className="accessories-ask-ai-player-btn action-toggle-icons">
                <img id="accessories-ask-ai-player-icon" className="accessories-ask-ai-player-icon accessories-group-icon-styles" src="/assets/common/ai-ask.png" alt="Ask AI" />
              </i>
            </div>
          </div>
          <div className="hexagon" title="Video Filters" onClick={() => setIsFilterOpen(!isFilterOpen)} style={{ cursor: 'pointer' }}>
            <div id="accessories-control-btn-video-filter-placeholder" className="hexagon-inner">
              <i id="accessories-video-filter-player-btn" className="accessories-video-filter-player-btn open-deployer-btn action-toggle-icons">
                <img id="accessories-video-filter-player-icon" className="accessories-video-filter-player-icon accessories-group-icon-styles" src="/assets/common/video-filters.png" alt="Video Filters" />
              </i>
            </div>
          </div>
          <div className="hexagon" title="Magnifying glass">
            <div id="magnifying-glass-placeholder" className="hexagon-inner">
              <i id="accessories-magnifying-glass-btn" className="accessories-magnifying-glass-btn action-toggle-icons">
                <img id="accessories-magnifying-glass-icon" className="accessories-magnifying-glass-icon accessories-group-icon-styles" src="/assets/common/magnify.png" alt="Magnifying glass" />
              </i>
            </div>
          </div>
          <div className="hexagon" title="Capture Frame" onClick={() => setIsSnapActive(true)}>
            <div id="screen-capture-placeholder" className="hexagon-inner">
              <i id="accessories-snap-capture-btn" className="accessories-snap-capture-btn action-toggle-icons">
                <img id="accessories-snap-capture-icon" className="accessories-snap-capture-icon accessories-group-icon-styles" src="/assets/common/snap.png" alt="Take a snapshot" />
              </i>
            </div>
          </div>
          <div id="recording-accessories" className="hexagon" title="Recordings">
            <div id="screen-record-placeholder" className="hexagon-inner">
              <i id="accessories-screen-record-btn" className="accessories-screen-record-btn action-toggle-icons">
                <img id="accessories-screen-record-icon" className="accessories-screen-record-icon accessories-group-icon-styles" src="/assets/common/record.png" alt="Take a recording" />
              </i>
            </div>
          </div>
          <div id="video-ocr-accessories" className={`hexagon ${isOCRVisible ? 'active' : ''}`} title="Video OCR" onClick={toggleOCR}>
            <div id="video-ocr-placeholder" className="hexagon-inner">
              <i id="accessories-video-ocr-btn" className="accessories-video-ocr-btn action-toggle-icons">
                <img id="accessories-video-ocr-icon" className="accessories-video-ocr-icon accessories-group-icon-styles" src="/assets/common/zephyra-ocr.png" alt="Take a OCR" />
              </i>
            </div>
          </div>
          {/*Accessories Built-ins*/}
        </div>
        <div id="extension-built-ins" className="second-icon-bar" aria-label="Second icon bar">
          {/*Extension Built-ins*/}
          <button id="pluginCard-port" className="extension-card computer-vision jednazLonestamp" aria-label="Icon A" title="Computer Vision">
            <i className="extensionToggle">
              <img id="addedExtensionIcon" className="extensionProfile" src="/AppRegistry/extensions/compter-vision/icon.png" />
            </i>
          </button>
          {/*<ExtensionButtonBar/>*/}
          {/*Extension Built-ins*/}
          <div id="addExtension-btn" className="extension-portal">
            <div className="extension-portal-box">
              <div id="extension-add-btn-wrapper" className="extension-add-btn-wrapper" title="Extensions">
                <img id="extension-add-btn" className="extension-add-btn" src="/assets/others/add.png" alt="Add extension"/>
                <img id="extension-dropdown-more-btn" className="extension-dropdown-more-btn" src="/assets/others/dropdown-arrow.png" alt=""/>
              </div>
            </div>
          </div>
        </div>
        <div className="thumbnails-scroll" aria-label="Video thumbnails">
          <div id="playlistControlsLeft" className="video-playlist-controls">
            <button id="playlist-scroll-left" aria-label="Scroll left" className="scroll-btn" title="Scroll left">
              <i className="fas fa-chevron-left"></i>
            </button>
          </div>
          <div id="playlistCardPlayContainer" className="thumbnails-list">
            {/*Video Card List Template*/}
            {/*
            <div id="videoListCard" style={{width: '200px'}} className="thumbnail">
              <video style={{width: '200px', objectFit: 'cover'}} id="vidListPoster" className="video-poster-overlay" width="128" height="72">
              <source src="/media/sample.mp4"></source>
              </video>
              <video alt="deprecated" style={{ display: 'none', position: 'absolute', width: 'inherit', height: 'inherit', top: '0' }} id="videoHiddenList" src="/media/sample.mp4" className="video-initial-hidden" poster="" preload="metadata"></video>
              <div id="videoCaption-tzr" className="caption">Lisa Thailand <span id="video-list-year" className="year">2002</span>
              </div>
            </div>
            */}
            {/*Video Card List Template*/}
            <VideoPlaylist />
          </div>
          <div id="playlistControlsRight" className="video-playlist-controls">
            <button id="playlist-scroll-right" aria-label="Scroll right" className="scroll-btn" title="Scroll right">
              <i className="fas fa-chevron-right"></i>
            </button>
            {/*<span className="videoPlaylistCounter" style={{ color: '#999', fontSize: '12px', marginLeft: '8px' }}>559</span>*/}
            <div className="playlist-header">
               <span className="videoPlaylistCounter" onClick={toggleViewbox}
            style={{ 
            color: 'var(--text-muted)', 
            fontSize: '12px', 
            marginLeft: '8px', 
            cursor: 'pointer',
            padding: '2px 6px',
            backgroundColor: 'var(--surface-color)',
            borderRadius: '4px'
          }}
        >
          559
        </span>
      </div>
          </div>

      {/* Context Menus */}
      <PlaygroundCommonMainPlaybackContextMenu targetElementId="videoElements" />
      <PlaygroundCustomPlaybackContextMenu targetElementId="video-submenu" />
      <PlaygroundPlaybackAccessoriesContextMenu targetElementId="accessories-built-ins" />
      <PlaygroundExtensionPlaybackContextMenu targetElementId="extension-built-ins" />
      <PlaygroundVideoTheaterStageContextMenu targetElementId="videoContainer" />

        </div>
      </div>
      <SpeakerUI
        isVisible={isVolumePopupVisible}
        onClose={handleCloseVolumePopup}
        attachTo={volumeAttachedElement}
      />
      <CaptionSubtitleUI
        isVisible={isCaptionPopupVisible}
        onClose={handleCloseCaptionPopup}
      />
      <ResolutionUI
        isVisible={isResolutionPopupVisible}
        onClose={() => setIsResolutionPopupVisible(false)}
      />
      <AspectRatioUI
        isVisible={isAspectRatioVisible}
        onClose={handleClosePopup}
        onRatioSelect={handleRatioSelect}
        buttonRef={aspectRatioButtonRef}
      />
      <PlaybackSpeedUI
      isVisible={isPlaybackSpeedPopupVisible}
      onClose={handleClosePlaybackSpeedPopup}
      position={popupPosition}
      />

      <SkipControlsUI
      isVisible={isSkipControlsVisible}
      onClose={handleCloseSkipControls}
      position={skipControlsPosition}
      />

      {/* FPS UI Popup */}
      <FrameRateUI
        isVisible={isFrameRatePopupVisible}
        onClose={handleCloseFrameRatePopup}
        position={fpsPopupPosition}
      />

      {/* Bitrate UI */}
      <BitrateUI
        isVisible={isBitratePopupVisible}
        onClose={handleCloseBitratePopup}
        position={bitratePopupPosition}
      />

      {/* Fullscreen UI Component */}
      <FullscreenUI
        isVisible={isFullscreenPopupVisible}
        onClose={handleFullscreenPopupClose}
        />

      {/*Accessories Popup Components*/}

      {/* Render LinkDeployer UI */}
      <LinkDeployerUI
        isOpen={isDeployerOpen}
        onClose={() => setIsDeployerOpen(false)}
        config={{
          titleText: 'Link Player Deployer',
          urlPlaceholder: 'https://youtube.com/watch?v=... or any supported video URL',
          fileTypes: ['.txt', '.json', '.md'],
          onDeploy: handleDeploy,
          onCancel: handleCancel
        }}
      />

      {/* Snapshot */}
      <SnapCaptureController 
        isOpen={isSnapActive} 
        onClose={() => setIsSnapActive(false)} 
/>
      {/* Video OCR */}
      <VideoOCRUI 
        isOpen={isOCRVisible} 
        onClose={() => setIsOCRVisible(false)} 
      />
      {/* Video Filters */}
      <VideoFilterEffectUI 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

      {/* Extensions Area */}
      {/* Render all currently active popups */}
      {activeExtensions.map((ext) => (
        <ExtensionModalFrame 
          key={ext.id}
          id={ext.id}
          title={ext.title}
          className={ext.devClass}
          onClose={() => setActiveExtensions(prev => prev.filter(a => a.id !== ext.id))}
        />
      ))}
      {/* The Viewbox Popup */}
      {isOpen && (
      <VideoPlaylistFullView 
        isMinimized={isMinimized}
        position={position}
        size={size}
        onMinimize={handleMinimize}
        onRestore={handleRestore}
        onClose={handleClose}
        startDragging={startDragging} // 🟢 Added
        startResizing={startResizing} // 🟢 Added
  />
)}

    </main>
  );
};

export default Playground;