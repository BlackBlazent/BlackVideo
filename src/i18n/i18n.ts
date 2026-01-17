// src/i18n/i18n.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// --- TAURI API SETUP (V2 Plugin Compliant) ---
let locale: any = undefined;
if (typeof window !== 'undefined' && window.__TAURI_IPC__) {
    // 🟢 FIX FOR TAURI V2: Use the dedicated plugin package.
    import('@tauri-apps/plugin-os').then(module => { 
        locale = module.locale;
    }).catch(() => {
        // This warning is crucial if the Rust plugin isn't initialized
        console.warn("Tauri OS locale API not available. Ensure @tauri-apps/plugin-os is installed and initialized in main.rs.");
    });
}
// ---------------------------------------------

// Assuming your current paths are relative to where the file is eventually bundled
import en from "../../AppData/app/locales/en.json";
import hy from "../../AppData/app/locales/am.json";
import hi from "../../AppData/app/locales/in.json";
import ru from "../../AppData/app/locales/ru.json"; 
import sv from "../../AppData/app/locales/sv.json";


// List of supported language codes to check against Tauri's detection
const supportedLanguages = ['en', 'hy', 'hi', 'ru', 'sv'];
const DEFAULT_LANGUAGE = "en";
const STORAGE_KEY = "blackvideo-lang";


/**
 * 🌐 Attempts to detect the OS language using the Tauri API.
 * Falls back to the default language if not supported.
 */
async function detectLanguage(): Promise<string> {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && supportedLanguages.includes(savedLang)) {
        console.log(`i18n: Using saved language: ${savedLang}`);
        return savedLang;
    }

    // Check if the locale function loaded from the plugin
    if (locale) {
        try {
            const osLocale = await locale(); // e.g., "en-US", "fil-PH"
            const langCode = osLocale?.split("-")[0].toLowerCase();
            
            if (langCode && supportedLanguages.includes(langCode)) {
                console.log(`i18n: Using detected OS language: ${langCode}`);
                return langCode;
            }
        } catch (error) {
            console.warn("i18n: Failed to detect OS locale via Tauri Plugin.", error);
        }
    }
    
    console.log(`i18n: Falling back to default language: ${DEFAULT_LANGUAGE}`);
    return DEFAULT_LANGUAGE;
}

/**
 * Initializes i18next and sets the initial language based on preference or OS detection.
 */
async function initI18n() {
    const initialLang = await detectLanguage();

    i18n
      .use(initReactI18next)
      .init({
        resources: {
          en: { translation: en },
          hy: { translation: hy },
          hi: { translation: hi },
          ru: { translation: ru },
          sv: { translation: sv }
        },
        // Set initial language from the detection sequence
        lng: initialLang,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
          escapeValue: false
        }
      });
}

// Execute the async initialization function
initI18n();

/**
 * Reusable function to change the language and persist the choice.
 */
export const changeAndPersistLanguage = (newLang: string) => {
    if (i18n.language !== newLang) {
        i18n.changeLanguage(newLang);
        localStorage.setItem(STORAGE_KEY, newLang);
        console.log(`Language changed and persisted to: ${newLang}`);
    }
}

export default i18n;