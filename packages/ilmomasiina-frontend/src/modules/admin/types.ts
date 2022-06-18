import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { AuditLog } from '@tietokilta/ilmomasiina-models/src/services/auditlog';
import { User } from '@tietokilta/ilmomasiina-models/src/services/users';

export interface AdminState {
  events: AdminEvent.List | null;
  eventsLoadError: boolean;
  users: User.List | null;
  usersLoadError: boolean;
  userCreating: boolean;
  auditLogQuery: AuditLog.List.Query;
  auditLog: AuditLog.List | null;
  auditLogLoadError: boolean;
}

export type { AdminActions } from './actions';
