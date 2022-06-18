import moment from 'moment';
import { Op, WhereOptions } from 'sequelize';

import config from '../config';
import { AuditLog } from '../models/auditlog';

export default async function deleteOldAuditLogs() {
  await AuditLog.unscoped().destroy({
    where: {
      createdAt: {
        [Op.lt]: moment().subtract(config.anonymizeAfterDays, 'days').toDate(),
      },
    } as WhereOptions,
  });
}
