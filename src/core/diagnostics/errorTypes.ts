// src/core/diagnostics/errorTypes.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
/**
 * Defines the priority level for the detected error.
 */
export type ErrorSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

/**
 * Interface for a structured error object used by the diagnostics layer.
 */
export interface DetectedError {
  time: string;
  category: string;
  message: string;
  source?: string;
  severity: ErrorSeverity;
  mustFix: boolean;
  hint?: string;
}