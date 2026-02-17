/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// Server-side script that blocks countries based on IP geolocation.
/*
import { BAN_SETTINGS } from '../../../../config/ban-config';

export const checkIsCountryBanned = (countryCode) => {
  return BAN_SETTINGS.bannedCountryCodes.includes(countryCode);
};
*/
import { BAN_SETTINGS } from '../../../../config/ban-config';

export const checkIsCountryBanned = (countryCode) => {
  // TEMPORARY: If we are in development mode, ignore the ban
  // This allows you to develop without modifying the country list
  if (process.env.NODE_ENV === 'development') {
    console.log("Bypass active: Development mode detected.");
    return false; 
  }

  return BAN_SETTINGS.bannedCountryCodes.includes(countryCode);
};