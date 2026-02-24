/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

/**
 * videoFileFetcher.ts
 *
 * Single source of truth for reading video metadata that was indexed
 * by video_indexing_worker.rs / video_metadata_handler.rs and stored
 * in the Tauri store.
 *
 * Used by: Library.tsx, library.folder.card.ui.tsx, library.videos.card.ui.tsx
 * Also reusable by: Playground, future cloud components, etc.
 */

import { invoke } from '@tauri-apps/api/core';
import type { VideoMetadata, VideoFolder } from '../../main/folders/types';

// ─────────────────────────────────────────────────────────────
//  Library-specific enriched video type
//  Extends raw VideoMetadata with UI state fields
// ─────────────────────────────────────────────────────────────

export interface LibraryVideoItem {
  // Core metadata from Rust store
  id: string;
  title: string;
  filename: string;
  file_path: string;
  file_type: string;
  duration: number | null;       // seconds
  duration_label: string;        // "2h 14m" or "45 Min"
  resolution: string | null;
  width: number | null;
  height: number | null;
  size: number;                  // bytes
  size_label: string;            // "1.4 GB"
  video_codec: string | null;
  audio_codec: string | null;
  format: string | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;

  // UI state (persisted separately in app store)
  isStarred: boolean;
  folderId: number;              // numeric folder ID from VideoFolder.id
  folderName: string;
  /** 'Video' | 'Short' | 'Archive' — derived from duration */
  type: 'Video' | 'Short' | 'Archive';
  /** position in drag grid — persisted to Tauri store */
  gridPosition: number | null;
}

export interface LibraryFolderItem {
  id: number;
  name: string;
  path: string;
  isPinned: boolean;
  videoCount: number;
  totalSize: number;
  totalSizeLabel: string;
  avatars: string[];            // kept for future sharing feature
  /** password hash if locked, null if open */
  passwordHash: string | null;
  /** drag order position — persisted to Tauri store */
  gridPosition: number | null;
  lastUpdated: string;
}

// ─────────────────────────────────────────────────────────────
//  Store keys
// ─────────────────────────────────────────────────────────────

const UI_STATE_KEY = 'bv_library_ui_state';

interface UIVideoState {
  isStarred: boolean;
  type: 'Video' | 'Short' | 'Archive';
  gridPosition: number | null;
}

interface UIFolderState {
  isPinned: boolean;
  passwordHash: string | null;
  gridPosition: number | null;
  customName: string | null;    // frontend-only rename
}

export interface LibraryUIState {
  videos: Record<string, UIVideoState>;
  folders: Record<number, UIFolderState>;
}

