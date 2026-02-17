import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import {
  videoTheaterContextMenuManager,
  FitMode,
} from '../playgroundVideoTheaterStageContextMenu';
import { calculateMenuPosition } from '../indexContextMenu';
import '../../../../../../src/styles/others/playgroundContextMenu.css';

interface ContextMenuProps {
  targetElementId: string;
}

export const PlaygroundVideoTheaterStageContextMenu: React.FC<ContextMenuProps> = ({ targetElementId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fitMode, setFitMode] = useState<FitMode>(videoTheaterContextMenuManager.getFitMode());
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = videoTheaterContextMenuManager.subscribe((newFitMode) => { setFitMode(newFitMode); });
    return () => unsubscribe();
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const targetElement = document.getElementById(targetElementId);
    const videoElement = document.getElementById('VideoPlayer-TheaterStage');
    
    if (targetElement && (target === videoElement || videoElement?.contains(target))) {
      e.preventDefault();
      const menuWidth = 250;
      const menuHeight = 150;
      const pos = calculateMenuPosition(e.clientX, e.clientY, menuWidth, menuHeight);
      setPosition(pos);
      setIsVisible(true);
      setActiveSubmenu(null);
    }
  }, [targetElementId]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node) && (!submenuRef.current || !submenuRef.current.contains(e.target as Node))) {
      setIsVisible(false);
      setActiveSubmenu(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleContextMenu, handleClickOutside]);

  const handleItemClick = (action?: () => void) => {
    if (action) action();
    setIsVisible(false);
    setActiveSubmenu(null);
  };

  const handleSubmenuToggle = (menuId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const submenuWidth = 220;
    const submenuHeight = 100;
    let x = rect.right + 5;
    let y = rect.top;
    if (x + submenuWidth > window.innerWidth) x = rect.left - submenuWidth - 5;
    if (y + submenuHeight > window.innerHeight) y = window.innerHeight - submenuHeight - 10;
    setSubmenuPosition({ x, y });
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  const renderSubmenu = (options: any[]) => (
    <div ref={submenuRef} className="context-submenu" style={{ left: `${submenuPosition.x}px`, top: `${submenuPosition.y}px` }}>
      {options.map((option, index) => {
        if (option.divider) return <div key={`divider-${index}`} className="context-menu-divider" />;
        return (
          <div key={option.id} className={`context-menu-item ${option.disabled ? 'disabled' : ''}`}
            onClick={(e) => { e.stopPropagation(); if (!option.disabled) handleItemClick(option.action); }}>
            <span className="menu-item-check">{option.checked && <Check size={14} />}</span>
            <span className="menu-item-label">{option.label}</span>
          </div>
        );
      })}
    </div>
  );

  if (!isVisible) return null;

  const menuOptions = videoTheaterContextMenuManager.getContextMenuOptions();

  return (
    <>
      <div ref={menuRef} className="playground-context-menu video-theater-context" style={{ left: `${position.x}px`, top: `${position.y}px` }}>
        {menuOptions.map((option) => (
          <div key={option.id} className={`context-menu-item ${option.disabled ? 'disabled' : ''} ${option.submenu ? 'has-submenu' : ''}`}
            onClick={(e) => { if (!option.disabled) { if (option.submenu) handleSubmenuToggle(option.id, e); else handleItemClick(option.action); }}}>
            <span className="menu-item-check">{option.checked && <Check size={14} />}</span>
            <span className="menu-item-label">{option.label}</span>
            {option.submenu && <span className="menu-item-arrow"><ChevronRight size={14} /></span>}
          </div>
        ))}
      </div>
      {activeSubmenu && menuOptions.map((option) => {
        if (option.submenu && activeSubmenu === option.id) {
          return <React.Fragment key={`submenu-${option.id}`}>{renderSubmenu(option.submenu)}</React.Fragment>;
        }
        return null;
      })}
    </>
  );
};

export default PlaygroundVideoTheaterStageContextMenu;
