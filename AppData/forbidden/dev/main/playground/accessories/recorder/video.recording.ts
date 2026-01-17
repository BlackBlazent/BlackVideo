/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// video.recording.ts - Core video recording functionality
export class VideoRecorder {
    private videoTheaterStage: any;
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private cameraStream: MediaStream | null = null;
    private videoStream: MediaStream | null = null;
    private combinedStream: MediaStream | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private animationFrameId: number | null = null;
    private isRecording: boolean = false;
    private isPaused: boolean = false;
    private videoElement: HTMLVideoElement | null = null;
    private cameraCanvas: HTMLCanvasElement | null = null;
    private cameraCtx: CanvasRenderingContext2D | null = null;
    private originalVideoSrc: string | null = null; // Store original video source
    private cameraVideoElement: HTMLVideoElement | null = null; // For camera preview in main stage

    constructor() {
        this.initializeVideoTheaterStage();
    }

    private async initializeVideoTheaterStage() {
        try {
            if ((window as any).VideoTheaterStage) {
                this.videoTheaterStage = (window as any).VideoTheaterStage.getInstance();
            } else {
                const { VideoTheaterStage } = await import('../../Video.Theater.Stage');
                this.videoTheaterStage = VideoTheaterStage.getInstance();
            }
        } catch (error) {
            console.warn('VideoTheaterStage not available, will attempt direct video element access');
        }
    }

    // Initialize video capture from the main video player
    public async initializeVideoCapture(): Promise<void> {
        try {
            let videoElement: HTMLVideoElement | null = null;

            if (this.videoTheaterStage) {
                videoElement = this.videoTheaterStage.getVideoElement();
            }

            if (!videoElement) {
                videoElement = document.getElementById('VideoPlayer-TheaterStage') as HTMLVideoElement;
            }

            if (!videoElement) {
                throw new Error('Video element not found');
            }

            this.videoElement = videoElement;

            // Create canvas for video capture
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            
            if (!this.ctx) {
                throw new Error('Failed to get canvas context');
            }

            // Set canvas dimensions to match video - FIXED: Use proper dimensions
            this.canvas.width = videoElement.videoWidth || videoElement.clientWidth || 1920;
            this.canvas.height = videoElement.videoHeight || videoElement.clientHeight || 1080;

            // FIXED: Create stream with proper frame rate
            this.videoStream = this.canvas.captureStream(30);

            console.log('Video capture initialized successfully');
        } catch (error) {
            console.error('Failed to initialize video capture:', error);
            throw error;
        }
    }

