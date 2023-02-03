import { FastifyReply, FastifyRequest } from 'fastify';
import { BadRequest, NotFound } from 'http-errors';
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
      // Update user with a new password
      const oldPasswordMatch = AdminPasswordAuth.verifyHash(request.body.oldPassword, existing.password);
      if (!oldPasswordMatch) {
        throw new BadRequest('Incorrect password');
      }
      await existing.update({ password: AdminPasswordAuth.createHash(request.body.newPassword) });
      const res = {
        passwordChanged: true,
        id: existing.email,
        email: existing.email,
      };

      await request.logEvent(AuditEvent.CHANGE_PASSWORD, {
        extra: res,
        transaction,
      });
      return res;
    }
  });

  reply.status(204);
}
