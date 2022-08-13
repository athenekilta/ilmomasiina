import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { HttpError } from 'http-errors';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { AdminPasswordAuth } from '../../authentication/adminPassword';
import { AdminAuthSession, AdminTokenData } from '../../authentication/adminSession';
import { User } from '../../models/user';

export function adminLogin(session: AdminAuthSession) {
  return async (
    request: FastifyRequest<{ Body: schema.AdminLoginSchema }>,
    reply: FastifyReply,
  ): Promise<void> => {
    // Verify user
    const user = await User.findOne({
      where: { email: request.body.email },
      attributes: ['id', 'password'],
    });

    if (user && AdminPasswordAuth.verifyHash(request.body.password, user.password)) {
      // Authentication success -> generate auth token
      reply.status(204);
      session.createSession({ user: user.id }, reply);
    } else {
      reply.unauthorized('Invalid email or password');
    }
  };
}

export function adminLogout(session: AdminAuthSession) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    session.endSession(reply);
    reply.status(204);
  };
}

export function addSessionValidationHook(session: AdminAuthSession, fastify: FastifyInstance): void {
  fastify.decorateRequest('userID', null);
  fastify
    .addHook('onRequest', async (request: FastifyRequest, reply) => {
      try {
        // Validate session & decorate request with session data
        (request.sessionData as AdminTokenData) = session.verifySession(request, reply);
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
