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
import { Folder } from 'lucide-react';

interface LibraryFolder {
    id: string;
    name: string;
    videoCount: number;
    avatars: string[];
}

interface FolderCardProps {
    folder: LibraryFolder;
}

const LibraryFolderComp: React.FC<FolderCardProps> = ({ folder }) => {
    const extraPeopleCount = folder.videoCount > 3 ? folder.videoCount - 3 : 0;

    return (
        <motion.div className="LibraryFolder-Card">
            <div className="flex-between">
                <Folder 
                    size={24} 
                    className="text-[var(--accent-orange)] fill-[var(--accent-orange)]/30" 
                />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {folder.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                    {folder.videoCount} Video{folder.videoCount !== 1 ? 's' : ''}
                </p>
                
                <div className="Avatar-Stack">
                    {folder.avatars.slice(0, 3).map((src, index) => (
                        <img 
                            key={index} 
                            className="Avatar-Img" 
                            src={src} 
                            alt="Avatar" 
                        />
                    ))}
                    {extraPeopleCount > 0 && (
                        <span className="Avatar-Plus">+{extraPeopleCount}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default LibraryFolderComp;