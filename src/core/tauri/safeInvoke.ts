// src/core/tauri/safeInvoke.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { invoke } from '@tauri-apps/api/core';

/**
 * A safe, generic wrapper for invoking Tauri commands.
 * It provides basic error handling and types the payload.
 * * @param command The name of the Rust command to call (e.g., "zephyra_load_user_config").
 * @param payload The arguments to pass to the Rust command.
 * @returns The result of the Rust command, or throws an error.
 */
export async function safeInvoke<T>(
    command: string,
    payload: Record<string, unknown> = {}
): Promise<T> {
    try {
        // The invoke command returns the result of the Rust function call
        const result = await invoke<T>(command, payload);
        return result;
    } catch (error) {
        // Log the error using your diagnostics layer (if it's already set up)
        console.error(`[TAURI INVOKE ERROR] Command: ${command}`, error);
        
        // Rethrow the error to be caught by the calling function (e.g., loadLocalData)
        throw new Error(`Tauri command failed: ${command}`);
    }
}