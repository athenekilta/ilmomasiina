import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HttpError, Unauthorized } from 'http-errors';

import type { AdminLoginBody, AdminLoginResponse } from '@tietokilta/ilmomasiina-models';
import AdminAuthSession, { AdminTokenData } from '../../authentication/adminAuthSession';
import AdminPasswordAuth from '../../authentication/adminPasswordAuth';
import { User } from '../../models/user';

export function adminLogin(session: AdminAuthSession) {
  return async (
    request: FastifyRequest<{ Body: AdminLoginBody }>,
    reply: FastifyReply,
  ): Promise<AdminLoginResponse | void> => {
    // Verify user
    const user = await User.findOne({
      where: { email: request.body.email },
      attributes: ['id', 'password', 'email'],
    });

    // Verify password
    if (!user || !AdminPasswordAuth.verifyHash(request.body.password, user.password)) {
      // Mitigate user enumeration by timing: waste some time if we didn't actually verify a password
      if (!user) AdminPasswordAuth.createHash('hunter2');
      throw new Unauthorized('Invalid email or password');
    }

    // Authentication success -> generate auth token
    const accessToken = session.createSession({ user: user.id, email: user.email });
    reply.status(200);
    return { accessToken };
  };
}

export function renewAdminToken(session: AdminAuthSession) {
  return async (
    request: FastifyRequest<{ Body: AdminLoginBody }>,
    reply: FastifyReply,
  ): Promise<AdminLoginResponse | void> => {
    // Verify existing token
    const sessionData = session.verifySession(request);

    // Verify that the user exists
    const user = await User.findByPk(sessionData.user);
    if (!user) {
      throw new Unauthorized('User no longer exists');
    }

    // Create a new one
    const accessToken = session.createSession(sessionData);
    reply.status(200);
    return { accessToken };
  };
}

/** Adds a request hook that verifies the user's session and raises a 401 error if invalid. */
export function requireAdmin(session: AdminAuthSession, fastify: FastifyInstance): void {
  fastify
    .addHook('onRequest', async (request: FastifyRequest, reply) => {
      try {
        // Validate session & decorate request with session data
        (request.sessionData as AdminTokenData) = session.verifySession(request);
      } catch (err) {
        // Throwing inside hook is not safe, so the errors must be converted to actual reply here
        fastify.log.error(err);
        if (err instanceof HttpError) {
          reply.code(err.statusCode).send(err);
        } else {
          reply.internalServerError('Session validation failed');
        }
      }
    });
}

declare module 'fastify' {
  interface FastifyRequest {
    readonly sessionData: AdminTokenData,
  }
}
