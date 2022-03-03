import { Event } from '@tietokilta/ilmomasiina-models/src/services/events';

export interface EventsState {
  events: Event.List | null;
  eventsLoadError: boolean;
}

export type { EventsActions } from './actions';
