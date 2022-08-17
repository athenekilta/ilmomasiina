import { AdminEventList } from '@tietokilta/ilmomasiina-models/src/schema';

export interface AdminState {
  events: AdminEventList | null;
  eventsLoadError: boolean;
}

export type { AdminEventsActions } from './actions';
