import request from 'then-request';

import * as ActionTypes from './actionTypes';

export const setEvents = events => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENTS,
    payload: events,
  });
};

export const setEventsLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENTS_LOADING,
  });
};

export const setEventsError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENTS_ERROR,
  });
};

export const getEventsAsync = () => dispatch => {
  dispatch(setEventsLoading());
  request('GET', `${PREFIX_URL}/api/events`)
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch(setEvents(res));
    })
    .catch(error => {
      console.error('Error in getEventsAsync', error);
      dispatch(setEventsError());
    });
};
