import { Event } from '../../api/events';
import { eventsLoaded, eventsLoadFailed, resetState } from './actions';

interface EventsState {
  events: Event.List | null;
  eventsLoadError: boolean;
}

type EventsActions =
  | ReturnType<typeof eventsLoaded>
  | ReturnType<typeof eventsLoadFailed>
  | ReturnType<typeof resetState>;
