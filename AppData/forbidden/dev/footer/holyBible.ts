/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
const verses = [
    "matthew 21:22",
    "john 3:16",
    "psalms 23:1",
    "romans 8:28",
    "proverbs 3:5",
  ];
  
  export async function updateScriptureCarousel(intervalMs = 10000) {
    const scriptureEl = document.querySelector(".scripture") as HTMLDivElement;
    if (!scriptureEl) return;
  
    // Create tooltip div for popup overlay
    let tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0,0,0,0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "14px";
    tooltip.style.maxWidth = "300px";
    tooltip.style.pointerEvents = "none"; // so it won't block mouse events
    tooltip.style.visibility = "hidden";
    tooltip.style.zIndex = "1000";
    tooltip.style.transition = "opacity 0.3s ease";
    tooltip.style.opacity = "0";
  
    document.body.appendChild(tooltip);
  
    let index = 0;
    let fullMessage = "";
    let currentReference = ""; // store current verse reference like "Matthew 21:22"
  
    async function fetchAndUpdate(verse: string) {
      try {
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(verse)}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
        const data = await response.json();
  
        if (data.text && data.reference) {
          fullMessage = `${data.reference}: ${data.text.trim()}`;
          currentReference = data.reference;
          scriptureEl.textContent = currentReference;
        } else {
          fullMessage = "Verse not found.";
          scriptureEl.textContent = fullMessage;
        }
      } catch (error) {
        console.error("Failed to fetch scripture:", error);
        fullMessage = "Failed to load scripture.";
        scriptureEl.textContent = fullMessage;
      }
    }
  
    // Show tooltip on hover
    scriptureEl.addEventListener("mouseenter", (e) => {
      tooltip.textContent = fullMessage;
      tooltip.style.visibility = "visible";
      tooltip.style.opacity = "1";
      positionTooltip(e);
    });
  
    scriptureEl.addEventListener("mousemove", (e) => {
      positionTooltip(e);
    });
  
    scriptureEl.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
      setTimeout(() => {
        tooltip.style.visibility = "hidden";
      }, 300);
    });
  
    function positionTooltip(e: MouseEvent) {
      const padding = 10;
      let x = e.pageX + padding;
      let y = e.pageY + padding;
  
      if (x + tooltip.offsetWidth > window.pageXOffset + window.innerWidth) {
        x = e.pageX - tooltip.offsetWidth - padding;
      }
  
      if (y + tooltip.offsetHeight > window.pageYOffset + window.innerHeight) {
        y = e.pageY - tooltip.offsetHeight - padding;
      }
  
      tooltip.style.left = x + "px";
      tooltip.style.top = y + "px";
    }
  
    // Initial fetch
    await fetchAndUpdate(verses[index]);
  
    // Change verse every intervalMs
    setInterval(() => {
      index = (index + 1) % verses.length;
      fetchAndUpdate(verses[index]);
    }, intervalMs);
  }
  