// ─────────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────────

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const formatDuration = (seconds: number | null): string => {
  if (seconds === null || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m} Min`;
  return `${s}s`;
};

/** Short = ≤ 3 minutes with KNOWN duration, Archive if manually set, otherwise Video.
 *
 * FIX: seconds must be > 0 to qualify as Short.
 * remeta returns 0ms for files it cannot parse — that gets stored as 0.0s.
 * 0.0 ≤ 180 was incorrectly classifying ALL unreadable files as "Short",
 * which made them invisible on the Videos tab and showed "Unknown" titles
 * (because only Shorts tab was active).
 */
const deriveType = (
  seconds: number | null,
  override?: 'Video' | 'Short' | 'Archive'
): 'Video' | 'Short' | 'Archive' => {
  if (override) return override;
  // Only classify as Short when we have a real, positive duration ≤ 3 minutes.
  // null or 0 means duration unknown — default to Video so it's not hidden.
  if (seconds !== null && seconds > 0 && seconds <= 180) return 'Short';
  return 'Video';
};

// ─────────────────────────────────────────────────────────────
//  UI State persistence (Tauri store via store_get / store_set)
// ─────────────────────────────────────────────────────────────

export const loadUIState = async (): Promise<LibraryUIState> => {
  try {
    const raw = await invoke<string | null>('store_get', { key: UI_STATE_KEY });
    if (raw) return JSON.parse(raw) as LibraryUIState;
  } catch (_) {}
  return { videos: {}, folders: {} };
};

export const saveUIState = async (state: LibraryUIState): Promise<void> => {
  try {
    await invoke('store_set', { key: UI_STATE_KEY, value: JSON.stringify(state) });
  } catch (err) {
    console.error('[videoFileFetcher] saveUIState failed:', err);
  }
};

// ─────────────────────────────────────────────────────────────
//  Main fetch functions
// ─────────────────────────────────────────────────────────────

/**
 * Loads all folders from the Tauri store (same data saved by mockFileSystem.ts),
 * then fetches all indexed video metadata for each folder,
 * and merges with UI state (star, type override, positions).
 *
 * Returns { folders, videos } ready to render in Library.
 * Called ONCE on Library mount; updates triggered by folder changes.
 */
export const fetchLibraryData = async (): Promise<{
  folders: LibraryFolderItem[];
  videos: LibraryVideoItem[];
}> => {
  // 1. Load folder list (saved by Folder page)
  const raw = await invoke<string | null>('store_get', { key: 'blackvideo_folders' });
  const videoFolders: VideoFolder[] = raw ? JSON.parse(raw) : [];

  // 2. Load UI state (stars, type overrides, drag positions)
  const uiState = await loadUIState();

  const allFolders: LibraryFolderItem[] = [];
  const allVideos: LibraryVideoItem[] = [];

  for (const folder of videoFolders) {
    // 3. Fetch all indexed metadata for this folder from Rust store
    let metaList: VideoMetadata[] = [];
    try {
      metaList = await invoke<VideoMetadata[]>('get_folder_metadata', {
        folderId: folder.id,
      });
    } catch (_) {}

    const folderUi = uiState.folders[folder.id] ?? {
      isPinned: folder.isPinned,
      passwordHash: null,
      gridPosition: null,
      customName: null,
    };

    const totalSize = metaList.reduce((acc, m) => acc + (m.size ?? 0), 0);

    allFolders.push({
      id: folder.id,
      name: folderUi.customName ?? folder.name,
      path: folder.path,
      isPinned: folderUi.isPinned,
      videoCount: metaList.length,
      totalSize,
      totalSizeLabel: formatBytes(totalSize),
      avatars: [],          // reserved for future sharing
      passwordHash: folderUi.passwordHash,
      gridPosition: folderUi.gridPosition,
      lastUpdated: folder.lastUpdated,
    });

    // 4. Map each VideoMetadata → LibraryVideoItem
    for (const meta of metaList) {
      const vidUi = uiState.videos[meta.id] ?? {
        isStarred: false,
        type: deriveType(meta.duration),
        gridPosition: null,
      };

      allVideos.push({
        id: meta.id,
        title: meta.title ?? meta.filename,
        filename: meta.filename,
        file_path: meta.file_path,
        file_type: meta.file_type,
        duration: meta.duration,
        duration_label: formatDuration(meta.duration),
        resolution: meta.resolution,
        width: meta.width,
        height: meta.height,
        size: meta.size,
        size_label: formatBytes(meta.size),
        video_codec: meta.video_codec,
        audio_codec: meta.audio_codec,
        format: meta.format,
        thumbnail: meta.thumbnail,
        created_at: meta.created_at,
        updated_at: meta.updated_at,
        isStarred: vidUi.isStarred,
        folderId: folder.id,
        folderName: folderUi.customName ?? folder.name,
        type: deriveType(meta.duration, vidUi.type),
        gridPosition: vidUi.gridPosition,
      });
    }
  }

  // Sort pinned folders first, then by grid position
  allFolders.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return (a.gridPosition ?? 999) - (b.gridPosition ?? 999);
  });

  allVideos.sort((a, b) => (a.gridPosition ?? 999) - (b.gridPosition ?? 999));

  return { folders: allFolders, videos: allVideos };
};

// ─────────────────────────────────────────────────────────────
//  Mutation helpers (update UI state then persist)
// ─────────────────────────────────────────────────────────────

export const toggleVideoStar = async (
  videoId: string,
  current: boolean,
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    videos: {
      ...uiState.videos,
      [videoId]: {
        ...(uiState.videos[videoId] ?? { type: 'Video', gridPosition: null }),
        isStarred: !current,
      },
    },
  };
  await saveUIState(next);
  return next;
};

export const setVideoType = async (
  videoId: string,
  type: 'Video' | 'Short' | 'Archive',
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    videos: {
      ...uiState.videos,
      [videoId]: {
        ...(uiState.videos[videoId] ?? { isStarred: false, gridPosition: null }),
        type,
      },
    },
  };
  await saveUIState(next);
  return next;
};

export const setVideoGridPosition = async (
  videoId: string,
  position: number,
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    videos: {
      ...uiState.videos,
      [videoId]: {
        ...(uiState.videos[videoId] ?? { isStarred: false, type: 'Video' }),
        gridPosition: position,
      },
    },
  };
  await saveUIState(next);
  return next;
};

export const toggleFolderPin = async (
  folderId: number,
  current: boolean,
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    folders: {
      ...uiState.folders,
      [folderId]: {
        ...(uiState.folders[folderId] ?? { passwordHash: null, gridPosition: null, customName: null }),
        isPinned: !current,
      },
    },
  };
  await saveUIState(next);
  return next;
};

export const renameFolderFrontend = async (
  folderId: number,
  newName: string,
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    folders: {
      ...uiState.folders,
      [folderId]: {
        ...(uiState.folders[folderId] ?? { isPinned: false, passwordHash: null, gridPosition: null }),
        customName: newName.trim() || null,
      },
    },
  };
  await saveUIState(next);
  return next;
};

export const setFolderPassword = async (
  folderId: number,
  passwordHash: string | null,
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    folders: {
      ...uiState.folders,
      [folderId]: {
        ...(uiState.folders[folderId] ?? { isPinned: false, gridPosition: null, customName: null }),
        passwordHash,
      },
    },
  };
  await saveUIState(next);
  return next;
};

export const setFolderGridPosition = async (
  folderId: number,
  position: number,
  uiState: LibraryUIState
): Promise<LibraryUIState> => {
  const next: LibraryUIState = {
    ...uiState,
    folders: {
      ...uiState.folders,
      [folderId]: {
        ...(uiState.folders[folderId] ?? { isPinned: false, passwordHash: null, customName: null }),
        gridPosition: position,
      },
    },
  };
  await saveUIState(next);
  return next;
};

/** Move or copy a video to a different folder (UI-only — updates folderId in uiState) */
export const moveVideoToFolder = async (
  videoId: string,
  targetFolderId: number,
  uiState: LibraryUIState,
  allVideos: LibraryVideoItem[]
): Promise<LibraryUIState> => {
  // We don't change the file on disk; we update a folder assignment override
  const MOVE_KEY = `bv_video_folder_map`;
  const rawMap = await invoke<string | null>('store_get', { key: MOVE_KEY });
  const map: Record<string, number> = rawMap ? JSON.parse(rawMap) : {};
  map[videoId] = targetFolderId;
  await invoke('store_set', { key: MOVE_KEY, value: JSON.stringify(map) });
  return uiState; // caller refetches
};

// Simple deterministic hash for passwords (NOT cryptographic — UI lock only)
export const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16);
};