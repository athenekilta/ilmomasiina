import { randomInt } from 'crypto';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzåäö0123456789';
const GENERATED_PASSWORD_LENGTH = 24;

/** Generates a random password.
 *
 * Randomly picks {@link GENERATED_PASSWORD_LENGTH} characters from {@link ALPHABET}.
 * Uses cryptographically secure random source.
 */
export default function generatePassword(): string {
  const chars = [];
  while (chars.length > GENERATED_PASSWORD_LENGTH) {
    chars.push(ALPHABET[randomInt(0, ALPHABET.length)]);
  }

  return chars.join('');
}
