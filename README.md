# steamid-resolver-ts

> Professional TypeScript library for Steam ID resolution with comprehensive error handling

A modern, type-safe TypeScript implementation of Steam profile and group resolution. Built with Bun and designed for production use with robust error handling and full Promise/callback support.

## ✨ Features

- **🔒 Type-Safe**: Complete TypeScript support with precise type definitions
- **⚡ Fast**: Built with Bun and optimized for performance
- **🛡️ Robust**: Comprehensive error handling for all edge cases
- **🔄 Flexible**: Dual Promise/callback support for maximum compatibility
- **📝 Well-Tested**: Extensive test coverage with real Steam data
- **🎯 Professional**: Based on analysis of real Steam XML response variations

## 🚀 Installation

```bash
# Using Bun (recommended)
bun add steamid-resolver-ts

# Using npm
npm install steamid-resolver-ts

# Using pnpm
pnpm add steamid-resolver-ts
```

## 📖 Usage

### Basic Examples

```typescript
import {
  customUrlToSteamID64,
  steamID64ToCustomUrl,
  steamID64ToFullInfo,
  SteamProfileNotFoundError
} from 'steamid-resolver-ts'

// Convert Steam ID64 to custom URL
const customUrl = await steamID64ToCustomUrl('76561198260031749')
console.log(customUrl) // "3urobeat"

// Convert custom URL to Steam ID64
const steamId = await customUrlToSteamID64('3urobeat')
console.log(steamId) // "76561198260031749"

// Get full profile information
const profile = await steamID64ToFullInfo('76561198260031749')
console.log(profile.steamID[0]) // Profile name
console.log(profile.memberSince?.[0]) // Member since date (optional)
```

### Error Handling

```typescript
try {
  const customUrl = await steamID64ToCustomUrl('invalid-id')
}
catch (error) {
  if (error instanceof SteamProfileNotFoundError) {
    console.log('Profile not found')
  }
  else if (error instanceof SteamAPIError) {
    console.log('API error:', error.message)
  }
}
```

### Callback Support

```typescript
// All functions support both Promise and callback patterns
steamID64ToCustomUrl('76561198260031749', (err, result) => {
  if (err) {
    console.error('Error:', err)
  }
  else {
    console.log('Custom URL:', result)
  }
})
```

## 📚 API Reference

### Profile Functions

#### `steamID64ToCustomUrl(steamID64, callback?)`
Convert Steam ID64 to custom profile URL.

#### `steamID64ToProfileName(steamID64, callback?)`
Get profile display name from Steam ID64.

#### `customUrlToSteamID64(customURL, callback?)`
Convert custom profile URL to Steam ID64.

#### `customUrlToProfileName(customURL, callback?)`
Get profile display name from custom URL.

#### `steamID64ToFullInfo(steamID64, callback?)`
Get complete profile information object.

#### `customUrlToFullInfo(customURL, callback?)`
Get complete profile information from custom URL.

### Group Functions

#### `groupUrlToGroupID64(groupURL, callback?)`
Convert group URL to group ID64.

#### `groupUrlToFullInfo(groupURL, callback?)`
Get complete group information object.

### Utility Functions

#### `isValidSharedfileID(sharedfileID, callback?)`
Validate if a sharedfile ID exists.

## 🏗️ TypeScript Support

Full TypeScript definitions included:

```typescript
import type {
  FullGroupInfo,
  FullProfileInfo,
  MinimalSteamProfile,
  SteamAPIError
} from 'steamid-resolver-ts'

// Profile information is properly typed
const profile: FullProfileInfo = await steamID64ToFullInfo('76561198260031749')

// Optional fields are correctly marked
const customUrl: string | undefined = profile.customURL?.[0]
const memberSince: string | undefined = profile.memberSince?.[0]
```

## 🔧 Error Types

The library provides specific error classes:

- `SteamAPIError` - Base error class
- `SteamProfileNotFoundError` - Profile doesn't exist
- `SteamGroupNotFoundError` - Group doesn't exist
- `SteamPrivateProfileError` - Profile is private
- `SteamEmptyResponseError` - Steam returned empty response

## 🧪 Testing

```bash
# Run tests
bun test

# Run tests in watch mode
bun test --watch

# Build the project
bun run build
```

## 🔄 Migration from JS Version

The TypeScript version maintains full compatibility with the original:

```javascript
// Old JS version
// New TS version  
import { steamID64ToCustomUrl } from 'steamid-resolver-ts';

const resolver = require('steamid-resolver');
resolver.steamID64ToCustomUrl('76561198260031749', callback)
steamID64ToCustomUrl('76561198260031749', callback)
```

## 📊 Response Formats

Based on real Steam XML analysis, responses handle various profile states:

- **Minimal Private**: Basic ID and privacy info only
- **Public Minimal**: + member since, rating
- **Full Profile**: + avatars, custom URL, games, groups
- **Empty Response**: Invalid profiles

## 🤝 Contributing

Contributions welcome! This library is built using:

- **Bun** - Runtime and package manager
- **TypeScript** - Type safety
- **tsup** - Build system
- **bun:test** - Testing framework

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Credits

Based on the original [node-steamid-resolver](https://github.com/3urobeat/node-steamid-resolver) by 3urobeat, converted to TypeScript with enhanced error handling and type safety.
