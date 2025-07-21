/**
 * Utility API Tests
 * Tests utility functions like sharedfile validation
 */

import { describe, expect, test } from 'vitest';
import { isValidSharedfileID } from '../index.js';
import { TEST_DATA } from './test-data.js';

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

  test('should support callback pattern', async () => {
    return new Promise<void>((resolve) => {
      isValidSharedfileID(TEST_DATA.validSharedfileID, (err, result) => {
        expect(err).toBeNull();
        expect(result).toBe(true);
        resolve();
      });
    });
  });
});
