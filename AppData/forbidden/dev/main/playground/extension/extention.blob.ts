/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

window.addEventListener('DOMContentLoaded', () => {
    // Inject Lucide Icon Script
    if (!document.getElementById('lucide-icons-script')) {
        const script = document.createElement('script');
        script.id = 'lucide-icons-script';
        script.src = 'https://unpkg.com/lucide@latest';
        script.onload = () => (window as any).lucide.createIcons();
        document.head.appendChild(script);
    }

    const waitForButton = setInterval(() => {
      const addBtn = document.getElementById('extension-add-btn');
      if (!addBtn) return;
  
      clearInterval(waitForButton);
  
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div id="extension-popup-ui" class="extension-popup-ui hidden">
          <div class="popup-header">
            <i data-lucide="puzzle" class="header-icon"></i>
            <h3>Add Extension</h3>
          </div>
          
          <div class="popup-body">
            <label class="upload-btn">
              <i data-lucide="file-json" class="btn-icon"></i>
              <span>Upload package.json</span>
              <input type="file" accept="application/JSON" id="upload-package-json" hidden />
            </label>
            
            <div class="separator"><span>OR</span></div>

            <button id="goto-store-btn">
              <i data-lucide="shopping-bag" class="btn-icon"></i>
              Install from Store
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(wrapper);
  
      const popup = document.getElementById('extension-popup-ui') as HTMLElement;
      const uploadInput = document.getElementById('upload-package-json') as HTMLInputElement;
      const storeBtn = document.getElementById('goto-store-btn') as HTMLButtonElement;
  
      const style = document.createElement('style');
      style.textContent = `
        .hidden { display: none !important; }
        
        .extension-popup-ui {
          position: fixed;
          width: 240px;
          background: var(--background-dark);
          background-image: linear-gradient(rgba(255,255,255,0.03), rgba(255,255,255,0.03));
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-medium);
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
          z-index: 9999;
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
        }

        .popup-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 8px;
        }

        .header-icon { width: 18px; color: var(--primary-blue); }

        .extension-popup-ui h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }

        .popup-body { display: flex; flex-direction: column; gap: 8px; }

        .upload-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: var(--glass-bg);
          border: 1px solid var(--border-medium);
          cursor: pointer;
          border-radius: 8px;
          font-size: 12px;
          transition: all 0.2s ease;
        }

        .upload-btn:hover {
          background: var(--hover-bg);
          border-color: var(--primary-blue);
        }

        .btn-icon { width: 16px; height: 16px; opacity: 0.8; }

        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 8px 0;
          color: var(--text-muted);
          font-size: 10px;
        }

        .separator::before, .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-subtle);
        }

        .separator span { padding: 0 8px; }

        #goto-store-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px;
          width: 100%;
          background: var(--primary-blue);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: filter 0.2s;
        }

        #goto-store-btn:hover {
          filter: brightness(1.1);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }
      `;
      document.head.appendChild(style);
  
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rect = addBtn.getBoundingClientRect();
        const popupWidth = 240;
        const spaceRight = window.innerWidth - rect.right;
        const showOnLeft = spaceRight < popupWidth + 10;
  
        if (showOnLeft) {
          popup.style.left = `${rect.left - popupWidth - 12}px`;
        } else {
          popup.style.left = `${rect.right + 12}px`;
        }
  
        popup.style.top = `${rect.top}px`;
        popup.classList.toggle('hidden');
        
        // Refresh icons whenever shown
        if ((window as any).lucide) (window as any).lucide.createIcons();
      });
  
      document.addEventListener('click', (e) => {
        if (!popup.contains(e.target as Node) && !addBtn.contains(e.target as Node)) {
          popup.classList.add('hidden');
        }
      });
  
      uploadInput.addEventListener('change', () => {
        const file = uploadInput.files?.[0];
        if (file && file.name === 'package.json') {
          const reader = new FileReader();
          reader.onload = () => {
            try {
              const data = JSON.parse(reader.result as string);
              console.log('Extension Metadata:', data);
              alert(`Extension Loaded: ${data.name} by ${data.author}`);
            } catch (err) {
              alert('Invalid JSON structure in package.json');
            }
          };
          reader.readAsText(file);
        } else {
          alert('Please select a valid package.json file.');
        }
      });
  
      storeBtn.addEventListener('click', () => {
        alert('Redirecting to extension store...');
      });
    }, 100);
});