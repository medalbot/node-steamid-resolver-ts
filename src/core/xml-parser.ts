/**
 * XML parsing utilities for Steam API responses
 * Uses xml2js for parsing and provides robust error handling
 */

import { parseString } from 'xml2js';

import {
  SteamAPIError,
  SteamEmptyResponseError,
  SteamGroupNotFoundError,
  SteamProfileNotFoundError,
} from '../errors/steam-errors.js';
import type {
  RawXMLParseResult,
  SteamXMLResponse,
} from '../types/steam-types.js';
import {
  hasMinimalProfileData,
  isEmptyResponse,
  isErrorResponse,
  isGroupResponse,
  isProfileResponse,
} from '../types/type-guards.js';
import { debugLog, extractString, withRetry } from './common-utils.js';

/** Parse XML string to JSON using xml2js */
function parseXMLToJSON(xmlString: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    parseString(
      xmlString,
      {
        explicitArray: true, // Always use arrays for consistency with original
        trim: true,
        normalize: true,
      },
      (err: Error | null, result: unknown) => {
        if (err) {
          reject(
            new SteamAPIError(
              `XML parsing failed: ${err.message}`,
              'PARSE_ERROR',
              err,
            ),
          );
        } else {
          resolve(result);
        }
      },
    );
  });
}

/** Fetch XML data from Steam with proper error handling */
async function fetchSteamXML(url: string): Promise<string> {
  debugLog(`Fetching XML from: ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; node-steamid-resolver-ts)',
      },
    });

    if (!response.ok) {
      throw new SteamAPIError(
        `HTTP ${response.status}: ${response.statusText}`,
        'NETWORK_ERROR',
      );
    }

    const xmlText = await response.text();
    debugLog('Successfully retrieved XML data');

    return xmlText;
  } catch (error) {
    if (error instanceof SteamAPIError) {
      throw error;
    }

    debugLog(`Network error: ${error}`);
    throw new SteamAPIError(
      `Failed to fetch data from Steam: ${error}`,
      'NETWORK_ERROR',
      error instanceof Error ? error : undefined,
    );
  }
}

/** Handle redirect resolution for private profiles */
async function resolveCustomURLFromRedirect(
  url: string,
): Promise<string | null> {
  debugLog(`Attempting to resolve customURL from redirect: ${url}`);

  try {
    const response = await fetch(url, {
      redirect: 'manual', // Don't follow redirects automatically
    });

    const location = response.headers.get('location');

    if (location?.includes('steamcommunity.com/id/')) {
      const split = location.split('/');
      if (split[split.length - 1] === '') split.pop();

      const customURL = split[split.length - 1];
      debugLog(`Resolved customURL from redirect: ${customURL}`);
      return customURL || null;
    }

    return null;
  } catch (error) {
    debugLog(`Failed to resolve redirect: ${error}`);
    return null;
  }
}

/** Parse and validate Steam XML response */
export async function parseSteamXML(url: string): Promise<SteamXMLResponse> {
  return withRetry(async () => {
    const xmlText = await fetchSteamXML(url);

    // Handle empty responses (invalid profiles)
    if (!xmlText.trim() || xmlText.length < 10) {
      throw new SteamEmptyResponseError('Steam returned empty response');
    }

    // Check for obvious error conditions before parsing
    if (
      !xmlText.includes('<?xml') &&
      !xmlText.includes('<profile') &&
      !xmlText.includes('<memberList')
    ) {
      // Detect group-specific errors based on URL context
      if (url.includes('/groups/') || url.includes('memberslistxml')) {
        throw new SteamGroupNotFoundError('group');
      }

      // Check for common group error messages in HTML response
      if (
        xmlText.includes('group could not be found') ||
        xmlText.includes('group does not exist') ||
        xmlText.includes('Group') ||
        (xmlText.includes('<html') && xmlText.includes('error'))
      ) {
        throw new SteamGroupNotFoundError('group');
      }

      throw new SteamAPIError('Invalid XML response from Steam', 'PARSE_ERROR');
    }

    const parsed = (await parseXMLToJSON(xmlText)) as RawXMLParseResult;
    debugLog('XML parsed successfully', { keys: Object.keys(parsed) });

    // Handle empty/null responses
    if (isEmptyResponse(parsed)) {
      throw new SteamEmptyResponseError('Steam returned empty response');
    }

    // Handle error responses
    if (isErrorResponse(parsed)) {
      const errorMessage =
        extractString(parsed.response.error) || 'Unknown error';

      if (
        errorMessage.includes('profile could not be found') ||
        errorMessage.includes('The specified profile could not be found') ||
        errorMessage.includes('Failed loading profile data')
      ) {
        throw new SteamProfileNotFoundError('profile');
      }
      if (errorMessage.includes('group could not be found')) {
        throw new SteamGroupNotFoundError('group');
      }

      throw new SteamAPIError(errorMessage, 'PARSE_ERROR');
    }

    // Handle profile responses
    if (isProfileResponse(parsed)) {
      const profile = parsed.profile;

      // Validate minimal profile data
      if (!hasMinimalProfileData(profile)) {
        throw new SteamAPIError(
          'Profile missing required fields',
          'PARSE_ERROR',
        );
      }

      // Handle private profile customURL resolution
      if (
        profile.privacyState &&
        extractString(profile.privacyState) !== 'public'
      ) {
        debugLog('Profile is private, attempting customURL resolution');

        if (url.includes('steamcommunity.com/profiles/')) {
          const customURL = await resolveCustomURLFromRedirect(url);
          if (customURL) {
            profile.customURL = [customURL];
          }
        }

        if (url.includes('steamcommunity.com/id/')) {
          const split = url.split('/');
          const customURL = split[split.length - 1]?.replace('?xml=1', '');
          if (customURL) {
            profile.customURL = [customURL];
          }
        }
      }

      return { type: 'profile', data: profile };
    }

    // Handle group responses
    if (isGroupResponse(parsed)) {
      return { type: 'group', data: parsed.memberList };
    }

    // Fallback error
    throw new SteamAPIError(
      'Unexpected response format from Steam',
      'PARSE_ERROR',
    );
  });
}

/** Validate sharedfile by checking if it exists */
export async function validateSharedfile(url: string): Promise<boolean> {
  debugLog(`Validating sharedfile: ${url}`);

  try {
    const response = await fetch(url);
    const html = await response.text();

    // Check for error indicators in the HTML
    const isInvalid =
      html.includes('There was a problem accessing the item') ||
      html.includes('That item does not exist') ||
      html.includes('error_message');

    return !isInvalid;
  } catch (error) {
    debugLog(`Sharedfile validation failed: ${error}`);
    return false;
  }
}
