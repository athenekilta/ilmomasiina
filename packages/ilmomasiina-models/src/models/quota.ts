import EventAttributes from './event';

export default interface QuotaAttributes {
  id: string;
  order: number;
  title: string;
  size: number | null;
  eventId: EventAttributes['id'];
  signupCount?: number;
}
