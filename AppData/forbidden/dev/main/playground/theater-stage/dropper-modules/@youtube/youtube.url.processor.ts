/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

const YOUTUBE_PROXY_BASE_URL = 'http://localhost:9292';

export interface YouTubeStreamData {
  videoId: string;
  playlistId?: string;
  isPlaylist: boolean;
  isShorts: boolean;
}

export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  duration: string;
  thumbnail: string;
  author: string;
  views: string;
  isLive: boolean;
  description: string;
}

export const YouTubeUrlProcessor = {
  /**
   * Parse YouTube URL and extract video/playlist information
   * Supports: youtube.com/watch, youtu.be, youtube.com/shorts, youtube.com/embed
   */
  process(url: string): YouTubeStreamData | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');
      
      let videoId: string | null = null;
      let playlistId: string | null = null;
      let isShorts = false;

      // Handle different YouTube URL formats
      if (hostname === 'youtube.com' || hostname === 'youtube.com') {
        // Standard watch URL: youtube.com/watch?v=VIDEO_ID
        if (urlObj.pathname === '/watch') {
          videoId = urlObj.searchParams.get('v');
        }
        
        // Shorts URL: youtube.com/shorts/VIDEO_ID
        else if (urlObj.pathname.startsWith('/shorts/')) {
          const parts = urlObj.pathname.split('/');
          videoId = parts[2];
          isShorts = true;
        }
        
        // Embed URL: youtube.com/embed/VIDEO_ID
        else if (urlObj.pathname.startsWith('/embed/')) {
          const parts = urlObj.pathname.split('/');
          videoId = parts[2];
        }
        
        // Check for playlist
        playlistId = urlObj.searchParams.get('list');
      } 
      
      // Short URL format: youtu.be/VIDEO_ID
      else if (hostname === 'youtu.be') {
        const parts = urlObj.pathname.split('/');
        videoId = parts[1];
      }

      if (!videoId && !playlistId) {
        console.warn('[YouTubeUrlProcessor] Could not extract video or playlist ID from URL:', url);
        return null;
      }

      return {
        videoId: videoId || '',
        playlistId: playlistId || undefined,
        isPlaylist: !!playlistId,
        isShorts
      };

    } catch (error) {
      console.error('[YouTubeUrlProcessor] Invalid URL:', error);
      return null;
    }
  },

  /**
   * Get streamable URL from local proxy server
   * This URL can be used directly in <video> src
   */
  async getStreamUrl(videoId: string): Promise<string> {
    try {
      // Validate video ID first
      const validationResponse = await fetch(`${YOUTUBE_PROXY_BASE_URL}/validate/${videoId}`);
      const validation = await validationResponse.json();
      
      if (!validation.valid) {
        throw new Error('Invalid YouTube video ID');
      }

      // Return the streaming endpoint URL
      // The video tag will fetch from this endpoint
      return `${YOUTUBE_PROXY_BASE_URL}/stream/${videoId}`;

    } catch (error) {
      console.error('[YouTubeUrlProcessor] Stream URL error:', error);
      throw error;
    }
  },

  /**
   * Get video metadata/info
   */
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo | null> {
    try {
      const response = await fetch(`${YOUTUBE_PROXY_BASE_URL}/info/${videoId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch video info: ${response.statusText}`);
      }

      const info = await response.json();
      return info;

    } catch (error) {
      console.error('[YouTubeUrlProcessor] Info fetch error:', error);
      return null;
    }
  },

  /**
   * Check if proxy server is running
   */
  async checkProxyHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${YOUTUBE_PROXY_BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      const data = await response.json();
      return data.status === 'ok';

    } catch (error) {
      console.error('[YouTubeUrlProcessor] Proxy server is not running:', error);
      return false;
    }
  },

  /**
   * Placeholder for future playlist support
   * TODO: Implement playlist parsing with youtube-pl or similar
   */
  async fetchPlaylistIds(_playlistId: string): Promise<string[]> {
    console.warn('[YouTubeUrlProcessor] Playlist support not yet implemented');
    // Future implementation could use youtube-pl package
    return [];
  },

  /**
   * Extract video ID from various URL formats
   */
  extractVideoId(url: string): string | null {
    const data = this.process(url);
    return data?.videoId || null;
  }
};
