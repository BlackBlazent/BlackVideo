/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Film, Upload, X, GripVertical } from 'lucide-react';
import { LinkDeployerCore, DeployerConfig, DeployerData, DeployMode } from './link.core.deployer.dev';
import '../../../../../../../src/styles/modals/link.deployer.css';

interface LinkDeployerUIProps {
  isOpen: boolean;
  onClose: () => void;
  config: DeployerConfig;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const LinkDeployerUI: React.FC<LinkDeployerUIProps> = ({ isOpen, onClose, config }) => {
  const [core] = useState(() => new LinkDeployerCore(config));
  const [urlInput, setUrlInput] = useState('');
  const [urlValid, setUrlValid] = useState<boolean | null>(null);
  const [platformDetected, setPlatformDetected] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState<Size>({ width: 520, height: 620 });
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({ 
    x: 0, y: 0, width: 0, height: 0 
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Center popup on open
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2,
        y: (window.innerHeight - rect.height) / 2
      });
    }
  }, [isOpen]);

  // Update core config when props change
  useEffect(() => {
    core.updateConfig(config);
  }, [config, core]);

  // Dragging handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.link-deployer-header')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    
    if (isResizing) {
      const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(500, resizeStart.height + (e.clientY - resizeStart.y));
      setSize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Resizing handlers
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  }, [size]);

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // URL validation and platform detection
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlInput(value);
    
    if (value.trim() === '') {
      setUrlValid(null);
      setPlatformDetected(null);
      core.setCurrentUrl('');
    } else if (core.validateUrl(value)) {
      setUrlValid(true);
      const platform = core.detectPlatform(value);
      setPlatformDetected(platform);
      core.setCurrentUrl(value);
    } else {
      setUrlValid(false);
      setPlatformDetected(null);
      core.setCurrentUrl('');
    }
  };

  // File handling
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && core.isValidFileType(file)) {
      core.setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && core.isValidFileType(file)) {
      core.setSelectedFile(file);
      setSelectedFileName(file.name);
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Deployment actions
  const handleDeployEmbed = async () => {
    try {
      await core.handleDeploy(DeployMode.EMBED);
      handleClose();
    } catch (error) {
      console.error('Embed deployment error:', error);
    }
  };

  const handleDeployVideoStage = async () => {
    try {
      await core.handleDeploy(DeployMode.VIDEO_STAGE);
      handleClose();
    } catch (error) {
      console.error('Video stage deployment error:', error);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    core.handleCancel();
    handleClose();
  };

  const resetForm = () => {
    setUrlInput('');
    setUrlValid(null);
    setPlatformDetected(null);
    setSelectedFileName('');
    core.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="link-deployer-popup-wrapper">
      <div
        ref={modalRef}
        className="link-deployer-container"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
          cursor: isDragging ? 'grabbing' : 'default'
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
        <div className="link-deployer-header">
          <GripVertical size={14} className="drag-icon" />
          <h2 className="link-deployer-title">{config.titleText}</h2>
          <button className="link-deployer-close-btn" onClick={handleCancel}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="link-deployer-body">
          {/* URL Input Section */}
          <div className="link-deployer-input-section">
            <label className="link-deployer-input-label" htmlFor="url-input">
              Video URL
            </label>
            <input
              type="url"
              id="url-input"
              className={`link-deployer-url-input ${urlValid === true ? 'valid' : ''} ${urlValid === false ? 'invalid' : ''}`}
              placeholder={config.urlPlaceholder}
              value={urlInput}
              onChange={handleUrlChange}
            />
            {urlValid === false && (
              <div className="link-deployer-error-message">Please enter a valid URL</div>
            )}
            {urlValid === true && platformDetected && (
              <div className="link-deployer-success-message">
                <span className="platform-badge">{platformDetected}</span> URL detected
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="link-deployer-divider">
            <span>OR</span>
          </div>

          {/* File Upload Section */}
          <div
            className="link-deployer-file-upload-area"
            onClick={handleFileUploadClick}
            onDrop={handleFileDrop}
            onDragOver={handleDragOver}
          >
            <Upload size={32} className="link-deployer-file-upload-icon" />
            <div className="link-deployer-file-upload-text">Upload a file with video links</div>
            <div className="link-deployer-file-upload-hint">
              Supports {config.fileTypes.join(', ')}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="file-input"
              className="link-deployer-file-input"
              accept={config.fileTypes.join(',')}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          {selectedFileName && (
            <div className="link-deployer-selected-file">
              <Film size={16} />
              <span>{selectedFileName}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="link-deployer-footer">
          <button className="link-deployer-btn link-deployer-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <div className="link-deployer-action-buttons">
            <button
              className="link-deployer-btn link-deployer-btn-video-stage"
              onClick={handleDeployVideoStage}
              disabled={!core.canDeploy()}
              title="Play in Video Stage"
            >
              {/*<Play size={16} />*/}
              <img  style={{width: '16px', height: '16px'}} src="/assets/others/play.png" className="video-play-it-in-stage" alt="Play in stage" />
              <span>Video Stage</span>
            </button>
            <button
              className="link-deployer-btn link-deployer-btn-go"
              onClick={handleDeployEmbed}
              disabled={!core.canDeploy()}
              title="Play in Embed Window"
            >
              {/*<Film size={16} />*/}
              <img  style={{width: '16px', height: '16px'}} src="/assets/others/go.png" className="go-play-it-in-embed" alt="Directly play" />
              <span>Go</span>
            </button>
          </div>
        </div>

        {/* Resize Handle */}
        <div 
          className="link-deployer-resize-handle"
          onMouseDown={handleResizeMouseDown}
        />
      </div>
    </div>
  );
};

export default LinkDeployerUI;