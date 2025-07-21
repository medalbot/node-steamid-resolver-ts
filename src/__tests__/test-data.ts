/**
 * Shared test data for Steam ID Resolver tests
 * Contains real Steam profile and group data for testing
 */

export const TEST_DATA = {
  // Valid public profile
  validSteamID64: '76561198260031749',
  validCustomURL: '3urobeat',
  validProfileName: '3urobeat', // This might change, so tests should be flexible

  // Private profile
  privateSteamID64: '76561199106614750',

  // Valid group
  validGroupURL: '3urobeatGroup',
  validGroupID64: '103582791464712227',

  // Invalid data
  invalidSteamID64: '86561198260031749',
  invalidCustomURL: 'thisuserdoesnotexist123456789',
  invalidGroupURL: 'thisgroupdoesnotexist123456789',

  // Valid sharedfile
  validSharedfileID: '2966606880',
  invalidSharedfileID: '123',
} as const;
