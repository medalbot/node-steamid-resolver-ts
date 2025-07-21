/**
 * Common utility functions for Steam ID resolution
 * Provides helper functions for error handling, data extraction, and async operations
 */

import type { CallbackFunction } from '../types/steam-types.js';

/** Type-safe wrapper for Promise/Callback dual support */
export function createDualSupport<T>(
  operation: () => Promise<T>,
): (callback?: CallbackFunction<T>) => Promise<T> {
  return (callback?) => {
    const promise = operation();

    if (callback && typeof callback === 'function') {
      // Handle both success and error with callback
      promise
        .then((result) => callback(null, result))
        .catch((error) => callback(error.message || String(error), null));

      // Return a promise that never rejects when callback is provided
      return promise.catch(() => {
        // Swallow rejections when callback is provided to prevent UnhandledPromiseRejection
        return undefined as T;
      });
    }

    return promise;
  };
}

/** Retry mechanism for network requests */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError || new Error('Unknown error occurred');
}

/** Safe array access for Steam XML arrays */
export function getFirstArrayItem<T>(arr: T[] | undefined): T | undefined {
  return arr && Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
}

/** Convert Steam XML array format to simple string */
export function extractString(
  value: [string] | string | undefined,
): string | undefined {
  if (Array.isArray(value) && value.length > 0) {
    return value[0];
  }
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

/** Debugging helper (can be disabled in production) */
export function debugLog(message: string, data?: unknown): void {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG === 'steamid-resolver'
  ) {
    console.warn(`[steamid-resolver] ${message}`, data || '');
  }
}
