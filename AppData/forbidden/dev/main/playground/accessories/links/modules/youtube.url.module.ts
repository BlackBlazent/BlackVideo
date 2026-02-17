/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export interface PlatformModule {
  name: string;
  process(url: string): Promise<string>;
  getEmbedData(url: string): Promise<EmbedData>;
  extractVideoId(url: string): string | null;
}

export interface EmbedData {
  url: string;
  html?: string;
  width?: number;
  height?: number;
}

export class YouTubeModule implements PlatformModule {
  public readonly name = 'YouTube';

  /**
   * Extract YouTube video ID from various URL formats
   * Supports:
   * - https://www.youtube.com/watch?v=VIDEO_ID
   * - https://youtu.be/VIDEO_ID
   * - https://www.youtube.com/embed/VIDEO_ID
   * - https://www.youtube.com/v/VIDEO_ID
   */
  public extractVideoId(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Handle youtu.be short URLs
      if (hostname.includes('youtu.be')) {
        const pathParts = urlObj.pathname.split('/');
        return pathParts[1] || null;
      }

      // Handle youtube.com URLs
      if (hostname.includes('youtube.com')) {
        // Check for /watch?v= format
        const vParam = urlObj.searchParams.get('v');
        if (vParam) {
          return vParam;
        }

        // Check for /embed/ format
        const embedMatch = urlObj.pathname.match(/\/embed\/([^/?]+)/);
        if (embedMatch) {
          return embedMatch[1];
        }

        // Check for /v/ format
        const vMatch = urlObj.pathname.match(/\/v\/([^/?]+)/);
        if (vMatch) {
          return vMatch[1];
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting YouTube video ID:', error);
      return null;
    }
  }

  /**
   * Process YouTube URL and return playable URL
   * For direct video stage playback, we'll use the embed URL
   * which can be loaded in an iframe or used with YouTube IFrame API
   */
  public async process(url: string): Promise<string> {
    const videoId = this.extractVideoId(url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL: Could not extract video ID');
    }

    // Return the direct video URL for the video element
    // Note: YouTube doesn't allow direct MP4 playback in <video> tags
    // We need to use iframe or YouTube IFrame Player API
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  }

  /**
   * Get embed data for YouTube video
   */
  public async getEmbedData(url: string): Promise<EmbedData> {
    const videoId = this.extractVideoId(url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL: Could not extract video ID');
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    
    return {
      url: embedUrl,
      html: this.generateEmbedHtml(videoId),
      width: 560,
      height: 315
    };
  }

  /**
   * Generate embed HTML for YouTube video
   */
  private generateEmbedHtml(videoId: string): string {
    return `
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
    `;
  }

  /**
   * Get video thumbnail URL
   */
  public getThumbnailUrl(url: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string | null {
    const videoId = this.extractVideoId(url);
    
    if (!videoId) {
      return null;
    }

    const qualityMap = {
      'default': 'default',
      'medium': 'mqdefault',
      'high': 'hqdefault',
      'maxres': 'maxresdefault'
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  }

  /**
   * Validate if URL is a YouTube URL
   */
  public isYouTubeUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();
      return hostname.includes('youtube.com') || hostname.includes('youtu.be');
    } catch (_) {
      return false;
    }
  }

  /**
   * Get video info using YouTube oEmbed API
   * This is a legitimate way to get video metadata per YouTube's TOS
   */
  public async getVideoInfo(url: string): Promise<YouTubeVideoInfo | null> {
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video info');
      }

      const data = await response.json();
      
      return {
        title: data.title,
        author: data.author_name,
        authorUrl: data.author_url,
        thumbnailUrl: data.thumbnail_url,
        thumbnailWidth: data.thumbnail_width,
        thumbnailHeight: data.thumbnail_height,
        html: data.html
      };
    } catch (error) {
      console.error('Error fetching YouTube video info:', error);
      return null;
    }
  }
}

export interface YouTubeVideoInfo {
  title: string;
  author: string;
  authorUrl: string;
  thumbnailUrl: string;
  thumbnailWidth: number;
  thumbnailHeight: number;
  html: string;
}