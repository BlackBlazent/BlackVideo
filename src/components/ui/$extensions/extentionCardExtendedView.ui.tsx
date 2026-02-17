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
import { Zap, Star, Download } from 'lucide-react';
import { ExtensionPlugin } from '../../../blackvideo-dts/extentionPage';

interface ExtendedViewProps {
    item: ExtensionPlugin;
    onClose: () => void;
}

export const ExtentionCardExtendedView: React.FC<ExtendedViewProps> = ({ item, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
        >
            <div className="modal-header">
                <div className="modal-identity">
                    <div className={`modal-icon ${item.type.toLowerCase()}`}><Zap size={32} /></div>
                    <div>
                        <h2>{item.title}</h2>
                        <p>By <strong>{item.developerName}</strong> | {item.type}</p>
                        <div className="modal-rating">
                            <Star size={16} className="star-icon" />
                            <span>{item.rating.toFixed(1)} Stars</span>
                            <span className="likes-count">({item.likes.toLocaleString()} likes)</span>
                        </div>
                    </div>
                </div>
                <button className="btn-close" onClick={onClose}>&times;</button>
            </div>

            <div className="modal-body">
                <div className="modal-main">
                    <section>
                        <h3>Overview</h3>
                        <p>{item.description}. Specialized tools for advanced playback.</p>
                    </section>
                    <section>
                        <h3>Features</h3>
                        <ul>
                            <li>Real-time synchronization.</li>
                            <li>Custom hotkey support.</li>
                            <li>Cloud storage integration.</li>
                        </ul>
                    </section>
                </div>
                <aside className="modal-sidebar">
                    <h3>Status</h3>
                    <div className="status-info">
                        <p><span>Type:</span> {item.type}</p>
                        <p><span>Installs:</span> {item.installs.toLocaleString()}</p>
                        <p><span>Updated:</span> {item.lastUpdated}</p>
                        <p><span>Category:</span> {item.category}</p>
                    </div>
                    <button className={`btn-install-large ${item.isSubscription ? 'sub' : 'free'}`}>
                        <Download size={20} /> {item.isSubscription ? 'Start Subscription' : 'Install'}
                    </button>
                </aside>
            </div>
        </motion.div>
    </div>
);