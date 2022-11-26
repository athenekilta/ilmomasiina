import { FastifyInstance } from 'fastify';
import { Transaction } from 'sequelize';

import { AuditEvent } from '@tietokilta/ilmomasiina-models/src/enum';
import { AuditLog } from '../models/auditlog';
import { Event } from '../models/event';
import { Signup } from '../models/signup';

/**
 * Creates an {@link AuditLogger}
 *
 * @param ipAddress related ip address
 * @param user a function returning username (email), executed when events are logged
 */
function eventLogger(ipAddress: string, user?: () => (string | null)) {
  return async (
    action: AuditEvent,
    {
      transaction, event, signup, extra,
    }: {
      event?: Pick<Event, 'id' | 'title'>,
      signup?: Signup,
      transaction?: Transaction,
      extra?: object,
    },
  ) => {
    await AuditLog.create({
      user: user ? user() : null,
      action,
      eventId: event?.id || signup?.quota?.event?.id || null,
      eventName: event?.title || signup?.quota?.event?.title || null,
      signupId: signup?.id || null,
      signupName: signup ? `${signup.firstName} ${signup.lastName}` : null,
      extra: extra ? JSON.stringify(extra) : null,
      ipAddress,
    }, { transaction });
  };
}

/**
 * Couples audit event logging with FastifyRequest
 *
 * Decorates each request object with a `logEvent` method.
 * Using this method, user and ip address information will be automatically inferred into audit log event.
 */
export function addLogEventHook(fastify: FastifyInstance): void {
  fastify.decorateRequest('logEvent', () => { throw new Error('Not initialized'); });
  fastify.addHook('onRequest', async (req) => {
    (req.logEvent as AuditLogger) = eventLogger(req.ip, () => req.sessionData?.email || null);
  });
}

/** Use to log internally triggered actions to the audit log (actions run by cron jobs for example) */
export const internalAuditLogger = eventLogger('internal');

export type AuditLogger = ReturnType<typeof eventLogger>;

declare module 'fastify' {
  interface FastifyRequest {
    readonly logEvent: AuditLogger,
  }
}
