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
import { Folder, MoreVertical, Pin, Trash2, RotateCcw } from 'lucide-react';
import { VideoFolder } from '../../../AppData/forbidden/dev/main/folders/mockFileSystem';

interface FolderVideoCardProps {
  folder: VideoFolder;
  isActive: boolean;
  onContextMenu: (folderId: number, e: React.MouseEvent) => void;
  onPin: (folderId: number) => void;
  onReload: (folderId: number) => void;
  onRemove: (folderId: number) => void;
}

export const FolderVideoCard: React.FC<FolderVideoCardProps> = ({
  folder,
  isActive,
  onContextMenu,
  onPin,
  onReload,
  onRemove
}) => {
  return (
    <div className="folder-card">
      <div className="folder-header">
        <div className="folder-info">
          <div className="folder-title-row">
            <Folder className="folder-icon" size={24} />
            <h3 className="folder-name">{folder.name}</h3>
            {folder.isPinned && <Pin className="pin-icon" size={24} />}
          </div>

          <div className="context-menu-container">
            <button
              onClick={(e) => onContextMenu(folder.id, e)}
              className="context-menu-btn"
            >
              <MoreVertical className="more-icon" size={24} />
            </button>

            {isActive && (
              <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                <div className="context-menu-content">
                  <button onClick={() => onPin(folder.id)} className="context-menu-item">
                    <Pin className="context-icon" />
                    {folder.isPinned ? 'Unpin Folder' : 'Pin Folder'}
                  </button>
                  <button onClick={() => onReload(folder.id)} className="context-menu-item context-menu-item-folder">
                    <RotateCcw className="context-icon" />
                    Reload Folder
                  </button>
                  <button onClick={() => onRemove(folder.id)} className="context-menu-item danger">
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
  );
};