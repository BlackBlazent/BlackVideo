// language.list.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export interface LanguageItem {
    name: string;
    code: string;
    flag: string;
  }
  
  export const languages: LanguageItem[] = [
    { name: 'Armenia', code: 'hy', flag: '/assets/locales/armenia.png' },
    { name: 'English (default)', code: 'en', flag: '/assets/locales/us.png' },
    { name: 'India', code: 'hi', flag: '/assets/locales/india.png' },
    { name: 'Russia', code: 'ru', flag: '/assets/locales/russia.png' },
    { name: 'Sweden', code: 'sv', flag: '/assets/locales/sweden.png' },
  ].sort((a, b) => a.name.localeCompare(b.name));
  