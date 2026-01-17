// saveCaptureFrame.tsx
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import React from 'react';
import { Folder } from 'lucide-react';

interface SaveCaptureFrameProps {
  imageSrc: string;
  fileName: string;
}

export const SaveCaptureFrame: React.FC<SaveCaptureFrameProps> = ({ imageSrc, fileName }) => {
  // Path is illustrative as browsers cannot programmatically get the full OS path for security
  const defaultPath = "Downloads/"; 

  return (
    <div className="save-capture-preview">
      <div className="preview-image-container">
        <img src={imageSrc} alt="Capture Preview" />
      </div>
      <div className="preview-info">
        <span className="file-name">{fileName}</span>
        <div className="file-path">
          <Folder size={12} />
          <span>{defaultPath}{fileName}</span>
        </div>
      </div>
    </div>
  );
};