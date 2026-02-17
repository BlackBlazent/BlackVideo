/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { v4 as uuidv4 } from 'uuid'; 

const LOCAL_STORAGE_DEVICE_KEY = 'zephyra_device_id';
const LOCAL_STORAGE_NUMBER_KEY = 'zephyra_user_number';
const SUPABASE_RPC_ENDPOINT = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/register_install`;

interface LocalInstallerData {
    device_id: string | null;
    user_number: number | null;
}

// --- HELPER FUNCTIONS ---

function loadLocalData(): LocalInstallerData {
    const userNumberStr = localStorage.getItem(LOCAL_STORAGE_NUMBER_KEY);
    return {
        device_id: localStorage.getItem(LOCAL_STORAGE_DEVICE_KEY),
        user_number: userNumberStr ? parseInt(userNumberStr) : null,
    };
}

function saveLocalData(data: LocalInstallerData): void {
    if (data.device_id) {
        localStorage.setItem(LOCAL_STORAGE_DEVICE_KEY, data.device_id);
    }
    if (data.user_number !== null) {
        localStorage.setItem(LOCAL_STORAGE_NUMBER_KEY, String(data.user_number));
    }
}

// --- CORE LOGIC ---

/**
 * Initializes the installer badge.
 * Instead of touching the DOM, it returns the number to the React component.
 */
export async function initializeInstallerBadge(): Promise<number | null> {
    let localData = loadLocalData();

    // 1. If we already have the number locally, return it immediately
    if (localData.user_number) {
        return localData.user_number;
    }
    
    // 2. Generate or use existing device_id
    let device_id = localData.device_id || uuidv4();
    localData.device_id = device_id;
    
    try {
        const response = await fetch(SUPABASE_RPC_ENDPOINT, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY 
            },
            body: JSON.stringify({ input_device_id: device_id }),
        });

        if (!response.ok) throw new Error(`Registration failed: ${response.statusText}`);

        const result = await response.json();
        
        // 3. Save to local storage for future refreshes
        localData.user_number = result.user_number;
        saveLocalData(localData);

        // 4. Return the number to be used by React useState
        return result.user_number;

    } catch (e) {
        console.error("Supabase Error:", e);
        return null; 
    }
}