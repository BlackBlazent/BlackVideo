/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
export async function updateUserLocationDetails() {
    const continentEl = document.querySelector(".user-continental-location") as HTMLDivElement;
    const codeEl = document.querySelector(".continental-number-code-and-country-code") as HTMLDivElement;
    const ipEl = document.querySelector(".apiIpAddress") as HTMLDivElement;
  
    if (!continentEl || !codeEl || !ipEl) return;
  
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
  
      const rawContinent = data.continent_name || "";
      const countryCode = data.country || "??";
      const callingCode = data.country_calling_code || "+?";
      const ipAddress = data.ip || "0.0.0.0";
  
      // Manual continent mapping as fallback
      const continentMap: { [key: string]: string } = {
        // Asia
        PH: "Asia", IN: "Asia", CN: "Asia", JP: "Asia", KR: "Asia", SG: "Asia", MY: "Asia",
        // Europe
        RU: "Europe", FR: "Europe", DE: "Europe", IT: "Europe", GB: "Europe", ES: "Europe",
        // North America
        US: "North America", CA: "North America", MX: "North America",
        // South America
        BR: "South America", AR: "South America", CO: "South America",
        // Africa
        NG: "Africa", ZA: "Africa", EG: "Africa", KE: "Africa",
        // Oceania
        AU: "Oceania", NZ: "Oceania",
      };
  
      const fallbackContinent = continentMap[countryCode] || "Unknown";
      const finalContinent = rawContinent || fallbackContinent;
  
      continentEl.textContent = finalContinent.toUpperCase();
      codeEl.textContent = `${callingCode} ${countryCode}`;
      ipEl.textContent = ipAddress;
    } catch (err) {
      console.error("Failed to fetch location data:", err);
      continentEl.textContent = "UNKNOWN";
      codeEl.textContent = "+? ??";
      ipEl.textContent = "0.0.0.0";
    }
  }
  