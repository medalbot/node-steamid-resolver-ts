/**
 * Steam Profile API Functions
 * Handles Steam profile resolution, conversion, and information retrieval
 */

import { createDualSupport, extractString } from '../core/common-utils.js';
import { buildProfileURL } from '../core/url-utils.js';
import { parseSteamXML } from '../core/xml-parser.js';
import {
  SteamAPIError,
  SteamProfileNotFoundError,
} from '../errors/steam-errors.js';
import type {
  CallbackFunction,
  FullProfileInfo,
} from '../types/steam-types.js';

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
