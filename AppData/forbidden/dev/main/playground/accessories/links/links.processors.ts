/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// usage-example.ts
import LinkPlayerDeployer from './link.player.deployer';

// Import the CSS file in your main CSS or HTML file:
// <link rel="stylesheet" href="./link-player-deployer.css">

class VideoTheaterManager {
  private deployer: LinkPlayerDeployer = new LinkPlayerDeployer({
    titleText: 'Video Link Deployer',
    urlPlaceholder: 'https://youtube.com/watch?v=... or any video URL',
    fileTypes: ['.txt', '.json', '.md'],
    onDeploy: (data) => this.handleVideoDeployment(data),
    onCancel: () => this.handleCancel()
  });

  private videoElement: HTMLVideoElement | null = null;

  constructor() {
    this.deployer.init();
    this.setupTriggerButton();
  }

  private setupTriggerButton(): void {
    // Your existing button that triggers the modal
    const triggerButton = document.getElementById('accessories-link-player-btn');
    
    if (triggerButton) {
      triggerButton.addEventListener('click', () => {
        this.deployer.show();
      });
    }
  }

  private async handleVideoDeployment(data: { type: 'url' | 'file'; url?: string; fileContent?: string }): Promise<void> {
    console.log('Deploying video:', data);

    try {
      if (data.type === 'url' && data.url) {
        await this.playVideoFromUrl(data.url);
      } else if (data.type === 'file' && data.fileContent) {
        await this.playVideoFromFileContent(data.fileContent);
      }
    } catch (error) {
      console.error('Error deploying video:', error);
      this.showError('Failed to deploy video. Please try again.');
    }
  }

  private async playVideoFromUrl(url: string): Promise<void> {
    // Extract video ID or process URL for different platforms
    const videoInfo = this.extractVideoInfo(url);
    
    if (videoInfo.platform === 'youtube') {
      await this.playYouTubeVideo(videoInfo.id);
    } else if (videoInfo.platform === 'direct') {
      await this.playDirectVideo(url);
    } else {
      throw new Error('Unsupported video platform');
    }
  }

  private async playVideoFromFileContent(fileContent: string): Promise<void> {
    // Parse file content to extract video URLs
    const urls = this.parseVideoUrls(fileContent);
    
    if (urls.length === 0) {
      throw new Error('No valid video URLs found in file');
    }

    // For now, play the first URL (you can extend this for playlists)
    await this.playVideoFromUrl(urls[0]);
  }

  private extractVideoInfo(url: string): { platform: string; id: string } {
    // YouTube URL patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        return { platform: 'youtube', id: match[1] };
      }
    }

    // Check if it's a direct video URL
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const hasVideoExtension = videoExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );

    if (hasVideoExtension) {
      return { platform: 'direct', id: url };
    }

    return { platform: 'unknown', id: '' };
  }

  private async playYouTubeVideo(videoId: string): Promise<void> {
    // You can use YouTube API or embed the video
    // This is a simplified example using iframe
    
    const videoTheater = this.getVideoTheater();
    const iframe = document.createElement('iframe');
    
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;

    // Clear existing content and add iframe
    videoTheater.innerHTML = '';
    videoTheater.appendChild(iframe);
    
    this.showVideoTheater();
  }


  private async playDirectVideo(url: string): Promise<void> {
    const videoTheater = this.getVideoTheater();
    
    // Create video element if it doesn't exist
    if (!this.videoElement) {
      this.videoElement = document.createElement('video');
      this.videoElement.controls = true;
      this.videoElement.style.width = '100%';
      this.videoElement.style.height = '100%';
    }

    this.videoElement.src = url;
    
    // Clear existing content and add video
    videoTheater.innerHTML = '';
    videoTheater.appendChild(this.videoElement);
    
    // Attempt to play the video
    try {
      await this.videoElement.play();
      this.showVideoTheater();
    } catch (error) {
      throw new Error('Failed to play video. The URL might be invalid or the video format is not supported.');
    }
  }

  private parseVideoUrls(content: string): string[] {
    const urls: string[] = [];
    
    try {
      // Try to parse as JSON first
      const jsonData = JSON.parse(content);
      if (Array.isArray(jsonData)) {
        urls.push(...jsonData.filter(item => typeof item === 'string' && this.isValidUrl(item)));
      } else if (jsonData.urls && Array.isArray(jsonData.urls)) {
        urls.push(...jsonData.urls.filter((url: string) => this.isValidUrl(url)));
      }
    } catch {
      // If not JSON, treat as plain text with URLs separated by lines
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && this.isValidUrl(trimmed)) {
          urls.push(trimmed);
        }
      }
    }

    return urls;
  }

  private isValidUrl(string: string): boolean {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  private getVideoTheater(): HTMLElement {
    // Assume you have a video theater element in your DOM
    let theater = document.getElementById('video-theater');
    
    if (!theater) {
      // Create video theater if it doesn't exist
      theater = document.createElement('div');
      theater.id = 'video-theater';
      theater.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80vw;
        height: 60vh;
        background: #000;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        display: none;
      `;
      
      document.body.appendChild(theater);
      
      // Add close button
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        z-index: 1002;
      `;
      
      closeBtn.addEventListener('click', () => this.hideVideoTheater());
      theater.appendChild(closeBtn);
    }
    
    return theater;
  }

  private showVideoTheater(): void {
    const theater = this.getVideoTheater();
    theater.style.display = 'block';
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.id = 'video-theater-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
    `;
    
    overlay.addEventListener('click', () => this.hideVideoTheater());
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  private hideVideoTheater(): void {
    const theater = document.getElementById('video-theater');
    const overlay = document.getElementById('video-theater-overlay');
    
    if (theater) theater.style.display = 'none';
    if (overlay) overlay.remove();
    
    // Stop video if playing
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.currentTime = 0;
    }
    
    document.body.style.overflow = 'auto';
  }

  private handleCancel(): void {
    console.log('Video deployment cancelled');
  }

  private showError(message: string): void {
    // Simple error notification - you can replace with your notification system
    alert(message);
  }

  // Public method to programmatically show the deployer
  public showDeployer(): void {
    this.deployer.show();
  }

  // Public method to destroy the deployer
  public destroy(): void {
    this.deployer.destroy();
  }
}

// Initialize the video theater manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const videoManager = new VideoTheaterManager();
  
  // Make it globally accessible if needed
  (window as any).videoManager = videoManager;
});

// Alternative: Simple initialization without class
/*
document.addEventListener('DOMContentLoaded', () => {
  const deployer = new LinkPlayerDeployer({
    onDeploy: (data) => {
      console.log('Deploy data:', data);
      // Your video deployment logic here
    },
    onCancel: () => {
      console.log('Cancelled');
    }
  });

  deployer.init();

  // Attach to your existing button
  const triggerBtn = document.getElementById('accessories-link-player-btn');
  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => deployer.show());
  }
});
*/

export default VideoTheaterManager;