import { setEvents, setEventsLoading, setEventsError } from "./actions";
import { Event } from "../types";

interface EventsState {
  events: { [key: string]: Event };
  eventsLoading: boolean;
  eventsError: boolean;
}

type EventsActions =
  | ReturnType<typeof setEvents>
  | ReturnType<typeof setEventsLoading>
  | ReturnType<typeof setEventsError>;
