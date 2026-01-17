/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

export interface OCRResult {
  text: string;
  confidence: number;
  bbox: { x: number; y: number; w: number; h: number };
}

export const highlightColors = [
  '#0066ff', '#6cc24a', '#ff6b35', '#f7931e', 
  '#e0e0e0', '#ff0000', '#9b59b6', '#1abc9c'
];

export const processVideoFrameOCR = async (rect: { x: number; y: number; w: number; h: number }): Promise<OCRResult> => {
  // Simulate OCR Processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: "Detected Text from Video Frame",
        confidence: 0.98,
        bbox: rect
      });
    }, 800);
  });
};