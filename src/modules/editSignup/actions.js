import request from 'then-request';

import * as ActionTypes from './actionTypes';

export const setSignupAndEvent = (signup, event) => dispatch => {
  dispatch({
    type: ActionTypes.SET_SIGNUP_AND_EVENT,
    payload: {
      signup,
      event,
    },
  });
};

export const setSignup = signup => dispatch => {
  dispatch({ type: ActionTypes.SET_SIGNUP, payload: signup });
};

export const setEvent = event => dispatch => {
  dispatch({ type: ActionTypes.SET_EVENT, payload: event });
};

export const setLoading = () => dispatch => {
  dispatch({ type: ActionTypes.SET_LOADING });
};

export const setError = () => dispatch => {
  dispatch({ type: ActionTypes.SET_ERROR });
};

export const setDeleted = () => dispatch => {
  dispatch({ type: ActionTypes.SET_DELETED });
};

export const resetEventState = () => dispatch => {
  dispatch({ type: ActionTypes.RESET });
};

export const getSignupAndEventAsync = (id, editToken) => dispatch => {
  dispatch(setLoading());

  return request(
    'GET',
    `${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`
  )
    .then(res => JSON.parse(res.body))
    .then(res => {
      if (res.signup === null) throw new Error('signup not found');
      dispatch(setSignupAndEvent(res.signup, res.event));
      return true;
    })
    .catch(error => {
      console.error('Error in getSignupAndEventAsync', error);
      dispatch(setError());
      return false;
    });
};

export const deleteSignupAsync = (id, editToken) => dispatch => {
  dispatch(setLoading());
  return request(
    'DELETE',
    `${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`
  )
    .then(res => JSON.parse(res.body))
    .then(res => {
      dispatch(setDeleted());
      return true;
    })
    .catch(error => {
      console.error('Error in deleteSignupAsync', error);
      dispatch(setError());
      return false;
    });
};
