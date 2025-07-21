/**
 * Steam ID Resolver - TypeScript Implementation
 * Professional Steam profile/group resolution with comprehensive error handling
 *
 * @packageDocumentation
 */

// Profile API Functions
export {
  customUrlToFullInfo,
  customUrlToProfileName,
  customUrlToSteamID64,
  steamID64ToCustomUrl,
  steamID64ToFullInfo,
  steamID64ToProfileName,
} from './api/profile-api.js';

// Group API Functions
export { groupUrlToFullInfo, groupUrlToGroupID64 } from './api/group-api.js';

// Utility API Functions
export { isValidSharedfileID } from './api/utility-api.js';

// Type Exports
export type {
  CallbackFunction,
  ExtendedProfileFields,
  FullGroupInfo,
  FullProfileInfo,
  MinimalSteamProfile,
  ResolverOptions,
  SteamXMLResponse,
} from './types/steam-types.js';

// Error Class Exports
export {
  SteamAPIError,
  SteamEmptyResponseError,
  SteamGroupNotFoundError,
  SteamPrivateProfileError,
  SteamProfileNotFoundError,
} from './errors/steam-errors.js';
