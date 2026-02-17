/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Tauri v2: import from '@tauri-apps/api/core', NOT '@tauri-apps/api/tauri'
import { invoke } from '@tauri-apps/api/core';

/**
 * Video progress data structure
 */
export interface VideoProgress {
  video_path: string;
  current_time: number;
  duration: number;
  last_updated: number;
  progress_percentage: number;
}

/**
 * Resume playback invoker - communicates with Rust backend
 */
export class ResumePlaybackInvoker {
  /**
   * Save video playback progress to persistent storage
   * @param videoPath - Absolute path to the video file
   * @param currentTime - Current playback time in seconds
   * @param duration - Total video duration in seconds
   */
  static async saveVideoProgress(
    videoPath: string,
    currentTime: number,
    duration: number
  ): Promise<string> {
    try {
      const result = await invoke<string>('save_video_progress', {
        videoPath,
        currentTime,
        duration,
      });
      console.log('✅ Video progress saved:', { videoPath, currentTime, duration });
      return result;
    } catch (error) {
      console.error('❌ Failed to save video progress:', error);
      throw error;
    }
  }

  /**
   * Get saved video progress from persistent storage
   * @param videoPath - Absolute path to the video file
   * @returns VideoProgress object or null if not found
   */
  static async getVideoProgress(videoPath: string): Promise<VideoProgress | null> {
    try {
      const result = await invoke<VideoProgress | null>('get_video_progress', {
        videoPath,
      });
      
      if (result) {
        console.log('✅ Video progress retrieved:', result);
      } else {
        console.log('ℹ️ No saved progress found for:', videoPath);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Failed to get video progress:', error);
      throw error;
    }
  }

  /**
   * Get all saved video progress entries
   * @returns Array of VideoProgress objects sorted by last updated
   */
  static async getAllVideoProgress(): Promise<VideoProgress[]> {
    try {
      const result = await invoke<VideoProgress[]>('get_all_video_progress');
      console.log(`✅ Retrieved ${result.length} video progress entries`);
      return result;
    } catch (error) {
      console.error('❌ Failed to get all video progress:', error);
      throw error;
    }
  }

  /**
   * Clear saved progress for a specific video
   * @param videoPath - Absolute path to the video file
   */
  static async clearVideoProgress(videoPath: string): Promise<string> {
    try {
      const result = await invoke<string>('clear_video_progress', {
        videoPath,
      });
      console.log('✅ Video progress cleared:', videoPath);
      return result;
    } catch (error) {
      console.error('❌ Failed to clear video progress:', error);
      throw error;
    }
  }

  /**
   * Clear all saved video progress data
   */
  static async clearAllVideoProgress(): Promise<string> {
    try {
      const result = await invoke<string>('clear_all_video_progress');
      console.log('✅ All video progress cleared');
      return result;
    } catch (error) {
      console.error('❌ Failed to clear all video progress:', error);
      throw error;
    }
  }

  /**
   * Check if resume playback feature is enabled
   */
  static async isResumeEnabled(): Promise<boolean> {
    try {
      const result = await invoke<boolean>('is_resume_enabled');
      return result;
    } catch (error) {
      console.error('❌ Failed to check resume enabled status:', error);
      return false;
    }
  }
}