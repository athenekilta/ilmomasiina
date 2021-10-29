import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  EVENT_SAVE_FAILED,
  EVENT_SAVING,
  EVENT_SLUG_CHECKED,
  EVENT_SLUG_CHECKING,
  MOVE_TO_QUEUE_CANCELED,
  MOVE_TO_QUEUE_WARNING,
  RESET,
} from './actionTypes';
import { EditorActions, EditorState } from './types';

const initialState: EditorState = {
  event: null,
  formData: null,
  isNew: true,
  loadError: false,
  slugAvailability: null,
  saving: false,
  saveError: false,
  moveToQueueModal: null,
};

export default function reducer(
  state = initialState,
  action: EditorActions,
): EditorState {
  switch (action.type) {
    case RESET:
      return initialState;
    case EVENT_LOADED:
      return {
        ...state,
        event: action.payload.event,
        formData: action.payload.formData,
        isNew: action.payload.isNew,
        loadError: false,
        saving: false,
        saveError: false,
      };
    case EVENT_LOAD_FAILED:
      return {
        ...state,
        loadError: true,
      };
    case EVENT_SLUG_CHECKING:
      return {
        ...state,
        slugAvailability: 'checking',
      };
    case EVENT_SLUG_CHECKED:
      return {
        ...state,
        slugAvailability: action.payload,
      };
    case EVENT_SAVING:
      return {
        ...state,
        saving: true,
        moveToQueueModal: null,
      };
    case EVENT_SAVE_FAILED:
      return {
        ...state,
        saving: false,
        saveError: true,
      };
    case MOVE_TO_QUEUE_WARNING:
      return {
        ...state,
        saving: false,
        moveToQueueModal: action.payload,
      };
    case MOVE_TO_QUEUE_CANCELED:
      return {
        ...state,
        moveToQueueModal: null,
      };
    default:
      return state;
  }
}
