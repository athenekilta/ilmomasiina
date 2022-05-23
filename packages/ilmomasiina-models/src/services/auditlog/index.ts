import AuditLogAttributes from '../../models/auditlog';
import { StringifyApi } from '../../utils';

// Query schema.
export interface AuditLogQuery {
  user?: string;
  ip?: string;
  action?: string;
  event?: string;
  signup?: string;
  $offset?: number;
  $limit?: number;
}

// Response schema.
export interface AuditLogItem extends AuditLogAttributes {
  createdAt: Date;
}

export interface AuditLogResponse {
  rows: AuditLogItem[];
  count: number;
}

export namespace AuditLog {
  export type List = StringifyApi<AuditLogResponse>;
  export namespace List {
    export type Query = AuditLogQuery;
    export type Item = StringifyApi<AuditLogItem>;
  }
}
