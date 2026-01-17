/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import fs from "fs";
interface PluginManifest {
    name: string;
    author: string;
    icon: string;
    entry: string;
  }
  
  const EXTENSION_DIR = "/extensions";
  
  export async function loadExtensions() {
    const folders = fs.readdirSync(EXTENSION_DIR); // pseudo-code
  
    for (const folder of folders) {
      const manifestPath = `${EXTENSION_DIR}/${folder}/manifest.json`;
      const manifest: PluginManifest = await fetch(manifestPath).then(res => res.json());
  
      // Dynamically create a button
      const button = document.createElement("button");
      button.id = `pluginCard-port`;
      button.className = `extension-card ${manifest.name} ${manifest.author}`;
      button.innerHTML = `
        <i class="extensionToggle">
          <img class="extensionProfile" src="${EXTENSION_DIR}/${folder}/${manifest.icon}" />
        </i>
      `;
      
      button.onclick = async () => {
        const script = await import(`${EXTENSION_DIR}/${folder}/${manifest.entry}`);
        if (script.default) script.default(); // Call main entry
      };
  
      document.getElementById("extension-container")?.appendChild(button);
    }
  }
  