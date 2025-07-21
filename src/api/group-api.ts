/**
 * Steam Group API Functions
 * Handles Steam group resolution and information retrieval
 */

import { createDualSupport, extractString } from '../core/common-utils.js';
import { buildGroupURL } from '../core/url-utils.js';
import { parseSteamXML } from '../core/xml-parser.js';
import {
  SteamAPIError,
  SteamGroupNotFoundError,
} from '../errors/steam-errors.js';
import type { CallbackFunction, FullGroupInfo } from '../types/steam-types.js';

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
