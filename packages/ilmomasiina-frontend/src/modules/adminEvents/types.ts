import type { AdminEventListResponse } from '@tietokilta/ilmomasiina-models';

export interface AdminState {
  events: AdminEventListResponse | null;
  eventsLoadError: boolean;
}

export type { AdminEventsActions } from './actions';
