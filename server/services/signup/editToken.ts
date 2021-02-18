import md5 from 'md5';
import config from '../../config/ilmomasiina.config';
import { Signup } from '../../models/signup';

export function generateToken(signup: Signup | number): string {
  const id = typeof signup === 'number' ? signup : signup.id;
  return md5(`${id}${config.editTokenSalt}`);
}

export function verifyToken(signup: Signup | number, token: string): boolean {
  return token === generateToken(signup);
}
