import React from 'react';

export const CLIContentArea = ({ activeTab }: { activeTab: string }) => {
  const path = "PS C:\\Users\\User\\BlackVideo\\@Albin_ka>";

  return (
    <div className="terminal-body">
      {activeTab === 'Terminal' && (
        <div>
          <span style={{color: '#fff'}}>{path}</span>
          <span className="cursor-blink">█</span>
        </div>
      )}
      
      {activeTab === 'Problems' && (
        <div style={{display: 'flex', flexDirection: 'column', gap: '4px'}}>
          <div className="problem-item" style={{color: '#f87171'}}>● [Codec Error] Missing H.265 dynamic library</div>
          <div className="problem-item" style={{color: '#fbbf24'}}>▲ [Warning] Low disk space for video caching</div>
        </div>
      )}

      {/* PLACEHOLDER FOR OTHER TABS */}
      {['Output', 'Ports', 'Assets', 'Metrics'].includes(activeTab) && (
        <div style={{color: '#666', fontSize: '11px', fontStyle: 'italic'}}>
          No active {activeTab.toLowerCase()} data to display...
        </div>
      )}
    </div>
  );
};