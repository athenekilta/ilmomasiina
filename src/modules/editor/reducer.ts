import {
  SET_EVENT,
  SET_EVENT_ERROR,
  SET_EVENT_LOADING,
  SET_EVENT_PUBLISH_ERROR,
  SET_EVENT_PUBLISH_LOADING,
  UPDATE_EVENT_FIELD,
} from './actionTypes';
import { EditorActions, EditorState } from './types';

const initialState: EditorState = {
  event: {},
  eventLoading: false,
  eventError: false,
  eventPublishLoading: false,
  eventPublishError: false,
};

export default function reducer(
  state = initialState,
  action: EditorActions,
): EditorState {
  switch (action.type) {
    case SET_EVENT:
      return {
        ...state,
        event: action.payload,
        eventLoading: false,
        eventError: false,
        eventPublishLoading: false,
        eventPublishError: false,
      };
    case UPDATE_EVENT_FIELD:
      return {
        ...state,
        event: {
          ...state.event,
          [action.payload.field]: action.payload.value,
        },
      };
    case SET_EVENT_LOADING:
      return {
        ...state,
        eventLoading: true,
        eventError: false,
      };
    case SET_EVENT_ERROR:
      return {
        ...state,
        eventLoading: false,
        eventError: true,
      };
    case SET_EVENT_PUBLISH_LOADING:
      return {
        ...state,
        eventPublishLoading: true,
        eventPublishError: false,
      };
    case SET_EVENT_PUBLISH_ERROR:
      return {
        ...state,
        eventPublishLoading: false,
        eventPublishError: true,
      };
    default:
      return state;
  }
}
