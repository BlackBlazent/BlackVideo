/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// heatmap.playback.behavior.graph.ts

import { VideoTheaterStage } from '../../../Video.Theater.Stage';

// --- CONFIGURATION & TYPES ---

export const STORAGE_KEY_PREFIX = 'zephyra_heatmap_';
export const SEGMENT_DURATION_S = 5; 
export const MAX_WEIGHT = 10;       

export interface HeatmapData {
    [segmentIndex: number]: number; 
}

// --- DATA UTILITY FUNCTIONS ---

/**
 * Loads the heatmap data for a specific video ID from local storage.
 * ... (loadHeatmap function remains the same)
 */
export const loadHeatmap = (videoId: string): HeatmapData => {
    try {
        const json = localStorage.getItem(STORAGE_KEY_PREFIX + videoId);
        return json ? JSON.parse(json) : {};
    } catch (e) {
        console.error("Could not load heatmap from localStorage:", e);
        return {};
    }
};

/**
 * Saves the heatmap data for a specific video ID to local storage.
 * ... (saveHeatmap function remains the same)
 */
export const saveHeatmap = (videoId: string, data: HeatmapData): void => {
    try {
        localStorage.setItem(STORAGE_KEY_PREFIX + videoId, JSON.stringify(data));
    } catch (e) {
        console.error("Could not save heatmap to localStorage:", e);
    }
};

/**
 * UTILITY: Gets the current playback time. 
 * We rely on the VideoTheaterStage for the source of truth.
 */
export const getCurrentTime = (): number => {
    const videoElement = VideoTheaterStage.getInstance().getVideoElement();
    return videoElement ? videoElement.currentTime : 0;
}

/**
 * UTILITY: Updates the visual style of the custom seek bar.
 * This is the function you asked for, which can be called by your external progress logic.
 * @param progressPercentage Current playback percentage (0 to 100).
 */
export function updateSeekBarVisuals(progressPercentage: number): void {
    const seekBar = document.getElementById('videoTimelineSeekBarProgress') as HTMLInputElement; {/* Remove this if Seekbar won't work and change code at .backup file */}
    if (seekBar) {
        // This style logic mimics your input element's background gradient
        seekBar.style.background = `linear-gradient(to right, rgba(85, 255, 0, 1) ${progressPercentage}%, rgb(255, 0, 0) ${progressPercentage}%, rgb(51, 51, 51) ${progressPercentage}%, rgb(51, 51, 51) 100%)`;
        seekBar.value = progressPercentage.toString();
    }
}


// --- CORE TRACKING LOGIC ---
// (No changes needed here, as it correctly uses videoElement.currentTime)

let lastTimeUpdate = 0;
let currentVideoId: string | null = null;
let currentHeatmapData: HeatmapData = {};
let trackingInterval: number | null = null; 

/**
 * Increments the watch weight for the current segment.
 */
const updateSegmentWeight = (time: number, weight: number): void => {
    if (!currentVideoId) return;
    const segmentIndex = Math.floor(time / SEGMENT_DURATION_S);
    const currentWeight = currentHeatmapData[segmentIndex] || 0;
    currentHeatmapData[segmentIndex] = Math.min(MAX_WEIGHT, currentWeight + weight);
};

/**
 * Main tracking function called repeatedly during playback.
 */
const trackPlayback = (): void => {
    const videoElement = VideoTheaterStage.getInstance().getVideoElement();
    if (!videoElement || videoElement.paused || videoElement.ended) return;

    const currentTime = videoElement.currentTime;
    
    if (currentTime - lastTimeUpdate >= 1) {
        if (currentTime > lastTimeUpdate) {
            updateSegmentWeight(currentTime, 1); 
        } 
        lastTimeUpdate = currentTime;
    }
    
    // ⚠️ Optional: You can call the visual update here if your primary progress logic is slow/missing
    // const duration = videoElement.duration;
    // if (duration > 0) {
    //     const percentage = (currentTime / duration) * 100;
    //     updateSeekBarVisuals(percentage);
    // }
};

/**
 * Attaches event listeners to the video element to start tracking.
 */
export const startTracking = (videoId: string): void => {
    currentVideoId = videoId;
    currentHeatmapData = loadHeatmap(videoId);
    
    const videoElement = VideoTheaterStage.getInstance().getVideoElement();
    if (videoElement) {
        lastTimeUpdate = videoElement.currentTime;
        
        if (trackingInterval) clearInterval(trackingInterval);
        trackingInterval = window.setInterval(trackPlayback, 1000) as unknown as number; 

        const handleSeek = () => {
            if (videoElement.currentTime < lastTimeUpdate) {
                updateSegmentWeight(videoElement.currentTime, 3);
            }
            lastTimeUpdate = videoElement.currentTime;
        };

        videoElement.addEventListener('seeked', handleSeek);
        
        const cleanup = () => {
             videoElement.removeEventListener('seeked', handleSeek);
        };
        (window as any).__zephyra_heatmap_cleanup = cleanup; 
    }
};

/**
 * Stops tracking and saves the final data.
 */
export const stopTracking = (videoId: string): void => {
    if (trackingInterval) {
        clearInterval(trackingInterval);
        trackingInterval = null;
    }
    if (currentVideoId === videoId) {
        saveHeatmap(videoId, currentHeatmapData);
        currentVideoId = null;
    }
    if ((window as any).__zephyra_heatmap_cleanup) {
        (window as any).__zephyra_heatmap_cleanup();
        delete (window as any).__zephyra_heatmap_cleanup;
    }
};