import { FastifyReply, FastifyRequest } from 'fastify';

import type { UserListResponse } from '@tietokilta/ilmomasiina-models';
import { User } from '../../../models/user';

export default async function listUsers(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<UserListResponse> {
  const users = await User.findAll({
    attributes: ['id', 'email'],
  });

  // Just to make sure password hashes are never exposed...
  const res = users.map((u) => ({ id: u.id, email: u.email }));

  reply.status(200);
  return res;
}
