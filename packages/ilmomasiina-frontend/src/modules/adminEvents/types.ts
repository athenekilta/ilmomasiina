import { AdminEvent } from '@tietokilta/ilmomasiina-models';

export interface AdminState {
  events: AdminEvent.List | null;
  eventsLoadError: boolean;
}

export type { AdminEventsActions } from './actions';
