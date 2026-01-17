/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
{/*
export function updateDaysPlayedDuration(): void {
    const storageKey = "blackvideo.daysUsed";
    const display = document.getElementById("daysPlayedDuration");
    if (!display) return;
  
    const today = new Date();
    const todayKey = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const currentYear = today.getFullYear();
  
    // Load previous usage from localStorage
    const data = localStorage.getItem(storageKey);
    let usedDays: Record<string, true> = data ? JSON.parse(data) : {};
  
    // Add today if not already present
    if (!usedDays[todayKey]) {
      usedDays[todayKey] = true;
      localStorage.setItem(storageKey, JSON.stringify(usedDays));
    }
  
    // Count how many days belong to this year
    const usedThisYear = Object.keys(usedDays).filter((d) =>
      d.startsWith(currentYear.toString())
    );
  
    // Update display
    display.textContent = `${usedThisYear.length} days / 365 days`;
  }
  */}


  /**
 * Calculates and displays the current day of the year (1 to 365/366).
 * This function does NOT track historical usage; it only calculates elapsed days.
 */
export function updateDaysPlayedDuration(): void {
    const display = document.getElementById("daysPlayedDuration");
    if (!display) {
        console.warn('UI element with ID "daysPlayedDuration" not found.');
        return;
    }

    const today = new Date();
    const currentYear = today.getFullYear();

    // 1. Get the date for the start of the current year (January 1st, 00:00:00)
    const startOfYear = new Date(currentYear, 0, 1);

    // 2. Calculate the difference in milliseconds between today and the start of the year
    // The getTime() method returns the number of milliseconds since January 1, 1970
    const timeDifference = today.getTime() - startOfYear.getTime();

    // 3. Convert milliseconds difference to days
    // 1000ms * 60s * 60m * 24h = milliseconds in a day
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    
    // Math.floor ensures we get a whole number of days passed.
    // Adding 1 because the current day is Day 1, not Day 0.
    const currentDayOfYear = Math.floor(timeDifference / millisecondsInDay) + 1;

    // 4. Determine total days in the current year (365 or 366 for a leap year)
    const isLeap = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
    const totalDaysInYear = isLeap ? 366 : 365;

    // 5. Update display
    display.textContent = `${currentDayOfYear} days / ${totalDaysInYear} days`;
    
    // Optional: Log the result for verification
    console.log(`Usage Display: ${currentDayOfYear} days / ${totalDaysInYear} days`);
}