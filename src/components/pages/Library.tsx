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
    Video, 
    Film, 
    Archive, 
    Star, 
    FolderPlus, 
    Plus, 
    Grid, 
    List, 
    ChevronDown, 
    Play,
    MoreVertical,
    Clock, 
    HardDrive, 
    Calendar,
    Folder, // ADDED for the folder UI
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATA STRUCTURES ---

interface LibraryVideo {
    id: string;
    title: string;
    thumbnail: string;
    duration: string;
    uploadedDate: string;
    views: number;
    size: string;
    isStarred: boolean;
    type: 'Video' | 'Short' | 'Archive'; // Category for tabs
    folderId: string; // New: To link videos to folders
}

interface LibraryFolder {
    id: string;
    name: string;
    videoCount: number;
    avatars: string[]; // Mock profile pictures for display
}

const MOCK_LIBRARY_VIDEOS: LibraryVideo[] = [
    { id: '1', title: 'Product Revamp', thumbnail: 'https://picsum.photos/300/200?random=1', duration: '2 Video', uploadedDate: '2 hours ago', views: 12, size: '200MB', isStarred: false, type: 'Video', folderId: 'f1' },
    { id: '2', title: 'Final UI Walkthrough - Product Landing Page', thumbnail: 'https://picsum.photos/300/200?random=2', duration: '24 Min', uploadedDate: '2 hours ago', views: 18, size: '400MB', isStarred: true, type: 'Video', folderId: 'f2' },
    { id: '3', title: 'Interactive Prototype - User Signup Flow', thumbnail: 'https://picsum.photos/300/200?random=3', duration: '4 Min', uploadedDate: '2 hours ago', views: 6, size: '150MB', isStarred: false, type: 'Video', folderId: 'f2' },
    { id: '4', title: 'Client Feedback Review - June Sprint', thumbnail: 'https://picsum.photos/300/200?random=4', duration: '17 Min', uploadedDate: '2 hours ago', views: 7, size: '350MB', isStarred: false, type: 'Video', folderId: 'f3' },
    { id: '5', title: 'Wireframe Exploration for Homepage Redesign', thumbnail: 'https://picsum.photos/300/200?random=5', duration: '8 Min', uploadedDate: '1 Day ago', views: 12, size: '250MB', isStarred: false, type: 'Video', folderId: 'f1' },
    { id: '6', title: 'Weekly Report Summary', thumbnail: 'https://picsum.photos/300/200?random=6', duration: '2 Video', uploadedDate: '1 Day ago', views: 15, size: '100MB', isStarred: false, type: 'Short', folderId: 'f2' },
    { id: '7', title: 'Mobile App Teaser', thumbnail: 'https://picsum.photos/300/200?random=7', duration: '12 Min', uploadedDate: '2 Days ago', views: 9, size: '300MB', isStarred: true, type: 'Video', folderId: 'f4' },
    { id: '8', title: 'Marketing Campaign Intro', thumbnail: 'https://picsum.photos/300/200?random=8', duration: '6 Min', uploadedDate: '3 Days ago', views: 25, size: '180MB', isStarred: false, type: 'Archive', folderId: 'f3' },
];

