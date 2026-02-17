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
    Search, Video, Film, Archive, Star, FolderPlus, Plus, Grid, List, ChevronDown, Activity, Database, Cpu, History, AlertCircle, 
    ArrowUpRight, Zap, PlayCircle, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

// Imports from separated files
import LibraryFolderComp from '../ui/library/library.folder.card.ui';
import { VideoSharingPeople } from '../ui/library/library.people.video.sharing';
import { LibraryCard, LibraryTile, LibraryVideo } from '../ui/library/library.videos.card.ui';
import { LibraryActivityChart } from '../ui/library/library.stats.chart';
import '../../styles/library.css';
import '../../styles/common.css';

// --- DATA ---
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

const MOCK_LIBRARY_FOLDERS = [
    { id: 'f1', name: 'Product Revamp', videoCount: 2, avatars: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2'] },
    { id: 'f2', name: 'Weekly Report', videoCount: 3, avatars: ['https://i.pravatar.cc/150?img=3', 'https://i.pravatar.cc/150?img=4'] },
    { id: 'f3', name: 'Meeting Project', videoCount: 2, avatars: ['https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6', 'https://i.pravatar.cc/150?img=7'] },
    { id: 'f4', name: 'Shot Preview', videoCount: 1, avatars: ['https://i.pravatar.cc/150?img=8'] },
];

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

const Library: React.FC = () => {
    const TABS = [
        { id: 'videos', name: 'Videos', icon: Video, count: MOCK_LIBRARY_VIDEOS.filter(v => v.type === 'Video').length },
        { id: 'shorts', name: 'Shorts', icon: Film, count: MOCK_LIBRARY_VIDEOS.filter(v => v.type === 'Short').length }, 
        { id: 'starred', name: 'Starred', icon: Star, count: MOCK_LIBRARY_VIDEOS.filter(v => v.isStarred).length },
        { id: 'archive', name: 'Archive', icon: Archive, count: MOCK_LIBRARY_VIDEOS.filter(v => v.type === 'Archive').length },
    ];

    const [activeTab, setActiveTab] = useState(TABS[0].id);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    const filteredVideos = MOCK_LIBRARY_VIDEOS.filter(video => {
        if (activeTab === 'videos') return video.type === 'Video';
        if (activeTab === 'shorts') return video.type === 'Short';
        if (activeTab === 'starred') return video.isStarred;
        if (activeTab === 'archive') return video.type === 'Archive';
        return true;
    });

    return (
        <main className="Library-Page" id="LibraryArsenal" style={cssVariables}>
            <div id="LibrayWrapper" className="Libray-Wrapper">
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Library</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Manage your local video files, shorts, and archives.</p>

                {/* --- Top Action Bar --- */}
                <div className="Library-TopAction-Bar">
                    <div className="Library-Tab-Group">
                        {TABS.map((tab) => {
                            const TabIcon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`Library-Tab-Btn ${isActive ? 'active' : 'inactive'}`}>
                                    <TabIcon size={16} />
                                    {tab.name}
                                    <span className={`Tab-Badge ${isActive ? 'active' : 'inactive'}`}>{tab.count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="Btn-Base Btn-Secondary"><FolderPlus size={18} /> New Folder</button>
                        <button className="Btn-Base Btn-Accent"><Plus size={18} /> New Video</button>
                    </div>
                </div>

                {/* --- Filter Row --- */}
                <div className="Library-Filter-Row">
                    <div className="Search-Container">
                        <input type="text" placeholder="Search by title..." className="Search-Input" />
                        <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                    </div>
                    
                    <div className="View-Toggle-Group">
                        <button onClick={() => setViewMode('grid')} className="Toggle-Btn" style={{ background: viewMode === 'grid' ? 'var(--primary-blue)' : 'var(--background-medium)', color: viewMode === 'grid' ? 'white' : 'var(--text-muted)' }}>
                            <Grid size={20} />
                        </button>
                        <button onClick={() => setViewMode('list')} className="Toggle-Btn" style={{ background: viewMode === 'list' ? 'var(--primary-blue)' : 'var(--background-medium)', color: viewMode === 'list' ? 'white' : 'var(--text-muted)' }}>
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* People Activity list */}
                 <VideoSharingPeople />

                {/* --- Folders Section --- */}
                <div className="Folder-Display" style={{ marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)' }}>All Folders</h2>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{MOCK_LIBRARY_FOLDERS.length} Folders</span>
                    </div>
                    <div className="Folder-Scroll-Area custom-scrollbar">
                        {MOCK_LIBRARY_FOLDERS.map(folder => (
                            <LibraryFolderComp key={folder.id} folder={folder} />
                        ))}
                    </div>
                </div>

                {/* --- Content Area --- */}
                <div className="Content-Display">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>All Videos ({filteredVideos.length})</h2>
                    {viewMode === 'grid' ? (
                        <motion.div layout className="grid-layout">
                            {filteredVideos.map(video => (
                                <LibraryCard key={video.id} video={video} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {/* HEADER ROW */}
    <div className="List-Header hidden-mobile" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0.5rem 1rem', 
        background: 'rgba(255,255,255,0.03)', 
        borderRadius: '8px',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
    }}>
        {/* Spacer to match the image width in LibraryTile (6rem + 1rem margin) */}
        <div style={{ width: '7rem', flexShrink: 0 }}>Preview</div> 
        
        <div style={{ flexGrow: 1 }}>Title</div>
        
        <div style={{ width: '7rem', textAlign: 'center' }}>Storage Size</div>
        <div style={{ width: '6rem', textAlign: 'center' }}>Duration</div>
        <div style={{ width: '8rem', textAlign: 'center' }}>Date Uploaded</div>
        
        {/* Match the action buttons width (approx 6rem) */}
        <div style={{ width: '6rem', textAlign: 'right' }}>Actions</div>
    </div>

    {/* DATA ROWS */}
    {filteredVideos.map(video => (
        <LibraryTile key={video.id} video={video} />
    ))}
</motion.div>
                    )}
                </div>
                {/*Safe space for scrolling heights*/}
                <div className="safeSpace"></div>
            </div>

{/* Library Aside statistics */}
<aside id="smart-statistics" className="Library-Aside custom-scrollbar">
    <div className='Library-Aside-Wrapper'>
        <div className="library-aside-header">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Smart Statistics
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Manage your previous history, activity, and more.
            </p>
        </div>

        <div id="smart-statistics-content" className='video-stats'>
            
            {/* 1. INTERACTIVE CHART SECTION */}
            <div className="justnow-type-stats" id="recent-activity">
                <LibraryActivityChart />
            </div>

            {/* 2. STORAGE METRICS */}
            <div className="recently-type-stats" id="storage-health" style={{ marginBottom: '1.5rem' }}>
                <h3 className="Aside-Section-Title"><Database size={16} /> Storage & Health</h3>
                <div className="Stats-Grid">
                    <div className="Stat-Box">
                        <span className="Stat-Label">Total Size</span>
                        <span className="Stat-Value">428.5 GB</span>
                        <div className="Progress-Mini">
                            <div style={{ width: '65%', background: 'var(--primary-blue)' }}></div>
                        </div>
                    </div>
                    <div className="Stat-Box">
                        <span className="Stat-Label">Offline Ratio</span>
                        <span className="Stat-Value">92%</span>
                        <span className="Stat-Sub">8.2 GB Pending</span>
                    </div>
                </div>
            </div>

            {/* 3. ENGAGEMENT */}
            <div className="history-type-stats" id="engagement" style={{ marginBottom: '1.5rem' }}>
                <h3 className="Aside-Section-Title"><Activity size={16} /> Viewing Activity</h3>
                <div className="Activity-Item">
                    <div className="Activity-Icon"><PlayCircle size={14} /></div>
                    <div className="Activity-Info">
                        <p>Avg. Completion</p>
                        <span>84.2% watched</span>
                    </div>
                </div>
                <div className="Activity-Item">
                    <div className="Activity-Icon"><Zap size={14} /></div>
                    <div className="Activity-Info">
                        <p>Playback Speed</p>
                        <span>1.5x Preferred</span>
                    </div>
                </div>
            </div>

            {/* 4. TECHNICAL BREAKDOWN */}
            <div className="longest-shortest-watch-type-stats" id="technical">
                <h3 className="Aside-Section-Title"><Cpu size={16} /> Technical Assets</h3>
                <div className="Codec-Pills">
                    <span className="Pill">MP4 (124)</span>
                    <span className="Pill">MKV (12)</span>
                    <span className="Pill">4K (45)</span>
                </div>
                <div className="Warning-Box" style={{ marginTop: '1rem' }}>
                    <AlertCircle size={16} />
                    <div>
                        <p>Battery Warning</p>
                        <span>12 high-bitrate files found.</span>
                    </div>
                </div>
            </div>
        </div>
        {/*Safe space for scrolling heights*/}
                <div className="safeSpace"></div>
    </div>
</aside>
        </main>
    );
};

export default Library;