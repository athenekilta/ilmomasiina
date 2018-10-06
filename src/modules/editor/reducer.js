import * as ActionTypes from './actionTypes';

const initialState = {
  event: {},
  eventLoading: false,
  eventError: false,
  eventPublishLoading: false,
  eventPublishError: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.SET_EVENT:
      return {
        ...state,
        event: action.payload,
        eventLoading: false,
        eventError: false,
        eventPublishLoading: false,
        eventPublishError: false,
      };
    case ActionTypes.UPDATE_EVENT_FIELD:
      return {
        ...state,
        event: {
          ...state.event,
          [action.payload.field]: action.payload.value,
        },
      };
    case ActionTypes.SET_EVENT_LOADING:
      return {
        ...state,
        eventLoading: true,
        eventError: false,
      };
    case ActionTypes.SET_EVENT_ERROR:
      return {
        ...state,
        eventLoading: false,
        eventError: true,
      };
    case ActionTypes.SET_EVENT_PUBLISH_LOADING:
      return {
        ...state,
        eventPublishLoading: true,
        eventPublishError: false,
      };
    case ActionTypes.SET_EVENT_PUBLISH_ERROR:
      return {
        ...state,
        eventPublishLoading: false,
        eventPublishError: true,
      };
    default:
      return state;
  }
}
