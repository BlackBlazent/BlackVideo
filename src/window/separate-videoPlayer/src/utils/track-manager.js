/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 */

'use strict';

const isTauri = typeof window !== 'undefined' && window.__TAURI_IPC__ !== undefined;

/**
 * Manages subtitle/caption tracks for video player
 * Supports: SRT, VTT, ASS, SSA
 */
export class TrackManager {
    constructor(videoElement) {
        this.videoElement = videoElement;
        this.trackElement = null;
        this.parser = null;
        
        this.init();
    }

    init() {
        // Get or create track element
        this.trackElement = this.videoElement.querySelector('track');
        
        if (!this.trackElement) {
            this.trackElement = document.createElement('track');
            this.trackElement.kind = 'subtitles';
            this.trackElement.label = 'Default';
            this.trackElement.srclang = 'en';
            this.videoElement.appendChild(this.trackElement);
        }

        console.log('✓ Track manager initialized');
    }

    /**
     * Load subtitle file from file system
     */
    async loadSubtitleFile() {
        if (!isTauri) {
            this.loadSubtitleFileWeb();
            return;
        }

        try {
            const { open } = await import('https://esm.sh/@tauri-apps/plugin-dialog@2');
            const { readTextFile } = await import('https://esm.sh/@tauri-apps/plugin-fs@2');
            
            const selected = await open({
                multiple: false,
                filters: [{
                    name: 'Subtitle Files',
                    extensions: ['srt', 'vtt', 'ass', 'ssa', 'sub']
                }]
            });

            if (!selected) return;

            // Security: Validate path
            if (selected.includes('..')) {
                throw new Error('Invalid file path');
            }

            // Read subtitle file
            const content = await readTextFile(selected);
            const ext = selected.split('.').pop().toLowerCase();

            // Convert to WebVTT if needed
            const vttContent = await this.convertToVTT(content, ext);

            // Create blob URL
            const blob = new Blob([vttContent], { type: 'text/vtt' });
            const url = URL.createObjectURL(blob);

            // Set track source
            this.trackElement.src = url;
            this.trackElement.label = selected.split('/').pop().split('\\').pop();
            this.trackElement.mode = 'showing';

            console.log('✓ Subtitle loaded:', selected);

        } catch (error) {
            console.error('❌ Failed to load subtitle:', error);
            alert(`Failed to load subtitle: ${error.message}`);
        }
    }

    /**
     * Web fallback for loading subtitles
     */
    loadSubtitleFileWeb() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.srt,.vtt,.ass,.ssa,.sub';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const content = await file.text();
                const ext = file.name.split('.').pop().toLowerCase();
                
                const vttContent = await this.convertToVTT(content, ext);
                const blob = new Blob([vttContent], { type: 'text/vtt' });
                const url = URL.createObjectURL(blob);

                this.trackElement.src = url;
                this.trackElement.label = file.name;
                this.trackElement.mode = 'showing';

                console.log('✓ Subtitle loaded:', file.name);
            } catch (error) {
                console.error('❌ Failed to load subtitle:', error);
            }
        };
        
        input.click();
    }

    /**
     * Convert subtitle format to WebVTT
     * Uses subsrt library (to be installed via npm)
     */
    async convertToVTT(content, format) {
        if (format === 'vtt') {
            return content;
        }

        // For SRT conversion (basic implementation)
        if (format === 'srt') {
            return this.srtToVtt(content);
        }

        // TODO: For ASS/SSA, use subsrt or subtitle.js library
        // This requires: npm install subsrt
        console.warn(`Format ${format} not fully supported yet, using as-is`);
        return content;
    }

    /**
     * Basic SRT to VTT converter
     */
    srtToVtt(srtContent) {
        let vtt = 'WEBVTT\n\n';
        
        // Replace comma with dot in timestamps
        vtt += srtContent.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
        
        return vtt;
    }

    /**
     * Get all available tracks
     */
    getTracks() {
        return Array.from(this.videoElement.textTracks);
    }

    /**
     * Set active track by index
     */
    setActiveTrack(index) {
        const tracks = this.videoElement.textTracks;
        
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = i === index ? 'showing' : 'hidden';
        }
    }

    /**
     * Disable all tracks
     */
    disableAllTracks() {
        const tracks = this.videoElement.textTracks;
        
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].mode = 'hidden';
        }
        
        console.log('✓ All subtitles disabled');
    }
}