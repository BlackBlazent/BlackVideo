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
import { 
    Search, 
    ChevronDown, 
    Grid, 
    List, 
    Heart, // For likes
    Download, // For installs
    Zap, // For extensions/plugins icon
    Code, // For developers
    Layers, // For category
    Clock, // For last updated
    Package, // For Install Button
    Play, // For Video Player specific
    User, // For Profile
    Star, // For Rating
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATA STRUCTURES ---

interface ExtensionPlugin {
    id: string;
    title: string;
    description: string;
    type: 'Extension' | 'Plugin';
    category: 'Enhancement' | 'Utility' | 'Theme' | 'Effect';
    developerName: string;
    developerAvatar: string;
    isSubscription: boolean; // Replaced 'Paid' with 'Subscription'
    likes: number;
    installs: number;
    rating: number;
    lastUpdated: string;
}

const MOCK_ITEMS: ExtensionPlugin[] = [
    { id: 'e1', title: 'Subtitle Sync Pro', description: 'Advanced subtitle timing and alignment for video files.', type: 'Extension', category: 'Enhancement', developerName: 'Sync Devs', developerAvatar: 'https://i.pravatar.cc/150?img=11', isSubscription: false, likes: 520, installs: 5610, rating: 4.5, lastUpdated: '2 months ago' },
    { id: 'e2', title: 'Video Loop Master', description: 'Seamlessly loop sections of video without quality loss.', type: 'Extension', category: 'Utility', developerName: 'LoopTech', developerAvatar: 'https://i.pravatar.cc/150?img=12', isSubscription: true, likes: 2300, installs: 18000, rating: 4.8, lastUpdated: '1 week ago' },
    { id: 'p1', title: 'Color Grade Palette', description: 'Apply cinematic color profiles from industry professionals.', type: 'Plugin', category: 'Effect', developerName: 'Grade Studio', developerAvatar: 'https://i.pravatar.cc/150?img=13', isSubscription: false, likes: 900, installs: 1500, rating: 4.2, lastUpdated: '3 days ago' },
    { id: 'p2', title: 'Stream Overlay Helper', description: 'Quickly toggle custom overlays for streaming sessions.', type: 'Plugin', category: 'Enhancement', developerName: 'Stream King', developerAvatar: 'https://i.pravatar.cc/150?img=14', isSubscription: true, likes: 380, installs: 4000, rating: 3.9, lastUpdated: '1 month ago' },
    { id: 'e3', title: 'Frame Analyzer', description: 'Detailed frame-by-frame video quality inspection tool.', type: 'Extension', category: 'Utility', developerName: 'Visual Insight', developerAvatar: 'https://i.pravatar.cc/150?img=15', isSubscription: true, likes: 120, installs: 500, rating: 5.0, lastUpdated: '1 year ago' },
];

// Reusing CSS variables from global.css
const cssVariables = {
    '--background-dark': '#1e1e1e',
    '--background-medium': '#2a2a2a',
    '--surface-color': '#3a3a3a',
    '--primary-blue': '#0066ff',
    '--primary-blue-dark': '#004dd9',
    '--text-primary': '#ffffff',
    '--text-secondary': '#e0e0e0',
    '--text-muted': '#888888',
    '--accent-orange': '#ff6b35',
    '--accent-green': '#6cc24a',
    '--border-subtle': 'rgba(255, 255, 255, 0.05)',
} as React.CSSProperties;


// --- HELPER COMPONENTS ---

// Extension/Plugin Card (Grid View - inspired by Network-Streaming-page and VS Code Registry)
const ItemGridCard: React.FC<{ item: ExtensionPlugin; openDetails: (item: ExtensionPlugin) => void }> = ({ item, openDetails }) => {
    return (
        <motion.div 
            layout 
            className="ItemCard-Grid relative bg-[var(--background-medium)] p-4 rounded-xl shadow-lg hover:bg-[var(--surface-color)] transition-colors duration-300 cursor-pointer border border-[var(--border-subtle)]"
            onClick={() => openDetails(item)}
        >
            <div className="flex items-center space-x-3 mb-3">
                {/* Icon Placeholder - Use a simple colored circle or a dedicated icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${item.type === 'Extension' ? 'bg-[var(--primary-blue)]' : 'bg-[var(--accent-orange)]'}`}>
                    <Zap size={20} />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">{item.title}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{item.developerName}</p>
                </div>
            </div>

            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{item.description}</p>

            {/* Stats and Action */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                    <span className="flex items-center text-xs text-[var(--text-muted)]">
                        <Star size={12} className="mr-1 text-yellow-400 fill-yellow-400" /> {item.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center text-xs text-[var(--text-muted)]">
                        <Download size={12} className="mr-1" /> {Math.round(item.installs / 100) / 10}k
                    </span>
                </div>
                <button
                    className={`px-3 py-1 text-sm rounded-lg font-semibold transition-colors 
                        ${item.isSubscription 
                            ? 'bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green)]/90' 
                            : 'bg-[var(--primary-blue)] text-white hover:bg-[var(--primary-blue-dark)]'
                        }`}
                    onClick={(e) => { e.stopPropagation(); console.log(`Installing ${item.title}`); }}
                >
                    {item.isSubscription ? 'Subscribe' : 'Install'}
                </button>
            </div>
        </motion.div>
    );
};


// Extension/Plugin Tile (List View - inspired by Plugin Marketplace for SaaS Tool UI)
const ItemListTile: React.FC<{ item: ExtensionPlugin; openDetails: (item: ExtensionPlugin) => void }> = ({ item, openDetails }) => {
    return (
        <motion.div 
            layout 
            className="ItemList-Tile flex items-center justify-between bg-[var(--background-medium)] hover:bg-[var(--surface-color)] transition-colors duration-200 p-4 rounded-xl border border-[var(--border-subtle)] cursor-pointer"
            onClick={() => openDetails(item)}
        >
            {/* Left Side: Icon, Title, Description */}
            <div className="flex items-center flex-grow min-w-0">
                {/* Icon */}
                <div className={`w-12 h-12 flex-shrink-0 rounded-lg flex items-center justify-center text-white font-bold text-xl ${item.type === 'Extension' ? 'bg-[var(--primary-blue)]' : 'bg-[var(--accent-orange)]'}`}>
                    <Zap size={24} />
                </div>

                {/* Text Content */}
                <div className="ml-4 min-w-0">
                    <h3 className="text-base font-semibold text-[var(--text-primary)] truncate">{item.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] truncate">{item.description}</p>
                </div>
            </div>

            {/* Right Side: Profile, Status, Stats, Buttons */}
            <div className="flex items-center space-x-6 flex-shrink-0 ml-4">
                
                {/* Profile/Status (Tile View Requirement) */}
                <div className="flex items-center gap-2 hidden lg:flex">
                    <img src={item.developerAvatar} alt={item.developerName} className="w-6 h-6 rounded-full object-cover" />
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.isSubscription ? 'bg-[var(--accent-green)]/20 text-[var(--accent-green)]' : 'bg-[var(--primary-blue)]/20 text-[var(--primary-blue)]'}`}>
                        {item.isSubscription ? 'Subscription' : 'Free'}
                    </span>
                </div>

                {/* Stats (Likes/Installs) */}
                <div className="flex items-center gap-4 hidden sm:flex">
                    <span className="flex items-center text-sm text-[var(--text-secondary)]">
                        <Heart size={16} className="mr-1 text-[var(--accent-orange)] fill-[var(--accent-orange)]/50" /> {Math.round(item.likes / 10) / 100}k
                    </span>
                    <span className="flex items-center text-sm text-[var(--text-secondary)]">
                        <Download size={16} className="mr-1 text-[var(--text-muted)]" /> {Math.round(item.installs / 100) / 10}k
                    </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        className="px-4 py-2 text-sm bg-[var(--primary-blue)] text-white rounded-lg font-semibold hover:bg-[var(--primary-blue-dark)] transition-colors"
                        onClick={(e) => { e.stopPropagation(); console.log(`Installing ${item.title}`); }}
                    >
                        <Package size={16} className="inline mr-1" /> {item.isSubscription ? 'Subscribe' : 'Install'}
                    </button>
                    <button
                        className="px-4 py-2 text-sm bg-[var(--background-dark)] text-[var(--text-secondary)] rounded-lg font-semibold hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]"
                        onClick={(e) => { e.stopPropagation(); openDetails(item); }}
                    >
                        View Details
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---

const Extensions: React.FC = () => {
    const TABS = [
        { id: 'all', name: 'All', count: MOCK_ITEMS.length },
        { id: 'extension', name: 'Extensions', count: MOCK_ITEMS.filter(i => i.type === 'Extension').length },
        { id: 'plugin', name: 'Plug-ins', count: MOCK_ITEMS.filter(i => i.type === 'Plugin').length },
        { id: 'subscription', name: 'Subscription', count: MOCK_ITEMS.filter(i => i.isSubscription).length },
    ];

    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view for marketplace feel
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItem, setSelectedItem] = useState<ExtensionPlugin | null>(null);

    // Filtered data based on search and tab
    const filteredItems = MOCK_ITEMS.filter(item => {
        const matchesType = activeTab === 'all' || activeTab === 'subscription' 
            ? true 
            : item.type.toLowerCase() === activeTab;
        
        const matchesSubscription = activeTab === 'subscription' 
            ? item.isSubscription 
            : true;

        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              item.developerName.toLowerCase().includes(searchTerm.toLowerCase());
                              
        return matchesType && matchesSubscription && matchesSearch;
    });

    const openDetailsModal = (item: ExtensionPlugin) => {
        setSelectedItem(item);
    };

    const closeDetailsModal = () => {
        setSelectedItem(null);
    };

    return (
        <main 
            className="Extensions-Page w-full min-h-screen text-[var(--text-primary)] font-sans" 
            id="ExtensionsArsenal"
            style={cssVariables}
        >
            <div id="ExtensionWrapper" className="px-8 md:px-16 pt-10 pb-20">
                <h1 className="text-4xl font-extrabold mb-2">Extensions & Plugins</h1>
                <p className="text-[var(--text-secondary)] mb-8">Enhance your Video Player with community extensions and powerful plug-ins.</p>

                {/* --- Top Action Bar --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-[var(--background-dark)] rounded-xl border border-[var(--border-subtle)] shadow-xl">
                    
                    {/* Tabs (Extensions and Plug-ins) */}
                    <div className="flex flex-wrap gap-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-all
                                    ${activeTab === tab.id 
                                        ? 'bg-[var(--primary-blue)] text-white' 
                                        : 'bg-[var(--background-medium)] text-[var(--text-secondary)] hover:bg-[var(--surface-color)]'
                                    }
                                `}
                            >
                                {tab.name}
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[var(--primary-blue-dark)]' : 'bg-black/20'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3">
                        {/* Join Developer Button (NEW) */}
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--background-medium)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]">
                            <Code size={18} /> Join Developer
                        </button>
                    </div>
                </div>

                {/* --- Secondary Filter Bar & View Toggle --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow min-w-[250px] md:min-w-0">
                            <input 
                                type="text" 
                                placeholder="Search by name, tag, or description..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--background-medium)] border border-[var(--border-subtle)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--primary-blue)] transition-colors text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        </div>
                        
                        {/* Dropdowns */}
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--background-medium)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]">
                            Category: All <ChevronDown size={14} />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--background-medium)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]">
                            Sort: Recently Updated <ChevronDown size={14} />
                        </button>
                    </div>
                    
                    {/* View Toggle */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[var(--text-muted)] text-sm hidden sm:block">View:</span>
                        <button 
                            title="Grid View"
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors border border-[var(--border-subtle)] ${viewMode === 'grid' ? 'bg-[var(--primary-blue)] text-white' : 'bg-[var(--background-medium)] text-[var(--text-muted)] hover:bg-[var(--surface-color)]'}`}
                        >
                            <Grid size={20} />
                        </button>
                        <button 
                            title="List View"
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors border border-[var(--border-subtle)] ${viewMode === 'list' ? 'bg-[var(--primary-blue)] text-white' : 'bg-[var(--background-medium)] text-[var(--text-muted)] hover:bg-[var(--surface-color)]'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* --- Content Area (Dynamically Rendered) --- */}
                <div className="Marketplace-Content-Display">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-6">{filteredItems.length} Results</h2>

                    {viewMode === 'grid' ? (
                        // Grid View (VS Code Registry / Streaming Card Style)
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <ItemGridCard key={item.id} item={item} openDetails={openDetailsModal} />
                            ))}
                        </motion.div>
                    ) : (
                        // List View (Plugin Marketplace Tile Style)
                        <motion.div layout className="flex flex-col gap-3">
                            {filteredItems.map(item => (
                                <ItemListTile key={item.id} item={item} openDetails={openDetailsModal} />
                            ))}
                        </motion.div>
                    )}
                </div>

            </div>
            
            {/* --- Item Detail Modal (Based on VS Code Registry Detail Page) --- */}
            {selectedItem && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={closeDetailsModal}
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[var(--background-dark)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-8 shadow-2xl border border-[var(--border-subtle)]"
                        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()} // Prevent closing when clicking inside modal
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center space-x-4">
                                <div className={`w-16 h-16 flex-shrink-0 rounded-xl flex items-center justify-center text-white font-bold text-3xl ${selectedItem.type === 'Extension' ? 'bg-[var(--primary-blue)]' : 'bg-[var(--accent-orange)]'}`}>
                                    <Zap size={32} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-extrabold text-[var(--text-primary)]">{selectedItem.title}</h2>
                                    <p className="text-sm text-[var(--text-muted)] mt-1">
                                        Published by **{selectedItem.developerName}** | {selectedItem.type}
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm text-[var(--text-secondary)] font-semibold">{selectedItem.rating.toFixed(1)} Stars</span>
                                        <span className="text-sm text-[var(--text-muted)]">({selectedItem.likes.toLocaleString()} likes)</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={closeDetailsModal} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-2xl">
                                &times;
                            </button>
                        </div>

                        {/* Detail Tabs and Sidebar */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-3/4">
                                {/* Overview Section */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold border-b border-[var(--border-subtle)] pb-2 mb-4">Overview</h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">{selectedItem.description}. This {selectedItem.type.toLowerCase()} enhances core Video Player functionality by offering specialized tools for advanced playback and file management. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                </div>

                                {/* Features List */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold border-b border-[var(--border-subtle)] pb-2 mb-4">Features</h3>
                                    <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                                        <li>Real-time data processing for accurate synchronization.</li>
                                        <li>Custom hotkey support for power users.</li>
                                        <li>Integration with cloud storage for file access.</li>
                                        <li>Light and dark mode compatibility.</li>
                                    </ul>
                                </div>
                                
                                {/* Documentation Placeholder */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold border-b border-[var(--border-subtle)] pb-2 mb-4">Documentation</h3>
                                    <p className="text-[var(--text-muted)]">See the full **User Manual** for installation and configuration instructions.</p>
                                </div>
                            </div>

                            {/* Sidebar (Version, Status, Resources) */}
                            <div className="lg:w-1/4 flex-shrink-0 bg-[var(--background-medium)] p-4 rounded-xl">
                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Status</h3>

                                <div className="space-y-3 mb-6">
                                    <p className="text-sm text-[var(--text-secondary)] flex justify-between">
                                        **Type:** <span className="text-[var(--text-primary)]">{selectedItem.type}</span>
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] flex justify-between">
                                        **Installs:** <span className="text-[var(--text-primary)]">{selectedItem.installs.toLocaleString()}</span>
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] flex justify-between">
                                        **Last Updated:** <span className="text-[var(--text-primary)]">{selectedItem.lastUpdated}</span>
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] flex justify-between">
                                        **Category:** <span className="text-[var(--text-primary)] flex items-center gap-1"><Layers size={14} /> {selectedItem.category}</span>
                                    </p>
                                </div>

                                <button
                                    className={`w-full py-2 text-lg rounded-lg font-bold transition-colors shadow-md 
                                        ${selectedItem.isSubscription 
                                            ? 'bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green)]/90' 
                                            : 'bg-[var(--primary-blue)] text-white hover:bg-[var(--primary-blue-dark)]'
                                        }`}
                                    onClick={(e) => { e.stopPropagation(); console.log(`Installing/Subscribing ${selectedItem.title}`); }}
                                >
                                    <Download size={20} className="inline mr-2" /> {selectedItem.isSubscription ? 'Start Subscription' : 'Download & Install'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </main>
    );
};

export default Extensions;