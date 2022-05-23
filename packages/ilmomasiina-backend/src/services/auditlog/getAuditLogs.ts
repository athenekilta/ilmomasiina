import { Params, Service } from '@feathersjs/feathers';
import { Op, WhereOptions } from 'sequelize';

import { AuditLogResponse } from '@tietokilta/ilmomasiina-models/src/services/auditlog';
import { AuditLog } from '../../models/auditlog';

export type AuditLogService = Service<AuditLog>;

const MAX_LOGS = 100;

export default async (params?: Params): Promise<AuditLogResponse> => {
  let where: WhereOptions<AuditLog>[] = [];
  if (params?.query?.user) {
    where = [
      ...where,
      { user: { [Op.like]: `%${params.query.user}%` } },
    ];
  }
  if (params?.query?.ip) {
    where = [
      ...where,
      { ipAddress: { [Op.like]: `%${params.query.ip}%` } },
    ];
  }
  if (params?.query?.action) {
    where = [
      ...where,
      { action: { [Op.in]: params.query.action.split(',') } },
    ];
  }
  if (params?.query?.event) {
    where = [
      ...where,
      {
        [Op.or]: [
          { eventId: params.query.event },
          { eventName: { [Op.like]: `%${params.query.event}%` } },
        ],
      },
    ];
  }
  if (params?.query?.signup) {
    where = [
      ...where,
      {
        [Op.or]: [
          { signupId: params.query.signup },
          { signupName: { [Op.like]: `%${params.query.signup}%` } },
        ],
      },
    ];
  }
  const offset = Number(params?.query?.$offset) || 0;
  const limit = Math.min(MAX_LOGS, Number(params?.query?.$limit) || MAX_LOGS);

  const logs = await AuditLog.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return logs;
};
