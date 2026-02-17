/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

import { PlaybackSpeed } from './utils/playback-speed.js';
import { FrameCapture } from './utils/capture-frame.js';
import { SettingsPanel } from './settings.js';

class VideoPlayer {
    constructor(videoElement) {
        this.video = videoElement;
        this.playlist = [];
        this.currentIndex = 0;
        this.isLooping = false;
        this.controlsVisible = false;
        this.hideTimeout = null;
        this.isHovering = false;
        
        // Initialize feature managers
        this.playbackSpeed = null;
        this.frameCapture = null;
        this.settingsPanel = null;
        
        this.init();
    }

    init() {
        this.createControls();
        this.attachEventListeners();
        this.loadPlaylist();
        
        // Initialize feature managers after controls are created
        this.playbackSpeed = new PlaybackSpeed(this.video);
        this.frameCapture = new FrameCapture(this.video);
        
        const container = this.video.parentElement.parentElement;
        this.settingsPanel = new SettingsPanel(this.video, container, this.controls);
        
        // Listen for video source changes
        this.video.addEventListener('videoSourceChanged', (e) => {
            console.log('🔄 Video source changed, updating controls...');
            this.handleSourceChange(e.detail);
        });
        
        // Initially hide controls
        this.hideControls(true);
    }
    
    handleSourceChange(detail) {
        if (detail.src) {
            this.playlist = [detail.src];
            this.currentIndex = 0;
        }
        
        this.updatePlayPauseIcon();
        this.updateProgress();
        this.showControls();
        
        console.log('✓ Controls updated for new video');
    }

    createControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'custom-video-controls';
        controlsContainer.innerHTML = `
            <style>
                /* Playback Speed Button */
                .speed-btn {
                    position: relative;
                    font-size: 13px;
                    font-weight: 600;
                    min-width: 45px;
                }
                .speed-btn.active {
                    color: #00a8ff;
                }

                /* Capture Frame Button */
                .capture-btn {
                    position: relative;
                }
                .capture-btn:active {
                    transform: scale(0.95);
                }

                /* Settings Button */
                .settings-btn {
                    position: relative;
                }
                .settings-btn.active {
                    color: #00a8ff;
                }
                .settings-btn svg {
                    animation: rotate 2s linear infinite;
                    animation-play-state: paused;
                }
                .settings-btn.active svg {
                    animation-play-state: running;
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>

            <div class="controls-wrapper">
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-filled"></div>
                    </div>
                    <span class="time-display">
                        <span class="current-time">0:00</span> / <span class="duration">0:00</span>
                    </span>
                </div>
                <div class="controls-buttons">
                    <button class="control-btn previous-btn" title="Previous">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                        </svg>
                    </button>
                    <button class="control-btn play-pause-btn" title="Play/Pause">
                        <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="white" style="display:none;">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                    </button>
                    <button class="control-btn next-btn" title="Next">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M16 18h2V6h-2zm-11-7l8.5-6v12z"/>
                        </svg>
                    </button>
                    <button class="control-btn loop-btn" title="Loop">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
                        </svg>
                    </button>

                    <!-- NEW: Playback Speed -->
                    <button class="control-btn speed-btn" title="Playback Speed">1x</button>

                    <!-- NEW: Capture Frame -->
                    <button class="control-btn capture-btn" title="Capture Frame">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M12 15.2l-3.5 2.4 1.3-4-3.3-2.4h4.1L12 7l1.4 4.2h4.1l-3.3 2.4 1.3 4z"/>
                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2" fill="none"/>
                        </svg>
                    </button>

                    <div class="volume-container">
                        <button class="control-btn volume-btn" title="Mute/Unmute">
                            <svg class="volume-icon" width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                            </svg>
                            <svg class="mute-icon" width="24" height="24" viewBox="0 0 24 24" fill="white" style="display:none;">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                            </svg>
                        </button>
                        <input type="range" class="volume-slider" min="0" max="100" value="100">
                    </div>
                    <button class="control-btn pip-btn" title="Picture-in-Picture">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/>
                        </svg>
                    </button>
                    <button class="control-btn fullscreen-btn" title="Fullscreen">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                        </svg>
                    </button>

                    <!-- NEW: Settings Button -->
                    <button class="control-btn settings-btn" title="Settings">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        this.video.parentElement.appendChild(controlsContainer);
        this.controls = controlsContainer;
        
        // Get control elements
        this.playPauseBtn = controlsContainer.querySelector('.play-pause-btn');
        this.playIcon = controlsContainer.querySelector('.play-icon');
        this.pauseIcon = controlsContainer.querySelector('.pause-icon');
        this.previousBtn = controlsContainer.querySelector('.previous-btn');
        this.nextBtn = controlsContainer.querySelector('.next-btn');
        this.loopBtn = controlsContainer.querySelector('.loop-btn');
        this.speedBtn = controlsContainer.querySelector('.speed-btn');
        this.captureBtn = controlsContainer.querySelector('.capture-btn');
        this.volumeBtn = controlsContainer.querySelector('.volume-btn');
        this.volumeSlider = controlsContainer.querySelector('.volume-slider');
        this.volumeIcon = controlsContainer.querySelector('.volume-icon');
        this.muteIcon = controlsContainer.querySelector('.mute-icon');
        this.pipBtn = controlsContainer.querySelector('.pip-btn');
        this.fullscreenBtn = controlsContainer.querySelector('.fullscreen-btn');
        this.settingsBtn = controlsContainer.querySelector('.settings-btn');
        this.progressBar = controlsContainer.querySelector('.progress-bar');
        this.progressFilled = controlsContainer.querySelector('.progress-filled');
        this.currentTimeDisplay = controlsContainer.querySelector('.current-time');
        this.durationDisplay = controlsContainer.querySelector('.duration');
    }

    attachEventListeners() {
        // Existing controls
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.video.addEventListener('click', () => this.togglePlayPause());
        this.previousBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.loopBtn.addEventListener('click', () => this.toggleLoop());
        
        // NEW: Playback speed
        this.speedBtn.addEventListener('click', () => {
            const newSpeed = this.playbackSpeed.cycleSpeed();
            this.speedBtn.textContent = newSpeed + 'x';
            this.speedBtn.classList.add('active');
            setTimeout(() => this.speedBtn.classList.remove('active'), 300);
        });

        // NEW: Capture frame
        this.captureBtn.addEventListener('click', () => {
            this.frameCapture.downloadFrame();
        });

        // Volume controls
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        this.volumeSlider.addEventListener('input', (e) => this.changeVolume(e.target.value));
        
        // PiP & Fullscreen
        this.pipBtn.addEventListener('click', () => this.togglePiP());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

        // NEW: Settings
        this.settingsBtn.addEventListener('click', () => {
            const isOpen = this.settingsPanel.toggle();
            this.settingsBtn.classList.toggle('active', isOpen);
        });

        // Progress bar
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Video events
        this.video.addEventListener('play', () => this.updatePlayPauseIcon());
        this.video.addEventListener('pause', () => this.updatePlayPauseIcon());
        this.video.addEventListener('timeupdate', () => this.updateProgress());
        this.video.addEventListener('loadedmetadata', () => this.updateDuration());
        this.video.addEventListener('ended', () => this.handleVideoEnded());
        this.video.addEventListener('enterpictureinpicture', () => this.handlePiPEnter());
        this.video.addEventListener('leavepictureinpicture', () => this.handlePiPLeave());
        
        // Mouse hover controls
        const container = this.video.parentElement.parentElement;
        
        container.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.showControls();
        });
        
        container.addEventListener('mousemove', () => {
            if (this.isHovering) {
                this.showControls();
            }
        });
        
        container.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.hideControls();
        });
        
        this.controls.addEventListener('mouseenter', () => {
            this.isHovering = true;
            clearTimeout(this.hideTimeout);
        });
        
        this.controls.addEventListener('mouseleave', () => {
            if (!this.video.paused) {
                this.hideControls();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // ... [Keep all existing methods unchanged] ...

    loadPlaylist() {
        const source = this.video.querySelector('source');
        if (source) {
            this.playlist = [source.src];
            this.currentIndex = 0;
        }
    }

    togglePlayPause() {
        if (this.video.paused) {
            this.video.play();
        } else {
            this.video.pause();
        }
    }

    updatePlayPauseIcon() {
        if (this.video.paused) {
            this.playIcon.style.display = 'block';
            this.pauseIcon.style.display = 'none';
        } else {
            this.playIcon.style.display = 'none';
            this.pauseIcon.style.display = 'block';
        }
    }

    playNext() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadVideo(this.playlist[this.currentIndex]);
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.loadVideo(this.playlist[this.currentIndex]);
    }

    loadVideo(src) {
        this.video.pause();
        const source = this.video.querySelector('source');
        if (source) {
            source.src = src;
        } else {
            const newSource = document.createElement('source');
            newSource.src = src;
            this.video.appendChild(newSource);
        }
        this.video.load();
        this.video.addEventListener('canplay', () => {
            this.video.play().catch(e => console.warn('Autoplay prevented:', e));
        }, { once: true });
    }

    toggleLoop() {
        this.isLooping = !this.isLooping;
        this.video.loop = this.isLooping;
        this.loopBtn.classList.toggle('active', this.isLooping);
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        if (this.video.muted) {
            this.volumeIcon.style.display = 'none';
            this.muteIcon.style.display = 'block';
            this.volumeSlider.value = 0;
        } else {
            this.volumeIcon.style.display = 'block';
            this.muteIcon.style.display = 'none';
            this.volumeSlider.value = this.video.volume * 100;
        }
    }

    changeVolume(value) {
        this.video.volume = value / 100;
        this.video.muted = value == 0;
        if (value == 0) {
            this.volumeIcon.style.display = 'none';
            this.muteIcon.style.display = 'block';
        } else {
            this.volumeIcon.style.display = 'block';
            this.muteIcon.style.display = 'none';
        }
    }

    async togglePiP() {
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else {
                if (document.pictureInPictureEnabled) {
                    await this.video.requestPictureInPicture();
                }
            }
        } catch (error) {
            console.error('PiP error:', error);
        }
    }

    handlePiPEnter() {
        this.pipBtn.classList.add('active');
    }

    handlePiPLeave() {
        this.pipBtn.classList.remove('active');
    }

    toggleFullscreen() {
        const container = this.video.parentElement.parentElement;
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error(`Fullscreen error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        this.video.currentTime = pos * this.video.duration;
    }

    updateProgress() {
        if (!this.video.duration || isNaN(this.video.duration)) {
            this.progressFilled.style.width = '0%';
            this.currentTimeDisplay.textContent = '0:00';
            return;
        }
        const percent = (this.video.currentTime / this.video.duration) * 100;
        this.progressFilled.style.width = `${percent}%`;
        this.currentTimeDisplay.textContent = this.formatTime(this.video.currentTime);
    }

    updateDuration() {
        if (!this.video.duration || isNaN(this.video.duration)) {
            this.durationDisplay.textContent = '0:00';
            return;
        }
        this.durationDisplay.textContent = this.formatTime(this.video.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    handleVideoEnded() {
        if (!this.isLooping && this.playlist.length > 1) {
            this.playNext();
        }
    }

    showControls() {
        this.controls.classList.add('visible');
        this.controls.style.opacity = '1';
        this.controls.style.pointerEvents = 'all';
        this.controlsVisible = true;
        clearTimeout(this.hideTimeout);
        if (!this.video.paused && !this.isHovering) {
            this.hideTimeout = setTimeout(() => {
                this.hideControls();
            }, 3000);
        }
    }

    hideControls(immediate = false) {
        if (this.video.paused || this.isHovering) return;
        if (immediate) {
            this.controls.style.opacity = '0';
            this.controls.style.pointerEvents = 'none';
        } else {
            this.controls.classList.remove('visible');
            setTimeout(() => {
                if (!this.controlsVisible && !this.isHovering) {
                    this.controls.style.opacity = '0';
                    this.controls.style.pointerEvents = 'none';
                }
            }, 300);
        }
        this.controlsVisible = false;
    }

    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'ArrowLeft':
                this.video.currentTime -= 5;
                this.showControls();
                break;
            case 'ArrowRight':
                this.video.currentTime += 5;
                this.showControls();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.video.volume = Math.min(1, this.video.volume + 0.1);
                this.volumeSlider.value = this.video.volume * 100;
                this.showControls();
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.video.volume = Math.max(0, this.video.volume - 0.1);
                this.volumeSlider.value = this.video.volume * 100;
                this.showControls();
                break;
            case 'm':
                this.toggleMute();
                this.showControls();
                break;
            case 'f':
                this.toggleFullscreen();
                break;
            case 'i':
                this.togglePiP();
                break;
            case 'l':
                this.toggleLoop();
                this.showControls();
                break;
            case 'n':
                this.playNext();
                this.showControls();
                break;
            case 'p':
                this.playPrevious();
                this.showControls();
                break;
        }
    }
}

// Initialize player when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.NativeBiteVideoSeparateWindow');
    if (video) {
        const player = new VideoPlayer(video);
        window.videoPlayer = player;
        console.log('✓ Custom video player initialized');
    } else {
        console.warn('⚠️ Video element not found for custom player');
    }
});