import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
const UPDATE_SIGNUP_AND_EVENT = 'UPDATE_SIGNUP_AND_EVENT';
const SET_ERROR = 'ERROR';
const SET_LOADING = 'LOADING';
const SET_DELETED = 'DELETED';

// ------------------------------------
// Actions
// ------------------------------------

// Helpers
function _getSignupAndEvent(id, editToken) {
  return request('GET', `/api/signups/${id}?editToken=${editToken}`);
}

function _deleteSignup(id, editToken) {
  return request('DELETE', `/api/signups/${id}?editToken=${editToken}`);
}

function _setLoading(dispatch, isLoading) {
  return dispatch({ type: SET_LOADING, payload: isLoading });
}

function _setError(dispatch, isError) {
  return dispatch({ type: SET_ERROR, payload: isError });
}

function _setDeleted(dispatch, isDeleted) {
  return dispatch({ type: SET_DELETED, payload: isDeleted });
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */
export const getSignupAndEventAsync = (id, editToken) => (dispatch) => {
  _setLoading(dispatch, true);
  _setError(dispatch, false);
  return _getSignupAndEvent(id, editToken)
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: UPDATE_SIGNUP_AND_EVENT,
        payload: res,
      });
    })
    .then(() => {
      _setLoading(dispatch, false);
      return true;
    })
    .catch((error) => {
      _setError(dispatch, true);
      console.log(error);
      return false;
    });
};

export const deleteSignupAsync = (id, editToken) => (dispatch) => {
  _setLoading(dispatch, true);
  return _deleteSignup(id, editToken)
    .then(res => JSON.parse(res.body))
    .then((res) => {
      console.log('RES', res);
      _setLoading(dispatch, false);
      _setDeleted(dispatch, true);
      return true;
    })
    .catch((error) => {
      _setError(dispatch, true);
      console.log('ERROR', error);
      return false;
    });
};

export const actions = {
  getSignupAndEventAsync,
  deleteSignupAsync,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  event: {},
  signup: {},
  loading: false,
  error: false,
  deleted: false,
};

const ACTION_HANDLERS = {
  [UPDATE_SIGNUP_AND_EVENT]: (state, action) => ({
    ...state,
    signup: action.payload.signup,
    event: action.payload.event,
  }),
  [SET_LOADING]: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
  [SET_ERROR]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
  [SET_DELETED]: (state, action) => ({
    ...state,
    deleted: action.payload,
  }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
