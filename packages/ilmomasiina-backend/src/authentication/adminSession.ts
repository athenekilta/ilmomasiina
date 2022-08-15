import { CookieSerializeOptions } from '@fastify/cookie';
import {
  createSigner, createVerifier, SignerSync, VerifierSync,
} from 'fast-jwt';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Unauthorized } from 'http-errors';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';

export interface AdminTokenData {
  user: schema.UserID
  email: schema.UserSchema['email']
}

export class AdminAuthSession {
  static COOKIE = 'Session';

  /** Session lifetime in seconds */
  static TTL = 10 * 60;

  private readonly cookieOptions: CookieSerializeOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/api/admin',
    maxAge: AdminAuthSession.TTL,
  };

  private readonly sign: typeof SignerSync;
  private readonly verifySoft: typeof VerifierSync;
  private readonly verifyHard: typeof VerifierSync;

  constructor(secret: string, cookieOptions?: CookieSerializeOptions) {
    this.sign = createSigner({ key: secret });
    this.verifySoft = createVerifier({ key: secret, maxAge: Math.floor(AdminAuthSession.TTL * 0.5 * 1000) });
    this.verifyHard = createVerifier({ key: secret, maxAge: AdminAuthSession.TTL * 1000 });

    if (cookieOptions) { this.cookieOptions = cookieOptions; }
  }

  createSession(userData: AdminTokenData, reply: FastifyReply): void {
    reply.setCookie(AdminAuthSession.COOKIE, this.sign(userData), this.cookieOptions);
  }

  // Throws an Unauthorized error if session is not valid
  verifySession(request: FastifyRequest, reply: FastifyReply): AdminTokenData {
    if (!request.headers.cookie) {
      throw new Unauthorized('Missing authentication Cookie');
    }

    // Cookie and header equivalent need to match (double submit)
    const parsed = request.server.parseCookie(request.headers.cookie);
    const token = parsed[AdminAuthSession.COOKIE];

    try { // Try first against soft limit
      const data = this.verifySoft(token);
      return { user: parseInt(data.user), email: data.email || '' };
    } catch { /* ignore errors */ }

    try { // The token is expiring. Replace it with a new one if it is still within the hard limit.
      const rawData = this.verifyHard(token);
      const data = { user: parseInt(rawData.user), email: rawData.email || '' };
      this.createSession(data, reply);
      return data;
    } catch (e) {
      throw new Unauthorized('Invalid session');
    }
  }

  endSession(reply: FastifyReply): void {
    // Replace the session cookie with an immediately expiring one
    reply.setCookie(AdminAuthSession.COOKIE, '', {
      ...this.cookieOptions,
      // invalidate immediately
      expires: new Date(),
      maxAge: 1,
    });
  }
}
