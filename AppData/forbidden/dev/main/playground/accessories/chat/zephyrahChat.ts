/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

/* zephyrahChat.ts
    Draggable + resizable chat UI for Zephyra AI.
*/

import { zephyraAI, ChatMessage } from "../../../../../service/zephyrahAI"; 

const chatHistory: ChatMessage[] = []; 

// ----------------------- Modernized CSS 💅 -----------------------
const css = `
#zephyra-ai-panel {
    position: fixed;
    right: 20px;
    bottom: 20px;
    width: 380px;
    height: 550px;
    background: rgba(13, 13, 15, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #f1f5f9;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 99999;
    resize: both;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0;
    pointer-events: none;
    transform: translateY(20px) scale(0.95);
}

#zephyra-ai-panel[data-visible="true"] {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0) scale(1);
}

#zephyra-ai-header {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 16px; 
    border-bottom: 1px solid rgba(255, 255, 255, 0.08); 
    background: rgba(255, 255, 255, 0.03);
    gap: 12px;
}

#zephyra-drag-handle {
    height: 100%;
    width: 100%;
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;
}
#zephyra-drag-handle::before {
    content: "";
    width: 30px;
    height: 4px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
}

#zephyra-ai-title { 
    font-weight: 600; 
    font-size: 15px; 
    display: flex; 
    gap: 10px; 
    align-items: center;
    color: #60a5fa;
}

#zephyra-ai-body { 
    flex: 1; 
    padding: 20px; 
    overflow-y: auto; 
    display: flex;
    flex-direction: column;
    gap: 16px;
}

#zephyra-ai-footer { 
    padding: 16px; 
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(255, 255, 255, 0.05); 
    display: flex; 
    gap: 10px; 
}

.zephyra-input { 
    flex: 1; 
    padding: 12px 16px; 
    border-radius: 12px; 
    background: rgba(255, 255, 255, 0.05); 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    color: #fff; 
    outline: none;
}

.zephyra-btn { 
    padding: 10px 18px; 
    border-radius: 12px; 
    background: #3b82f6; 
    color: #fff; 
    border: none; 
    cursor: pointer;
    font-weight: 600;
}

.zephyra-msg { 
    max-width: 85%; 
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 14px;
}

.zephyra-msg.user { background: #3b82f6; color: #fff; align-self: flex-end; }
.zephyra-msg.ai { background: rgba(255, 255, 255, 0.08); align-self: flex-start; }

.zephyra-select { 
    background: rgba(30, 30, 35, 0.8); 
    color: #cbd5e1; 
    border: 1px solid rgba(255,255,255,0.1); 
    padding: 6px 12px; 
    border-radius: 10px;
    font-size: 12px;
}

.zephyra-timestamp-seek {
    font-size: 12px;
    color: #60a5fa;
    cursor: pointer;
    margin-top: 8px;
    display: inline-block;
}

.typing-text {
    font-weight: 500;
    color: #60a5fa; 
    overflow: hidden;
    animation: typing 2s steps(15, end) forwards;
    width: 0; 
}
@keyframes typing { from { width: 0 } to { width: 100% } }
`;

const style = document.createElement("style");
style.textContent = css;
document.head.appendChild(style);

const panel = document.createElement("div");
panel.id = "zephyra-ai-panel";
panel.setAttribute('data-visible', 'false');
panel.innerHTML = `
    <div id="zephyra-ai-header">
        <div id="zephyra-ai-title">Zephyra AI</div>
        <div id="zephyra-drag-handle"></div>
        <div id="zephyra-ai-controls">
            <select id="zephyra-model-select" class="zephyra-select"></select>
            <button id="zephyra-close" style="background:none; border:none; color:#94a3b8; cursor:pointer;">✕</button>
        </div>
    </div>
    <div id="zephyra-ai-body"></div>
    <div id="zephyra-ai-footer">
        <input id="zephyra-input" class="zephyra-input" placeholder="Ask about the video..."/>
        <button id="zephyra-send" class="zephyra-btn">Ask</button>
    </div>
`;
document.body.appendChild(panel);

// --- State and UI Refs ---
const zephyra = zephyraAI;
const bodyEl = panel.querySelector("#zephyra-ai-body") as HTMLElement;
const modelSelect = panel.querySelector("#zephyra-model-select") as HTMLSelectElement;
const inputEl = panel.querySelector("#zephyra-input") as HTMLInputElement;
const sendBtn = panel.querySelector("#zephyra-send") as HTMLButtonElement;
const closeBtn = panel.querySelector("#zephyra-close") as HTMLButtonElement;

// --- Functions ---

function renderStarterMessage() {
    bodyEl.innerHTML = '';
    const starterDiv = document.createElement("div");
    starterDiv.className = "zephyra-msg starter ai";
    starterDiv.innerHTML = `<span class="typing-text">How can I help with this video?</span>`;
    bodyEl.appendChild(starterDiv);
}

