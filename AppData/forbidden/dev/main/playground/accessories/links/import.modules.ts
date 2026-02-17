/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { YouTubeModule, PlatformModule } from './modules/youtube.url.module';
import { HybridConfig } from './hybrid.config';

/**
 * Central registry for all platform modules
 * Easily extensible to add new platforms
 */
export class PlatformModules {
  private static modules: Map<string, PlatformModule> = new Map();
  private static initialized = false;

  /**
   * Initialize all platform modules
   */
  public static initialize(): void {
    if (this.initialized) return;

    // Register YouTube module
    this.registerModule('YouTube', new YouTubeModule());

    // Future platforms can be registered here
    // this.registerModule('Facebook', new FacebookModule());
    // this.registerModule('Instagram', new InstagramModule());
    // this.registerModule('Vimeo', new VimeoModule());

    this.initialized = true;
  }

  /**
   * Register a platform module
   */
  public static registerModule(platform: string, module: PlatformModule): void {
    this.modules.set(platform.toLowerCase(), module);
    HybridConfig.registerPlatform(platform, module);
    console.log(`Platform module registered: ${platform}`);
  }

  /**
   * Get a platform module by name
   */
  public static getModule(platform: string): PlatformModule | null {
    this.initialize();
    return this.modules.get(platform.toLowerCase()) || null;
  }

  /**
   * Check if a platform is supported
   */
  public static isSupported(platform: string): boolean {
    this.initialize();
    return this.modules.has(platform.toLowerCase());
  }

  /**
   * Get all registered platforms
   */
  public static getSupportedPlatforms(): string[] {
    this.initialize();
    return Array.from(this.modules.keys());
  }

  /**
   * Detect platform from URL and return appropriate module
   */
  public static getModuleByUrl(url: string): PlatformModule | null {
    this.initialize();

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.toLowerCase();

      // Check each module to see if it handles this URL
      for (const [platform, module] of this.modules) {
        if (hostname.includes(platform)) {
          return module;
        }
      }

      // Check YouTube specifically for youtu.be
      if (hostname.includes('youtu.be') || hostname.includes('youtube.com')) {
        return this.modules.get('youtube') || null;
      }

      return null;
    } catch (error) {
      console.error('Error detecting platform from URL:', error);
      return null;
    }
  }

  /**
   * Process URL with appropriate module
   */
  public static async processUrl(url: string): Promise<string> {
    const module = this.getModuleByUrl(url);
    
    if (!module) {
      throw new Error('No module found for this URL');
    }

    return await module.process(url);
  }

  /**
   * Get embed data for URL
   */
  public static async getEmbedData(url: string): Promise<any> {
    const module = this.getModuleByUrl(url);
    
    if (!module) {
      throw new Error('No module found for this URL');
    }

    return await module.getEmbedData(url);
  }
}

// Auto-initialize on import
PlatformModules.initialize();

// Export individual modules for direct access
export { YouTubeModule };