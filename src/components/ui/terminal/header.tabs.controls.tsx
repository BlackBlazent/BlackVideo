import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, Activity, HardDrive, ChevronUp, X, 
  Maximize2, Plus, Trash2, Columns, MoreHorizontal, AlertCircle, 
  Code2, Network, Database 
} from 'lucide-react';

export const TerminalHeader = ({ height, activeTab, setActiveTab, onMaximize, onReset, terminals, setTerminals, activeTerminalId, setActiveTerminalId }: any) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const addTerminal = () => {
    const newId = Date.now();
    setTerminals([...terminals, { id: newId, name: 'powershell' }]);
    setActiveTerminalId(newId);
  };

  const killTerminal = (id: number) => {
    if (terminals.length > 1) {
      const filtered = terminals.filter((t: any) => t.id !== id);
      setTerminals(filtered);
      setActiveTerminalId(filtered[0].id);
    }
  };

  return (
    <div className="terminal-tab-header" style={{ opacity: height > 25 ? 1 : 0 }}>
      <div className="tab-group">
        <TabItem label="Problems" icon={<AlertCircle size={12} color="#3b82f6"/>} active={activeTab === 'Problems'} onClick={() => setActiveTab('Problems')} count={2} />
        <TabItem label="Output" icon={<Database size={12}/>} active={activeTab === 'Output'} onClick={() => setActiveTab('Output')} />
        <TabItem label="Terminal" icon={<TerminalIcon size={12}/>} active={activeTab === 'Terminal'} onClick={() => setActiveTab('Terminal')} />
        <TabItem label="Ports" icon={<Network size={12}/>} active={activeTab === 'Ports'} onClick={() => setActiveTab('Ports')} />
        <TabItem label="Assets" icon={<HardDrive size={12}/>} active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')} />
        <TabItem label="Metrics" icon={<Activity size={12}/>} active={activeTab === 'Metrics'} onClick={() => setActiveTab('Metrics')} />
      </div>

      <div className="right-controls">
        <div className="instance-control-box">
          <Code2 size={12} style={{marginRight: '6px', opacity: 0.7}} />
          <span style={{fontSize: '11px', color: '#ccc', marginRight: '8px'}}>powershell</span>
          <button onClick={addTerminal} className="header-action-btn" title="New Terminal"><Plus size={14}/></button>
          <ChevronUp size={12} style={{marginRight: '10px', opacity: 0.5}} />
          <div className="divider-inner" />
          <button className="header-action-btn" title="Split Terminal"><Columns size={14}/></button>
          <button onClick={() => killTerminal(activeTerminalId)} className="header-action-btn" title="Kill Terminal"><Trash2 size={14}/></button>
          
          <div style={{position: 'relative'}}>
            <button onClick={() => setIsMoreOpen(!isMoreOpen)} className="header-action-btn"><MoreHorizontal size={14}/></button>
            {isMoreOpen && (
              <div className="terminal-dropdown">
                <div className="drop-item">Recent Commands</div>
                <div className="drop-item">Scroll to Command</div>
                <div className="drop-item">Run Active File</div>
              </div>
            )}
          </div>
        </div>
        <div className="divider-v" />
        <button onClick={onMaximize} className="win-btn"><Maximize2 size={12} /></button>
        <button onClick={onReset} className="win-btn"><X size={14} /></button>
      </div>
    </div>
  );
};

const TabItem = ({ label, icon, active, onClick, count }: any) => (
  <div onClick={onClick} className={`tab-item ${active ? 'active' : ''}`}>
    {icon} 
    <span style={{textTransform: 'capitalize'}}>{label}</span>
    {count && <span className="tab-count">{count}</span>}
  </div>
);