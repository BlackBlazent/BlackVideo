/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// hidden.mini.playback.script.ts

import { VideoTheaterStage } from '../Video.Theater.Stage';

let castStream: MediaStream | null = null;
let castWindow: Window | null = null;
const CAST_BUTTON_ID = "screen-cast-util";
const ACTIVE_CLASS = "active-cast"; // For visual status feedback

/**
 * Initializes the Screencast functionality by injecting CSS styles.
 * This should be called once on component mount.
 */
export function initScreenCast(): void {
    injectCastStyles();
    // The event listener logic is moved to toggleScreenCast
}

/**
 * The primary handler for the Screencast button click event.
 * This function will be passed directly to the React button's onClick prop.
 */
export async function toggleScreenCast(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    const button = event.currentTarget; // The <button> element

    if (castStream) {
        stopCast();
    } else {
        const videoStage = VideoTheaterStage.getInstance();
        const videoElement = videoStage.getVideoElement();
        if (!videoElement) {
            console.error("Video element not available from VideoTheaterStage.");
            return;
        }
        await startCast(videoElement, button);
    }
}


/* ---------------- START CAST (Mode A: getDisplayMedia) ---------------- */

async function startCast(_video: HTMLVideoElement, button: HTMLElement): Promise<void> {
    try {
        // 1. Request screen/window/tab stream
        castStream = await navigator.mediaDevices.getDisplayMedia({
            video: { frameRate: 60, displaySurface: "window" }, // Suggest 'window' first
            audio: true
        });

        if (!castStream) return;

        // 2. Open receiver window (This mimics casting to an external display)
        castWindow = window.open(
            "",
            "ZephyraCastReceiver",
            "width=1280,height=720,scrollbars=no,resizable=yes"
        );

        if (!castWindow) {
            // This is often blocked by pop-up blockers.
            console.error("Popup window blocked. Cannot start cast receiver.");
            stopCast();
            return;
        }

        // 3. Write receiver HTML
        castWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Zephyra Cast Receiver</title>
            </head>
            <body style="margin:0;background:black;display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden;">
                <video id="cast-video" autoplay playsinline style="width:100%;height:100%;object-fit:contain;"></video>
            </body>
            </html>
        `);
        castWindow.document.close();

        // Wait for DOM to load in the new window before accessing elements
        castWindow.onload = () => {
            const receiverVideo = castWindow!.document.getElementById(
                "cast-video"
            ) as HTMLVideoElement;

            // 4. Attach stream and play
            receiverVideo.srcObject = castStream;
            receiverVideo.play().catch(e => console.error("Receiver playback error:", e));
        };
        
        // 5. Set up auto-stop listener and UI feedback
        castStream.getTracks().forEach(track => {
            // Stop stream if user clicks 'Stop sharing' via OS dialog
            track.onended = stopCast;
        });

        button.classList.add(ACTIVE_CLASS);

    } catch (err) {
        console.error("Screen cast failed (user denied or error):", err);
        stopCast(); // Ensure state is reset if capture fails
    }
}

/* ---------------- STOP CAST ---------------- */

export function stopCast(): void {
    // The button element might not be directly available, we must query by ID
    const btn = document.getElementById(CAST_BUTTON_ID)?.parentElement;

    // 1. Stop all tracks in the MediaStream
    castStream?.getTracks().forEach(track => track.stop());
    castStream = null;

    // 2. Close the receiver window
    if (castWindow && !castWindow.closed) {
        castWindow.close();
    }
    castWindow = null;
    
    // 3. Update UI feedback
    if (btn) {
        btn.classList.remove(ACTIVE_CLASS);
    }
    console.log("Screencast stopped.");
}

/* ---------------- CSS INJECTION ---------------- */

function injectCastStyles(): void {
    const styleId = "screencast-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
        /* Basic animation to indicate active casting */
        .vid-screen-cast-util.active-cast {
            filter: drop-shadow(0 0 5px #4285F4) !important; 
            animation: pulse-cast 1s infinite alternate;
        }
        @keyframes pulse-cast {
            from { opacity: 1; }
            to { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}