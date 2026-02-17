/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { Sparkles, ChevronDown, Paperclip, MousePointer2, Send } from 'lucide-react';

interface ChatProps {
  query: string;
}

export const SearchChatSupport: React.FC<ChatProps> = ({ query }) => {
  const toolBtnStyle = { background: 'transparent', border: 'none', color: '#666', cursor: 'pointer' };

  return (
    <div className="ai-chat-workspace" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20px 20px' }}>
      <div className="chat-header" style={{ paddingBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <div className="llm-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#ccc' }}>
          <Sparkles size={12} color="#3b82f6" />
          <span>DeepSeek-V3</span>
          <ChevronDown size={12} />
        </div>
        <span className="chat-status" style={{ fontSize: '11px', color: '#666' }}>Ready to process {query}</span>
      </div>

      <div className="chat-messages" style={{ flex: 1, color: '#ccc', lineHeight: '1.6', fontSize: '14px' }}>
        <div className="ai-msg">
          I've analyzed the search parameters for <strong>{query}</strong>. 
          There are 3 local files and 1 extension related to this.
        </div>
      </div>

      <div className="chat-input-area" style={{ marginTop: '20px' }}>
        <div className="chat-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #333', padding: '10px', borderRadius: '8px' }}>
          <div className="chat-tools" style={{ display: 'flex', gap: '10px', marginRight: '15px' }}>
            <button style={toolBtnStyle} title="Tag File (@)"><Paperclip size={14} /></button>
            <button style={toolBtnStyle} title="Cursor Selection"><MousePointer2 size={14} /></button>
          </div>
          <input 
            type="text" 
            placeholder={`Message AI Agent about ${query}...`} 
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
          />
          <button className="send-btn" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px' }}>
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};