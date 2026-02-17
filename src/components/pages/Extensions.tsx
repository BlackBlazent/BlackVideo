/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState } from 'react';
import { Search, ChevronDown, Grid, List, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import '../../styles/extensions.css';
import '../../styles/common.css';
import { ExtensionPlugin } from '../../blackvideo-dts/extentionPage';

// Tab Component Imports
import { ItemGridCard, ItemListTile } from '../ui/$extensions/globalMarketHook.ui';
import { ExtensionMarketView } from '../ui/$extensions/extensionMarketCard.ui';
import { PluginMarketView } from '../ui/$extensions/pluginMarketCard.ui';
import { SubscriptionMarketView } from '../ui/$extensions/subscriptionMarketCard.ui';
import { FreeMarketView } from '../ui/$extensions/freeMarketCard.ui';
import { ExtentionCardExtendedView } from '../ui/$extensions/extentionCardExtendedView.ui';

const MOCK_ITEMS: ExtensionPlugin[] = [
    { id: 'e1', title: 'Subtitle Sync Pro', description: 'Advanced subtitle timing and alignment for video files.', type: 'Extension', category: 'Enhancement', developerName: 'Sync Devs', developerAvatar: 'https://i.pravatar.cc/150?img=11', isSubscription: false, likes: 520, installs: 5610, rating: 4.5, lastUpdated: '2 months ago' },
    { id: 'e2', title: 'Video Loop Master', description: 'Seamlessly loop sections of video without quality loss.', type: 'Extension', category: 'Utility', developerName: 'LoopTech', developerAvatar: 'https://i.pravatar.cc/150?img=12', isSubscription: true, likes: 2300, installs: 18000, rating: 4.8, lastUpdated: '1 week ago' },
    { id: 'p1', title: 'Color Grade Palette', description: 'Apply cinematic color profiles from industry professionals.', type: 'Plugin', category: 'Effect', developerName: 'Grade Studio', developerAvatar: 'https://i.pravatar.cc/150?img=13', isSubscription: false, likes: 900, installs: 1500, rating: 4.2, lastUpdated: '3 days ago' },
    { id: 'p2', title: 'Stream Overlay Helper', description: 'Quickly toggle custom overlays for streaming sessions.', type: 'Plugin', category: 'Enhancement', developerName: 'Stream King', developerAvatar: 'https://i.pravatar.cc/150?img=14', isSubscription: true, likes: 380, installs: 4000, rating: 3.9, lastUpdated: '1 month ago' },
    { id: 'e3', title: 'Frame Analyzer', description: 'Detailed frame-by-frame video quality inspection tool.', type: 'Extension', category: 'Utility', developerName: 'Visual Insight', developerAvatar: 'https://i.pravatar.cc/150?img=15', isSubscription: true, likes: 120, installs: 500, rating: 5.0, lastUpdated: '1 year ago' },
];

const Extensions: React.FC = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<ExtensionPlugin | null>(null);

    const TABS = [
        { id: 'all', name: 'All', count: MOCK_ITEMS.length },
        { id: 'extension', name: 'Extensions', count: MOCK_ITEMS.filter(i => i.type === 'Extension').length },
        { id: 'plugin', name: 'Plug-ins', count: MOCK_ITEMS.filter(i => i.type === 'Plugin').length },
        { id: 'subscription', name: 'Subscription', count: MOCK_ITEMS.filter(i => i.isSubscription).length },
        { id: 'free', name: 'Free', count: MOCK_ITEMS.filter(i => !i.isSubscription).length },
    ];

    const filteredItems = MOCK_ITEMS.filter(item => {
        const matchesType = (activeTab === 'all' || activeTab === 'subscription' || activeTab === 'free') ? true : item.type.toLowerCase() === activeTab;
        const matchesSub = activeTab === 'subscription' ? item.isSubscription : activeTab === 'free' ? !item.isSubscription : true;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.developerName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSub && matchesSearch;
    });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'extension': return <ExtensionMarketView items={filteredItems} viewMode={viewMode} openDetails={setSelectedItem} />;
            case 'plugin': return <PluginMarketView items={filteredItems} viewMode={viewMode} openDetails={setSelectedItem} />;
            case 'subscription': return <SubscriptionMarketView items={filteredItems} viewMode={viewMode} openDetails={setSelectedItem} />;
            case 'free': return <FreeMarketView items={filteredItems} viewMode={viewMode} openDetails={setSelectedItem} />;
            default: return filteredItems.map(item => viewMode === 'grid' ? <ItemGridCard key={item.id} item={item} openDetails={setSelectedItem} /> : <ItemListTile key={item.id} item={item} openDetails={setSelectedItem} />);
        }
    };

    return (
        <main className="Extensions-Page" id="ExtensionsArsenal">
            <div className="extension-container">
                <header className="page-header">
                    <div><h1>Extensions & Plugins</h1></div>
                    <div><p>Enhance your Video Player with community extensions and powerful plug-ins.</p></div>
                </header>

                <div className="top-action-bar">
                    <nav className="tab-navigation">
                        {TABS.map((tab) => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
                                {tab.name} <span className="tab-count">{tab.count}</span>
                            </button>
                        ))}
                    </nav>
                    <button className="btn-dev-join"><Code size={18} /> Join Developer</button>
                </div>

                <div className="filter-controls">
                    <div className="search-group">
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Search className="search-icon" size={16} />
                    </div>
                    <div className="dropdown-group">
                        <button className="btn-filter">Category: All <ChevronDown size={14} /></button>
                        <button className="btn-filter">Sort: Recent <ChevronDown size={14} /></button>
                    </div>
                    <div className="view-toggle">
                        <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}><Grid size={20} /></button>
                        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}><List size={20} /></button>
                    </div>
                </div>

                <div className="marketplace-grid">
                    <h2 className="results-count">{filteredItems.length} Results</h2>
                    <motion.div layout className={viewMode === 'grid' ? 'grid-layout' : 'list-layout'}>
                        {renderTabContent()}
                    </motion.div>
                </div>
            </div>
            <div className="safeSpace"></div>
            
            <AnimatePresence>
                {selectedItem && (
                    <ExtentionCardExtendedView item={selectedItem} onClose={() => setSelectedItem(null)} />
                )}
            </AnimatePresence>
        </main>
    );
};

export default Extensions;