/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Play, MoreVertical, Star, HardDrive, Clock, Calendar } from 'lucide-react';

export interface LibraryVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    uploadedDate: string;
    views: number;
    size: string;
    isStarred: boolean;
    type: 'Video' | 'Short' | 'Archive';
    folderId: string;
}

// --- GRID VARIANT ---
export const LibraryCard: React.FC<{ video: LibraryVideo }> = ({ video }) => {
    return (
        <motion.div 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }} 
            className="LibraryCard-Grid"
        >
            <div className="Card-Thumbnail-Wrapper">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div className="Card-Hover-Overlay">
                    <button className="Btn-Base" style={{ backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '9999px' }}>
                        <Play size={18} fill="currentColor" /> Watch Video
                    </button>
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                        <button className="Toggle-Btn" style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }}>
                            <MoreVertical size={18} />
                        </button>
                        <button className="Toggle-Btn" style={{ backgroundColor: video.isStarred ? 'var(--accent-orange)' : 'rgba(0,0,0,0.7)', color: 'white' }}>
                            <Star size={18} fill={video.isStarred ? 'white' : 'none'} />
                        </button>
                    </div>
                    <span style={{ position: 'absolute', bottom: '0.75rem', right: '0.75rem', fontSize: '0.75rem', color: 'white', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px' }}>
                        {video.duration}
                    </span>
                </div>
            </div>
            <div style={{ padding: '0.75rem' }}>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{video.title}</h3>
                <p className="text-xs text-[var(--text-muted)]" style={{ marginTop: '0.25rem' }}>{video.uploadedDate}</p>
            </div>
        </motion.div>
    );
};

// --- LIST VARIANT ---
export const LibraryTile: React.FC<{ video: LibraryVideo }> = ({ video }) => {
    return (
        <motion.div 
            layout 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="LibraryTile-List"
            style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0.5rem 1rem', // Same padding as header
                background: 'var(--background-medium)',
                borderRadius: '8px'
            }}
        >
            {/* 1. THUMBNAIL (Width: 6rem + 1rem margin = 7rem total) */}
            <div style={{ flexShrink: 0, width: '6rem', height: '3.5rem', borderRadius: '0.4rem', overflow: 'hidden' }}>
                <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* 2. TITLE (Flex Grow) */}
            <div style={{ flexGrow: 1, marginLeft: '1rem' }}>
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{video.title}</p>
            </div>

            {/* 3. SIZE (Width: 7rem) */}
            <div style={{ width: '7rem', textAlign: 'center' }} className="hidden-mobile">
                <span className="text-sm text-[var(--text-secondary)] flex justify-center items-center gap-1">
                    <HardDrive size={14} color="var(--text-muted)" /> {video.size}
                </span>
            </div>

            {/* 4. DURATION (Width: 6rem) */}
            <div style={{ width: '6rem', textAlign: 'center' }} className="hidden-mobile">
                <span className="text-sm text-[var(--text-secondary)] flex justify-center items-center gap-1">
                    <Clock size={14} color="var(--text-muted)" /> {video.duration}
                </span>
            </div>

            {/* 5. DATE (Width: 8rem) */}
            <div style={{ width: '8rem', textAlign: 'center' }} className="hidden-mobile">
                <span className="text-sm text-[var(--text-secondary)] flex justify-center items-center gap-1">
                    <Calendar size={14} color="var(--text-muted)" /> {video.uploadedDate}
                </span>
            </div>

            {/* 6. ACTIONS (Width: 6rem) */}
            <div style={{ width: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button className="Toggle-Btn" style={{ background: 'var(--primary-blue)', color: 'white', width: '32px', height: '32px' }}>
                    <Play size={14} fill="white" />
                </button>
                <button className="Btn-Secondary" style={{ padding: '0.4rem' }}>
                    <MoreVertical size={14} />
                </button>
            </div>
        </motion.div>
    );
};