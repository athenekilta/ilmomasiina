import {
  SET_EVENT,
  SET_EVENT_ERROR,
  SET_EVENT_LOADING,
  SET_EVENT_PUBLISH_ERROR,
  SET_EVENT_PUBLISH_LOADING,
} from './actionTypes';
import { EditorActions, EditorState } from './types';

const initialState: EditorState = {
  event: null,
  formData: null,
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
        event: action.payload.event,
        formData: action.payload.formData,
        eventLoading: false,
        eventError: false,
        eventPublishLoading: false,
        eventPublishError: false,
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
