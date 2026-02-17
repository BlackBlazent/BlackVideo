import React from 'react';

export const SideSupportPanel = () => {
  return (
    <div className="side-language-panel">
      <div style={{cursor: 'pointer'}} className="lang-item active-lang-running">
        <span className="lang-dot" style={{backgroundColor: '#10b981'}}/> <img style={{width: '20px', height: '20px'}} src="/assets/systems/node.js.png"/> node.js
      </div>
      <div style={{cursor: 'pointer'}} className="lang-item">
        <span className="lang-dot" style={{backgroundColor: '#353535ff'}}/> <img style={{width: '20px', height: '20px'}} src="/assets/systems/python.png"/>  python 3.1
      </div>
      <div style={{cursor: 'pointer'}} className="lang-item">
        <span className="lang-dot" style={{backgroundColor: '#353535ff'}}/> <img style={{width: '20px', height: '20px'}} src="/assets/systems/powershell.png"/> powershell
      </div>
      <div style={{cursor: 'pointer'}} className="lang-item">
        <span className="lang-dot" style={{backgroundColor: '#353535ff'}}/> <img style={{width: '20px', height: '20px'}} src="/assets/systems/git.png"/> Git
      </div>
      
      <div style={{marginTop: 'auto', borderTop: '1px solid #222', paddingTop: '10px'}}>
        <div className="lang-item" style={{opacity: 0.5}}>v0.1.0-zephyra</div>
      </div>
    </div>
  );
};