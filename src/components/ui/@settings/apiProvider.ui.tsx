/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState } from 'react';
import { 
  Database, Cpu, Save, Eye, EyeOff, Globe, 
  Bot, Search, Server
} from 'lucide-react';

const ApiProviderUI = () => {
  const [showToken, setShowToken] = useState<Record<string, boolean>>({});

  const toggleToken = (provider: string) => {
    setShowToken(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const cloudLLMs = [
    { id: 'openai', name: 'OpenAI', desc: 'GPT-4o & o1 Models' },
    { id: 'gemini', name: 'Google Gemini', desc: '1.5 Pro & Flash' },
    { id: 'claude', name: 'Anthropic Claude', desc: 'Claude 3.5 Sonnet' },
    { id: 'deepseek', name: 'DeepSeek', desc: 'V3 & R1 Reasoning' },
    { id: 'grok', name: 'xAI Grok', desc: 'Grok-2 & Beta' }
  ];

  return (
    <div className="tab-pane animate-fade-in api-provider-page">
      
      {/* SECTION: CLOUD LLM INTELLIGENCE */}
      <div className="settings-group">
        <div className="group-title-area">
          <Bot size={22} className="group-icon color-purple" strokeWidth={2.5} />
          <h2>Cloud LLM Intelligence</h2>
        </div>
        <div className="api-cards-grid">
          {cloudLLMs.map((llm) => (
            <div key={llm.id} className="api-card">
              <div className="api-card-header">
                <div className="provider-info">
                  <div className="provider-icon-placeholder"><Bot size={18} /></div>
                  <div>
                    <h4>{llm.name}</h4>
                    <p className="subtext">{llm.desc}</p>
                  </div>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="api-card-body">
                <div className="token-input-wrapper">
                  <input 
                    type={showToken[llm.id] ? "text" : "password"} 
                    placeholder={`${llm.name} API Key`}
                    className="token-field"
                  />
                  <button onClick={() => toggleToken(llm.id)} className="visibility-btn">
                    {showToken[llm.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <button className="btn-save-sm"><Save size={12} /> Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION: AI SEARCH PROVIDERS */}
      <div className="settings-group">
        <div className="group-title-area">
          <Search size={22} className="group-icon color-green" strokeWidth={2.5} />
          <h2>Search & Research AI</h2>
        </div>
        <div className="api-card active">
          <div className="api-card-header">
            <div className="provider-info">
              <div className="provider-icon-placeholder" style={{background: '#00a1b5'}}><Search size={18} color="white" /></div>
              <div>
                <h4>Perplexity AI</h4>
                <p className="subtext">Real-time web search for video fact-checking.</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="api-card-body">
             <div className="token-input-wrapper">
                <input 
                  type={showToken['pplx'] ? "text" : "password"} 
                  placeholder="pplx-xxxxxxxx"
                  className="token-field"
                />
                <button onClick={() => toggleToken('pplx')} className="visibility-btn">
                  {showToken['pplx'] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button className="btn-save-sm"><Save size={12} /> Save</button>
          </div>
        </div>
      </div>

      {/* SECTION: LOCAL LLM (On-Device) */}
      <div className="settings-group">
        <div className="group-title-area">
          <Cpu size={22} className="group-icon color-gray" strokeWidth={2.5} />
          <h2>Local AI Engines</h2>
        </div>
        <div className="api-card">
          <div className="api-card-header">
            <div className="provider-info">
              <div className="provider-icon-placeholder"><Server size={18} /></div>
              <div>
                <h4>Ollama</h4>
                <p className="subtext">On-device inference for private processing.</p>
              </div>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <div className="api-card-body">
            <div className="local-input-grid">
              <div className="input-group">
                <label>Endpoint</label>
                <input type="text" placeholder="http://localhost:11434" className="text-field" />
              </div>
              <div className="input-group">
                <label>Default Model</label>
                <input type="text" placeholder="llama3:latest" className="text-field" />
              </div>
            </div>
            <button className="btn-save-sm"><Save size={12} /> Save</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ApiProviderUI;