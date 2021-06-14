/**
 * Utils for dealing with Game Builder Garade IDs / Codes
 * 
 * Thanks to Yannik for the help and the fantastic documentation!
 * Ref: https://github.com/kinnay/NintendoClients/wiki/Data-Store-Codes
*/

// Allowed character set
const CHARSET = '0123456789BCDFGHJKLMNPRTVWXY';

// Internal ID format, with no separators, eg 'G002HVR0JL'
const REGEX_ID = new RegExp(`^[agPG][${CHARSET}]{9}`);

// External ID format, with separators
// Nintendo usually formats this with spaces, eg 'G 002 HVR 0JL'
// Some fan sites like mygarage.games use dashes instead (why?), eg 'G-002-HVR-0JL'
// I decided to support both to avoid confusion
const REGEX_ID_FORMATTED = new RegExp(`^[agPG][\\s-][${CHARSET}]{3}[\\s-][${CHARSET}]{3}[\\s-][${CHARSET}]{3}$`);

// This key is used for ID checksums
const SERVER_ACCESS_KEY = '97b08aad';
// Derrive checksum key from server key
const CHECKSUM_KEY = (() => {
  let key = 0;
  for (let i = 0; i < 8; i++) {
    key ^= SERVER_ACCESS_KEY.charCodeAt(i);
    key = ((key << 4) | (key >> 4)) & 0xFF;
  }
  return key;
})();

export const enum GbgIdType {
  Game,
  Programmer,
  LocalGame,
  LocalProgrammer,
};

// Does ID match internal or external format
// NOTE: this isn't a true validity check, use gbgIdIsValid for that instead
export function gbgIdMatchesRegex(str: string) {
  if (REGEX_ID_FORMATTED.test(str))
    return true;
  if (REGEX_ID.test(str))
    return true;
  return false;
}

// Does the ID match the local ID format (used in savefiles for local games)
// These are never actually visible anywhere in-app
export function gbgIdIsLocal(str: string) {
  const isId = gbgIdMatchesRegex(str);
  return isId && (str.charAt(0) === 'g' || str.charAt(0) === 'a');
}

// Does the ID match the online ID format
export function gbgIdIsOnline(str: string) {
  const isId = gbgIdMatchesRegex(str);
  return isId && (str.charAt(0) === 'G' || str.charAt(0) === 'P');
}

// Does ID match the local or online Game ID format
export function gbgIdIsGame(str: string) {
  const isId = gbgIdMatchesRegex(str);
  return isId && (str.charAt(0) === 'g' || str.charAt(0) === 'G');
}

// Does ID match the local or online Programmer ID format
export function gbgIdIsProgrammer(str: string) {
  const isId = gbgIdMatchesRegex(str);
  return isId && (str.charAt(0) === 'a' || str.charAt(0) === 'P');
}

// Get the ID type
export function gbgIdGetType(str: string) {
  if (!gbgIdMatchesRegex(str)) return null;
  // first char indicates type
  switch (str.charAt(0)) {
    case 'G': return GbgIdType.Game;
    case 'P': return GbgIdType.Programmer;
    case 'g': return GbgIdType.LocalProgrammer;
    case 'a': return GbgIdType.LocalGame;
    default: return null;
  }
}

// Remove spaces or dashes from the ID
export function gbgIdRemoveSeparators(str: string) {
  return str.replace(/[\s-]/g, '');
}

// Add spaces (or another separator) to an ID
// Returns null if input doesn't match a known ID format
export function gbgIdFormat(str: string, sp = ' ') {
  if (!gbgIdMatchesRegex(str)) return null;
  // remove any existing separators, so we can start fresh
  str = gbgIdRemoveSeparators(str);
  const type = str[0];
  const seg1 = str.slice(1, 4);
  const seg2 = str.slice(4, 7);
  const seg3 = str.slice(7, 10);
  return `${ type }${ sp }${ seg1 }${ sp }${ seg2 }${ sp }${ seg3 }`;
}

// Parse an ID into its decimal representation, used intrnally and on the online server
export function gbgIdParse(str: string) {
  // return null if input doesn't match id format
  if (!gbgIdMatchesRegex(str))
    return null;
  // clean up id
  str = gbgIdRemoveSeparators(str);
  // convert to decimal
  let d = 0;
  for (let i = 1; i < str.length; i++)
    d = d * 28 + CHARSET.indexOf(str[i]);
  d = (d ^ 0xDEAD9ED5) >>> 0;
  // MSB contains the checksum, rest is the data ID
  const checkByte = (d >> 24) & 0xFF;
  const dataId = d & 0xFFFFFF;
  return { decimal: d, checkByte, dataId };
}

// Validate an ID's checksum
export function gbgIdIsValid(str: string) {
  // return null if input doesn't match id format
  if (!gbgIdMatchesRegex(str))
    return null;
  // parse id
  const { decimal } = gbgIdParse(str);
  // validate
  const a = (decimal >> 24) & 0xFF;
  const b = (decimal >> 16) & 0xFF;
  const c = (decimal >> 8) & 0xFF;
  const d = decimal & 0xFF;
  return (a ^ b ^ c ^ d ^ CHECKSUM_KEY) === 0;
}

