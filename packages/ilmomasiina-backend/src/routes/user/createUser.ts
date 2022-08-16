import { FastifyReply, FastifyRequest } from 'fastify';
import { Conflict } from 'http-errors';

import { AuditEvent } from '@tietokilta/ilmomasiina-models/src/enum';
import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { AuditLogger } from '../../auditlog';
import { AdminPasswordAuth } from '../../authentication/adminPassword';
import EmailService from '../../mail';
import { User } from '../../models/user';
import generatePassword from './generatePassword';

/**
 * Private helper function to create a new user and save it to the database
 *
 * @param params user parameters
 * @param auditLogger audit logger function from the originating request
 */
async function create(params: schema.UserCreateSchema, auditLogger: AuditLogger): Promise<schema.UserSchema> {
  const user = await User.sequelize!.transaction(async (transaction) => {
    const existing = await User.findOne({
      where: { email: params.email },
      transaction,
    });

    if (existing) { throw new Conflict('User with given email already exists'); }

    // Create new user with hashed password
    return User.create(
      {
        ...params,
        password: AdminPasswordAuth.createHash(params.password),
      },
      { transaction },
    );
  });

  const res = {
    id: user.id,
    email: user.email,
  };

  await auditLogger(AuditEvent.CREATE_USER, {
    extra: res,
  });

  return res;
}

/**
 * Creates a new (admin) user
 *
 * Supposed to be used only for initial user creation.
 * For additional users, use {@link inviteUser} instead.
 */
export default async function createUser(
  request: FastifyRequest<{ Body: schema.UserCreateSchema }>,
  reply: FastifyReply,
): Promise<schema.UserSchema> {
  const user = await create(request.body, request.logEvent);
  reply.status(201);
  return user;
}

/**
 * Creates a new user and sends an invitation mail to their email
 */
export async function inviteUser(
  request: FastifyRequest<{ Body: schema.UserInviteSchema }>,
  reply: FastifyReply,
): Promise<schema.UserSchema> {
  // Generate secure password
  const password = generatePassword();

  const user = await create(
    {
      email: request.body.email,
      password,
    },
    request.logEvent,
  );

  // Send invitation mail
  EmailService.sendNewUserMail(user.email, {
    fields: [
      { label: 'Sähköposti', answer: user.email },
      { label: 'Salasana', answer: password },
    ],
  }).then();

  reply.status(201);
  return user;
}
