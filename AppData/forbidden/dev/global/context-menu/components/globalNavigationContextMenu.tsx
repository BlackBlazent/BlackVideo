import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import {
  globalNavigationContextMenuManager,
  GlobalNavigationSettings,
} from '../globalNavigationContextMenu';
import { calculateMenuPosition } from '../indexContextMenu';
import '../../../../../../src/styles/others/globalNavigationContextMenu.css';

interface ContextMenuProps {
  targetElementId: string;
}

export const GlobalNavigationContextMenu: React.FC<ContextMenuProps> = ({ targetElementId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [settings, setSettings] = useState<GlobalNavigationSettings>(
    globalNavigationContextMenuManager.getSettings()
  );
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = globalNavigationContextMenuManager.subscribe((newSettings) => {
      setSettings(newSettings);
    });

    return () => unsubscribe();
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const navigationElement = document.getElementById(targetElementId);
    
    // Only trigger if right-clicking directly on the header, not its children
    if (target.id === targetElementId || target === navigationElement) {
      e.preventDefault();
      
      const menuWidth = 280;
      const menuHeight = 200;
      const pos = calculateMenuPosition(e.clientX, e.clientY, menuWidth, menuHeight);
      
      setPosition(pos);
      setIsVisible(true);
      setActiveSubmenu(null);
    }
  }, [targetElementId]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(e.target as Node) &&
      (!submenuRef.current || !submenuRef.current.contains(e.target as Node))
    ) {
      setIsVisible(false);
      setActiveSubmenu(null);
    }
  }, []);

  useEffect(() => {
    const element = document.getElementById(targetElementId);
    if (element) {
      element.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
    }

    return () => {
      if (element) {
        element.removeEventListener('contextmenu', handleContextMenu);
      }
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [targetElementId, handleContextMenu, handleClickOutside]);

  const handleItemClick = (action?: () => void) => {
    if (action) {
      action();
    }
    setIsVisible(false);
    setActiveSubmenu(null);
  };

  const handleSubmenuToggle = (menuId: string, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const submenuWidth = 280;
    const submenuHeight = 400;
    
    let x = rect.right + 5;
    let y = rect.top;
    
    if (x + submenuWidth > window.innerWidth) {
      x = rect.left - submenuWidth - 5;
    }
    
    if (y + submenuHeight > window.innerHeight) {
      y = window.innerHeight - submenuHeight - 10;
    }
    
    setSubmenuPosition({ x, y });
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  const renderSubmenu = (options: any[], parentId: string) => {
    return (
      <div
        ref={submenuRef}
        className="context-submenu"
        style={{
          left: `${submenuPosition.x}px`,
          top: `${submenuPosition.y}px`,
        }}
      >
        {options.map((option, index) => {
          if (option.divider) {
            return <div key={`divider-${index}`} className="context-menu-divider" />;
          }

          return (
            <div
              key={option.id}
              className={`context-menu-item ${option.disabled ? 'disabled' : ''} ${
                option.submenu ? 'has-submenu' : ''
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!option.disabled) {
                  if (option.submenu) {
                    handleSubmenuToggle(`${parentId}-${option.id}`, e);
                  } else {
                    handleItemClick(option.action);
                  }
                }
              }}
            >
              <span className="menu-item-check">
                {option.checked && <Check size={14} />}
              </span>
              <span className="menu-item-label">{option.label}</span>
              {option.submenu && (
                <span className="menu-item-arrow">
                  <ChevronRight size={14} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!isVisible) return null;

  const menuOptions = globalNavigationContextMenuManager.getContextMenuOptions();

  return (
    <>
      <div
        ref={menuRef}
        className="global-navigation-context-menu"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {menuOptions.map((option) => {
          if (option.divider) {
            return <div key={option.id} className="context-menu-divider" />;
          }

          return (
            <div
              key={option.id}
              className={`context-menu-item ${option.disabled ? 'disabled' : ''} ${
                option.submenu ? 'has-submenu' : ''
              }`}
              onClick={(e) => {
                if (!option.disabled) {
                  if (option.submenu) {
                    handleSubmenuToggle(option.id, e);
                  } else {
                    handleItemClick(option.action);
                  }
                }
              }}
            >
              <span className="menu-item-check">
                {option.checked && <Check size={14} />}
              </span>
              <span className="menu-item-label">{option.label}</span>
              {option.submenu && (
                <span className="menu-item-arrow">
                  <ChevronRight size={14} />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {activeSubmenu && menuOptions.map((option) => {
        if (option.submenu && activeSubmenu === option.id) {
          return (
            <React.Fragment key={`submenu-${option.id}`}>
              {renderSubmenu(option.submenu, option.id)}
            </React.Fragment>
          );
        }
        
        if (option.submenu) {
          return option.submenu.map((subOption) => {
            if (subOption.submenu && activeSubmenu === `${option.id}-${subOption.id}`) {
              return (
                <React.Fragment key={`submenu-${option.id}-${subOption.id}`}>
                  {renderSubmenu(subOption.submenu, `${option.id}-${subOption.id}`)}
                </React.Fragment>
              );
            }
            return null;
          });
        }
        return null;
      })}
    </>
  );
};

export default GlobalNavigationContextMenu;
