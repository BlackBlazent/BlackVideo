/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

import { invoke } from "@tauri-apps/api/core";
import { VideoTheaterStage } from "../../../Video.Theater.Stage";

/**
 * Security: Validates video source before passing to backend
 * @param src - Video source URL
 * @returns boolean indicating if source is safe
 */
const isValidVideoSource = (src: string): boolean => {
    if (!src || src.trim() === '') return false;
    
    // Allow http(s), asset protocol, and file paths
    const validProtocols = /^(https?:\/\/|asset:\/\/|file:\/\/|\/|[a-zA-Z]:\\)/;
    
    // Prevent path traversal
    if (src.includes('../') || src.includes('..\\')) {
        console.error('Security: Path traversal detected');
        return false;
    }
    
    return validProtocols.test(src);
};

/**
 * Opens video in separate native window player
 * Production-ready with error handling and security validation
 */
export const handleSeparateWindowPlayback = async (): Promise<void> => {
    try {
        const theaterStage = VideoTheaterStage.getInstance();
        const videoElement = theaterStage.getVideoElement();

        // Validation: Check if video exists
        if (!videoElement) {
            console.error("❌ No active video found in Theater Stage");
            throw new Error("No video element available");
        }

        // Get current video source
        const currentSrc = videoElement.currentSrc || videoElement.src;
        
        // Security: Validate source
        if (!isValidVideoSource(currentSrc)) {
            console.error("❌ Invalid or potentially unsafe video source");
            throw new Error("Invalid video source");
        }

        // Get current playback time for seamless continuation
        const currentTime = videoElement.currentTime || 0;

        console.log("📹 Spawning separate window for:", currentSrc);
        console.log("⏱️ Current timestamp:", currentTime);

        // Pause main player to prevent dual audio
        videoElement.pause();

        // Invoke Rust command with error handling
        await invoke("open_separate_video_window", {
            videoPath: currentSrc,
            currentTime: currentTime
        });

        console.log("✓ Successfully spawned native video player window");

    } catch (error) {
        console.error("❌ Failed to open separate window:", error);
        
        // User-friendly error notification (integrate with your UI notification system)
        alert(`Failed to open video player: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Re-throw for upstream handling if needed
        throw error;
    }
};