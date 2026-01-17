/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

// snapshot.capture.frame.ts | the processor 

export const processFrameCapture = async (
  videoElement: HTMLVideoElement,
  cropArea: { x: number; y: number; width: number; height: number }
): Promise<{ dataUri: string; blob: Blob }> => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Could not get canvas context");

      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      const videoRect = videoElement.getBoundingClientRect();
      const scaleX = videoElement.videoWidth / videoRect.width;
      const scaleY = videoElement.videoHeight / videoRect.height;

      ctx.drawImage(
        videoElement,
        cropArea.x * scaleX,
        cropArea.y * scaleY,
        cropArea.width * scaleX,
        cropArea.height * scaleY,
        0, 0,
        cropArea.width,
        cropArea.height
      );

      const dataUri = canvas.toDataURL('image/png', 0.95);
      canvas.toBlob((blob) => {
        if (blob) resolve({ dataUri, blob });
        else reject(new Error("Blob conversion failed"));
      }, 'image/png', 0.95);
    } catch (err) {
      reject(err);
    }
  });
};

export const downloadImage = (dataUri: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `capture-${timestamp}.png`;
  const link = document.createElement('a');
  link.href = dataUri;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return fileName; // Return filename for the notifier
};