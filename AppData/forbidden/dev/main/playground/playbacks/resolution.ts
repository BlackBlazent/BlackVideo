/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// resolution.ts
export interface ResolutionOption {
  label: string;
  notes: string;
  value: string;
}

export const resolutionOptions: ResolutionOption[] = [
  { label: '144p', notes: 'Very low quality', value: '144p' },
  { label: '240p', notes: 'Low quality, faster loading', value: '240p' },
  { label: '360p', notes: 'Standard SD quality', value: '360p' },
  { label: '480p', notes: 'SD (DVD quality)', value: '480p' },
  { label: '540p', notes: 'Higher SD / qHD', value: '540p' },
  { label: '720p', notes: 'HD (entry-level HD)', value: '720p' },
  { label: '1080p', notes: 'Full HD', value: '1080p' },
  { label: '1440p', notes: 'QHD or 2K', value: '1440p' },
  { label: '2160p', notes: '4K UHD', value: '2160p' },
  { label: '4320p', notes: '8K UHD', value: '4320p' }
];

export const toggleResolutionPopup = () => {
  const popup = document.getElementById('resolution-popup');
  if (popup) {
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  }
};

export const closeResolutionPopup = () => {
  const popup = document.getElementById('resolution-popup');
  if (popup) {
    popup.style.display = 'none';
  }
};

import { ResolutionProcessor } from './resolution.processor';

export const handleResolutionSelect = (value: string) => {
  console.log('Selected resolution:', value);
  // Apply the resolution using our processor
  const processor = ResolutionProcessor.getInstance();
  processor.setResolution(value);
  
  // Close the popup after applying resolution
  closeResolutionPopup();
};

// Close popup when clicking outside
export const initResolutionController = () => {
  document.addEventListener('mousedown', (event) => {
    const popup = document.getElementById('resolution-popup');
    const button = document.getElementById('resolution-controller');
    const target = event.target as Node;
    
    // Don't close if clicking inside popup or on the controller button
    if (popup && button && 
        !popup.contains(target) && 
        !button.contains(target) &&
        popup.style.display !== 'none') {
      closeResolutionPopup();
    }
  });
};