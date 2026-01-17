// src/core/security/user.installer.badge.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
// Requires 'uuid' package: npm install uuid @types/uuid
import { v4 as uuidv4 } from 'uuid'; 

// --- CONSTANTS AND CONFIGURATION ---

// Define the storage keys for localStorage
const LOCAL_STORAGE_DEVICE_KEY = 'zephyra_device_id';
const LOCAL_STORAGE_NUMBER_KEY = 'zephyra_user_number';

// Define the RPC endpoint using the environment variable (CRITICAL: Only define once)
const SUPABASE_RPC_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/register_install`;

// ----------------------------------------------------
// 1. DATA MANAGEMENT (Load/Save using localStorage)
// ----------------------------------------------------

interface LocalInstallerData {
    device_id: string | null;
    user_number: number | null;
}

/**
 * Loads installer data (device_id, user_number) from localStorage.
 */
function loadLocalData(): LocalInstallerData {
    // localStorage stores everything as strings, so we must parse the number.
    const userNumberStr = localStorage.getItem(LOCAL_STORAGE_NUMBER_KEY);
    
    return {
        device_id: localStorage.getItem(LOCAL_STORAGE_DEVICE_KEY),
        user_number: userNumberStr ? parseInt(userNumberStr) : null,
    };
}

/**
 * Saves installer data back to localStorage forever.
 */
function saveLocalData(data: LocalInstallerData): void {
    if (data.device_id) {
        localStorage.setItem(LOCAL_STORAGE_DEVICE_KEY, data.device_id);
    }
    if (data.user_number !== null) {
        localStorage.setItem(LOCAL_STORAGE_NUMBER_KEY, String(data.user_number));
    }
}


// ----------------------------------------------------
// 2. CORE LOGIC (Check, Register, Update)
// ----------------------------------------------------

/**
 * The main function to initialize and set the installer badge.
 */
export async function initializeInstallerBadge() {
    let localData = loadLocalData();

    // 1. Check if user_number already exists locally (badge is persistent)
    if (localData.user_number) {
        updateBadgeUI(localData.user_number);
        console.info(`Installer Badge loaded from localStorage: #${localData.user_number}`);
        return;
    }
    
    // 2. If no user_number, generate a unique ID if missing
    let device_id = localData.device_id || uuidv4();
    localData.device_id = device_id;
    
    // 3. Register with the backend service
    try {
        const response = await fetch(SUPABASE_RPC_ENDPOINT, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                // IMPORTANT: UNCOMMENT THIS LINE if you are getting a 401 error:
                 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY 
            },
            // We only send the device_id to the RPC function
            body: JSON.stringify({ input_device_id: device_id }),
        });

        if (!response.ok) {
            throw new Error(`Backend registration failed: ${response.statusText}`);
        }

        const result: { user_number: number } = await response.json();
        
        // 4. Update local data and save (Crucial for persistence)
        localData.user_number = result.user_number;
        saveLocalData(localData);

        // 5. Update UI
        updateBadgeUI(localData.user_number);
        console.log(`New Installer registered: #${localData.user_number}`);

    } catch (e) {
        console.error("Failed to register installer ID with backend. Badge hidden.", e);
        // Fallback: Hide the badge if the service is unreachable.
        updateBadgeUI(null); 
    }
}

// ----------------------------------------------------
// 3. UI UPDATE (Your chosen design implementation)
// ----------------------------------------------------

/**
 * Updates the badge UI with the assigned installer number.
 */
function updateBadgeUI(userNumber: number | null) {
    // Use your existing badge ID and class
    const badgeEl = document.getElementById("userLegacyBadge");
    const countEl = badgeEl?.querySelector(".badge-count");
    
    if (badgeEl && countEl && userNumber !== null) {
        countEl.textContent = String(userNumber);
        // This line makes the badge visible.
        badgeEl.style.display = 'inline-flex'; 
    } else if (badgeEl) {
        // Hide the badge if the number is not available
        badgeEl.style.display = 'none'; 
    }
}