/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useState, useEffect } from 'react';
import { Folder, FolderPlus } from 'lucide-react';
import { 
  loadFoldersFromStorage, 
  saveFoldersToStorage, 
  createNewFolder, 
  refreshFolderData, 
  VideoFolder 
} from '../../../AppData/forbidden/dev/main/folders/mockFileSystem';

// --- IMPORT SEPARATED COMPONENT ---
import { FolderVideoCard } from '../ui/folder/folderVideoCard';
import '../../styles/folder.css'

const FolderManager = () => {
  const [folders, setFolders] = useState<VideoFolder[]>([]);
  const [activeContextMenu, setActiveContextMenu] = useState<number | null>(null);
  const [topButtonLoading, setTopButtonLoading] = useState(false);
  const [emptyStateButtonLoading, setEmptyStateButtonLoading] = useState(false);

  useEffect(() => {
    setFolders(loadFoldersFromStorage());
  }, []);

  useEffect(() => {
    if (folders.length > 0) saveFoldersToStorage(folders);
  }, [folders]);

  // --- ACTIONS ---
  const handleTopButtonAdd = async (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setTopButtonLoading(true);
    const newFolder = await createNewFolder();
    if (newFolder) {
      if (!folders.find(f => f.path === newFolder.path)) {
        setFolders(prev => [...prev, newFolder]);
      } else {
        alert("This folder is already in your collection.");
      }
    }
    setTopButtonLoading(false);
  };

  const handleReloadFolder = async (folderId: number) => {
    const folderToUpdate = folders.find(f => f.id === folderId);
    if (!folderToUpdate) return;
    const updatedFolder = await refreshFolderData(folderToUpdate);
    setFolders(folders.map(f => f.id === folderId ? updatedFolder : f));
    setActiveContextMenu(null);
  };

  const handleRemoveFolder = (folderId: number) => {
    const updated = folders.filter(folder => folder.id !== folderId);
    setFolders(updated);
    saveFoldersToStorage(updated);
    setActiveContextMenu(null);
  };

  const handlePinFolder = (folderId: number) => {
    setFolders(folders.map(folder => 
      folder.id === folderId ? { ...folder, isPinned: !folder.isPinned } : folder
    ));
    setActiveContextMenu(null);
  };

  return (
    <main className="folder-page" id="FolderArsenal" onClick={() => setActiveContextMenu(null)}>
      <div className="container">
        <div className="header">
          <h1 className="page-title">Video Folder Manager</h1>
          <button 
            onClick={handleTopButtonAdd}
            className="add-folder-btn"
            disabled={topButtonLoading}
          >
            <FolderPlus className="icon" size={24} />
            {topButtonLoading ? 'Scanning...' : 'Add Folder'}
          </button>
        </div>

        {/* --- JSX AREA: FOLDERS GRID --- */}
        <div className="folders-grid">
          {folders.map((folder) => (
            <FolderVideoCard 
              key={folder.id}
              folder={folder}
              isActive={activeContextMenu === folder.id}
              onContextMenu={(id, e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveContextMenu(activeContextMenu === id ? null : id);
              }}
              onPin={handlePinFolder}
              onReload={handleReloadFolder}
              onRemove={handleRemoveFolder}
            />
          ))}
        </div>

        {/* Empty State */}
        {folders.length === 0 && (
          <div className="empty-state">
            <Folder className="empty-state-icon" size={48} />
            <h3 className="empty-state-title">No folders added yet</h3>
            <button
              onClick={handleTopButtonAdd}
              className="add-folder-btn"
              disabled={emptyStateButtonLoading}
            >
              <FolderPlus className="icon" size={24} />
              {emptyStateButtonLoading ? 'Scanning...' : 'Add Your First Folder'}
            </button>
          </div>
        )}
      </div>

      {activeContextMenu && (
        <div className="context-menu-overlay" onClick={() => setActiveContextMenu(null)} />
      )}
    </main>
  );
};

export default FolderManager;