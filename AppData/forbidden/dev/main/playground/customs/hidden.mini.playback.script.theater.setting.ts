/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useState } from 'react';

export const useSubSettingsUI = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // UI Toggle states (Visual only for now)
  const [resumePlayback, setResumePlayback] = useState(true);
  const [rememberVolume, setRememberVolume] = useState(false);
  const [renderMode, setRenderMode] = useState<'video' | 'canvas'>('video');

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  return {
    isSettingsOpen,
    toggleSettings,
    resumePlayback,
    setResumePlayback,
    rememberVolume,
    setRememberVolume,
    renderMode,
    setRenderMode
  };
};