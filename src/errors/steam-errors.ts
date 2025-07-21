/**
 * Custom error classes for Steam API operations
 * Provides specific error types for better error handling and debugging
 */

/** Base error class for Steam API related errors */
export class SteamAPIError extends Error {
  constructor(
    message: string,
    public readonly code:
      | 'PROFILE_NOT_FOUND'
      | 'GROUP_NOT_FOUND'
      | 'PRIVATE_PROFILE'
      | 'NETWORK_ERROR'
      | 'PARSE_ERROR'
      | 'EMPTY_RESPONSE',
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'SteamAPIError';
  }
}

/** Error thrown when a Steam profile cannot be found */
export class SteamProfileNotFoundError extends SteamAPIError {
  constructor(identifier: string) {
    super(
      `The specified profile could not be found: ${identifier}`,
      'PROFILE_NOT_FOUND',
    );
  }
}

/** Error thrown when a Steam group cannot be found */
export class SteamGroupNotFoundError extends SteamAPIError {
  constructor(identifier: string) {
    super(
      `The specified group could not be found: ${identifier}`,
      'GROUP_NOT_FOUND',
    );
  }
}

/** Error thrown when trying to access a private Steam profile */
export class SteamPrivateProfileError extends SteamAPIError {
  constructor(identifier: string) {
    super(`The specified profile is private: ${identifier}`, 'PRIVATE_PROFILE');
  }
}

/** Error thrown when Steam returns an empty response */
export class SteamEmptyResponseError extends SteamAPIError {
  constructor(identifier: string) {
    super(
      `Steam returned an empty response for: ${identifier}`,
      'EMPTY_RESPONSE',
    );
  }
}
