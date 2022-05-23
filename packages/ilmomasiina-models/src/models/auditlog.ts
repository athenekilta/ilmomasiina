export default interface AuditLogAttributes {
  id: number;
  user: string | null;
  ipAddress: string;
  action: string | null;
  eventId: string | null;
  eventName: string | null;
  signupId: string | null;
  signupName: string | null;
  extra: string | null;
}
