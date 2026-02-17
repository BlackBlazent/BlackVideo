/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// saved.captured.ts - Handle saving recorded videos to OS downloads folder
import { invoke } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';

/**
 * Save recorded video to OS downloads folder
 * @param blob - The recorded video blob
 * @param baseFilename - Base filename without extension
 */
export async function saveRecording(blob: Blob, baseFilename: string): Promise<void> {
  try {
    // Determine file extension from blob type
    const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const filename = `${baseFilename}.${extension}`;
    
    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Use Tauri dialog to let user choose save location (defaults to Downloads)
    const filePath = await save({
      defaultPath: filename,
      filters: [{
        name: 'Video',
        extensions: [extension]
      }]
    });
    
    if (filePath) {
      // Write file to selected location
      await writeFile(filePath, uint8Array);
      
      console.log(`Recording saved successfully: ${filePath}`);
      
      // Show success notification
      showNotification('Recording Saved', `Video saved to ${filePath}`);
    } else {
      console.log('Save cancelled by user');
    }
  } catch (error) {
    console.error('Failed to save recording:', error);
    showNotification('Save Failed', 'Could not save recording. Please try again.', 'error');
    throw error;
  }
}

/**
 * Auto-save to downloads folder without dialog
 * @param blob - The recorded video blob
 * @param baseFilename - Base filename without extension
 */
export async function autoSaveToDownloads(blob: Blob, baseFilename: string): Promise<void> {
  try {
    // Determine file extension from blob type
    const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const filename = `${baseFilename}.${extension}`;
    
    // Convert blob to array buffer
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Get downloads directory path from Tauri
    const downloadsPath = await invoke<string>('get_downloads_path');
    const filePath = `${downloadsPath}/${filename}`;
    
    // Write file to downloads folder
    await writeFile(filePath, uint8Array);
    
    console.log(`Recording auto-saved: ${filePath}`);
    
    // Show success notification
    showNotification('Recording Saved', `Video saved to Downloads folder`);
  } catch (error) {
    console.error('Failed to auto-save recording:', error);
    showNotification('Save Failed', 'Could not save recording. Please try again.', 'error');
    throw error;
  }
}

/**
 * Show desktop notification
 * @param title - Notification title
 * @param body - Notification body
 * @param type - Notification type (success or error)
 */
function showNotification(title: string, body: string, type: 'success' | 'error' = 'success'): void {
  try {
    // Try using Tauri's notification system first
    if (typeof invoke !== 'undefined') {
      invoke('show_notification', { title, body, type }).catch(() => {
        // Fallback to browser notification
        showBrowserNotification(title, body);
      });
    } else {
      // Fallback to browser notification
      showBrowserNotification(title, body);
    }
  } catch (error) {
    console.error('Failed to show notification:', error);
  }
}

/**
 * Show browser notification as fallback
 */
function showBrowserNotification(title: string, body: string): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, { body });
      }
    });
  }
}

/**
 * Get supported video formats
 */
export function getSupportedFormats(): { extension: string; mimeType: string }[] {
  const formats = [
    { extension: 'webm', mimeType: 'video/webm' },
    { extension: 'mp4', mimeType: 'video/mp4' }
  ];
  
  return formats.filter(format => MediaRecorder.isTypeSupported(format.mimeType));
}

/**
 * Estimate file size from blob
 */
export function estimateFileSize(blob: Blob): string {
  const bytes = blob.size;
  const megabytes = bytes / (1024 * 1024);
  
  if (megabytes < 1) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else if (megabytes < 1024) {
    return `${megabytes.toFixed(2)} MB`;
  } else {
    return `${(megabytes / 1024).toFixed(2)} GB`;
  }
}
