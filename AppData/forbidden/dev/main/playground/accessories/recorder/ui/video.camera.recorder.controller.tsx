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
import { 
  Square, 
  X, 
  GripVertical, 
  Camera, 
  AlertTriangle,
  Maximize2,
  RefreshCw
} from 'lucide-react';
import '../../../../../../../../src/styles/modals/video.recorder.css';
import '../../../../../../../../src/styles/modals/recorder.control.css';

interface VideoCameraRecorderControllerProps {
  initialFacing: 'user' | 'environment';
  isVisible: boolean;
  onClose: () => void;
}

const VideoCameraRecorderController: React.FC<VideoCameraRecorderControllerProps> = ({ 
  initialFacing, 
  isVisible, 
  onClose 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recorderTimeCounter, setRecorderTimeCounter] = useState(0);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>(initialFacing);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [size, setSize] = useState({ width: 340, height: 'auto' as number | 'auto' });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 340, height: 400 });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recorderRef = useRef<any>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      initializeRecording();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      cleanup();
    };
  }, [isVisible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && controlsRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        const maxX = window.innerWidth - controlsRef.current.offsetWidth;
        const maxY = window.innerHeight - controlsRef.current.offsetHeight;
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
      
      if (isResizing && controlsRef.current) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(300, Math.min(500, resizeStart.width + deltaX));
        const newHeight = Math.max(350, Math.min(600, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (controlsRef.current) {
      const rect = controlsRef.current.getBoundingClientRect();
      setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setIsDragging(true);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (controlsRef.current) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: controlsRef.current.offsetWidth,
        height: controlsRef.current.offsetHeight
      });
      setIsResizing(true);
    }
  };

  const initializeRecording = async () => {
    try {
      setError(null);
      const { VideoRecorder } = await import('../video.recording.ts');
      recorderRef.current = new VideoRecorder();
      await recorderRef.current.initializeCameraCapture(cameraFacing);
    } catch (err) {
      setError('Check camera permissions');
    }
  };

  const startRecording = async () => {
    if (!recorderRef.current) return;
    try {
      await recorderRef.current.startRecording('camera');
      setIsRecording(true);
      setRecorderTimeCounter(0);
      timerRef.current = setInterval(() => setRecorderTimeCounter(prev => prev + 1), 1000);
    } catch (err) {
      setError('Start failed');
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    try {
      const recordedBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordedBlob) {
        const { saveRecording } = await import('../saved.captured.ts');
        await saveRecording(recordedBlob, `camera-${cameraFacing}-${Date.now()}`);
      }
      // Close after saving
      onClose();
    } catch (err) {
      setError('Stop failed');
    }
  };

  const switchCamera = async () => {
    if (isRecording) return; // Can't switch during recording
    
    const newFacing = cameraFacing === 'user' ? 'environment' : 'user';
    if (recorderRef.current) {
      try {
        await recorderRef.current.switchCamera(newFacing);
        setCameraFacing(newFacing);
      } catch (err) {
        setError('Camera switch failed');
      }
    }
  };

  const cleanup = () => {
    if (recorderRef.current) recorderRef.current.cleanup();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div 
      className="recorder-controls-overlay"
      style={{ 
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${size.width}px`,
        height: size.height === 'auto' ? 'auto' : `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
      ref={controlsRef}
    >
      <div className="recorder-controls-panel">
        <div className="controls-header" onMouseDown={handleDragStart} style={{ cursor: 'grab' }}>
          <div className="header-actions">
            <GripVertical size={16} className="drag-handle-icon" />
            <h3>CAMERA RECORDING</h3>
          </div>
          <button className="close-btn-minimal" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          </div>
        )}

        <div className="preview-section">
          <div className="video-status">
            <div className="status-icon-wrapper">
              <Camera size={20} />
            </div>
            <div className="status-text">
              <p>Capturing Camera Feed</p>
              <small>{cameraFacing === 'user' ? 'Front' : 'Back'} Camera Active</small>
            </div>
          </div>
        </div>

        <div className="recording-controls">
          <div className="recorder-timer-display">
            <span className={`recording-indicator ${isRecording ? 'active' : ''}`}></span>
            <span className="recorder-time-counter">{formatTime(recorderTimeCounter)}</span>
            {/* Duration bar at max (jumps to end like Facebook Live) */}
            <div className="duration-bar-container">
              <div className="duration-bar" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="control-buttons">
            {!isRecording ? (
              <button className="start-btn" onClick={startRecording} disabled={!!error}>
                <Camera size={14} /> Start Recording
              </button>
            ) : (
              <button className="stop-btn" onClick={stopRecording}>
                <Square size={14} fill="currentColor" /> Stop & Save
              </button>
            )}
            
            <button 
              className="switch-camera-btn" 
              onClick={switchCamera} 
              disabled={isRecording}
              title={isRecording ? 'Cannot switch during recording' : 'Switch camera'}
            >
              <RefreshCw size={14} />
              <span>Switch</span>
            </button>
          </div>
        </div>

        <div className="recording-info">
          <div className="info-row">
            <span className="info-label">Camera</span>
            <span className="info-value">{cameraFacing === 'user' ? 'Front' : 'Back'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value">{isRecording ? 'Recording' : 'Ready'}</span>
          </div>
        </div>

        <div 
          className="resize-handle"
          onMouseDown={handleResizeStart}
        >
          <Maximize2 size={12} />
        </div>
      </div>
    </div>
  );
};

export default VideoCameraRecorderController;
