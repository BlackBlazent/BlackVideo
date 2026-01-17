// zephyrahAI.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
// Frontend AI manager for Zephyra — Web + Tauri safe

// -------------------- SAFE TAURI INVOKE (TAURI v2 + WEB SAFE) --------------------
let safeInvoke: any = async () => {
    throw new Error("Tauri not available");
};

(async () => {
    try {
        const mod = await import("@tauri-apps/api/core");
        safeInvoke = mod.invoke;
        console.info("Tauri detected: invoke bound");
    } catch {
        console.warn("Web mode: Tauri not available");
    }
})();

// ---------------------------- Imports ----------------------------
import { VideoTheaterStage } from "../../forbidden/dev/main/playground/Video.Theater.Stage";

// ---------------------------- Types ----------------------------
export type ProviderKind =
    | "openai"
    | "ollama"
    | "localai"
    | "lmstudio"
    | "deepseek"
    | "anthropic"
    | "custom";

export interface ProviderInfo {
    kind: ProviderKind;
    url?: string;
    name: string;
    healthy?: boolean;
    info?: string;
}

export interface TranscriptSegment {
    start: number;
    end: number;
    text: string;
}

// Interface for chat history entries
export interface ChatMessage {
    kind: "user" | "ai";
    text: string;
    timestamp?: number;
}

// --- Placeholder for ENV access (MUST be implemented in your backend/Tauri) ---
// In a real frontend/Tauri app, these would come from the backend or a global script.
// Assuming your Tauri setup injects these from the .env file.
const env = {
    OLLAMA_URL: "http://localhost:11434",
    LOCALAI_URL: "http://localhost:8080",
    LMSTUDIO_URL: "http://localhost:3000",
    ZEPHYRA_DEFAULT_PROVIDER: "openai",
    COST_PER_1K_TOKENS_OPENAI: "0.06",
    COST_PER_1K_TOKENS_DEEPSEEK: "0.03",
    // DeepSeek and Anthropic API keys presence implies availability
    DEEPSEEK_API_KEY_PRESENT: true, // Assuming a check for the key's existence
    ANTHROPIC_API_KEY_PRESENT: false, // Assuming a check for the key's existence
} as any; 
// -------------------------------------------------------------------------------


// ---------------------------- ZephyrahAI Class ----------------------------
export class ZephyrahAI {
    providers: ProviderInfo[] = [];
    selectedProvider: ProviderInfo | null = null;
    videoStage: VideoTheaterStage;

    constructor() {
        this.videoStage = VideoTheaterStage.getInstance();
        this.attachAskAIButton();
    }
    
    // ----------------------- Auto Detect Providers (FIXED) -----------------------
    async autoDetectProviders(timeout = 1000) {
        // Local Providers configured in .env
        const localProbes: ProviderInfo[] = [
            // FIX: Explicitly cast the 'kind' string literal to ProviderKind
            { kind: "ollama" as ProviderKind, url: env.OLLAMA_URL, name: "Ollama" },
            { kind: "localai" as ProviderKind, url: env.LOCALAI_URL, name: "LocalAI" },
            { kind: "lmstudio" as ProviderKind, url: env.LMSTUDIO_URL, name: "LM Studio" }
        ].filter(p => p.url); // Only include if URL is set

        const probePromises = localProbes.map(async (p) => {
            try {
                // We're simulating the health check on the frontend, which requires CORS/network access.
                // In a production Tauri app, this is often done via the backend.
                const controller = new AbortController();
                const id = setTimeout(() => controller.abort(), timeout);
                // Check if API endpoint exists (assuming /v1/models is standard)
                const res = await fetch(p.url + "/v1/models", { signal: controller.signal });
                clearTimeout(id);
                p.healthy = res.ok;
            } catch {
                p.healthy = false;
            }
            return p;
        });

        const results = await Promise.allSettled(probePromises);

        this.providers = results
            .map((r) => (r.status === "fulfilled" ? r.value : null))
            .filter(Boolean) as ProviderInfo[];

        // Cloud Providers (checking for API key presence is often done on the backend)
        this.providers.push({
            kind: "openai",
            name: "OpenAI (Cloud)",
            healthy: true // Assume healthy if API key is present
        });
        
        if (env.DEEPSEEK_API_KEY_PRESENT) {
            this.providers.push({
                kind: "deepseek",
                name: "DeepSeek (Cloud)",
                healthy: true
            });
        }
        
        if (env.ANTHROPIC_API_KEY_PRESENT) {
            this.providers.push({
                kind: "anthropic",
                name: "Anthropic (Cloud)",
                healthy: true
            });
        }

        // Set the default provider based on .env configuration
        const defaultKind = env.ZEPHYRA_DEFAULT_PROVIDER;
        this.selectedProvider = 
            this.providers.find((p) => p.kind === defaultKind) || 
            this.providers.find((p) => p.healthy) || 
            this.providers[0] || 
            null;

        return this.providers;
    }

