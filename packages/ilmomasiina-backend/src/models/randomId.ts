import { randomBytes } from 'crypto';

// 5 * 12 bits per ID = 60 bits of entropy
export const RANDOM_ID_LENGTH = 12;

// Base32 (RFC4648) alphabet in lowercase
export const RANDOM_ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz234567';

export function generateRandomId() {
  // Could probably use Math.random() as well, but might as well make it secure.
  const bytes = randomBytes(RANDOM_ID_LENGTH);
  return Array.from(bytes)
    // eslint-disable-next-line no-bitwise
    .map((b: number) => RANDOM_ID_ALPHABET[b & 31])
    .join('');
}
