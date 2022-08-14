import { FastifyReply, FastifyRequest } from 'fastify';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { User } from '../../models/user';
import { logEvent } from '../../util/auditLog';

export default async function deleteUser(
  request: FastifyRequest<{ Params: schema.UserPathParams }>,
  reply: FastifyReply,
): Promise<void> {
  await User.sequelize!.transaction(async (transaction) => {
    // Try to fetch existing user
    const existing = await User.findByPk(
      request.params.id,
      { attributes: ['id', 'email'], transaction },
    );

    if (!existing) {
      // TODO: throw new 404 Error('User does not exist')
    } else {
      // Delete user
      await existing.destroy({ transaction });
      await logEvent('user.delete', {
        extra: {
          id: existing.email,
          email: existing.email,
        },
        params: {},
      });
    }
  });

  reply.status(204);
}
