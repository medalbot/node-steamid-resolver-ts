/**
 * Steam Utility API Functions
 * Handles validation and other utility operations
 */

import { createDualSupport } from '../core/common-utils.js';
import { buildSharedfileURL } from '../core/url-utils.js';
import { validateSharedfile } from '../core/xml-parser.js';
import type { CallbackFunction } from '../types/steam-types.js';

/**
 * Checks if the provided ID or full URL points to a valid sharedfile
 * @param sharedfileID - Sharedfile ID or full sharedfile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to boolean indicating validity
 */
export function isValidSharedfileID(
  sharedfileID: string,
  callback?: CallbackFunction<boolean>,
): Promise<boolean> {
  return createDualSupport(async () => {
    const url = buildSharedfileURL(sharedfileID);
    return await validateSharedfile(url);
  })(callback);
}
