// src/core/diagnostics/errorUtils.ts
/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */
import { DetectedError, ErrorSeverity } from "./errorTypes";

// Array to store all detected errors
const errors: DetectedError[] = [];

/**
 * Maps severity level to a console color for visual impact.
 */
function getColor(sev: ErrorSeverity): string {
  return {
    CRITICAL: "red",
    HIGH: "orange",
    MEDIUM: "yellow",
    LOW: "gray"
  }[sev];
}

/**
 * Logs a structured error to the console, displays the full table,
 * and provides the diagnostic hint.
 */
export function logError(err: DetectedError) {
  errors.push(err);

  console.groupCollapsed(
    `%c[Zephyra Diagnostics] ${err.severity}`,
    `color:${getColor(err.severity)};font-weight:bold`
  );

  // Use a custom object for table output to ensure desired column order
  const tableData = errors.map(e => ({
      'Time': e.time.split('T')[1]?.substring(0, 8) || 'N/A',
      'Category': e.category,
      'Message': e.message,
      'Severity': e.severity,
      'Must Fix': e.mustFix ? '✅' : '❌',
      'Source': e.source ?? 'N/A'
  }));

  console.table(tableData);
  console.info("ℹ️ Hint:", err.hint ?? "No suggestion");
  console.groupEnd();
}

/**
 * A runtime assertion utility to ensure a value is not null or undefined.
 * This helps catch missing dependencies or initialization issues early.
 * @throws {Error} if value is null or undefined.
 */
export function assertExists<T>(
  value: T | null | undefined,
  label: string
): T {
  if (value == null) {
    // Log a CRITICAL diagnostic error immediately
    logError({
        time: new Date().toISOString(),
        category: "Logic Error (Assertion)",
        message: `Missing required value: ${label}`,
        severity: "CRITICAL",
        mustFix: true,
        hint: `The value for '${label}' was expected but found to be null or undefined. Check initialization flow.`
    });
    
    // Throw a standard error to halt execution as requested
    throw new Error(`Missing required value: ${label}`);
  }
  return value;
}