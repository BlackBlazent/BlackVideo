/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// recorder.control.ui.tsx - Recording controls interface
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

interface RecorderControlsProps {
  mode: 'video' | 'camera' | 'both';
  isVisible: boolean;
  onClose: () => void;
}

const RecorderControls: React.FC<RecorderControlsProps> = ({ mode, isVisible, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recorderTimeCounter, setRecorderTimeCounter] = useState(0);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recorderRef = useRef<any>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && mode) {
      initializeRecording();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      cleanup();
    };
  }, [isVisible, mode]);

  // Mouse event handlers for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && controlsRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep within viewport bounds
        const maxX = window.innerWidth - controlsRef.current.offsetWidth;
        const maxY = window.innerHeight - controlsRef.current.offsetHeight;
        
        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent) => {
    if (controlsRef.current) {
      const rect = controlsRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const initializeRecording = async () => {
    try {
      setError(null);
      const { VideoRecorder } = await import('./video.recording.ts');
      recorderRef.current = new VideoRecorder();
      
      if (mode === 'video' || mode === 'both') {
        await recorderRef.current.initializeVideoCapture();
      }
      
      if (mode === 'camera' || mode === 'both') {
        await recorderRef.current.initializeCameraCapture(cameraFacing);
      }
    } catch (error) {
      console.error('Failed to initialize recording:', error);
      setError('Failed to initialize recording. Please check camera permissions.');
    }
  };

  const startRecording = async () => {
    if (!recorderRef.current) return;
    
    try {
      setError(null);
      await recorderRef.current.startRecording(mode);
      setIsRecording(true);
      setRecorderTimeCounter(0);
      
      timerRef.current = setInterval(() => {
        setRecorderTimeCounter(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Failed to start recording. Please try again.');
    }
  };

  const pauseRecording = () => {
    if (!recorderRef.current) return;
    
    try {
      if (isPaused) {
        recorderRef.current.resumeRecording();
        setIsPaused(false);
        
        timerRef.current = setInterval(() => {
          setRecorderTimeCounter(prev => prev + 1);
        }, 1000);
      } else {
        recorderRef.current.pauseRecording();
        setIsPaused(true);
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    } catch (error) {
      console.error('Failed to pause/resume recording:', error);
      setError('Failed to pause/resume recording.');
    }
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    
    try {
      const recordedBlob = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (recordedBlob) {
        setVideoPreview(URL.createObjectURL(recordedBlob));
        // Auto-download the recording
        const { VideoRecorder } = await import('./video.recording.ts');
        VideoRecorder.downloadRecording(recordedBlob, `recording-${mode}-${Date.now()}`);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setError('Failed to stop recording.');
    }
  };

  const switchCamera = async () => {
    const newFacing = cameraFacing === 'user' ? 'environment' : 'user';
    
    if (recorderRef.current && (mode === 'camera' || mode === 'both')) {
      try {
        await recorderRef.current.switchCamera(newFacing);
        setCameraFacing(newFacing);
      } catch (error) {
        console.error('Failed to switch camera:', error);
        setError('Failed to switch camera.');
      }
    }
  };

  const cleanup = () => {
    if (recorderRef.current) {
      recorderRef.current.cleanup();
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }
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
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      ref={controlsRef}
    >
      <div className="recorder-controls-panel">
        <div 
          className="controls-header"
          onMouseDown={handleDragStart}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <h3>Recording - {mode.charAt(0).toUpperCase() + mode.slice(1)}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="preview-section">
          {mode === 'video' && (
            <div className="video-info">
              <div className="video-status">
                <span className="status-icon">🎥</span>
                <p>Recording main video player</p>
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="video-info">
              <div className="video-status">
                <span className="status-icon">📱</span>
                <p>Recording {cameraFacing === 'user' ? 'front' : 'back'} camera</p>
                <p>Camera feed is shown in main video player</p>
              </div>
            </div>
          )}

          {mode === 'both' && (
            <div className="video-info">
              <div className="video-status">
                <span className="status-icon">📹</span>
                <p>Picture-in-Picture recording</p>
                <small>Camera will appear in corner of video</small>
              </div>
            </div>
          )}
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
                <span>●</span> Start Recording
              </button>
            ) : (
              <>
                <button className="pause-btn" onClick={pauseRecording}>
                  <span>{isPaused ? '▶' : '⏸'}</span>
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
                <button className="stop-btn" onClick={stopRecording}>
                  <span>■</span> Stop
                </button>
              </>
            )}
            
            {(mode === 'camera' || mode === 'both') && (
              <button className="switch-camera-btn" onClick={switchCamera} disabled={isRecording}>
                <span>{cameraFacing === 'user' ? '🤳' : '📷'}</span>
                Switch Camera
              </button>
            )}
          </div>
        </div>

        <div className="recording-info">
          <div className="info-row">
            <span className="info-label">Mode:</span>
            <span className="info-value">{mode}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Format:</span>
            <span className="info-value">WebM</span>
          </div>
          {(mode === 'camera' || mode === 'both') && (
            <div className="info-row">
              <span className="info-label">Camera:</span>
              <span className="info-value">{cameraFacing === 'user' ? 'Front' : 'Back'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Initialize recorder controls
export const initializeRecorderControls = (mode: 'video' | 'camera' | 'both') => {
  let recorderControlsRoot: any = null;
  let isControlsVisible = false;

  const createRecorderControlsContainer = () => {
    const container = document.createElement('div');
    container.id = 'recorder-controls-container';
    document.body.appendChild(container);
    return container;
  };

  const showRecorderControls = () => {
    if (!recorderControlsRoot) {
      const container = createRecorderControlsContainer();
      recorderControlsRoot = createRoot(container);
    }

    isControlsVisible = true;
    
    recorderControlsRoot.render(
      <RecorderControls
        mode={mode}
        isVisible={isControlsVisible}
        onClose={() => {
          isControlsVisible = false;
          recorderControlsRoot.render(
            <RecorderControls 
              mode={mode} 
              isVisible={false} 
              onClose={() => {}} 
            />
          );
        }}
      />
    );
  };

// Add CSS styles
const addControlsStyles = () => {
  if (document.getElementById('recorder-controls-styles')) return;
  const style = document.createElement('style');
  style.id = 'recorder-controls-styles';
  style.textContent = `.recorder-controls-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: var(--background-dark);
        border: 1px solid var(--border-medium);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
      }

      .controls-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border-subtle);
      }

      .controls-header h3 {
        color: var(--text-primary);
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .preview-section {
        padding: 16px;
        position: relative;
      }

      .camera-preview {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        background: var(--background-medium);
      }

      .preview-video {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 8px;
      }

      .switch-camera-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
      }

      .video-info {
        text-align: center;
        padding: 20px;
        color: var(--text-secondary);
      }

      .recording-controls {
        padding: 16px;
        border-top: 1px solid var(--border-subtle);
      }

      .timer-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 16px;
      }

      .recording-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-muted);
      }

      .recording-indicator.active {
        background: #ff4444;
        animation: pulse 1s infinite;
      }

      .time {
        font-family: monospace;
        font-size: 18px;
        font-weight: bold;
        color: var(--text-primary);
      }

      .paused-label {
        background: var(--accent-orange);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }

      .control-buttons {
        display: flex;
        gap: 8px;
        justify-content: center;
      }

      .start-btn, .pause-btn, .stop-btn {
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .start-btn {
        background: var(--accent-green);
        color: white;
      }

      .start-btn:hover {
        background: var(--accent-green-light);
      }

      .pause-btn {
        background: var(--accent-orange);
        color: white;
      }

      .stop-btn {
        background: #ff4444;
        color: white;
      }

      .recorded-preview {
        padding: 16px;
        border-top: 1px solid var(--border-subtle);
      }

      .recorded-preview h4 {
        color: var(--text-primary);
        margin: 0 0 12px 0;
      }

      .recorded-video {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .download-btn {
        width: 100%;
        padding: 10px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      }

      .download-btn:hover {
        background: var(--primary-blue-dark);
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }`;
  document.head.appendChild(style);
};

addControlsStyles();
showRecorderControls();
};

  {/* 
  // Add CSS styles
  const addControlsStyles = () => {
    if (document.getElementById('recorder-controls-styles')) return;

    const style = document.createElement('style');
    style.id = 'recorder-controls-styles';
    style.textContent = `
      .recorder-controls-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        background: var(--background-dark);
        border: 1px solid var(--border-medium);
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
      }

      .controls-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--border-subtle);
      }

      .controls-header h3 {
        color: var(--text-primary);
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .preview-section {
        padding: 16px;
        position: relative;
      }

      .camera-preview {
        position: relative;
        border-radius: 8px;
        overflow: hidden;
        background: var(--background-medium);
      }

      .preview-video {
        width: 100%;
        height: 160px;
        object-fit: cover;
        border-radius: 8px;
      }

      .switch-camera-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.6);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
      }

      .video-info {
        text-align: center;
        padding: 20px;
        color: var(--text-secondary);
      }

      .recording-controls {
        padding: 16px;
        border-top: 1px solid var(--border-subtle);
      }

      .timer-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-bottom: 16px;
      }

      .recording-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--text-muted);
      }

      .recording-indicator.active {
        background: #ff4444;
        animation: pulse 1s infinite;
      }

      .time {
        font-family: monospace;
        font-size: 18px;
        font-weight: bold;
        color: var(--text-primary);
      }

      .paused-label {
        background: var(--accent-orange);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
      }

      .control-buttons {
        display: flex;
        gap: 8px;
        justify-content: center;
      }

      .start-btn, .pause-btn, .stop-btn {
        padding: 10px 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .start-btn {
        background: var(--accent-green);
        color: white;
      }

      .start-btn:hover {
        background: var(--accent-green-light);
      }

      .pause-btn {
        background: var(--accent-orange);
        color: white;
      }

      .stop-btn {
        background: #ff4444;
        color: white;
      }

      .recorded-preview {
        padding: 16px;
        border-top: 1px solid var(--border-subtle);
      }

      .recorded-preview h4 {
        color: var(--text-primary);
        margin: 0 0 12px 0;
      }

      .recorded-video {
        width: 100%;
        border-radius: 8px;
        margin-bottom: 12px;
      }

      .download-btn {
        width: 100%;
        padding: 10px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
      }

      .download-btn:hover {
        background: var(--primary-blue-dark);
      }

      @keyframes slideInRight {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  };

  addControlsStyles();
};
*/}