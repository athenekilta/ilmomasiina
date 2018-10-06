import request from 'then-request';
import * as ActionTypes from './actionTypes';

export const setEvents = events => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENTS,
    payload: events,
  });
};

export const setEventsLoading = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENTS_LOADING,
  });
};

export const setEventsError = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENTS_ERROR,
  });
};

export const getEventsAsync = () => (dispatch) => {
  dispatch(setEventsLoading());

  request('GET', '/api/admin/events', {
    headers: { Authorization: localStorage.getItem('id_token') },
  })
    .then((res) => {
      dispatch(setEvents(JSON.parse(res.body)));
    })
    .catch((error) => {
      console.error('Error in getEventsAsync', error);
      dispatch(setEventsError());
    });
};
