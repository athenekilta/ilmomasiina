import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from 'http-errors';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { AdminSessionSchema } from '@tietokilta/ilmomasiina-models/src/schema';
import AdminAuthSession, { AdminTokenData } from '../../authentication/adminAuthSession';
import AdminPasswordAuth from '../../authentication/adminPasswordAuth';
import { User } from '../../models/user';

export function adminLogin(session: AdminAuthSession) {
  return async (
    request: FastifyRequest<{ Body: schema.AdminLoginSchema }>,
    reply: FastifyReply,
  ): Promise<AdminSessionSchema | void> => {
    // Verify user
    const user = await User.findOne({
      where: { email: request.body.email },
      attributes: ['id', 'password', 'email'],
    });

    if (user && AdminPasswordAuth.verifyHash(request.body.password, user.password)) {
      // Authentication success -> generate auth token
      const accessToken = session.createSession({ user: user.id, email: user.email });
      reply.status(200);
      return { accessToken };
    }
    reply.unauthorized('Invalid email or password');
    return undefined;
  };
}

export function renewAdminToken(session: AdminAuthSession) {
  return async (
    request: FastifyRequest<{ Body: schema.AdminLoginSchema }>,
    reply: FastifyReply,
  ): Promise<AdminSessionSchema | void> => {
    // Verify existing token
    const sessionData = session.verifySession(request);

    // Create a new one
    const accessToken = session.createSession(sessionData);
    reply.status(200);
    return { accessToken };
  };
}

export function addSessionValidationHook(session: AdminAuthSession, fastify: FastifyInstance): void {
  fastify.decorateRequest('userID', null);
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
