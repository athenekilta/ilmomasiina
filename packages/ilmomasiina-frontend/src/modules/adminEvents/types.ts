import type { AdminEventList } from '@tietokilta/ilmomasiina-models';

export interface AdminState {
  events: AdminEventList | null;
  eventsLoadError: boolean;
}

export type { AdminEventsActions } from './actions';
