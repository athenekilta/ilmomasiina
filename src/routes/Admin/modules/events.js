import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTLIST_ASYNC = 'GET_EVENTLIST_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

<<<<<<< HEAD
/*  Temporary payload. This is going to be loaded from the backend. */

const payload = [
  {
    id: 1,
    name: 'Joulusitsit',
    date: 1482697816,
    quota: [
      {
        quotaName: 'Athene',
        signUpStarts: 1482697816,
        signUpEnds: 1482697816,
        going: 15,
        max: 20,
      },
      {
        quotaName: 'Athene',
        signUpStarts: 1482697816,
        signUpEnds: 1482697816,
        going: 10,
        max: 20,
      },
    ],
  },
  {
    id: 2,
    name: 'Uusivuosi',
    date: 1483221600,
    quota: [
      {
        quotaName: 'Default',
        signUpStarts: 1482697816,
        signUpEnds: 1482697816,
        going: 50,
        max: 50,
      },
    ],
  },
];

=======
>>>>>>> 45a802aa6b5d5b85263f1cc083756f5c1d63966e
/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getAdminEventList = () => dispatch =>
  request('GET', 'http://localhost:3000/api/admin/events', {
    headers: { Authorization: localStorage.getItem('id_token') },
  }).then((res) => {
    console.log(JSON.parse(res.body));

    dispatch({
      type: GET_EVENTLIST_ASYNC,
      payload: JSON.parse(res.body),
    });
  });

export const actions = {
  getAdminEventList,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENTLIST_ASYNC]: (state, action) => action.payload,
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = [];
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
