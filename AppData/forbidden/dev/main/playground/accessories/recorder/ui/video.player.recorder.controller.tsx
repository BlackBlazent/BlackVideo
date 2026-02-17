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
  Circle, 
  Square, 
  Pause, 
  Play, 
  X, 
  GripVertical, 
  Video, 
  AlertTriangle,
  Maximize2,
  Download
} from 'lucide-react';
import '../../../../../../../../src/styles/modals/video.recorder.css';
import '../../../../../../../../src/styles/modals/recorder.control.css';

interface VideoPlayerRecorderControllerProps {
  isVisible: boolean;
  onClose: () => void;
}

const VideoPlayerRecorderController: React.FC<VideoPlayerRecorderControllerProps> = ({ isVisible, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recorderTimeCounter, setRecorderTimeCounter] = useState(0);
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
      await recorderRef.current.initializeVideoCapture();
    } catch (err) {
      setError('Failed to initialize video capture');
    }
  };

  const startRecording = async () => {
    if (!recorderRef.current) return;
    try {
      await recorderRef.current.startRecording('video');
      setIsRecording(true);
      setRecorderTimeCounter(0);
      timerRef.current = setInterval(() => setRecorderTimeCounter(prev => prev + 1), 1000);
    } catch (err) {
      setError('Start failed');
    }
  };

  const pauseRecording = () => {
    if (!recorderRef.current) return;
    if (isPaused) {
      recorderRef.current.resumeRecording();
      setIsPaused(false);
      timerRef.current = setInterval(() => setRecorderTimeCounter(prev => prev + 1), 1000);
    } else {
      recorderRef.current.pauseRecording();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    try {
      const recordedBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordedBlob) {
        const { saveRecording } = await import('../saved.captured.ts');
        await saveRecording(recordedBlob, `video-player-${Date.now()}`);
      }
    } catch (err) {
      setError('Stop failed');
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
            <h3>VIDEO PLAYER RECORDING</h3>
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
              <Video size={20} />
            </div>
            <div className="status-text">
              <p>Capturing Video Player Feed</p>
              <small>Recording follows video playback</small>
            </div>
          </div>
        </div>

        <div className="recording-controls">
          <div className="recorder-timer-display">
            <span className={`recording-indicator ${isRecording ? 'active' : ''}`}></span>
            <span className="recorder-time-counter">{formatTime(recorderTimeCounter)}</span>
            {isPaused && <span className="paused-label">PAUSED</span>}
          </div>

          <div className="control-buttons">
            {!isRecording ? (
              <button className="start-btn" onClick={startRecording} disabled={!!error}>
                <Circle size={14} fill="currentColor" /> Start
              </button>
            ) : (
              <>
                <button className="pause-btn" onClick={pauseRecording}>
                  {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button className="stop-btn" onClick={stopRecording}>
                  <Square size={14} fill="currentColor" /> Stop & Save
                </button>
              </>
            )}
          </div>
        </div>

        <div className="recording-info">
          <div className="info-row">
            <span className="info-label">Format</span>
            <span className="info-value">WEBM / 30FPS</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="info-value">{isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}</span>
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

export default VideoPlayerRecorderController;
