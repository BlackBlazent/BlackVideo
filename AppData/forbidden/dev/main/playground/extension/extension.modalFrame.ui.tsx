import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, Settings, Minus, Square, X, ChevronDown } from 'lucide-react';

interface ExtensionFrameProps {
  id: string;
  title: string;
  className?: string;
  onClose: () => void;
}

const ExtensionModalFrame: React.FC<ExtensionFrameProps> = ({ id, title, className, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isInstalled, setIsInstalled] = useState(true);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ w: 400, h: 300 });

  // Refs for Dragging logic
  const dragRef = useRef<boolean>(false);
  const offset = useRef({ x: 0, y: 0 });

  const startDrag = (e: React.MouseEvent) => {
    dragRef.current = true;
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  const onDrag = (e: MouseEvent) => {
    if (!dragRef.current) return;
    setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
  };

  const stopDrag = () => {
    dragRef.current = false;
    document.removeEventListener('mousemove', onDrag);
  };

  // Resize logic
  const startResize = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.w;
    const startH = size.h;

    const onResize = (re: MouseEvent) => {
      setSize({
        w: Math.max(250, startW + (re.clientX - startX)),
        h: Math.max(150, startH + (re.clientY - startY))
      });
    };

    const stopResize = () => {
      document.removeEventListener('mousemove', onResize);
    };

    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', stopResize, { once: true });
  };

  return (
    <div 
      className={`extensionsPlaceholderBuff ${isMinimized ? 'is-minimized' : ''} ${className}`}
      style={{ left: position.x, top: position.y, width: size.w, height: size.h }}
    >
      <nav className="extension-nav-wrapper">
        <div className="extensionFrameTabs">
          <div className="drag-handle-area" onMouseDown={startDrag}>
            <GripVertical size={14} color="var(--text-muted)" />
            <span className="extension-title-text">{title}</span>
          </div>

          <div className="nav-extra-controls">
            <button className={`text-switch ${isActive ? 'active' : ''}`} onClick={() => setIsActive(!isActive)}>
              {isActive ? 'Active' : 'Deactive'}
            </button>
            <button className="text-switch" onClick={() => setIsInstalled(!isInstalled)}>
              {isInstalled ? 'Installed' : 'Uninstall'}
            </button>
            <span style={{fontSize: '9px', color: 'var(--accent-orange)'}}>FREE</span>
            
            <div className="settings-trigger">
              <Settings size={14} className="win-btn" />
            </div>
          </div>

          <div className="window-controls">
            <button className="win-btn" onClick={() => setIsMinimized(!isMinimized)}><Minus size={14} /></button>
            <button className="win-btn"><Square size={10} /></button>
            <button className="win-btn" onClick={onClose}><X size={14} /></button>
          </div>
        </div>
      </nav>

      <div id={`${id}_container`} className="developer_extension_container">
        {/* DEV CONTENT INJECTED HERE */}
        <div style={{color: 'var(--text-muted)', fontSize: '12px'}}>
          Extension Context: {id} <br/>
          Status: Ready for Developer implementation.
        </div>
      </div>

      <div className="extensionSpace">
        © 2026 BlackVideo Ecosystem. Author: Dev_{id.split('-')[0]}
      </div>

      {!isMinimized && <div className="resizer-bottom-right" onMouseDown={startResize}></div>}
    </div>
  );
};

export default ExtensionModalFrame;