    // Initialize camera capture
    public async initializeCameraCapture(facing: 'user' | 'environment' = 'user'): Promise<void> {
        try {
            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facing,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            };

            this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // FIXED: Show camera in main video stage instead of preview window
            await this.setupCameraInMainStage();

            console.log('Camera capture initialized successfully');
        } catch (error) {
            console.error('Failed to initialize camera capture:', error);
            throw error;
        }
    }

    // FIXED: Setup camera feed in main video stage
    private async setupCameraInMainStage(): Promise<void> {
        if (!this.cameraStream || !this.videoElement) return;

        // Store original video source
        this.originalVideoSrc = this.videoElement.src || this.videoElement.currentSrc;

        // Create video element for camera stream
        this.cameraVideoElement = document.createElement('video');
        this.cameraVideoElement.srcObject = this.cameraStream;
        this.cameraVideoElement.autoplay = true;
        this.cameraVideoElement.muted = true;
        this.cameraVideoElement.playsInline = true;

        // Replace main video source with camera stream
        this.videoElement.srcObject = this.cameraStream;
        this.videoElement.autoplay = true;
        this.videoElement.muted = true;
        this.videoElement.playsInline = true;

        // Wait for camera video to load
        await new Promise((resolve) => {
            this.cameraVideoElement!.addEventListener('loadedmetadata', resolve, { once: true });
        });
    }

    // FIXED: Restore original video source
    private restoreOriginalVideoSource(): void {
        if (!this.videoElement) return;

        // Clear camera stream from main video element
        this.videoElement.srcObject = null;
        
        // Restore original video source
        if (this.originalVideoSrc) {
            this.videoElement.src = this.originalVideoSrc;
        }

        // Clean up camera video element
        if (this.cameraVideoElement) {
            this.cameraVideoElement.srcObject = null;
            this.cameraVideoElement = null;
        }
    }

    // FIXED: Switch camera between front and back
    public async switchCamera(facing: 'user' | 'environment'): Promise<void> {
        try {
            if (this.cameraStream) {
                this.cameraStream.getTracks().forEach(track => track.stop());
            }

            const constraints: MediaStreamConstraints = {
                video: {
                    facingMode: facing,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: true
            };

            this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Update main video stage with new camera stream
            if (this.videoElement) {
                this.videoElement.srcObject = this.cameraStream;
            }

            console.log(`Switched to ${facing} camera`);
        } catch (error) {
            console.error('Failed to switch camera:', error);
            throw error;
        }
    }

    // FIXED: Start recording with proper video capture
    public async startRecording(mode: 'video' | 'camera' | 'both'): Promise<void> {
        try {
            this.recordedChunks = [];
            let streamToRecord: MediaStream;

            switch (mode) {
                case 'video':
                    if (!this.videoStream) {
                        throw new Error('Video stream not initialized');
                    }
                    streamToRecord = this.videoStream;
                    this.startVideoCapture();
                    break;

                case 'camera':
                    if (!this.cameraStream) {
                        throw new Error('Camera stream not initialized');
                    }
                    streamToRecord = this.cameraStream;
                    break;

                case 'both':
                    if (!this.videoStream || !this.cameraStream) {
                        throw new Error('Both streams not initialized');
                    }
                    streamToRecord = await this.createCombinedStream();
                    this.startCombinedCapture();
                    break;

                default:
                    throw new Error('Invalid recording mode');
            }

            // FIXED: Better codec selection and options
            const options: MediaRecorderOptions = {
                mimeType: this.getBestMimeType(),
                videoBitsPerSecond: 2500000, // 2.5 Mbps
                audioBitsPerSecond: 128000   // 128 kbps
            };

            this.mediaRecorder = new MediaRecorder(streamToRecord, options);

            // FIXED: Better event handling
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                console.log('Recording stopped, chunks:', this.recordedChunks.length);
            };

            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
            };

            // FIXED: Start recording with smaller time slice for better data
            this.mediaRecorder.start(100);
            this.isRecording = true;
            this.isPaused = false;

            console.log(`Recording started in ${mode} mode`);
        } catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    }

    // FIXED: Get best available MIME type
    private getBestMimeType(): string {
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/webm',
            'video/mp4;codecs=h264,aac',
            'video/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }
        return 'video/webm';
    }

    // Pause recording
    public pauseRecording(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.pause();
            this.isPaused = true;
            
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            console.log('Recording paused');
        }
    }

    // Resume recording
    public resumeRecording(): void {
        if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
            this.mediaRecorder.resume();
            this.isPaused = false;
            
            if (this.videoElement && this.ctx) {
                this.startVideoCapture();
            }
            if (this.combinedStream) {
                this.startCombinedCapture();
            }
            
            console.log('Recording resumed');
        }
    }

    // FIXED: Stop recording with proper cleanup
    public async stopRecording(): Promise<Blob | null> {
        return new Promise((resolve) => {
            if (!this.mediaRecorder) {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                // FIXED: Create blob with proper type
                const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
                const blob = new Blob(this.recordedChunks, { type: mimeType });
                
                this.isRecording = false;
                this.isPaused = false;
                
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = null;
                }
                
                // Restore original video source if it was replaced
                this.restoreOriginalVideoSource();
                
                console.log('Recording stopped, blob size:', blob.size);
                resolve(blob);
            };

            if (this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            } else {
                resolve(null);
            }
        });
    }

    // FIXED: Create combined stream for PiP recording
    private async createCombinedStream(): Promise<MediaStream> {
        if (!this.videoStream || !this.cameraStream) {
            throw new Error('Cannot create combined stream: missing video or camera stream');
        }

        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = 1920;
        combinedCanvas.height = 1080;
        
        const combinedCtx = combinedCanvas.getContext('2d');
        if (!combinedCtx) {
            throw new Error('Failed to get combined canvas context');
        }

        this.combinedStream = combinedCanvas.captureStream(30);
        
        // Add audio from camera stream
        const audioTracks = this.cameraStream.getAudioTracks();
        audioTracks.forEach(track => {
            this.combinedStream!.addTrack(track);
        });

        return this.combinedStream;
    }

    // FIXED: Start video capture with proper frame handling
    private startVideoCapture(): void {
        if (!this.videoElement || !this.ctx || !this.canvas) return;

        const captureFrame = () => {
            if (!this.isRecording || this.isPaused) return;

            // Update canvas dimensions if needed
            if (this.videoElement!.videoWidth && this.videoElement!.videoHeight) {
                if (this.canvas!.width !== this.videoElement!.videoWidth || 
                    this.canvas!.height !== this.videoElement!.videoHeight) {
                    this.canvas!.width = this.videoElement!.videoWidth;
                    this.canvas!.height = this.videoElement!.videoHeight;
                }
            }

            try {
                // FIXED: Clear canvas before drawing
                this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
                
                // Draw video frame
                this.ctx!.drawImage(
                    this.videoElement!,
                    0, 0,
                    this.canvas!.width,
                    this.canvas!.height
                );
            } catch (error) {
                console.warn('Error drawing video frame:', error);
            }

            this.animationFrameId = requestAnimationFrame(captureFrame);
        };

        captureFrame();
    }

    // FIXED: Start combined capture with proper PiP positioning
    private startCombinedCapture(): void {
        if (!this.videoElement || !this.cameraStream || !this.combinedStream) return;

        const cameraVideo = document.createElement('video');
        cameraVideo.srcObject = this.cameraStream;
        cameraVideo.autoplay = true;
        cameraVideo.muted = true;
        cameraVideo.playsInline = true;

        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = 1920;
        combinedCanvas.height = 1080;
        const combinedCtx = combinedCanvas.getContext('2d');

        if (!combinedCtx) return;

        const captureFrame = () => {
            if (!this.isRecording || this.isPaused) return;

            try {
                // Clear canvas
                combinedCtx.fillStyle = '#000000';
                combinedCtx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

                // Draw main video
                if (this.videoElement!.videoWidth && this.videoElement!.videoHeight) {
                    combinedCtx.drawImage(
                        this.videoElement!,
                        0, 0,
                        combinedCanvas.width,
                        combinedCanvas.height
                    );
                }

                // Draw camera PiP
                if (cameraVideo.videoWidth && cameraVideo.videoHeight) {
                    const pipWidth = 320;
                    const pipHeight = 240;
                    const pipX = combinedCanvas.width - pipWidth - 20;
                    const pipY = combinedCanvas.height - pipHeight - 20;

                    // Draw PiP border
                    combinedCtx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    combinedCtx.fillRect(pipX - 2, pipY - 2, pipWidth + 4, pipHeight + 4);

                    // Draw camera feed
                    combinedCtx.drawImage(
                        cameraVideo,
                        pipX, pipY,
                        pipWidth, pipHeight
                    );
                }
            } catch (error) {
                console.warn('Error drawing combined frame:', error);
            }

            this.animationFrameId = requestAnimationFrame(captureFrame);
        };

        captureFrame();
    }

    // Get camera stream for preview
    public getCameraStream(): MediaStream | null {
        return this.cameraStream;
    }

    // Get recording state
    public getRecordingState(): { isRecording: boolean; isPaused: boolean } {
        return {
            isRecording: this.isRecording,
            isPaused: this.isPaused
        };
    }

    // FIXED: Enhanced cleanup with proper resource management
    public cleanup(): void {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }

        if (this.combinedStream) {
            this.combinedStream.getTracks().forEach(track => track.stop());
            this.combinedStream = null;
        }

        // Restore original video source
        this.restoreOriginalVideoSource();

        this.videoStream = null;
        this.isRecording = false;
        this.isPaused = false;
        this.recordedChunks = [];

        console.log('VideoRecorder cleanup completed');
    }

    // FIXED: Download with proper filename and type
    public static downloadRecording(blob: Blob, filename?: string): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Determine file extension from blob type
        const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
        a.download = filename || `recording-${Date.now()}.${extension}`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Get supported MIME types
    public static getSupportedMimeTypes(): string[] {
        const types = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/webm',
            'video/mp4;codecs=h264,aac',
            'video/mp4'
        ];

        return types.filter(type => MediaRecorder.isTypeSupported(type));
    }
}