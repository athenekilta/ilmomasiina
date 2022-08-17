import { FastifyReply, FastifyRequest } from 'fastify';
import { Op, WhereOptions } from 'sequelize';

import * as schema from '@tietokilta/ilmomasiina-models/src/schema';
import { AuditLog } from '../../models/auditlog';
import { stringifyDates } from '../utils';

const MAX_LOGS = 100;

export default async function getAuditLogItems(
  request: FastifyRequest<{ Querystring: schema.AuditLoqQuery }>,
  response: FastifyReply,
): Promise<schema.AuditLogResponse> {
  let where: WhereOptions<AuditLog>[] = [];
  if (request.query.user) {
    where = [
      ...where,
      { user: { [Op.like]: `%${request.query.user}%` } },
    ];
  }
  if (request.query.ip) {
    where = [
      ...where,
      { ipAddress: { [Op.like]: `%${request.query.ip}%` } },
    ];
  }
  if (request.query.action) {
    where = [
      ...where,
      { action: { [Op.in]: request.query.action } },
    ];
  }
  if (request.query.event) {
    where = [
      ...where,
      {
        [Op.or]: [
          { eventId: request.query.event },
          { eventName: { [Op.like]: `%${request.query.event}%` } },
        ],
      },
    ];
  }
  if (request.query.signup) {
    where = [
      ...where,
      {
        [Op.or]: [
          { signupId: request.query.signup },
          { signupName: { [Op.like]: `%${request.query.signup}%` } },
        ],
      },
    ];
  }

  const logs = await AuditLog.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset: request.query.offset || schema.auditLoqQuery.properties.offset.default,
    limit: Math.min(MAX_LOGS, request.query.limit || schema.auditLoqQuery.properties.limit.default),
  });

  response.status(200);
  return {
    rows: logs.rows.map((r) => stringifyDates({
      ...r.get({ plain: true }),
      createdAt: r.createdAt,
    })),
    count: logs.count,
  };
}
