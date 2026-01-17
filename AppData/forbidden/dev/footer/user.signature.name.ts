// footer.username.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export interface User {
    username?: string;
    firstName?: string;
    isLoggedIn: boolean;
  }
  
  /**
   * Extracts the first name from a username
   * Assumes username follows patterns like "JohnDoe", "john.doe", "john_doe", etc.
   */
  export const extractFirstName = (username: string): string => {
    if (!username) return '';
    
    // Handle different username formats
    let firstName = username;
    
    // Split by common separators (dot, underscore, hyphen)
    if (username.includes('.')) {
      firstName = username.split('.')[0];
    } else if (username.includes('_')) {
      firstName = username.split('_')[0];
    } else if (username.includes('-')) {
      firstName = username.split('-')[0];
    } else {
      // Handle camelCase or PascalCase (extract first word)
      const match = username.match(/^[a-zA-Z]+/);
      firstName = match ? match[0] : username;
    }
    
    // Capitalize first letter and lowercase the rest
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };
  
  /**
   * Gets the display name for the user (React-friendly version)
   */
  export const getUserDisplayName = (user: User | null): string => {
    if (!user || !user.isLoggedIn) {
      return 'Guest';
    }
    
    // Use firstName if available, otherwise extract from username
    if (user.firstName) {
      return user.firstName;
    }
    
    if (user.username) {
      return extractFirstName(user.username);
    }
    
    return 'Guest';
  };
  
  /**
   * Gets CSS classes for the user name element
   */
  export const getUserNameClasses = (user: User | null): string => {
    const baseClass = 'user-name';
    const statusClass = user?.isLoggedIn ? 'logged-in' : 'guest';
    return `${baseClass} ${statusClass}`;
  };