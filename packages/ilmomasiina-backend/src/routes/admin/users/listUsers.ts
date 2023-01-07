import { FastifyReply, FastifyRequest } from 'fastify';

import type { UserListSchema } from '@tietokilta/ilmomasiina-models';
import { User } from '../../../models/user';

export default async function listUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<UserListSchema> {
  const users = await User.findAll({
    attributes: ['id', 'email'],
  });

  // Just to make sure password hashes are never exposed...
  const res = users.map((u) => ({ id: u.id, email: u.email }));

  reply.status(200);
  return res;
}