const MOCK_LIBRARY_FOLDERS: LibraryFolder[] = [
    { id: 'f1', name: 'Product Revamp', videoCount: 2, avatars: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2'] },
    { id: 'f2', name: 'Weekly Report', videoCount: 3, avatars: ['https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4'] },
    { id: 'f3', name: 'Meeting Project', videoCount: 2, avatars: ['https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6', 'https://i.pravatar.cc/150?img=7'] },
    { id: 'f4', name: 'Shot Preview', videoCount: 1, avatars: ['https://i.pravatar.cc/150?img=8'] },
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

// Library Folder Component (NEW)
const LibraryFolder: React.FC<{ folder: LibraryFolder }> = ({ folder }) => {
    // Determine the number of extra people not shown in the avatars array
    const extraPeopleCount = folder.videoCount > 3 ? folder.videoCount - 3 : 0;

    return (
        <motion.div
            className="LibraryFolder-Card flex flex-col justify-between p-4 w-40 h-32 bg-[var(--surface-color)]/70 hover:bg-[var(--surface-color)] rounded-xl cursor-pointer transition-colors border border-[var(--border-subtle)] flex-shrink-0"
        >
            <div className="flex justify-between items-start">
                {/* Folder Icon */}
                <Folder size={24} className="text-[var(--accent-orange)] fill-[var(--accent-orange)]/30" />
            </div>

            {/* Folder Name and Avatars */}
            <div className="mt-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">{folder.name}</h3>
                <p className="text-xs text-[var(--text-muted)]">{folder.videoCount} Video{folder.videoCount !== 1 ? 's' : ''}</p>
                
                {/* Avatars / Participants */}
                <div className="flex items-center -space-x-2 mt-2">
                    {folder.avatars.slice(0, 3).map((src, index) => (
                        <img
                            key={index}
                            className="w-5 h-5 rounded-full ring-2 ring-[var(--surface-color)] object-cover"
                            src={src}
                            alt="Avatar"
                        />
                    ))}
                    {extraPeopleCount > 0 && (
                        <span className="w-5 h-5 rounded-full ring-2 ring-[var(--surface-color)] bg-[var(--primary-blue)] text-white text-[10px] flex items-center justify-center font-bold">
                            +{extraPeopleCount}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


// Library Card (Grid View - remains the same structure)
const LibraryCard: React.FC<{ video: LibraryVideo }> = ({ video }) => {
    return (
        <motion.div 
            layout 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="LibraryCard-Grid relative bg-[var(--background-medium)] rounded-xl overflow-hidden group shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[var(--border-subtle)]"
        >
            {/* Thumbnail Area */}
            <div className="relative aspect-video overflow-hidden">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                    <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-blue)] hover:bg-[var(--primary-blue-dark)] text-white rounded-full font-semibold transition-colors shadow-lg">
                        <Play size={18} className="fill-current" /> Watch Video
                    </button>
                    
                    <div className="absolute top-3 right-3 flex gap-2">
                        {/* More Button */}
                        <button className="p-1.5 bg-black/70 rounded-full text-white hover:bg-[var(--surface-color)] transition-colors">
                            <MoreVertical size={18} />
                        </button>
                        {/* Star Button */}
                        <button className={`p-1.5 rounded-full text-white transition-colors ${video.isStarred ? 'bg-[var(--accent-orange)]' : 'bg-black/70 hover:bg-[var(--surface-color)]'}`}>
                            <Star size={18} className={video.isStarred ? 'fill-white' : 'fill-none'} />
                        </button>
                    </div>

                    {/* Duration Preview */}
                    <span className="absolute bottom-3 right-3 text-xs text-white bg-black/70 px-2 py-0.5 rounded">
                        {video.duration}
                    </span>
                </div>
            </div>

            {/* Video Details (Profile/Name/Reactions are HIDDEN as requested) */}
            <div className="p-3">
                <h3 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{video.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">{video.uploadedDate}</p>
            </div>
        </motion.div>
    );
};

// Library Tile (List View - remains the same structure)
const LibraryTile: React.FC<{ video: LibraryVideo }> = ({ video }) => {
    return (
        <motion.div 
            layout 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="LibraryTile-List flex items-center bg-[var(--background-medium)] hover:bg-[var(--surface-color)] transition-colors duration-200 p-3 rounded-xl border border-[var(--border-subtle)]"
        >
            {/* Thumbnail */}
            <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden relative">
                <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover" 
                />
            </div>

            {/* Title */}
            <div className="flex-grow ml-4">
                <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{video.title}</p>
            </div>

            {/* Custom Library Metrics */}
            
            {/* File Size / Storage */}
            <div className="w-28 text-center hidden md:block">
                <span className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-1">
                    <HardDrive size={16} className="text-[var(--text-muted)]" /> {video.size}
                </span>
            </div>

            {/* Duration */}
            <div className="w-24 text-center hidden sm:block">
                <span className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-1">
                    <Clock size={16} className="text-[var(--text-muted)]" /> {video.duration}
                </span>
            </div>
            
            {/* Uploaded Date */}
            <div className="w-32 text-center hidden lg:block">
                <span className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-1">
                    <Calendar size={16} className="text-[var(--text-muted)]" /> {video.uploadedDate}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                <button 
                    title="Watch"
                    className="p-2 bg-[var(--primary-blue)]/80 rounded-lg text-white hover:bg-[var(--primary-blue)] transition-colors"
                >
                    <Play size={16} fill="white" />
                </button>
                <button 
                    title="More"
                    className="p-2 bg-[var(--background-dark)] rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]"
                >
                    <MoreVertical size={16} />
                </button>
            </div>
        </motion.div>
    );
};


// --- MAIN COMPONENT ---

const Library: React.FC = () => {
    const TABS = [
        { id: 'videos', name: 'Videos', icon: Video, count: MOCK_LIBRARY_VIDEOS.filter(v => v.type === 'Video').length },
        { id: 'shorts', name: 'Shorts', icon: Film, count: MOCK_LIBRARY_VIDEOS.filter(v => v.type === 'Short').length }, 
        { id: 'starred', name: 'Starred', icon: Star, count: MOCK_LIBRARY_VIDEOS.filter(v => v.isStarred).length },
        { id: 'archive', name: 'Archive', icon: Archive, count: MOCK_LIBRARY_VIDEOS.filter(v => v.type === 'Archive').length },
    ];

    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    // Filtered videos based on the active tab
    const filteredVideos = MOCK_LIBRARY_VIDEOS.filter(video => {
        if (activeTab === 'videos') return video.type === 'Video';
        if (activeTab === 'shorts') return video.type === 'Short';
        if (activeTab === 'starred') return video.isStarred;
        if (activeTab === 'archive') return video.type === 'Archive';
        return true;
    });

    return (
        <main 
            className="Library-Page w-full min-h-screen text-[var(--text-primary)] font-sans" 
            id="LibraryArsenal"
            style={cssVariables}
        >
            <div id="LibrayWrapper" className="px-8 md:px-16 pt-10 pb-20">
                <h1 className="text-4xl font-extrabold mb-2">My Library</h1>
                <p className="text-[var(--text-secondary)] mb-8">Manage your local video files, shorts, and archives.</p>

                {/* --- Top Action Bar --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-4 bg-[var(--background-dark)] rounded-xl border border-[var(--border-subtle)] shadow-xl">
                    
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {TABS.map((tab) => {
                            const TabIcon = tab.icon;
                            return (
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
                                    <TabIcon size={16} />
                                    {tab.name}
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[var(--primary-blue-dark)]' : 'bg-black/20'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side Controls */}
                    <div className="flex items-center gap-3">
                        {/* New Folder Button */}
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--surface-color)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--background-medium)] transition-colors border border-[var(--border-subtle)]">
                            <FolderPlus size={18} /> New Folder
                        </button>
                        
                        {/* New Video Button */}
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--accent-orange)] text-white rounded-xl font-semibold hover:bg-[var(--accent-orange)]/90 transition-colors shadow-md shadow-[rgba(255,107,53,0.3)]">
                            <Plus size={18} /> New Video
                        </button>
                    </div>
                </div>

                {/* --- Secondary Filter Bar & View Toggle --- */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Search and Filters */}
                    <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow min-w-[200px] md:min-w-0">
                            <input 
                                type="text" 
                                placeholder="Search by title..." 
                                className="w-full bg-[var(--background-medium)] border border-[var(--border-subtle)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--primary-blue)] transition-colors text-[var(--text-secondary)] placeholder-[var(--text-muted)]"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
                        </div>
                        
                        {/* Dropdowns (e.g., Sort by Date) */}
                        <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[var(--background-medium)] text-[var(--text-secondary)] rounded-xl font-semibold hover:bg-[var(--surface-color)] transition-colors border border-[var(--border-subtle)]">
                            Sort: Date Created <ChevronDown size={14} />
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

                {/* --- FOLDER SECTION --- */}
                <div className="Folder-Display mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-[var(--text-secondary)]">All Folders</h2>
                        <span className="text-sm text-[var(--text-muted)]">{MOCK_LIBRARY_FOLDERS.length} Folders</span>
                    </div>

                    {/* Folder Cards */}
                    <div className="flex flex-wrap gap-4 overflow-x-auto pb-4 custom-scrollbar">
                        {MOCK_LIBRARY_FOLDERS.map(folder => (
                            <LibraryFolder key={folder.id} folder={folder} />
                        ))}
                    </div>
                </div>
                {/* --- END FOLDER SECTION --- */}


                {/* --- Content Area (Dynamically Rendered) --- */}
                <div className="Content-Display">
                    <h2 className="text-xl font-bold text-[var(--text-secondary)] mb-6">All Videos ({filteredVideos.length})</h2>

                    {viewMode === 'grid' ? (
                        // Grid View (Snappy Dribbble Style)
                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVideos.map(video => (
                                <LibraryCard key={video.id} video={video} />
                            ))}
                        </motion.div>
                    ) : (
                        // List View (Media Manager Dribbble Style)
                        <motion.div layout className="flex flex-col gap-3">
                            {/* List Header */}
                            <div className="flex items-center p-3 text-sm font-semibold text-[var(--text-muted)] border-b border-[var(--border-subtle)] hidden sm:flex">
                                <div className="flex-grow ml-4">Title</div>
                                <div className="w-28 text-center hidden md:block">Storage Size</div>
                                <div className="w-24 text-center hidden sm:block">Duration</div>
                                <div className="w-32 text-center hidden lg:block">Date Uploaded</div>
                                <div className="w-24 ml-4 flex-shrink-0 text-right">Actions</div>
                            </div>
                            
                            {filteredVideos.map(video => (
                                <LibraryTile key={video.id} video={video} />
                            ))}
                        </motion.div>
                    )}
                </div>

            </div>
        </main>
    );
};

export default Library;