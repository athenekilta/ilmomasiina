import { Params } from '@feathersjs/feathers';
import { NextFunction, Request, Response } from 'express';
import { Transaction } from 'sequelize';

import '@feathersjs/express'; // for type definition of Request.feathers

import { AuditLog } from '../models/auditlog';
import { Event } from '../models/event';
import { Signup } from '../models/signup';

export function remoteIp(req: Request, _res: Response, next: NextFunction) {
  req.feathers = { ...req.feathers, remoteIp: req.ip };
  next();
}

export async function logEvent(
  action: string,
  {
    params, transaction, event, signup, extra,
  }: {
    params: Params | undefined,
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
    ipAddress: params?.remoteIp || '-',
  }, { transaction });
}
