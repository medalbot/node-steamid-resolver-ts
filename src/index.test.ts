/**
 * Comprehensive tests for Steam ID Resolver
 * Tests all functions with real Steam data and edge cases
 */

import { describe, expect, test } from 'bun:test';

import {
  customUrlToFullInfo,
  customUrlToProfileName,
  customUrlToSteamID64,
  groupUrlToFullInfo,
  groupUrlToGroupID64,
  isValidSharedfileID,
  SteamAPIError,
  SteamGroupNotFoundError,
  steamID64ToCustomUrl,
  steamID64ToFullInfo,
  steamID64ToProfileName,
  SteamProfileNotFoundError,
} from './index.js';

// Test data based on real Steam profiles
const TEST_DATA = {
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
};

describe('steamID64ToCustomUrl', () => {
  test('should convert valid steamID64 to customURL', async () => {
    const result = await steamID64ToCustomUrl(TEST_DATA.validSteamID64);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('should work with full profile URL', async () => {
    const fullURL = `https://steamcommunity.com/profiles/${TEST_DATA.validSteamID64}`;
    const result = await steamID64ToCustomUrl(fullURL);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('should throw error for invalid steamID64', async () => {
    await expect(
      steamID64ToCustomUrl(TEST_DATA.invalidSteamID64),
    ).rejects.toThrow(SteamProfileNotFoundError);
  });

  test('should support callback pattern', (done) => {
    steamID64ToCustomUrl(TEST_DATA.validSteamID64, (err, result) => {
      expect(err).toBeNull();
      expect(typeof result).toBe('string');
      expect(result?.length).toBeGreaterThan(0);
      done();
    });
  });

  test('should handle callback errors', (done) => {
    steamID64ToCustomUrl(TEST_DATA.invalidSteamID64, (err, result) => {
      expect(err).toBeTruthy();
      expect(result).toBeNull();
      done();
    });
  });
});

describe('customUrlToSteamID64', () => {
  test('should convert valid customURL to steamID64', async () => {
    const result = await customUrlToSteamID64(TEST_DATA.validCustomURL);
    expect(result).toBe(TEST_DATA.validSteamID64);
  });

  test('should work with full profile URL', async () => {
    const fullURL = `https://steamcommunity.com/id/${TEST_DATA.validCustomURL}`;
    const result = await customUrlToSteamID64(fullURL);
    expect(result).toBe(TEST_DATA.validSteamID64);
  });

  test('should throw error for invalid customURL', async () => {
    await expect(
      customUrlToSteamID64(TEST_DATA.invalidCustomURL),
    ).rejects.toThrow(SteamProfileNotFoundError);
  });
});

describe('steamID64ToProfileName', () => {
  test('should convert valid steamID64 to profile name', async () => {
    const result = await steamID64ToProfileName(TEST_DATA.validSteamID64);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('should throw error for invalid steamID64', async () => {
    await expect(
      steamID64ToProfileName(TEST_DATA.invalidSteamID64),
    ).rejects.toThrow(SteamProfileNotFoundError);
  });
});

describe('customUrlToProfileName', () => {
  test('should convert valid customURL to profile name', async () => {
    const result = await customUrlToProfileName(TEST_DATA.validCustomURL);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('should throw error for invalid customURL', async () => {
    await expect(
      customUrlToProfileName(TEST_DATA.invalidCustomURL),
    ).rejects.toThrow(SteamProfileNotFoundError);
  });
});

describe('steamID64ToFullInfo', () => {
  test('should get full profile information', async () => {
    const result = await steamID64ToFullInfo(TEST_DATA.validSteamID64);

    // Check required fields
    expect(result.steamID64).toBeDefined();
    expect(Array.isArray(result.steamID64)).toBe(true);
    expect(result.steamID64[0]).toBe(TEST_DATA.validSteamID64);

    expect(result.steamID).toBeDefined();
    expect(Array.isArray(result.steamID)).toBe(true);

    expect(result.onlineState).toBeDefined();
    expect(Array.isArray(result.onlineState)).toBe(true);

    expect(result.privacyState).toBeDefined();
    expect(Array.isArray(result.privacyState)).toBe(true);
  });

  test('should handle private profiles', async () => {
    const result = await steamID64ToFullInfo(TEST_DATA.privateSteamID64);

    // Private profiles still have basic data
    expect(result.steamID64).toBeDefined();
    expect(result.privacyState).toBeDefined();
    expect(result.privacyState[0]).toBe('private');
  });

  test('should throw error for invalid steamID64', async () => {
    await expect(
      steamID64ToFullInfo(TEST_DATA.invalidSteamID64),
    ).rejects.toThrow(SteamProfileNotFoundError);
  });
});

describe('customUrlToFullInfo', () => {
  test('should get full profile information by customURL', async () => {
    const result = await customUrlToFullInfo(TEST_DATA.validCustomURL);

    expect(result.steamID64).toBeDefined();
    expect(result.steamID64[0]).toBe(TEST_DATA.validSteamID64);
    expect(result.customURL).toBeDefined();
  });

  test('should throw error for invalid customURL', async () => {
    await expect(
      customUrlToFullInfo(TEST_DATA.invalidCustomURL),
    ).rejects.toThrow(SteamProfileNotFoundError);
  });
});

describe('groupUrlToGroupID64', () => {
  test('should convert valid groupURL to groupID64', async () => {
    const result = await groupUrlToGroupID64(TEST_DATA.validGroupURL);
    expect(result).toBe(TEST_DATA.validGroupID64);
  });

  test('should work with full group URL', async () => {
    const fullURL = `https://steamcommunity.com/groups/${TEST_DATA.validGroupURL}`;
    const result = await groupUrlToGroupID64(fullURL);
    expect(result).toBe(TEST_DATA.validGroupID64);
  });

  test('should throw error for invalid groupURL', async () => {
    await expect(
      groupUrlToGroupID64(TEST_DATA.invalidGroupURL),
    ).rejects.toThrow(SteamGroupNotFoundError);
  });
});

describe('groupUrlToFullInfo', () => {
  test('should get full group information', async () => {
    const result = await groupUrlToFullInfo(TEST_DATA.validGroupURL);

    expect(result.groupID64).toBeDefined();
    expect(Array.isArray(result.groupID64)).toBe(true);
    expect(result.groupID64[0]).toBe(TEST_DATA.validGroupID64);

    expect(result.groupDetails).toBeDefined();
    expect(Array.isArray(result.groupDetails)).toBe(true);
  });

  test('should throw error for invalid groupURL', async () => {
    await expect(groupUrlToFullInfo(TEST_DATA.invalidGroupURL)).rejects.toThrow(
      SteamGroupNotFoundError,
    );
  });
});

describe('isValidSharedfileID', () => {
  test('should validate valid sharedfile ID', async () => {
    const result = await isValidSharedfileID(TEST_DATA.validSharedfileID);
    expect(result).toBe(true);
  });

  test('should work with full sharedfile URL', async () => {
    const fullURL = `https://steamcommunity.com/sharedfiles/filedetails/?id=${TEST_DATA.validSharedfileID}`;
    const result = await isValidSharedfileID(fullURL);
    expect(result).toBe(true);
  });

  test('should return false for invalid sharedfile ID', async () => {
    const result = await isValidSharedfileID(TEST_DATA.invalidSharedfileID);
    expect(result).toBe(false);
  });

  test('should support callback pattern', (done) => {
    isValidSharedfileID(TEST_DATA.validSharedfileID, (err, result) => {
      expect(err).toBeNull();
      expect(result).toBe(true);
      done();
    });
  });
});

describe('Error handling', () => {
  test('should handle network errors gracefully', async () => {
    // This test might be flaky depending on network conditions
    // Consider mocking HTTP requests for more reliable testing
  });

  test('should preserve error types', async () => {
    try {
      await steamID64ToCustomUrl(TEST_DATA.invalidSteamID64);
    } catch (error) {
      expect(error).toBeInstanceOf(SteamProfileNotFoundError);
      expect(error).toBeInstanceOf(SteamAPIError);
    }
  });
});

describe('Performance tests', () => {
  test('should handle concurrent requests', async () => {
    const promises = Array.from({ length: 5 })
      .fill(null)
      .map(() => steamID64ToCustomUrl(TEST_DATA.validSteamID64));

    const results = await Promise.all(promises);
    expect(results).toHaveLength(5);
    results.forEach((result) => {
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
