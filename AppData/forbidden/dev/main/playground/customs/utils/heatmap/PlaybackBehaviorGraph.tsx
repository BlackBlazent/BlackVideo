/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// PlaybackBehaviorGraph.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { 
    loadHeatmap, 
    startTracking, 
    stopTracking, 
    HeatmapData, 
    SEGMENT_DURATION_S, 
    MAX_WEIGHT 
} from './heatmap.playback.behavior.graph'; // ⬅️ Import pure TS logic

// --- PROPS TYPE (Copied from original plan) ---
interface HeatmapGraphProps {
    videoId: string;
    videoDuration: number;
    showFullWidth?: boolean; // For when the graph is shown outside the submenu
}


// --- REACT COMPONENT (Rendering) ---

export const PlaybackBehaviorGraph: React.FC<HeatmapGraphProps> = ({ videoId, videoDuration, showFullWidth = false }) => {
    
    const [heatmap, setHeatmap] = useState<HeatmapData>(loadHeatmap(videoId));

    // Effect to manage tracking state and cleanup
    useEffect(() => {
        // Start tracking only if a valid video duration is available
        if (videoDuration > 0) {
            startTracking(videoId);
        }

        // Cleanup: Stop tracking and save data when component unmounts
        return () => {
            stopTracking(videoId);
        };
    }, [videoId, videoDuration]); // Re-run if video changes

    // Update the local component state when the global data changes (for visual update)
    const forceUpdate = useCallback(() => {
        setHeatmap(loadHeatmap(videoId));
    }, [videoId]);

    // Simple polling to refresh the graph every 5 seconds (to show progress visually)
    useEffect(() => {
        const interval = setInterval(forceUpdate, 5000); 
        return () => clearInterval(interval);
    }, [forceUpdate]);

    // --- RENDERING LOGIC ---

    const totalSegments = Math.ceil(videoDuration / SEGMENT_DURATION_S);
    if (totalSegments === 0 || videoDuration <= 0) {
        return null; 
    }
    
    // Create the segments array for drawing
    const segments = Array.from({ length: totalSegments }, (_, index) => {
        const weight = heatmap[index] || 0;
        return weight / MAX_WEIGHT; 
    });

    return (
        <div 
            className={`playback-heatmap ${showFullWidth ? 'full-width' : ''}`} 
            // Positioned right above the progress bar in VideoControls
            style={{ 
                position: 'absolute',
                bottom: showFullWidth ? '35px' : 'calc(100% - 2px)', 
                left: 0,
                width: '100%',
                height: showFullWidth ? '40px' : '1px', // Smaller height for submenu hover
                pointerEvents: 'none',
                zIndex: 10,
                top: 0,
                background: 'rgba(43, 47, 42, 0.28)' 
            }}
        >
            <svg 
                width="100%" 
                height="100%" 
                preserveAspectRatio="none" 
                viewBox={`0 0 ${totalSegments} ${showFullWidth ? 1 : 0.2}`}
                style={{ overflow: 'visible' }}
            >
                {/* Draw segments as small rectangles */}
                {segments.map((normalizedWeight, index) => {
                    if (normalizedWeight === 0) return null;
                    
                    const barHeight = showFullWidth ? normalizedWeight : normalizedWeight * 0.2;
                    
                    return (
                        <rect
                            key={index}
                            x={index}
                            y={showFullWidth ? 1 - barHeight : 0.2 - barHeight} 
                            width={1} 
                            height={barHeight}
                            fill="white"
                            opacity={normalizedWeight * 0.8} 
                            filter="url(#heatmap-blur)" 
                        />
                    );
                })}
                
                {/* Define Gaussian Blur Filter */}
                <defs>
                    <filter id="heatmap-blur">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="0.1" /> 
                    </filter>
                </defs>
            </svg>
        </div>
    );
};