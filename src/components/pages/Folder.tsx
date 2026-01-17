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
import { Folder, MoreVertical, Pin, Trash2, RotateCcw, FolderPlus } from 'lucide-react';
// Import logic from base file
import { 
  loadFoldersFromStorage, 
  saveFoldersToStorage, 
  createNewFolder, 
  refreshFolderData, 
  VideoFolder 
} from '../../../AppData/forbidden/dev/main/folders/mockFileSystem';

const FolderManager = () => {
  const [folders, setFolders] = useState<VideoFolder[]>([]);
  const [activeContextMenu, setActiveContextMenu] = useState<number | null>(null);
  
  // Separate loading states for each button
  const [topButtonLoading, setTopButtonLoading] = useState(false);
  const [emptyStateButtonLoading, setEmptyStateButtonLoading] = useState(false);

  // Load from database/localstorage on mount
  useEffect(() => {
    const data = loadFoldersFromStorage();
    setFolders(data);
  }, []);

  // Save to database whenever folders change
  useEffect(() => {
    if (folders.length > 0) {
      saveFoldersToStorage(folders);
    }
  }, [folders]);

  // --- ACTIONS ---

  // Top button handler
  const handleTopButtonAdd = async (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    setTopButtonLoading(true);
    const newFolder = await createNewFolder();
    if (newFolder) {
      const exists = folders.find(f => f.path === newFolder.path);
      if (!exists) {
        setFolders(prev => [...prev, newFolder]);
      } else {
        alert("This folder is already in your collection.");
      }
    }
    setTopButtonLoading(false);
    setActiveContextMenu(null);
  };

  // Empty state button handler
  const handleEmptyStateAdd = async (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    setEmptyStateButtonLoading(true);
    const newFolder = await createNewFolder();
    if (newFolder) {
      const exists = folders.find(f => f.path === newFolder.path);
      if (!exists) {
        setFolders(prev => [...prev, newFolder]);
      } else {
        alert("This folder is already in your collection.");
      }
    }
    setEmptyStateButtonLoading(false);
    setActiveContextMenu(null);
  };

  const handleReloadFolder = async (folderId: number) => {
    const folderToUpdate = folders.find(f => f.id === folderId);
    if (!folderToUpdate) return;

    console.log(`Reloading folder ${folderId} from physical disk...`);
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
      folder.id === folderId 
        ? { ...folder, isPinned: !folder.isPinned }
        : folder
    ));
    setActiveContextMenu(null);
  };

  const handleContextMenu = (folderId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveContextMenu(activeContextMenu === folderId ? null : folderId);
  };

  const closeContextMenu = () => {
    setActiveContextMenu(null);
  };

  // Handle click on main container
  const handleMainContainerClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const isButton = target.tagName === 'BUTTON' || 
                     target.closest('button') || 
                     target.closest('.context-menu');
    
    if (!isButton) {
      closeContextMenu();
    }
  };

  return (
    <main className="folder-page" id="FolderArsenal" onClick={handleMainContainerClick}>
      <div className="container">
        {/* Header Section */}
        <div className="header">
          <h1 className="page-title">Video Folder Manager</h1>
          
          {/* TRIGGER ELEMENT 1: Top Add Button */}
          <button 
            onClick={(e) => handleTopButtonAdd(e)}
            className="add-folder-btn"
            disabled={topButtonLoading}
          >
            <FolderPlus className="icon" size={24} />
            {topButtonLoading ? 'Scanning...' : 'Add Folder'}
          </button>
        </div>

        {/* Folders Grid */}
        <div className="folders-grid">
          {folders.map((folder) => (
            <div key={folder.id} className="folder-card">
              <div className="folder-header">
                <div className="folder-info">
                  <div className="folder-title-row">
                    <Folder className="folder-icon" size={24} />
                    <h3 className="folder-name">{folder.name}</h3>
                    {folder.isPinned && (
                      <Pin className="pin-icon" size={24} />
                    )}
                  </div>

                  <div className="context-menu-container">
                    <button
                      onClick={(e) => handleContextMenu(folder.id, e)}
                      className="context-menu-btn"
                    >
                      <MoreVertical className="more-icon" size={24} />
                    </button>

                    {activeContextMenu === folder.id && (
                      <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="context-menu-content">
                          <button onClick={() => handlePinFolder(folder.id)} className="context-menu-item">
                            <Pin className="context-icon" />
                            {folder.isPinned ? 'Unpin Folder' : 'Pin Folder'}
                          </button>
                          <button onClick={() => handleReloadFolder(folder.id)} className="context-menu-item">
                            <RotateCcw className="context-icon" />
                            Reload Folder
                          </button>
                          <button onClick={() => handleRemoveFolder(folder.id)} className="context-menu-item danger">
                            <Trash2 className="context-icon" />
                            Remove Folder
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="folder-path">{folder.path}</p>
              </div>

              <div className="subfolders-section">
                <h4 className="subfolders-title">
                  Subfolders ({folder.subfolders ? folder.subfolders.length : 0})
                </h4>
                
                {folder.subfolders && folder.subfolders.length > 0 ? (
                  <div className="subfolders-list">
                    {folder.subfolders.map((subfolder) => (
                      <div key={subfolder.id} className="subfolder-item">
                        <Folder className="subfolder-icon" size={24} />
                        <div className="subfolder-info">
                          <p className="subfolder-name">{subfolder.name}</p>
                          <p className="subfolder-path">{subfolder.path}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-subfolders">
                    <small>No subfolders detected.</small>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Only shows when folders array is empty */}
        {folders.length === 0 && (
          <div className="empty-state">
            <Folder className="empty-state-icon" size={48} />
            <h3 className="empty-state-title">No folders added yet</h3>
            <p className="empty-state-text">Start by adding your first video folder</p>
            
            {/* TRIGGER ELEMENT 2: Empty State Button */}
            <button
              onClick={(e) => handleEmptyStateAdd(e)}
              className="add-folder-btn"
              disabled={emptyStateButtonLoading}
            >
              <FolderPlus className="icon" size={24} />
              {emptyStateButtonLoading ? 'Scanning...' : 'Add Your First Folder'}
            </button>
          </div>
        )}
      </div>

      {/* Overlay to close context menu */}
      {activeContextMenu && (
        <div
          className="context-menu-overlay"
          onClick={closeContextMenu}
        />
      )}
    </main>
  );
};

export default FolderManager;