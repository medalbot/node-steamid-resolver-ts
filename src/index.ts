/**
 * Steam ID Resolver - TypeScript Implementation
 * Professional Steam profile/group resolution with comprehensive error handling
 */

import type {
  CallbackFunction,
  FullGroupInfo,
  FullProfileInfo,
} from './types.js';

import {
  SteamAPIError,
  SteamGroupNotFoundError,
  SteamProfileNotFoundError,
} from './types.js';
import {
  buildGroupURL,
  buildProfileURL,
  buildSharedfileURL,
  createDualSupport,
  extractString,
} from './utils.js';
import { parseSteamXML, validateSharedfile } from './xml-parser.js';

/**
 * Get the custom profile URL of a user by their steamID64 or full URL
 * @param steamID64 - Steam ID64 or full profile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to customURL string
 */
export function steamID64ToCustomUrl(
  steamID64: string,
  callback?: CallbackFunction<string>,
): Promise<string> {
  return createDualSupport(async () => {
    const url = buildProfileURL(steamID64);
    const response = await parseSteamXML(url);

    if (response.type !== 'profile') {
      throw new SteamProfileNotFoundError(steamID64);
    }

    const customURL = extractString(response.data.customURL);
    if (!customURL) {
      throw new SteamAPIError('Failed to resolve customURL', 'PARSE_ERROR');
    }

    return customURL;
  })(callback);
}

/**
 * Get the profile name of a user by their steamID64 or full URL
 * @param steamID64 - Steam ID64 or full profile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to profile name string
 */
export function steamID64ToProfileName(
  steamID64: string,
  callback?: CallbackFunction<string>,
): Promise<string> {
  return createDualSupport(async () => {
    const url = buildProfileURL(steamID64);
    const response = await parseSteamXML(url);

    if (response.type !== 'profile') {
      throw new SteamProfileNotFoundError(steamID64);
    }

    const profileName = extractString(response.data.steamID);
    if (!profileName) {
      throw new SteamAPIError('Failed to resolve profile name', 'PARSE_ERROR');
    }

    return profileName;
  })(callback);
}

/**
 * Get the steamID64 of a user by their custom profile URL or full URL
 * @param customURL - Custom URL or full profile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to steamID64 string
 */
export function customUrlToSteamID64(
  customURL: string,
  callback?: CallbackFunction<string>,
): Promise<string> {
  return createDualSupport(async () => {
    const url = buildProfileURL(customURL);
    const response = await parseSteamXML(url);

    if (response.type !== 'profile') {
      throw new SteamProfileNotFoundError(customURL);
    }

    const steamID64 = extractString(response.data.steamID64);
    if (!steamID64) {
      throw new SteamAPIError('Failed to resolve steamID64', 'PARSE_ERROR');
    }

    return steamID64;
  })(callback);
}

/**
 * Get the profile name of a user by their custom profile URL or full URL
 * @param customURL - Custom URL or full profile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to profile name string
 */
export function customUrlToProfileName(
  customURL: string,
  callback?: CallbackFunction<string>,
): Promise<string> {
  return createDualSupport(async () => {
    const url = buildProfileURL(customURL);
    const response = await parseSteamXML(url);

    if (response.type !== 'profile') {
      throw new SteamProfileNotFoundError(customURL);
    }

    const profileName = extractString(response.data.steamID);
    if (!profileName) {
      throw new SteamAPIError('Failed to resolve profile name', 'PARSE_ERROR');
    }

    return profileName;
  })(callback);
}

/**
 * Get the full information of a user by their steamID64 or full URL
 * @param steamID64 - Steam ID64 or full profile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to full profile information object
 */
export function steamID64ToFullInfo(
  steamID64: string,
  callback?: CallbackFunction<FullProfileInfo>,
): Promise<FullProfileInfo> {
  return createDualSupport(async () => {
    const url = buildProfileURL(steamID64);
    const response = await parseSteamXML(url);

    if (response.type !== 'profile') {
      throw new SteamProfileNotFoundError(steamID64);
    }

    return response.data;
  })(callback);
}

/**
 * Get the full information of a user by their custom profile URL or full URL
 * @param customURL - Custom URL or full profile URL
 * @param callback - Optional callback function
 * @returns Promise resolving to full profile information object
 */
export function customUrlToFullInfo(
  customURL: string,
  callback?: CallbackFunction<FullProfileInfo>,
): Promise<FullProfileInfo> {
  return createDualSupport(async () => {
    const url = buildProfileURL(customURL);
    const response = await parseSteamXML(url);

    if (response.type !== 'profile') {
      throw new SteamProfileNotFoundError(customURL);
    }

    return response.data;
  })(callback);
}

/**
 * Get the groupID64 of a group by groupURL or full URL
 * @param groupURL - Group custom name or full URL
 * @param callback - Optional callback function
 * @returns Promise resolving to groupID64 string
 */
export function groupUrlToGroupID64(
  groupURL: string,
  callback?: CallbackFunction<string>,
): Promise<string> {
  return createDualSupport(async () => {
    const url = buildGroupURL(groupURL);
    const response = await parseSteamXML(url);

    if (response.type !== 'group') {
      throw new SteamGroupNotFoundError(groupURL);
    }

    const groupID64 = extractString(response.data.groupID64);
    if (!groupID64) {
      throw new SteamAPIError('Failed to resolve groupID64', 'PARSE_ERROR');
    }

    return groupID64;
  })(callback);
}

/**
 * Get the full information of a group by groupURL or full URL
 * @param groupURL - Group custom name or full URL
 * @param callback - Optional callback function
 * @returns Promise resolving to full group information object
 */
export function groupUrlToFullInfo(
  groupURL: string,
  callback?: CallbackFunction<FullGroupInfo>,
): Promise<FullGroupInfo> {
  return createDualSupport(async () => {
    const url = buildGroupURL(groupURL);
    const response = await parseSteamXML(url);

    if (response.type !== 'group') {
      throw new SteamGroupNotFoundError(groupURL);
    }

    return response.data;
  })(callback);
}

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

// Export all types for consumer use
export type {
  CallbackFunction,
  ExtendedProfileFields,
  FullGroupInfo,
  FullProfileInfo,
  MinimalSteamProfile,
  ResolverOptions,
  SteamXMLResponse,
} from './types.js';

// Export custom error classes
export {
  SteamAPIError,
  SteamEmptyResponseError,
  SteamGroupNotFoundError,
  SteamPrivateProfileError,
  SteamProfileNotFoundError,
} from './types.js';
