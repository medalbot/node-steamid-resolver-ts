/**
 * Group API Tests
 * Tests all Steam group-related functions with real Steam data
 */

import { describe, expect, test } from 'vitest';
import {
  groupUrlToFullInfo,
  groupUrlToGroupID64,
  SteamGroupNotFoundError,
} from '../index.js';
import { TEST_DATA } from './test-data.js';

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
