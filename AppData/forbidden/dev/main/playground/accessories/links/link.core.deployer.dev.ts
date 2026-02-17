/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { PlatformModules } from './import.modules';
import { LinkProcessor } from './links.processors';
import { VideoTheaterStage } from '../../Video.Theater.Stage';

export enum DeployMode {
  EMBED = 'embed',
  VIDEO_STAGE = 'video_stage'
}

export interface DeployerData {
  type: 'url' | 'file';
  mode: DeployMode;
  url?: string;
  file?: File;
  fileContent?: string;
  urls?: string[];
  platform?: string;
}

export interface DeployerConfig {
  titleText: string;
  urlPlaceholder: string;
  fileTypes: string[];
  onDeploy: (data: DeployerData) => void;
  onCancel: () => void;
}

export class LinkDeployerCore {
  private selectedFile: File | null = null;
  private currentUrl: string = '';
  private config: DeployerConfig;
  private processor: LinkProcessor;

  constructor(config: DeployerConfig) {
    this.config = config;
    this.processor = new LinkProcessor();
  }

  // URL Validation
  public validateUrl(url: string): boolean {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Platform Detection
  public detectPlatform(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Check for YouTube
      if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        return 'YouTube';
      }
      // Check for Facebook
      if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
        return 'Facebook';
      }
      // Check for Instagram
      if (hostname.includes('instagram.com')) {
        return 'Instagram';
      }
      // Check for Vimeo
      if (hostname.includes('vimeo.com')) {
        return 'Vimeo';
      }
      // Check for TikTok
      if (hostname.includes('tiktok.com')) {
        return 'TikTok';
      }
      // Check for Twitch
      if (hostname.includes('twitch.tv')) {
        return 'Twitch';
      }
      // Check for Dailymotion
      if (hostname.includes('dailymotion.com')) {
        return 'Dailymotion';
      }

