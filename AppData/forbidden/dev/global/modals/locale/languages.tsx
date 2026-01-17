// languages.tsx (Final, Cleaned-up Version)
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; // 🧩 Get i18n instance
import { languages, LanguageItem } from './langauge.select';
// Adjust the relative path below if needed
import { changeAndPersistLanguage } from '../../../../../../src/i18n/i18n'; 

export default function LanguagePopup() {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement | null>(null);

    // Get current language from i18n instance (used for 'selected' class)
    const currentLangCode = i18n.language;

    // ❌ REMOVED: The useEffect that manually set document.getElementById('languagePreview').innerText
    // This is now handled reactively by the parent component (App.tsx) using useTranslation().
    
    const handleSelect = useCallback((lang: LanguageItem) => {
        // 1. Change language and persist selection
        changeAndPersistLanguage(lang.code); 
        // 2. Close popup
        setIsOpen(false);
    }, []);

    // Effect for handling DOM interaction (outside click, position, toggle)
    useEffect(() => {
        // We must target the parent element wrapper to capture the click events
        const langSelectContainer = document.querySelector('.lang-select');
        const langButton = langSelectContainer?.querySelector('button');
        
        if (!langSelectContainer || !langButton) return;

        const toggleDropdown = () => setIsOpen(prev => !prev);
        // Attach the click listener to the parent container
        langSelectContainer.addEventListener('click', toggleDropdown);

        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                !(langSelectContainer as HTMLElement).contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const updatePosition = () => {
            if (!popupRef.current || !langSelectContainer) return;
            const rect = (langSelectContainer as HTMLElement).getBoundingClientRect();
            // Position the popup absolutely relative to the viewport
            popupRef.current.style.position = 'absolute';
            popupRef.current.style.top = `${rect.bottom + window.scrollY}px`;
            popupRef.current.style.left = `${rect.left + window.scrollX}px`;
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        // Initial position update
        updatePosition(); 

        return () => {
            langSelectContainer.removeEventListener('click', toggleDropdown);
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, []);

    // 🟢 ARIA EXPANDED FIX: Set the aria-expanded attribute on the button
    // This runs every time 'isOpen' changes.
    useEffect(() => {
        const langButton = document.querySelector('.lang-select button');
        if (langButton) {
            // Set the attribute based on the boolean state
            langButton.setAttribute('aria-expanded', String(isOpen));
        }
    }, [isOpen]);


    return isOpen ? (
        <div 
            id="appLanguageSelection" 
            className="language-popup" 
            ref={popupRef}
            // Use zIndex to ensure it appears over other elements
            style={{ zIndex: 1000 }} 
        >
            {languages.map(lang => (
                <div 
                    key={lang.code} 
                    // Add a 'selected' class for styling the currently active language
                    className={`language-option ${lang.code === currentLangCode ? 'selected' : ''}`}
                    onClick={() => handleSelect(lang)}
                >
                    <img className="flag-icon" src={lang.flag} alt={lang.name} />
                    <span>{lang.name}</span>
                </div>
            ))}
        </div>
    ) : null;
}