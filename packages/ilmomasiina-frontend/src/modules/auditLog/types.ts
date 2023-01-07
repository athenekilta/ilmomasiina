import type { AuditLogResponse, AuditLoqQuery } from '@tietokilta/ilmomasiina-models';

export interface AuditLogState {
  auditLogQuery: AuditLoqQuery;
  auditLog: AuditLogResponse | null;
  auditLogLoadError: boolean;
}

export type { AuditLogActions } from './actions';
