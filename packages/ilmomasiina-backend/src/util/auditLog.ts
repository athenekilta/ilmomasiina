import { Transaction } from 'sequelize';

import { AuditLog } from '../models/auditlog';
import { Event } from '../models/event';
import { Signup } from '../models/signup';

// eslint-disable-next-line import/prefer-default-export
export async function logEvent(
  action: string,
  {
    params, transaction, event, signup, extra,
  }: {
    params: Record<string, any> | undefined,
    event?: Pick<Event, 'id' | 'title'>,
    signup?: Signup,
    transaction?: Transaction,
    extra?: object,
  },
) {
  await AuditLog.create({
    user: params?.user?.email || null,
    action,
    eventId: event?.id || signup?.quota?.event?.id || null,
    eventName: event?.title || signup?.quota?.event?.title || null,
    signupId: signup?.id || null,
    signupName: signup ? `${signup.firstName} ${signup.lastName}` : null,
    extra: extra ? JSON.stringify(extra) : null,
    ipAddress: params?.remoteIp || '-', // TODO: Change for fastify
  }, { transaction });
}
