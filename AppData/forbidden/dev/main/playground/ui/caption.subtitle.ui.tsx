/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import React, { useState, useEffect, useRef } from 'react';
import { captionControlEnhancement, CaptionSettings } from '../playbacks/playback.advanced.control.enhancement.caption';

interface CaptionSubtitleUIProps {
  isVisible: boolean;
  onClose?: () => void;
}

const CaptionSubtitleUI: React.FC<CaptionSubtitleUIProps> = ({ isVisible, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState<'generate' | 'settings'>('generate');
  const [settings, setSettings] = useState<CaptionSettings>({
    fontSize: 'medium',
    fontStyle: 'default',
    textColor: '#ffffff',
    backgroundColor: '#000000',
    opacity: 80,
    position: 'bottom'
  });
  const [selectedLanguage, setSelectedLanguage] = useState('English (Auto)');
  const [buttonPosition, setButtonPosition] = useState<DOMRect | null>(null);

  const languages = ['English (Auto)', 'Armenia', 'Russia', 'Sweden', 'Spain', 'India'];
  const textColors = ['#ffffff', '#ffff00', '#0066ff', '#ff6600', '#00ff00', '#ff0066'];
  const backgroundColors = ['#000000', 'transparent', '#333333', '#666666', '#ffffff'];

  useEffect(() => {
    if (popupRef.current && isVisible) {
      captionControlEnhancement.setPopupElement(popupRef.current);
      
      // Get button position for popup positioning
      const pos = captionControlEnhancement.getButtonPosition();
      setButtonPosition(pos);
    }
  }, [isVisible]);

  useEffect(() => {
    const updatePosition = () => {
      const pos = captionControlEnhancement.getButtonPosition();
      setButtonPosition(pos);
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  const getPopupStyle = (): React.CSSProperties => {
    if (!buttonPosition) {
      return {
        position: 'fixed',
        top: '160px',
        right: '20px',
        zIndex: 9999
      };
    }

    return {
      position: 'fixed',
      top: `${buttonPosition.bottom + 10}px`,
      left: `${buttonPosition.left - 150}px`,
      zIndex: 9999
    };
  };

  const handleSettingChange = (key: keyof CaptionSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    captionControlEnhancement.updateSettings({ [key]: value });
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    captionControlEnhancement.setLanguage(language);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Subtitle file uploaded:', file.name);
      // Here you would handle the file upload logic
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (!isVisible) return null;

  return (
    <div
      ref={popupRef}
      style={getPopupStyle()}
      className="caption-popup"
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #333',
        borderRadius: '8px',
        width: '320px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
            Captions / Subtitles
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0',
              width: '24px',
              height: '24px'
            }}
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #333'
        }}>
          <button
            onClick={() => setActiveTab('generate')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'generate' ? '#333' : 'transparent',
              border: 'none',
              color: activeTab === 'generate' ? 'white' : '#999',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Auto Generate
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === 'settings' ? '#333' : 'transparent',
              border: 'none',
              color: activeTab === 'settings' ? 'white' : '#999',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Settings
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          {activeTab === 'generate' && (
            <div>
              {/* Fetch Subtitles */}
              <div style={{ marginBottom: '16px' }}>
                <button style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginBottom: '8px'
                }}>
                  Fetch Subtitles
                </button>
              </div>

              {/* Upload Subtitle Files */}
              <div style={{ marginBottom: '16px' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".srt,.vtt,.ass"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={triggerFileUpload}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Upload Subtitle Files
                </button>
              </div>

              {/* Translate Captions */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Translate Captions
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              {/* Font Size */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Font Size
                </label>
                <select
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              {/* Font Style */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Font Style
                </label>
                <select
                  value={settings.fontStyle}
                  onChange={(e) => handleSettingChange('fontStyle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="default">Default</option>
                  <option value="bold">Bold</option>
                  <option value="italic">Italic</option>
                </select>
              </div>

              {/* Text Color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Text Color
                </label>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {textColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleSettingChange('textColor', color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color,
                        border: settings.textColor === color ? '2px solid white' : '1px solid #555',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Background Color
                </label>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {backgroundColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleSettingChange('backgroundColor', color)}
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: color === 'transparent' ? 'transparent' : color,
                        border: settings.backgroundColor === color ? '2px solid white' : '1px solid #555',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                        backgroundSize: color === 'transparent' ? '4px 4px' : 'auto',
                        backgroundPosition: color === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Opacity: {settings.opacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.opacity}
                  onChange={(e) => handleSettingChange('opacity', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#007bff'
                  }}
                />
              </div>

              {/* Position */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#ccc' }}>
                  Position
                </label>
                <select
                  value={settings.position}
                  onChange={(e) => handleSettingChange('position', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="bottom">Bottom</option>
                  <option value="top">Top</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptionSubtitleUI;