import { Event } from '../types';
import { setEvents, setEventsError, setEventsLoading } from './actions';

interface EventsState {
  events: { [key: string]: Event };
  eventsLoading: boolean;
  eventsError: boolean;
}

type EventsActions =
  | ReturnType<typeof setEvents>
  | ReturnType<typeof setEventsLoading>
  | ReturnType<typeof setEventsError>;