    // ----------------------- Provider Setter (FIXED) -----------------------
    setProvider(kindOrUrl: string) {
        // 1. Check if it's a URL (for custom/local providers)
        if (kindOrUrl.startsWith('http')) {
            const custom: ProviderInfo = {
                kind: "custom",
                url: kindOrUrl,
                name: `Custom (${new URL(kindOrUrl).hostname})`,
                healthy: true
            };

            // Check if the URL already exists in providers
            const existing = this.providers.find(p => p.url === kindOrUrl);
            if (existing) {
                this.selectedProvider = existing;
                return;
            }

            // If it's a new custom URL, add it and select it
            this.providers.push(custom);
            this.selectedProvider = custom;
            return;
        }

        // 2. Check if it's a ProviderKind (for cloud/known local providers)
        const found = this.providers.find(
            (x) => x.kind === (kindOrUrl as ProviderKind)
        );

        if (found) {
            this.selectedProvider = found;
            return;
        }

        console.warn(`Provider or URL not found for selection: ${kindOrUrl}`);
    }

    // ----------------------- Video Helpers (Included for completeness) -----------------------
    getVideoElement(): HTMLVideoElement | null {
        // Placeholder implementation
        return document.querySelector('video') as HTMLVideoElement | null;
    }

    // ----------------------- BUTTON TRIGGER (FIXED & RELIABLE) -----------------------
    attachAskAIButton() {
        console.info("ZephyraAI: Ask-AI listener armed");

        document.addEventListener("click", (e) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const btn = target.closest(
                "#accessories-ask-ai-player-btn, #accessories-ask-ai-player-icon"
            ) as HTMLElement | null;

            if (!btn) return;

            console.info("Ask-AI button clicked ✅");

            const panel = document.getElementById("zephyra-ai-panel");

            if (panel) {
                // Toggle the 'data-visible' attribute instead of direct style.display
                const isVisible = panel.getAttribute('data-visible') === 'true';
                panel.setAttribute('data-visible', String(!isVisible));
            }
        });
    }

    // ----------------------- Ask Question via Backend -----------------------
    async askQuestion(question: string) {
        const transcript = await this.getTranscriptForCurrentVideo();
        if (!transcript || transcript.length === 0) {
            return { answer: null, reason: "No transcript available." };
        }

        try {
            // Note: Your Tauri backend (safeInvoke) must handle the different providers/URLs
            const res = await safeInvoke("zephyra_answer_question", {
                transcript,
                question,
                provider: this.selectedProvider
            });
            return res;
        } catch (e) {
            console.error("askQuestion failed:", e);
            return { answer: null, reason: "Provider call failed." };
        }
    }

    // ----------------------- Transcript Stub -----------------------
    async getTranscriptForCurrentVideo(): Promise<TranscriptSegment[] | null> {
        try {
            const video = this.getVideoElement();
            const src = video?.currentSrc || video?.getAttribute?.("src") || null;

            if (src) {
                const res = await safeInvoke("zephyra_transcribe_from_source", {
                    sourceUrl: src
                });
                return res?.transcript || null;
            }
        } catch (e) {
            console.warn("transcribe_from_source failed:", e);
        }

        return null;
    }

    // ----------------------- Cost Estimator -----------------------
    estimateCost(providerKind: ProviderKind, approxTokens: number) {
        const per1kOpenAI = parseFloat(env.COST_PER_1K_TOKENS_OPENAI || "0.06");
        const per1kDeepSeek = parseFloat(env.COST_PER_1K_TOKENS_DEEPSEEK || "0.03");
        // Add more cost variables here if needed

        let rate = per1kOpenAI;

        if (providerKind === "deepseek") {
            rate = per1kDeepSeek;
        }
        // Add other provider cost logic here

        const cost = (approxTokens / 1000) * rate;

        return {
            providerKind,
            approxTokens,
            estimatedUSD: cost
        };
    }

    // ----------------------- History Commands -----------------------
    async saveChatHistory(history: ChatMessage[]) {
        try {
            await safeInvoke("zephyra_save_chat_history", { history });
            console.log("Chat history saved successfully.");
        } catch (e) {
            console.error("Failed to save chat history:", e);
        }
    }

    async loadChatHistory(): Promise<ChatMessage[] | null> {
        try {
            const res = await safeInvoke("zephyra_load_chat_history");
            return res?.history || [];
        } catch (e) {
            console.warn("Failed to load chat history:", e);
            return null;
        }
    }
}

// ----------------------- Auto Agent Instance -----------------------
export const zephyraAI = new ZephyrahAI();