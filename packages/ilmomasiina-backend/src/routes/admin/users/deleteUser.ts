import { FastifyReply, FastifyRequest } from 'fastify';
import { NotFound } from 'http-errors';

import type { UserPathParams } from '@tietokilta/ilmomasiina-models';
import { AuditEvent } from '@tietokilta/ilmomasiina-models';
import { User } from '../../../models/user';

export default async function deleteUser(
  request: FastifyRequest<{ Params: UserPathParams }>,
  reply: FastifyReply,
): Promise<void> {
  await User.sequelize!.transaction(async (transaction) => {
    // Try to fetch existing user
    const existing = await User.findByPk(
      request.params.id,
      { attributes: ['id', 'email'], transaction },
    );

    if (!existing) {
      throw new NotFound('User does not exist');
    } else {
      // Delete user
      await existing.destroy({ transaction });
      await request.logEvent(AuditEvent.DELETE_USER, {
        extra: {
          id: existing.email,
          email: existing.email,
        },
        transaction,
      });
    }
  });

  reply.status(204);
}
