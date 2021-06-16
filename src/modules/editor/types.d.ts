import { Event } from '../types';
import {
  setEvent,
  setEventError,
  setEventLoading,
  setEventPublishError,
  setEventPublishLoading,
  updateEventField
} from './actions';

interface EditorState {
  event: { [key: string]: Event };
  eventLoading: boolean;
  eventError: boolean;
  eventPublishLoading: boolean;
  eventPublishError: boolean;
}

type EditorActions =
  | ReturnType<typeof setEvent>
  | ReturnType<typeof setEventLoading>
  | ReturnType<typeof setEventError>
  | ReturnType<typeof setEventPublishLoading>
  | ReturnType<typeof setEventPublishError>
  | ReturnType<typeof updateEventField>;
