/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Utility functions for working with IP addresses.

export const fetchPublicIP = async () => {
  try {
    // Using a free API to get public IP and Geo info
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip,
      countryCode: data.country_code, // e.g., "PH"
      countryName: data.country_name
    };
  } catch (error) {
    console.error("Failed to fetch IP geolocation", error);
    return null;
  }
};