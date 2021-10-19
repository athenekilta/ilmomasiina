import { Event } from '@tietokilta/ilmomasiina-api/src/services/events';
import { eventsLoaded, eventsLoadFailed, resetState } from './actions';

interface EventsState {
  events: Event.List | null;
  eventsLoadError: boolean;
}

type EventsActions =
  | ReturnType<typeof eventsLoaded>
  | ReturnType<typeof eventsLoadFailed>
  | ReturnType<typeof resetState>;
