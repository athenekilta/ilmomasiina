import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
const UPDATE_SIGNUP = 'UPDATE_SIGNUP';
const SET_ERROR = 'ERROR';
const SET_LOADING = 'LOADING';

// ------------------------------------
// Actions
// ------------------------------------

// Helpers
function _getSignup(id, editToken) {
  return request('GET', `/api/signups/${id}?editToken=${editToken}`);
}

function _setLoading(dispatch, isLoading) {
  return dispatch({ type: SET_LOADING, isLoading });
}

function _setError(dispatch, isError) {
  return dispatch({ type: SET_ERROR, isError });
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */
export const getSignupAsync = (id, editToken) => (dispatch) => {
  _setLoading(dispatch, true);
  _setError(dispatch, false);
  return _getSignup(id, editToken)
    .then(res => JSON.parse(res.body))
    .then((res) => {
      dispatch({
        type: UPDATE_SIGNUP,
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

// export const setLoading = isLoading => (dispatch) => {
//   dispatch({
//     type: SET_LOADING,
//     payload: isLoading,
//   });
// };

// // If non-empty string, counts as error
// export const setError = errorText => (dispatch) => {
//   dispatch({
//     type: SET_ERROR,
//     payload: errorText,
//   });
// };

// export const updateEventAsync = eventId => (dispatch) => {
//   _getEvent(eventId)
//     .then(res => JSON.parse(res.body))
//     .then((res) => {
//       dispatch({
//         type: UPDATE_EVENT,
//         payload: res,
//       });
//     });
// };

// export const attachPositionAsync = quotaId => (dispatch) => {
//   _attachPosition(quotaId)
//     .then(res => JSON.parse(res.body))
//     .then((res) => {
//       dispatch({
//         type: UPDATE_SIGNUP,
//         payload: res,
//       });
//     });
// };

// export const completeSignupAsync = (signupId, data) => (dispatch) => {
//   dispatch(setLoading(true));

//   return _insertAnswers(signupId, data)
//     .then(res => JSON.parse(res.body))
//     .then((res) => {
//       dispatch({
//         type: UPDATE_SIGNUP,
//         payload: res,
//       });
//       dispatch(setLoading(false));
//       return true;
//     })
//     .catch(() => {
//       dispatch(setError('Jotain meni pieleen. Yritäpä uudestaan.'));
//       return false;
//     });
// };

// export const cancelSignupAsync = (signupId, editToken) => dispatch =>
//   _deleteSignup(signupId, editToken)
//     .then(res => JSON.parse(res.body))
//     .then(() => {
//       dispatch({
//         type: UPDATE_SIGNUP,
//         payload: {},
//       });
//       dispatch(setLoading(false));
//     });

export const actions = {
  getSignupAsync,
  //   updateEventAsync,
  //   attachPositionAsync,
  //   completeSignupAsync,
  //   cancelSignupAsync,
  //   setLoading,
  //   setError,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const initialState = {
  event: {},
  signup: {},
  loading: false,
  error: '',
};

const ACTION_HANDLERS = {
  [UPDATE_SIGNUP]: (state, action) => ({
    ...state,
    signup: action.payload,
  }),
  [SET_LOADING]: (state, action) => ({
    ...state,
    loading: action.payload,
  }),
  [SET_ERROR]: (state, action) => ({
    ...state,
    error: action.payload,
  }),
  //   [UPDATE_EVENT]: (state, action) => ({
  //     ...state,
  //     event: action.payload,
  //   }),
  //   [UPDATE_SIGNUP]: (state, action) => ({
  //     ...state,
  //     signup: action.payload,
  //   }),
  //   [SET_LOADING]: (state, action) => ({
  //     ...state,
  //     loading: action.payload,
  //     error: '',
  //   }),
  //   [SET_ERROR]: (state, action) => ({
  //     ...state,
  //     error: action.payload,
  //     loading: false,
  //   }),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
