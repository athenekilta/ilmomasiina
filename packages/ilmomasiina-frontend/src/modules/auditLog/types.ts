import { AuditLog } from '@tietokilta/ilmomasiina-models/src/services/auditlog';

export interface AuditLogState {
  auditLogQuery: AuditLog.List.Query;
  auditLog: AuditLog.List | null;
  auditLogLoadError: boolean;
}

export type { AuditLogActions } from './actions';
