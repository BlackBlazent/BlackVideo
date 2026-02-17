/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { PlatformModule } from './modules/youtube.url.module';

export interface PlatformConfig {
  name: string;
  module: PlatformModule;
  patterns: RegExp[];
  enabled: boolean;
  priority: number;
}

export interface EventListener {
  event: string;
  platform: string;
  handler: (data: any) => void;
}

/**
 * Hybrid configuration system for managing platform modules
 * Provides a flexible way to add, configure, and manage video platform integrations
 */
export class HybridConfig {
  private static platforms: Map<string, PlatformConfig> = new Map();
  private static listeners: Map<string, EventListener[]> = new Map();
  private static defaultPriority = 100;

  /**
   * Register a new platform module
   */
  public static registerPlatform(
    name: string, 
    module: PlatformModule, 
    patterns?: RegExp[],
    priority: number = this.defaultPriority
  ): void {
    const platformConfig: PlatformConfig = {
      name,
      module,
      patterns: patterns || this.generateDefaultPatterns(name),
      enabled: true,
      priority
    };

    this.platforms.set(name.toLowerCase(), platformConfig);
    console.log(`Hybrid Config: Registered platform ${name} with priority ${priority}`);
  }

  /**
   * Generate default URL patterns for a platform
   */
  private static generateDefaultPatterns(platform: string): RegExp[] {
    const platformLower = platform.toLowerCase();
    
    switch (platformLower) {
      case 'youtube':
        return [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
          /youtube\.com\/embed\/([^&\s]+)/,
          /youtube\.com\/v\/([^&\s]+)/
        ];
      case 'facebook':
        return [
          /facebook\.com\/.*\/videos\/(\d+)/,
          /fb\.watch\/([^&\s]+)/
        ];
      case 'instagram':
        return [
          /instagram\.com\/p\/([^&\s\/]+)/,
          /instagram\.com\/reel\/([^&\s\/]+)/
        ];
      case 'vimeo':
        return [
          /vimeo\.com\/(\d+)/
        ];
      case 'tiktok':
        return [
          /tiktok\.com\/.*\/video\/(\d+)/
        ];
      case 'twitch':
        return [
          /twitch\.tv\/videos\/(\d+)/,
          /twitch\.tv\/([^\/]+)$/
        ];
      default:
        return [new RegExp(`${platformLower}\\.com`, 'i')];
    }
  }

  /**
   * Detect platform from URL
   */
  public static detectPlatform(url: string): PlatformConfig | null {
    const sortedPlatforms = Array.from(this.platforms.values())
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const platform of sortedPlatforms) {
      if (this.matchesPatterns(url, platform.patterns)) {
        return platform;
      }
    }

    return null;
  }

  /**
   * Check if URL matches any of the patterns
   */
  private static matchesPatterns(url: string, patterns: RegExp[]): boolean {
    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Get platform configuration
   */
  public static getPlatform(name: string): PlatformConfig | null {
    return this.platforms.get(name.toLowerCase()) || null;
  }

  /**
   * Enable/disable a platform
   */
  public static setPlatformEnabled(name: string, enabled: boolean): void {
    const platform = this.platforms.get(name.toLowerCase());
    if (platform) {
      platform.enabled = enabled;
      console.log(`Hybrid Config: Platform ${name} ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Set platform priority
   */
  public static setPlatformPriority(name: string, priority: number): void {
    const platform = this.platforms.get(name.toLowerCase());
    if (platform) {
      platform.priority = priority;
      console.log(`Hybrid Config: Platform ${name} priority set to ${priority}`);
    }
  }

  /**
   * Add custom URL pattern to platform
   */
  public static addPlatformPattern(name: string, pattern: RegExp): void {
    const platform = this.platforms.get(name.toLowerCase());
    if (platform) {
      platform.patterns.push(pattern);
      console.log(`Hybrid Config: Added pattern to ${name}`);
    }
  }

  /**
   * Register event listener for platform events
   */
  public static addEventListener(
    event: string, 
    platform: string, 
    handler: (data: any) => void
  ): void {
    const key = `${event}:${platform}`;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }

    this.listeners.get(key)?.push({ event, platform, handler });
  }

  /**
   * Emit event for platform
   */
  public static emitEvent(event: string, platform: string, data: any): void {
    const key = `${event}:${platform}`;
    const listeners = this.listeners.get(key);

    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener.handler(data);
        } catch (error) {
          console.error(`Error in event listener for ${key}:`, error);
        }
      });
    }
  }

  /**
   * Remove event listener
   */
  public static removeEventListener(
    event: string, 
    platform: string, 
    handler: (data: any) => void
  ): void {
    const key = `${event}:${platform}`;
    const listeners = this.listeners.get(key);

    if (listeners) {
      const index = listeners.findIndex(l => l.handler === handler);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Get all registered platforms
   */
  public static getAllPlatforms(): PlatformConfig[] {
    return Array.from(this.platforms.values());
  }

  /**
   * Get enabled platforms
   */
  public static getEnabledPlatforms(): PlatformConfig[] {
    return Array.from(this.platforms.values()).filter(p => p.enabled);
  }

  /**
   * Clear all platforms
   */
  public static clearPlatforms(): void {
    this.platforms.clear();
    console.log('Hybrid Config: All platforms cleared');
  }

  /**
   * Reset to default configuration
   */
  public static reset(): void {
    this.platforms.clear();
    this.listeners.clear();
    console.log('Hybrid Config: Reset to defaults');
  }

  /**
   * Get configuration summary
   */
  public static getSummary(): string {
    const platforms = Array.from(this.platforms.values());
    const enabled = platforms.filter(p => p.enabled).length;
    
    return `Hybrid Config: ${platforms.length} platforms registered (${enabled} enabled)`;
  }
}

/**
 * Example usage for adding new platforms:
 * 
 * // Add Facebook support
 * HybridConfig.registerPlatform('Facebook', new FacebookModule(), [
 *   /facebook\.com\/.*\/videos\/(\d+)/,
 *   /fb\.watch\/([^&\s]+)/
 * ], 90);
 * 
 * // Listen for Facebook video events
 * HybridConfig.addEventListener('video-loaded', 'Facebook', (data) => {
 *   console.log('Facebook video loaded:', data);
 * });
 * 
 * // Disable a platform temporarily
 * HybridConfig.setPlatformEnabled('Facebook', false);
 */