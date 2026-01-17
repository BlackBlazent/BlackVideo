// src/utils/folder.base.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { open } from "@tauri-apps/plugin-dialog";
import { readDir } from "@tauri-apps/plugin-fs";
// import { Subfolder, VideoFolder } from './types';

export interface Subfolder {
  id: number | string;
  name: string;
  path: string;
}

export interface VideoFolder {
  id: number;
  name: string;
  path: string;
  isPinned: boolean;
  subfolders: Subfolder[];
  lastUpdated: string;
}

const STORAGE_KEY = "blackvideo_folders";

/**
 * Generates a unique ID based on timestamp
 */
const generateId = () => Date.now();

/**
 * Loads folders from LocalStorage
 */
export const loadFoldersFromStorage = (): VideoFolder[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

/**
 * Saves the current list of folders to LocalStorage
 */
export const saveFoldersToStorage = (folders: VideoFolder[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders));
};

/**
 * Scans a directory path to find subfolders (directories only)
 * ✅ Tauri v2 compatible
 */
export const scanDirectoryForSubfolders = async (
  dirPath: string
): Promise<Subfolder[]> => {
  try {
    // ✅ v2 readDir has NO recursive option
    const entries = await readDir(dirPath);

    const subfolders: Subfolder[] = entries
      .filter((entry) => entry.isDirectory)
      .map((entry) => ({
        id: generateId() + Math.floor(Math.random() * 1000),
        name: entry.name ?? "Unknown",
        // ✅ v2 does NOT expose full path → reconstruct it
        path: `${dirPath}/${entry.name}`,
      }));

    return subfolders;
  } catch (error) {
    console.warn(
      `Could not read directory (run in Tauri to fix): ${dirPath}`,
      error
    );
    return [];
  }
};

/**
 * Triggers the OS folder picker, creates the metadata, and returns the new object.
 */
export const createNewFolder = async (): Promise<VideoFolder | null> => {
  try {
    const selected = await open({ // <-- This opens the OS folder picker
      directory: true,          // <-- It is set to select a Directory (Folder)
      multiple: false,
      title: "Select Video Folder",
    });
    
    if (selected === null || Array.isArray(selected)) return null;

    const folderPath = selected as string;

    const folderName = folderPath.split(/[\\/]/).pop() || folderPath;

    const subfolders = await scanDirectoryForSubfolders(folderPath);

    const newFolder: VideoFolder = {
      id: generateId(),
      name: folderName,
      path: folderPath,
      isPinned: false,
      subfolders,
      lastUpdated: new Date().toISOString(),
    };

    return newFolder;
  } catch (err) {
    console.error("Error opening dialog:", err);
    return null;
  }
};

/**
 * Refresh a specific folder's subfolders from the physical disk
 */
export const refreshFolderData = async (
  folder: VideoFolder
): Promise<VideoFolder> => {
  const updatedSubfolders = await scanDirectoryForSubfolders(folder.path);

  return {
    ...folder,
    subfolders: updatedSubfolders,
    lastUpdated: new Date().toISOString(),
  };
};
