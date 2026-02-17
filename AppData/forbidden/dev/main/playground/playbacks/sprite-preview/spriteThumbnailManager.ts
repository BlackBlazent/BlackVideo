// spriteThumbnailManager.ts - Manages sprite thumbnail configuration and state

export interface SpriteConfig {
  url: string;
  width: number;
  height: number;
  columns: number;
  rows: number;
  interval: number; // seconds per thumbnail
}

export interface ThumbnailState {
  visible: boolean;
  currentTime: number;
  mouseX?: number;
  mouseY?: number;
}

export class SpriteThumbnailManager {
  private spriteConfig: SpriteConfig = {
    url: '',
    width: 160,
    height: 90,
    columns: 10,
    rows: 0,
    interval: 1 // seconds per thumbnail
  };

  private thumbnailState: ThumbnailState = {
    visible: false,
    currentTime: 0,
    mouseX: undefined,
    mouseY: undefined
  };

  private stateChangeCallback?: (state: ThumbnailState, config: SpriteConfig) => void;

  constructor() {
    console.log('Sprite thumbnail manager initialized');
  }

  /**
   * Initialize sprite configuration based on video source
   */
  public initializeSpriteConfig(videoElement: HTMLVideoElement): void {
    const videoSource = videoElement.querySelector('source') as HTMLSourceElement;
    
    if (videoSource && videoSource.src) {
      // Replace video extension with .jpg for sprite
      this.spriteConfig.url = videoSource.src.replace(/\.(mp4|webm|ogg)$/i, '-sprite.jpg');
      console.log('Sprite URL configured:', this.spriteConfig.url);
      this.notifyStateChange();
    }
  }

  /**
   * Update sprite configuration rows based on video duration
   */
  public updateSpriteRows(duration: number): void {
    this.spriteConfig.rows = Math.ceil(
      duration / this.spriteConfig.interval / this.spriteConfig.columns
    );
    console.log('Sprite rows calculated:', this.spriteConfig.rows);
    this.notifyStateChange();
  }

  /**
   * Show thumbnail at specific time and position
   */
  public showThumbnailAtTime(time: number, mouseX?: number, mouseY?: number): void {
    this.thumbnailState = {
      visible: true,
      currentTime: time,
      mouseX,
      mouseY
    };
    this.notifyStateChange();
  }

  /**
   * Hide the thumbnail preview
   */
  public hideThumbnail(): void {
    this.thumbnailState = {
      ...this.thumbnailState,
      visible: false
    };
    this.notifyStateChange();
  }

  /**
   * Set custom sprite configuration
   */
  public setSpriteConfig(config: Partial<SpriteConfig>): void {
    this.spriteConfig = { ...this.spriteConfig, ...config };
    console.log('Sprite config updated:', this.spriteConfig);
    this.notifyStateChange();
  }

  /**
   * Update sprite URL directly
   */
  public updateSpriteUrl(url: string): void {
    this.spriteConfig.url = url;
    console.log('Sprite URL updated:', url);
    this.notifyStateChange();
  }

  /**
   * Get current sprite configuration
   */
  public getSpriteConfig(): SpriteConfig {
    return { ...this.spriteConfig };
  }

  /**
   * Get current thumbnail state
   */
  public getThumbnailState(): ThumbnailState {
    return { ...this.thumbnailState };
  }

  /**
   * Register callback for state changes
   */
  public onStateChange(callback: (state: ThumbnailState, config: SpriteConfig) => void): void {
    this.stateChangeCallback = callback;
  }

  /**
   * Notify listeners of state changes
   */
  private notifyStateChange(): void {
    if (this.stateChangeCallback) {
      this.stateChangeCallback(this.getThumbnailState(), this.getSpriteConfig());
    }
  }

  /**
   * Calculate thumbnail index for given time
   */
  public calculateThumbnailIndex(time: number): { row: number; col: number; index: number } {
    const thumbnailIndex = Math.floor(time / this.spriteConfig.interval);
    const row = Math.floor(thumbnailIndex / this.spriteConfig.columns);
    const col = thumbnailIndex % this.spriteConfig.columns;

    return { row, col, index: thumbnailIndex };
  }

  /**
   * Calculate sprite offset for thumbnail
   */
  public calculateSpriteOffset(time: number): { offsetX: number; offsetY: number } {
    const { row, col } = this.calculateThumbnailIndex(time);
    
    return {
      offsetX: col * this.spriteConfig.width,
      offsetY: row * this.spriteConfig.height
    };
  }

  /**
   * Reset sprite configuration to defaults
   */
  public reset(): void {
    this.spriteConfig = {
      url: '',
      width: 160,
      height: 90,
      columns: 10,
      rows: 0,
      interval: 1
    };
    
    this.thumbnailState = {
      visible: false,
      currentTime: 0,
      mouseX: undefined,
      mouseY: undefined
    };
    
    console.log('Sprite thumbnail manager reset');
    this.notifyStateChange();
  }
}

export default SpriteThumbnailManager;