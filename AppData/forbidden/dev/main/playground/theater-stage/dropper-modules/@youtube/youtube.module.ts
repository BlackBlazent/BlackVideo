/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { YouTubeUrlProcessor } from './youtube.url.processor';

export class YouTubeModule {
  private queue: string[] = [];
  private currentPlayingIndex: number = 0;

  constructor(private videoElement: HTMLVideoElement) {
    this.setupAutoPlayNext();
  }

  private setupAutoPlayNext() {
    this.videoElement.onended = async () => {
      if (this.currentPlayingIndex < this.queue.length - 1) {
        this.currentPlayingIndex++;
        await this.playVideo(this.queue[this.currentPlayingIndex]);
      }
    };
  }

  async play(url: string) {
    const data = YouTubeUrlProcessor.process(url);
    if (!data) return;

    if (data.isPlaylist && data.playlistId) {
       this.queue = await YouTubeUrlProcessor.fetchPlaylistIds(data.playlistId);
       this.currentPlayingIndex = 0;
       if (this.queue.length > 0) await this.playVideo(this.queue[0]);
    } else {
       this.queue = [data.videoId];
       this.currentPlayingIndex = 0;
       await this.playVideo(data.videoId);
    }
  }

  private async playVideo(id: string) {
    const streamUrl = await YouTubeUrlProcessor.getStreamUrl(id);
    const source = document.getElementById('VideoSource-Stream') as HTMLSourceElement;
    if (source && streamUrl) {
      source.src = streamUrl;
      this.videoElement.load();
      this.videoElement.play().catch(e => console.warn("Autoplay interaction required", e));
    }
  }
}