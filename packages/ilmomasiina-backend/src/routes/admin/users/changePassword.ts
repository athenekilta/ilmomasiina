import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequest, NotFound, Unauthorized } from 'http-errors';
import AdminPasswordAuth from 'src/authentication/adminPasswordAuth';

import type { UserChangePasswordSchema } from '@tietokilta/ilmomasiina-models';
import { AuditEvent } from '@tietokilta/ilmomasiina-models';
import { User } from '../../../models/user';

export default async function changePassword(
  request: FastifyRequest<{ Body: UserChangePasswordSchema }>,
  reply: FastifyReply,
): Promise<void> {
  if (request.body.newPassword.length < 10) {
    throw new BadRequest('Password must be at least 10 characters long');
  }

  await User.sequelize!.transaction(async (transaction) => {
    // Try to fetch existing user
    const existing = await User.findByPk(
      request.sessionData.user,
      { attributes: ['id', 'email', 'password'], transaction },
    );

    if (!existing) {
      throw new NotFound('User does not exist');
    } else {
      // Verify old password
      if (!AdminPasswordAuth.verifyHash(request.body.oldPassword, existing.password)) {
        throw new Unauthorized('Incorrect password');
      }
      // Update user with a new password
      await existing.update(
        { password: AdminPasswordAuth.createHash(request.body.newPassword) },
        { transaction },
      );

      await request.logEvent(AuditEvent.CHANGE_PASSWORD, {
        extra: {
          id: existing.id,
          email: existing.email,
        },
        transaction,
      });
    }
  });

  reply.status(204);
}
