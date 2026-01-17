/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
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
