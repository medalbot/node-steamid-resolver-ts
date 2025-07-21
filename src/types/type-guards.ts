/**
 * Type guards for runtime validation of Steam API responses
 * Provides type-safe checks for different response formats
 */

import type {
  FullGroupInfo,
  FullProfileInfo,
  MinimalSteamProfile,
  SteamErrorResponse,
} from './steam-types.js';

/** Type guard for profile responses */
export function isProfileResponse(
  data: unknown,
): data is { profile: FullProfileInfo } {
  return !!(
    data &&
    typeof data === 'object' &&
    data !== null &&
    'profile' in data
  );
}

/** Type guard for group responses */
export function isGroupResponse(
  data: unknown,
): data is { memberList: FullGroupInfo } {
  return !!(
    data &&
    typeof data === 'object' &&
    data !== null &&
    'memberList' in data
  );
}

/** Type guard for error responses */
export function isErrorResponse(data: unknown): data is SteamErrorResponse {
  return !!(
    data &&
    typeof data === 'object' &&
    data !== null &&
    'response' in data &&
    // biome-ignore lint/suspicious/noExplicitAny: Type guard requires any for progressive narrowing
    typeof (data as any).response === 'object' &&
    // biome-ignore lint/suspicious/noExplicitAny: Type guard requires any for progressive narrowing
    (data as any).response !== null &&
    // biome-ignore lint/suspicious/noExplicitAny: Type guard requires any for progressive narrowing
    'error' in (data as any).response
  );
}

/** Check if response is empty */
export function isEmptyResponse(data: unknown): boolean {
  return (
    !data ||
    (typeof data === 'object' &&
      data !== null &&
      Object.keys(data).length === 0)
  );
}

/** Validate if profile has minimal required fields */
export function hasMinimalProfileData(
  profile: unknown,
): profile is MinimalSteamProfile {
  if (!profile || typeof profile !== 'object' || profile === null) {
    return false;
  }

  // biome-ignore lint/suspicious/noExplicitAny: Type guard requires any for progressive narrowing
  const p = profile as any;
  return !!(
    p.steamID64 &&
    Array.isArray(p.steamID64) &&
    p.steamID &&
    Array.isArray(p.steamID) &&
    p.onlineState &&
    Array.isArray(p.onlineState) &&
    p.privacyState &&
    Array.isArray(p.privacyState)
  );
}
