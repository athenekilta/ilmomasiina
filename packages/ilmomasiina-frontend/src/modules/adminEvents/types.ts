import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';

export interface AdminState {
  events: AdminEvent.List | null;
  eventsLoadError: boolean;
}

export type { AdminEventsActions } from './actions';