function appendMessage(kind: "user" | "ai", text: string, timestamp?: number) {
    const div = document.createElement("div");
    div.className = `zephyra-msg ${kind}`;
    
    const textContent = document.createElement("div");
    textContent.textContent = text;
    div.appendChild(textContent);

    if (timestamp) {
        const seekEl = document.createElement("div");
        seekEl.className = "zephyra-timestamp-seek";
        seekEl.innerHTML = `▶ Jump to ${new Date(timestamp * 1000).toISOString().substr(11, 8)}`;
        seekEl.onclick = () => {
            const video = zephyra.getVideoElement();
            if (video) video.currentTime = timestamp;
        };
        div.appendChild(seekEl);
    }
    
    bodyEl.appendChild(div);
    bodyEl.scrollTop = bodyEl.scrollHeight;
}

function renderHistory(history: ChatMessage[]) {
    bodyEl.innerHTML = ''; 
    history.forEach(msg => appendMessage(msg.kind, msg.text, msg.timestamp));
}

async function initProviders() {
    modelSelect.innerHTML = "<option>Detecting...</option>";
    await zephyra.autoDetectProviders();
    modelSelect.innerHTML = "";

    if (zephyra.providers.length === 0) {
        modelSelect.innerHTML = "<option>No providers found</option>";
        return;
    }

    zephyra.providers.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.url ? `url|${p.url}` : `kind|${p.kind}`;
        opt.text = `${p.name}${p.healthy === false ? " (offline)" : ""}`;
        modelSelect.appendChild(opt);
    });

    if (zephyra.selectedProvider) {
        const p = zephyra.selectedProvider;
        modelSelect.value = p.url ? `url|${p.url}` : `kind|${p.kind}`;
    }
}

modelSelect.onchange = (e) => {
    const v = (e.target as HTMLSelectElement).value;
    const [type, payload] = v.split("|");
    zephyra.setProvider(payload);
};

async function sendQuestion() {
    const q = inputEl.value.trim();
    if (!q) return;
    
    appendMessage("user", q);
    chatHistory.push({ kind: "user", text: q });
    inputEl.value = "";
    
    const thinkingEl = document.createElement("div");
    thinkingEl.className = "zephyra-msg ai";
    thinkingEl.textContent = "Thinking...";
    bodyEl.appendChild(thinkingEl);

    try {
        const res = await zephyra.askQuestion(q);
        const finalAnswer = res?.answer || res?.reason || "No answer.";
        thinkingEl.textContent = finalAnswer;
        chatHistory.push({ kind: "ai", text: finalAnswer, timestamp: res?.timestamp });
        
        if (res?.timestamp) {
             const seekEl = document.createElement("div");
             seekEl.className = "zephyra-timestamp-seek";
             seekEl.innerHTML = `▶ Jump to ${new Date(res.timestamp * 1000).toISOString().substr(11, 8)}`;
             seekEl.onclick = () => {
                 const video = zephyra.getVideoElement();
                 if (video) video.currentTime = res.timestamp;
             };
             thinkingEl.appendChild(seekEl);
        }
    } catch (e) {
        thinkingEl.textContent = "Error: " + e;
    }
}

closeBtn.onclick = async () => {
    panel.setAttribute('data-visible', 'false');
    await zephyra.saveChatHistory(chatHistory);
};

sendBtn.onclick = sendQuestion;
inputEl.onkeydown = (e) => { if (e.key === "Enter") sendQuestion(); };

async function initializeChatUI() {
    await initProviders();
    const history = await zephyra.loadChatHistory();
    if (history && history.length > 0) {
        chatHistory.push(...history);
        renderHistory(chatHistory);
    } else {
        renderStarterMessage();
    }
}

// Draggable logic
(function makeDraggable(el: HTMLElement) {
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    const handle = el.querySelector("#zephyra-drag-handle") as HTMLElement;
    handle.onpointerdown = (e) => {
        dragging = true;
        startX = e.clientX; startY = e.clientY;
        const rect = el.getBoundingClientRect();
        startLeft = rect.left; startTop = rect.top;
        handle.setPointerCapture(e.pointerId);
    };
    window.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        el.style.left = `${startLeft + (e.clientX - startX)}px`;
        el.style.top = `${startTop + (e.clientY - startY)}px`;
        el.style.right = "auto"; el.style.bottom = "auto";
    });
    window.addEventListener("pointerup", () => dragging = false);
})(panel);

// Trigger initialization
if (document.readyState === "complete" || document.readyState === "interactive") {
    initializeChatUI();
} else {
    window.addEventListener("DOMContentLoaded", initializeChatUI);
}

(window as any).zephyra = zephyra;