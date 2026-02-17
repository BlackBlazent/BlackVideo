/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// connector.ts - Connect all recorder modules and provide unified interface

import { VideoRecorder } from './video.recording';
import { saveRecording, autoSaveToDownloads } from './saved.captured';

/**
 * RecorderConnector - Unified interface for video recording functionality
 * Supports: Video Player Recording and Camera Recording (Front/Back)
 */
export class RecorderConnector {
    private static instance: RecorderConnector;
    private recorder: VideoRecorder | null = null;
    private mode: 'video' | 'camera' | null = null;

    private constructor() {
        console.log('RecorderConnector initialized');
    }

    public static getInstance(): RecorderConnector {
        if (!RecorderConnector.instance) {
            RecorderConnector.instance = new RecorderConnector();
        }
        return RecorderConnector.instance;
    }

    /**
     * Initialize recorder with specific mode
     */
    public async initialize(mode: 'video' | 'camera', cameraFacing?: 'user' | 'environment'): Promise<void> {
        this.mode = mode;
        this.recorder = new VideoRecorder();

        try {
            switch (mode) {
                case 'video':
                    await this.recorder.initializeVideoCapture();
                    break;
                
                case 'camera':
                    await this.recorder.initializeCameraCapture(cameraFacing || 'user');
                    break;
            }
            
            console.log(`Recorder initialized in ${mode} mode`);
        } catch (error) {
            console.error('Failed to initialize recorder:', error);
            throw error;
        }
    }

    /**
     * Start recording
     */
    public async startRecording(): Promise<void> {
        if (!this.recorder || !this.mode) {
            throw new Error('Recorder not initialized');
        }

        await this.recorder.startRecording(this.mode);
    }

    /**
     * Pause recording (video mode only)
     */
    public pauseRecording(): void {
        if (!this.recorder) {
            throw new Error('Recorder not initialized');
        }

        this.recorder.pauseRecording();
    }

    /**
     * Resume recording (video mode only)
     */
    public resumeRecording(): void {
        if (!this.recorder) {
            throw new Error('Recorder not initialized');
        }

        this.recorder.resumeRecording();
    }

    /**
     * Stop recording and save
     */
    public async stopAndSave(filename?: string, autoSave: boolean = true): Promise<void> {
        if (!this.recorder) {
            throw new Error('Recorder not initialized');
        }

        const blob = await this.recorder.stopRecording();
        
        if (blob) {
            const baseFilename = filename || `recording-${this.mode}-${Date.now()}`;
            
            if (autoSave) {
                await autoSaveToDownloads(blob, baseFilename);
            } else {
                await saveRecording(blob, baseFilename);
            }
        }
    }

    /**
     * Switch camera (for camera mode only)
     */
    public async switchCamera(facing: 'user' | 'environment'): Promise<void> {
        if (!this.recorder) {
            throw new Error('Recorder not initialized');
        }

        if (this.mode !== 'camera') {
            throw new Error('Camera switching only available in camera mode');
        }

        await this.recorder.switchCamera(facing);
    }

    /**
     * Get recording state
     */
    public getState(): { isRecording: boolean; isPaused: boolean } | null {
        if (!this.recorder) {
            return null;
        }

        return this.recorder.getRecordingState();
    }

    /**
     * Get camera stream (camera mode only)
     */
    public getCameraStream(): MediaStream | null {
        if (!this.recorder) {
            return null;
        }

        return this.recorder.getCameraStream();
    }

    /**
     * Cleanup and reset
     */
    public cleanup(): void {
        if (this.recorder) {
            this.recorder.cleanup();
            this.recorder = null;
        }
        this.mode = null;
    }

    /**
     * Get supported video formats
     */
    public static getSupportedFormats(): string[] {
        return VideoRecorder.getSupportedMimeTypes();
    }
}

// Export singleton instance getter
export const getRecorderConnector = () => RecorderConnector.getInstance();

// Make available globally for debugging
if (typeof window !== 'undefined') {
    (window as any).RecorderConnector = RecorderConnector;
    (window as any).getRecorderConnector = getRecorderConnector;
}
