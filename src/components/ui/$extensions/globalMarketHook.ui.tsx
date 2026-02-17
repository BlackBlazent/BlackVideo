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
import { Zap, Star, Download, Heart, Package } from 'lucide-react';
import { ExtensionPlugin } from '../../../blackvideo-dts/extentionPage';

interface CardProps {
    item: ExtensionPlugin;
    openDetails: (item: ExtensionPlugin) => void;
}

export const ItemGridCard: React.FC<CardProps> = ({ item, openDetails }) => (
    <motion.div layout className="item-card-grid" onClick={() => openDetails(item)}>
        <div className="card-header">
            <div className={`icon-box ${item.type.toLowerCase()}`}><Zap size={20} /></div>
            <div className="title-area">
                <h3>{item.title}</h3>
                <p>{item.developerName}</p>
            </div>
        </div>
        <p className="card-description">{item.description}</p>
        <div className="card-footer">
            <div className="stats-row">
                <span className="stat-item"><Star size={12} className="star-icon" /> {item.rating.toFixed(1)}</span>
                <span className="stat-item"><Download size={12} /> {Math.round(item.installs / 100) / 10}k</span>
            </div>
            <button className={`btn-action ${item.isSubscription ? 'sub' : 'install'}`} onClick={(e) => e.stopPropagation()}>
                {item.isSubscription ? 'Subscribe' : 'Install'}
            </button>
        </div>
    </motion.div>
);

export const ItemListTile: React.FC<CardProps> = ({ item, openDetails }) => (
    <motion.div layout className="item-list-tile" onClick={() => openDetails(item)}>
        <div className="list-main-info">
            <div className={`icon-box-list ${item.type.toLowerCase()}`}><Zap size={24} /></div>
            <div className="list-text">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
            </div>
        </div>
        <div className="list-actions-area">
            <div className="dev-status hide-mobile">
                <img src={item.developerAvatar} alt={item.developerName} />
                <span className={`badge ${item.isSubscription ? 'sub' : 'free'}`}>{item.isSubscription ? 'Subscription' : 'Free'}</span>
            </div>
            <div className="list-stats hide-small">
                <span><Heart size={16} className="heart-icon" /> {Math.round(item.likes / 10) / 100}k</span>
                <span><Download size={16} /> {Math.round(item.installs / 100) / 10}k</span>
            </div>
            <div className="button-group">
                <button className="btn-package" onClick={(e) => e.stopPropagation()}>
                    <Package size={16} /> {item.isSubscription ? 'Subscribe' : 'Install'}
                </button>
                <button className="btn-outline" onClick={(e) => { e.stopPropagation(); openDetails(item); }}>View Details</button>
            </div>
        </div>
    </motion.div>
);