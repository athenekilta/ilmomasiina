import { AuditEvent } from '../enum';

export default interface AuditLogAttributes {
  id: number;
  user: string | null;
  ipAddress: string;
  action: AuditEvent;
  eventId: string | null;
  eventName: string | null;
  signupId: string | null;
  signupName: string | null;
  extra: string | null;
}
