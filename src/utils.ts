/**
 * Utility functions for Steam ID resolution
 * Handles URL parsing, parameter validation, and common operations
 */

/** Extract ID/username from full Steam URL or return as-is if already clean */
export function parseParam(param: string): string {
  if (!param || typeof param !== 'string') {
    throw new Error('Parameter must be a non-empty string');
  }

  // Check if full URL was provided
  if (param.includes('steamcommunity.com/')) {
    const split = param.split('/');

    // Remove trailing slash if present
    if (split[split.length - 1] === '') {
      split.pop();
    }

    return split[split.length - 1] || '';
  }

  return param.trim();
}

/** Validate Steam ID64 format */
export function isValidSteamID64(steamId: string): boolean {
  // Steam ID64s are 17-digit numbers starting with 765611979
  const steamIdRegex = /^765611\d{11}$/;
  return steamIdRegex.test(steamId);
}

/** Validate custom URL format */
export function isValidCustomURL(customUrl: string): boolean {
  // Custom URLs can contain letters, numbers, underscores, and hyphens
  // Minimum 3 characters, maximum 32 characters
  const customUrlRegex = /^[\w-]{3,32}$/;
  return customUrlRegex.test(customUrl);
}

/** Build Steam profile XML URL */
export function buildProfileURL(identifier: string): string {
  const cleanId = parseParam(identifier);

  if (isValidSteamID64(cleanId)) {
    return `https://steamcommunity.com/profiles/${cleanId}?xml=1`;
  } else {
    return `https://steamcommunity.com/id/${cleanId}?xml=1`;
  }
}

/** Build Steam group XML URL */
export function buildGroupURL(groupIdentifier: string): string {
  const cleanId = parseParam(groupIdentifier);
  return `https://steamcommunity.com/groups/${cleanId}/memberslistxml?xml=1`;
}

/** Build sharedfile URL */
export function buildSharedfileURL(sharedfileId: string): string {
  // If it's a full sharedfile URL, extract the ID from query parameter
  if (sharedfileId.includes('steamcommunity.com/sharedfiles/')) {
    const url = new URL(sharedfileId);
    const id = url.searchParams.get('id');
    if (id) {
      return `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`;
    }
    return sharedfileId; // Return as-is if no ID found
  }

  const cleanId = parseParam(sharedfileId);
  return `https://steamcommunity.com/sharedfiles/filedetails/?id=${cleanId}`;
}

/** Type-safe wrapper for Promise/Callback dual support */
export function createDualSupport<T>(
  operation: () => Promise<T>,
): (callback?: (err: string | null, result: T | null) => void) => Promise<T> {
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
