/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// language.list.ts

export interface LanguageItem {
    name: string;
    code: string;
    flag: string;
  }
  
  export const languages: LanguageItem[] = [
    { name: 'Armenia', code: 'hy', flag: '/assets/locales/armenia.png' },
    { name: 'Canada', code: 'ca', flag: '/assets/locales/canada.png' },
    { name: 'English (default)', code: 'en', flag: '/assets/locales/us.png' },
    { name: 'Estonia', code: 'ee ', flag: '/assets/locales/estonia.png' },
    { name: 'Finland', code: 'fi', flag: '/assets/locales/finland.png' },
    { name: 'Germany', code: 'de', flag: '/assets/locales/germany.png' },
    { name: 'India', code: 'hi', flag: '/assets/locales/india.png' },
    { name: 'Japan', code: 'jp', flag: '/assets/locales/japan.png' },
    { name: 'Netherlands', code: 'nl', flag: '/assets/locales/netherlands.png' },
    { name: 'Russia', code: 'ru', flag: '/assets/locales/russia.png' },
    { name: 'Singapore', code: 'sg', flag: '/assets/locales/singapore.png' },
    { name: 'South Korea', code: 'kr', flag: '/assets/locales/south-korea.png' },
    { name: 'Sweden', code: 'se', flag: '/assets/locales/sweden.png' },
  ].sort((a, b) => a.name.localeCompare(b.name));
  