/**
 * Steam API Response Types - Based on Real XML Analysis
 * Handles all variations: public/private profiles, groups, errors, minimal data
 */

/** Minimal Steam profile data that appears in ALL responses */
export interface MinimalSteamProfile {
  steamID64: [string];
  steamID: [string];
  onlineState: [string];
  privacyState: [string];
  visibilityState: [string];
  vacBanned: [string];
  tradeBanState: [string];
  isLimitedAccount: [string];
}

/** Additional fields that may appear in public profiles */
export interface ExtendedProfileFields {
  stateMessage?: [string];
  memberSince?: [string];
  steamRating?: [string];
  hoursPlayed2Wk?: [string];

  // Rich profile data (often missing)
  customURL?: [string];
  avatarIcon?: [string];
  avatarMedium?: [string];
  avatarFull?: [string];
  headline?: [string];
  location?: [string];
  realname?: [string];
  summary?: [string];
}

/** Game information structure (rarely present in minimal profiles) */
export interface GameInfo {
  gameName: [string];
  gameLink: [string];
  gameIcon: [string];
  gameLogo: [string];
  gameLogoSmall: [string];
  hoursPlayed: [string];
  hoursOnRecord: [string];
  statsName: [string];
}

export interface MostPlayedGames {
  mostPlayedGame?: GameInfo[];
}

/** Group information - often just IDs, not full objects */
export interface GroupInfo {
  $?: { isPrimary: string };
  groupID64: [string];
  groupName?: [string];
  groupURL?: [string];
  headline?: [string];
  summary?: [string];
  avatarIcon?: [string];
  avatarMedium?: [string];
  avatarFull?: [string];
  memberCount?: [string];
  membersInChat?: [string];
  membersInGame?: [string];
  membersOnline?: [string];
}

export interface Groups {
  group?: GroupInfo[];
}

/** Complete profile information object - most fields optional */
export interface FullProfileInfo
  extends MinimalSteamProfile,
    ExtendedProfileFields {
  mostPlayedGames?: [MostPlayedGames];
  groups?: [Groups];
}

/** Group XML response structure */
export interface GroupDetails {
  groupName: [string];
  groupURL: [string];
  headline: [string];
  summary: [string];
  avatarIcon: [string];
  avatarMedium: [string];
  avatarFull: [string];
  memberCount: [string];
  membersInChat: [string];
  membersInGame: [string];
  membersOnline: [string];
}

export interface FullGroupInfo {
  groupID64: [string];
  groupDetails: [GroupDetails];
  memberCount: [string];
  totalPages: [string];
  currentPage: [string];
  startingMember: [string];
  nextPageLink?: [string];
  members: [{ steamID64: string[] }];
}

/** Error response from Steam */
export interface SteamErrorResponse {
  response: {
    error: [string];
  };
}

/** Different types of Steam responses based on real examples */
export type SteamProfileResponse =
  | { type: 'minimal_private'; data: MinimalSteamProfile }
  | {
      type: 'public_minimal';
      data: MinimalSteamProfile &
        Pick<ExtendedProfileFields, 'memberSince' | 'steamRating'>;
    }
  | { type: 'full_profile'; data: FullProfileInfo }
  | { type: 'empty'; error: 'Profile not found' };

/** Discriminated union for XML parsing results */
export type SteamXMLResponse =
  | { type: 'profile'; data: FullProfileInfo }
  | { type: 'group'; data: FullGroupInfo }
  | { type: 'error'; error: string }
  | { type: 'empty'; error: string };

/** Raw XML parsing result before discrimination */
export interface RawXMLParseResult {
  profile?: FullProfileInfo;
  memberList?: FullGroupInfo;
  response?: { error: [string] };
}

/** Function signature types for Promise/Callback dual support */
export type CallbackFunction<T> = (
  err: string | null,
  result: T | null,
) => void;

export type PromiseOrCallback<T> =
  | Promise<T>
  | ((callback: CallbackFunction<T>) => Promise<T>);

/** Configuration options */
export interface ResolverOptions {
  timeout?: number;
  userAgent?: string;
  retries?: number;
}
