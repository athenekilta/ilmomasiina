import {
  createSigner, createVerifier, SignerSync, VerifierSync,
} from 'fast-jwt';
import { FastifyRequest } from 'fastify';
import { Unauthorized } from 'http-errors';

import type { UserID, UserSchema } from '@tietokilta/ilmomasiina-models';

export interface AdminTokenData {
  user: UserID;
  email: UserSchema['email'];
}

export default class AdminAuthSession {
  /** Session lifetime in seconds */
  static TTL = 10 * 60;

  private readonly sign: typeof SignerSync;
  private readonly verify: typeof VerifierSync;

  constructor(secret: string) {
    this.sign = createSigner({ key: secret, expiresIn: AdminAuthSession.TTL * 1000 });
    this.verify = createVerifier({ key: secret, maxAge: AdminAuthSession.TTL * 1000 });
  }

  /**
   * Creates a session token (JWT)
   *
   * @param userData admin user information to be included into the token
   */
  createSession(userData: AdminTokenData): string {
    return this.sign(userData);
  }

  /**
   * Verifies the incoming request authorization.
   * Throws an Unauthorized error if session is not valid.
   *
   * @param request incoming request
   */
  verifySession(request: FastifyRequest): AdminTokenData {
    const header = request.headers.authorization; // Yes, Fastify converts header names to lowercase :D

    if (!header) {
      throw new Unauthorized('Missing Authorization header');
    }

    const token = Array.isArray(header) ? header[0] : header;

    try { // Try to verify token
      const data = this.verify(token);
      return { user: parseInt(data.user), email: data.email || '' };
    } catch {
      throw new Unauthorized('Invalid session');
    }
  }
}