      return 'Generic';
    } catch (_) {
      return null;
    }
  }

  public setCurrentUrl(url: string): void {
    this.currentUrl = url;
  }

  public getCurrentUrl(): string {
    return this.currentUrl;
  }

  // File Validation
  public isValidFileType(file: File): boolean {
    const fileName = file.name.toLowerCase();
    return this.config.fileTypes.some(type => fileName.endsWith(type));
  }

  public setSelectedFile(file: File | null): void {
    this.selectedFile = file;
  }

  public getSelectedFile(): File | null {
    return this.selectedFile;
  }

  // File Reading
  public async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Deployment Logic
  public async handleDeploy(mode: DeployMode): Promise<void> {
    const platform = this.currentUrl ? this.detectPlatform(this.currentUrl) : null;

    if (this.currentUrl) {
      // Single URL deployment
      await this.deploySingleUrl(this.currentUrl, mode, platform);
    } else if (this.selectedFile) {
      // File deployment
      await this.deployFromFile(this.selectedFile, mode);
    }
  }

  private async deploySingleUrl(url: string, mode: DeployMode, platform: string | null): Promise<void> {
    const deployerData: DeployerData = {
      type: 'url',
      mode,
      url,
      platform: platform || 'Generic'
    };

    if (mode === DeployMode.VIDEO_STAGE) {
      await this.deployToVideoStage(url, platform);
    } else {
      await this.deployToEmbed(url, platform);
    }

    this.config.onDeploy(deployerData);
  }

  private async deployFromFile(file: File, mode: DeployMode): Promise<void> {
    try {
      const fileContent = await this.readFileContent(file);
      const urls = this.processor.extractUrls(fileContent, file.name);

      const deployerData: DeployerData = {
        type: 'file',
        mode,
        file,
        fileContent,
        urls
      };

      if (urls.length > 0) {
        if (mode === DeployMode.VIDEO_STAGE) {
          await this.deployMultipleToVideoStage(urls);
        } else {
          await this.deployMultipleToEmbed(urls);
        }
      }

      this.config.onDeploy(deployerData);
    } catch (error) {
      console.error('Error deploying from file:', error);
      throw error;
    }
  }

  private async deployToVideoStage(url: string, platform: string | null): Promise<void> {
    const videoStage = VideoTheaterStage.getInstance();
    const videoElement = videoStage.getVideoElement();
    const sourceElement = document.getElementById('VideoSource-Stream') as HTMLSourceElement;

    if (!videoElement || !sourceElement) {
      console.error('Video stage elements not found');
      return;
    }

    // Get the appropriate module for the platform
    const module = PlatformModules.getModule(platform || 'Generic');
    
    if (module) {
      try {
        const playableUrl = await module.process(url);
        
        // Update video source
        sourceElement.src = playableUrl;
        videoElement.load();
        
        // Wait for video to be ready and play
        videoElement.addEventListener('canplay', () => {
          videoElement.play().catch(err => {
            console.error('Error playing video:', err);
          });
        }, { once: true });

        console.log(`Deployed ${platform} video to stage:`, playableUrl);
      } catch (error) {
        console.error(`Error processing ${platform} URL:`, error);
      }
    }
  }

  private async deployToEmbed(url: string, platform: string | null): Promise<void> {
    const module = PlatformModules.getModule(platform || 'Generic');
    
    if (module) {
      try {
        const embedData = await module.getEmbedData(url);
        
        // Create embed popup window
        this.createEmbedWindow(embedData);
        
        console.log(`Deployed ${platform} video to embed:`, embedData);
      } catch (error) {
        console.error(`Error creating embed for ${platform}:`, error);
      }
    }
  }

  private async deployMultipleToVideoStage(urls: string[]): Promise<void> {
    console.log(`Deploying ${urls.length} videos to video stage with playlist`);
    
    // Deploy first video immediately
    if (urls.length > 0) {
      const platform = this.detectPlatform(urls[0]);
      await this.deployToVideoStage(urls[0], platform);
    }

    // Set up playlist for remaining videos
    if (urls.length > 1) {
      this.setupVideoPlaylist(urls);
    }
  }

  private async deployMultipleToEmbed(urls: string[]): Promise<void> {
    console.log(`Deploying ${urls.length} videos to embed with playlist`);
    
    // For embed mode, create a playlist embed or deploy first video
    if (urls.length > 0) {
      const platform = this.detectPlatform(urls[0]);
      await this.deployToEmbed(urls[0], platform);
      
      // Could implement playlist UI here
      if (urls.length > 1) {
        console.log('Playlist embed not yet implemented, playing first video only');
      }
    }
  }

  private setupVideoPlaylist(urls: string[]): void {
    const videoStage = VideoTheaterStage.getInstance();
    const videoElement = videoStage.getVideoElement();

    if (!videoElement) return;

    let currentIndex = 0;

    const playNext = async () => {
      currentIndex++;
      if (currentIndex < urls.length) {
        const nextUrl = urls[currentIndex];
        const platform = this.detectPlatform(nextUrl);
        await this.deployToVideoStage(nextUrl, platform);
      }
    };

    // Listen for video end to play next
    videoElement.addEventListener('ended', playNext);
  }

  private createEmbedWindow(embedData: { url: string; html?: string }): void {
    // Create a popup or modal with the embed
    const embedContainer = document.createElement('div');
    embedContainer.className = 'video-embed-popup';
    embedContainer.innerHTML = embedData.html || `
      <div class="embed-content">
        <iframe src="${embedData.url}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
    
    document.body.appendChild(embedContainer);
    
    // Add close functionality
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.className = 'embed-close-btn';
    closeBtn.onclick = () => embedContainer.remove();
    embedContainer.appendChild(closeBtn);
  }

  public handleCancel(): void {
    this.config.onCancel();
  }

  // State Management
  public canDeploy(): boolean {
    return !!(this.currentUrl || this.selectedFile);
  }

  public reset(): void {
    this.selectedFile = null;
    this.currentUrl = '';
  }

  public getConfig(): DeployerConfig {
    return this.config;
  }

  public updateConfig(config: Partial<DeployerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}