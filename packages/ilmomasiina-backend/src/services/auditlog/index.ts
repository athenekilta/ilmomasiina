import { hooks as authHooks } from '@feathersjs/authentication';
import { Service, ServiceMethods } from '@feathersjs/feathers';

import { AuditLogResponse } from '@tietokilta/ilmomasiina-models/src/services/auditlog';
import { IlmoApplication } from '../../defs';
import { AuditLog } from '../../models/auditlog';
import getAuditLogs from './getAuditLogs';

export type AuditLogService = Service<AuditLog>;

export const auditLogService: Partial<ServiceMethods<AuditLogResponse>> = {
  find(params) {
    return getAuditLogs(params);
  },
};

export default function configureAuditLogService(this: IlmoApplication) {
  const app = this;

  // Initialize our service with any options it requires
  app.use('/api/auditlog', auditLogService);

  app.service('/api/auditlog').hooks({
    before: {
      all: [authHooks.authenticate('jwt')],
    },
  });
}
