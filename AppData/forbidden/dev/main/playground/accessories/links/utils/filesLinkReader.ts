/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export class FileLinkReader {
  /**
   * Read URLs from JSON file content
   * Expected formats:
   * - { "urls": ["url1", "url2"] }
   * - { "videos": ["url1", "url2"] }
   * - ["url1", "url2"]
   */
  public readJsonUrls(content: string): string[] {
    try {
      const data = JSON.parse(content);
      
      // Handle array of URLs
      if (Array.isArray(data)) {
        return data.filter(item => typeof item === 'string' && this.isValidUrl(item));
      }
      
      // Handle object with urls/videos property
      if (typeof data === 'object') {
        const urlsArray = data.urls || data.videos || data.links || [];
        if (Array.isArray(urlsArray)) {
          return urlsArray.filter(item => typeof item === 'string' && this.isValidUrl(item));
        }
        
        // Handle object with nested structure
        const allUrls: string[] = [];
        this.extractUrlsFromObject(data, allUrls);
        return allUrls;
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return [];
    }
  }

  /**
   * Recursively extract URLs from nested objects
   */
  private extractUrlsFromObject(obj: any, urls: string[]): void {
    for (const key in obj) {
      const value = obj[key];
      
      if (typeof value === 'string' && this.isValidUrl(value)) {
        urls.push(value);
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'string' && this.isValidUrl(item)) {
            urls.push(item);
          } else if (typeof item === 'object') {
            this.extractUrlsFromObject(item, urls);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        this.extractUrlsFromObject(value, urls);
      }
    }
  }

  /**
   * Read URLs from Markdown file content
   * Extracts URLs from:
   * - [text](url) format
   * - Plain URLs
   * - Code blocks with URLs
   */
  public readMarkdownUrls(content: string): string[] {
    const urls: string[] = [];
    
    // Extract URLs from markdown links [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    
    while ((match = markdownLinkRegex.exec(content)) !== null) {
      const url = match[2];
      if (this.isValidUrl(url)) {
        urls.push(url);
      }
    }
    
    // Extract plain URLs
    const plainUrlRegex = /(https?:\/\/[^\s\)]+)/g;
    while ((match = plainUrlRegex.exec(content)) !== null) {
      const url = match[1].replace(/[.,;:!?)]+$/, '');
      if (this.isValidUrl(url) && !urls.includes(url)) {
        urls.push(url);
      }
    }
    
    return urls;
  }

  /**
   * Read URLs from plain text file
   * Extracts any URL found in the text
   */
  public readTextUrls(content: string): string[] {
    const urls: string[] = [];
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) {
        continue;
      }
      
      // Check if line is a direct URL
      if (this.isValidUrl(trimmedLine)) {
        urls.push(trimmedLine);
        continue;
      }
      
      // Extract URLs from line
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      let match;
      
      while ((match = urlRegex.exec(trimmedLine)) !== null) {
        const url = match[1].replace(/[.,;:!?)]+$/, '');
        if (this.isValidUrl(url)) {
          urls.push(url);
        }
      }
    }
    
    return urls;
  }

  /**
   * Validate if string is a valid URL
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (_) {
      return false;
    }
  }

  /**
   * Read URLs from any supported file type
   */
  public readUrls(content: string, fileType: 'json' | 'md' | 'txt'): string[] {
    switch (fileType) {
      case 'json':
        return this.readJsonUrls(content);
      case 'md':
        return this.readMarkdownUrls(content);
      case 'txt':
        return this.readTextUrls(content);
      default:
        return [];
    }
  }
}