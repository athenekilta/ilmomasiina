import base32Encode from 'base32-encode';
import { createHash, createHmac } from 'crypto';
import { Forbidden } from 'http-errors';

import config from '../../config';
import { Signup } from '../../models/signup';

function generateLegacyToken(signup: Signup | string): string {
  const id = typeof signup === 'string' ? signup : signup.id;
  const data = Buffer.from(`${id}${config.oldEditTokenSalt}`, 'utf-8');
  return createHash('md5').update(data).digest().toString('hex');
}

export function generateToken(signup: Signup | string) {
  const id = typeof signup === 'string' ? signup : signup.id;
  const key = Buffer.from(config.newEditTokenSecret!, 'utf-8');
  const data = Buffer.from(id, 'utf-8');
  const mac = createHmac('sha256', key).update(data).digest();
  return base32Encode(mac, 'RFC4648').substring(0, 13).toLowerCase();
}

export function verifyToken(signup: Signup | string, token: string): void {
  let expectedToken;
  if (token && config.oldEditTokenSalt && token.length === 32) {
    expectedToken = generateLegacyToken(signup);
  } else {
    expectedToken = generateToken(signup);
  }
  if (!token || token !== expectedToken) {
    throw new Forbidden('Invalid editToken');
  }
}
