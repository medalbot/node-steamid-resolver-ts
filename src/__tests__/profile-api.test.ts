/**
 * Profile API Tests
 * Tests all Steam profile-related functions with real Steam data
 */

import { describe, expect, test } from 'vitest';
import {
  customUrlToFullInfo,
  customUrlToProfileName,
  customUrlToSteamID64,
  steamID64ToCustomUrl,
  steamID64ToFullInfo,
  steamID64ToProfileName,
  SteamProfileNotFoundError,
} from '../index.js';
import { TEST_DATA } from './test-data.js';

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

  test('should support callback pattern', async () => {
    return new Promise<void>((resolve) => {
      steamID64ToCustomUrl(TEST_DATA.validSteamID64, (err, result) => {
        expect(err).toBeNull();
        expect(typeof result).toBe('string');
        expect(result?.length).toBeGreaterThan(0);
        resolve();
      });
    });
  });

  test('should handle callback errors', async () => {
    return new Promise<void>((resolve) => {
      steamID64ToCustomUrl(TEST_DATA.invalidSteamID64, (err, result) => {
        expect(err).toBeTruthy();
        expect(result).toBeNull();
        resolve();
      });
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
