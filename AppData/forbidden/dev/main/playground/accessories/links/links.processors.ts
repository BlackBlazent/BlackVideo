/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { FileLinkReader } from './utils/filesLinkReader';

export class LinkProcessor {
  private fileReader: FileLinkReader;

  constructor() {
    this.fileReader = new FileLinkReader();
  }

  /**
   * Extract URLs from file content based on file type
   */
  public extractUrls(content: string, fileName: string): string[] {
    const extension = this.getFileExtension(fileName);
    
    switch (extension) {
      case '.json':
        return this.fileReader.readJsonUrls(content);
      case '.md':
        return this.fileReader.readMarkdownUrls(content);
      case '.txt':
        return this.fileReader.readTextUrls(content);
      default:
        return this.extractUrlsFromText(content);
    }
  }

  /**
   * Extract URLs from plain text using regex
   */
  public extractUrlsFromText(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    
    if (!matches) return [];

    // Validate and clean URLs
    return matches
      .map(url => this.cleanUrl(url))
      .filter(url => this.isValidVideoUrl(url));
  }

  /**
   * Clean URL by removing trailing punctuation and whitespace
   */
  private cleanUrl(url: string): string {
    return url.replace(/[.,;:!?)]+$/, '').trim();
  }

  /**
   * Check if URL is likely a video URL
   */
  private isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // List of video platforms
      const videoPlatforms = [
        'youtube.com',
        'youtu.be',
        'facebook.com',
        'fb.watch',
        'instagram.com',
        'vimeo.com',
        'tiktok.com',
        'twitch.tv',
        'dailymotion.com',
        'streamable.com',
        'video'
      ];

      return videoPlatforms.some(platform => hostname.includes(platform)) ||
             urlObj.pathname.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i) !== null;
    } catch (_) {
      return false;
    }
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(fileName: string): string {
    const match = fileName.match(/\.[^.]+$/);
    return match ? match[0].toLowerCase() : '';
  }

  /**
   * Validate a single URL
   */
  public validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * Detect platform from URL
   */
  public detectPlatform(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return 'YouTube';
      }
      if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
        return 'Facebook';
      }
      if (hostname.includes('instagram.com')) {
        return 'Instagram';
      }
      if (hostname.includes('vimeo.com')) {
        return 'Vimeo';
      }
      if (hostname.includes('tiktok.com')) {
        return 'TikTok';
      }
      if (hostname.includes('twitch.tv')) {
        return 'Twitch';
      }
      if (hostname.includes('dailymotion.com')) {
        return 'Dailymotion';
      }

      return 'Generic';
    } catch (_) {
      return null;
    }
  }

  /**
   * Process batch of URLs
   */
  public async processBatch(urls: string[]): Promise<ProcessedUrl[]> {
    return urls.map(url => ({
      original: url,
      cleaned: this.cleanUrl(url),
      valid: this.validateUrl(url),
      platform: this.detectPlatform(url)
    }));
  }
}

export interface ProcessedUrl {
  original: string;
  cleaned: string;
  valid: boolean;
  platform: string | null;
}