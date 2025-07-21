/**
 * Error Handling and Performance Tests
 * Tests error scenarios and performance characteristics
 */

import { describe, expect, test } from 'vitest';
import {
  SteamAPIError,
  steamID64ToCustomUrl,
  SteamProfileNotFoundError,
} from '../index.js';
import { TEST_DATA } from './test-data.js';

describe('Error handling', () => {
  test('should preserve error types', async () => {
    try {
      await steamID64ToCustomUrl(TEST_DATA.invalidSteamID64);
      // Should not reach here
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toBeInstanceOf(SteamProfileNotFoundError);
      expect(error).toBeInstanceOf(SteamAPIError);
    }
  });

  test('should handle empty or malformed input gracefully', async () => {
    await expect(steamID64ToCustomUrl('')).rejects.toThrow();
    await expect(steamID64ToCustomUrl('invalid-format')).rejects.toThrow();
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

  test('should complete requests within reasonable time', async () => {
    const startTime = Date.now();
    await steamID64ToCustomUrl(TEST_DATA.validSteamID64);
    const endTime = Date.now();

    // Request should complete within 10 seconds (generous timeout for network)
    expect(endTime - startTime).toBeLessThan(10000);
  });
});
