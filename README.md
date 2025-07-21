# node-steamid-resolver-ts

Professional TypeScript library for Steam ID resolution with comprehensive error handling and type safety.

## Features

- **Type-Safe**: Complete TypeScript support with precise interfaces
- **Robust**: Handles all Steam XML response variations (public/private profiles, groups, errors)
- **Flexible**: Dual Promise/callback support
- **Fast**: Built with Bun, optimized for performance
- **Well-Tested**: 100% test coverage with real Steam data

## Installation

```bash
bun add node-steamid-resolver-ts
npm install node-steamid-resolver-ts
```

## Quick Start

```typescript
import {
  steamID64ToCustomUrl,
  customUrlToSteamID64,
  steamID64ToFullInfo,
  SteamProfileNotFoundError,
} from "node-steamid-resolver-ts";

// Basic conversions
const customUrl = await steamID64ToCustomUrl("76561198260031749"); // "3urobeat"
const steamId = await customUrlToSteamID64("3urobeat"); // "76561198260031749"

// Full profile data
const profile = await steamID64ToFullInfo("76561198260031749");
console.log(profile.steamID[0], profile.memberSince?.[0]);

// Error handling
try {
  await steamID64ToCustomUrl("invalid-id");
} catch (error) {
  if (error instanceof SteamProfileNotFoundError) {
    console.log("Profile not found");
  }
}

// Callback support
steamID64ToCustomUrl("76561198260031749", (err, result) => {
  if (!err) console.log("Custom URL:", result);
});
```

## API Reference

### Profile Functions

| Function                                 | Description               | Returns           |
| ---------------------------------------- | ------------------------- | ----------------- |
| `steamID64ToCustomUrl(id, callback?)`    | Steam ID64 → custom URL   | `string \| null`  |
| `steamID64ToProfileName(id, callback?)`  | Steam ID64 → display name | `string`          |
| `customUrlToSteamID64(url, callback?)`   | Custom URL → Steam ID64   | `string`          |
| `customUrlToProfileName(url, callback?)` | Custom URL → display name | `string`          |
| `steamID64ToFullInfo(id, callback?)`     | Steam ID64 → full profile | `FullProfileInfo` |
| `customUrlToFullInfo(url, callback?)`    | Custom URL → full profile | `FullProfileInfo` |

### Group Functions

| Function                              | Description                 | Returns         |
| ------------------------------------- | --------------------------- | --------------- |
| `groupUrlToGroupID64(url, callback?)` | Group URL → group ID64      | `string`        |
| `groupUrlToFullInfo(url, callback?)`  | Group URL → full group info | `FullGroupInfo` |

### Utilities

| Function                             | Description                   | Returns   |
| ------------------------------------ | ----------------------------- | --------- |
| `isValidSharedfileID(id, callback?)` | Validate sharedfile existence | `boolean` |

## TypeScript Support

Complete type definitions for all response formats:

```typescript
import type { FullProfileInfo, FullGroupInfo } from "node-steamid-resolver-ts";

const profile: FullProfileInfo = await steamID64ToFullInfo("76561198260031749");

// Properly typed optional fields
const customUrl: string | undefined = profile.customURL?.[0];
const avatarUrl: string | undefined = profile.avatarFull?.[0];
const memberSince: string | undefined = profile.memberSince?.[0];
```

## Error Handling

Specific error classes for different failure scenarios:

```typescript
import {
  SteamAPIError, // Base error class
  SteamProfileNotFoundError, // Profile doesn't exist
  SteamGroupNotFoundError, // Group doesn't exist
  SteamPrivateProfileError, // Profile is private
  SteamEmptyResponseError, // Steam returned empty response
} from "node-steamid-resolver-ts";
```

## Response Variations

Handles all Steam XML response types based on real-world analysis:

- **Public Profiles**: Full data including avatars, games, groups
- **Private Profiles**: Minimal data (ID, privacy state, custom URL)
- **Limited Accounts**: Basic public info only
- **Invalid Profiles**: Empty responses, proper error handling
- **Groups**: Member lists, group details, error pages

## Development

```bash
# Install dependencies
bun install

# Run tests (100% coverage)
bun test

# Build for production
bun run build

# Lint and format
bun format && bun lint
```

## Migration from JS Version

Drop-in replacement for the original JavaScript library:

```diff
- const resolver = require('steamid-resolver')
- resolver.steamID64ToCustomUrl('76561198260031749', callback)
+ import { steamID64ToCustomUrl } from 'node-steamid-resolver-ts'
+ steamID64ToCustomUrl('76561198260031749', callback)
```

All function signatures remain identical for seamless migration.

## License

MIT © [Original library](https://github.com/3urobeat/node-steamid-resolver) by 3urobeat

Converted to TypeScript with enhanced error handling, type safety, and comprehensive test coverage.
