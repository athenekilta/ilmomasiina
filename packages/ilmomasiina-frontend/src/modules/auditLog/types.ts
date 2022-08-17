import { AuditLogResponse, AuditLoqQuery } from '@tietokilta/ilmomasiina-models/src/schema';

export interface AuditLogState {
  auditLogQuery: AuditLoqQuery;
  auditLog: AuditLogResponse | null;
  auditLogLoadError: boolean;
}

export type { AuditLogActions } from './actions';
