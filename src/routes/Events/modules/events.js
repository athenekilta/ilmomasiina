// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTLIST_ASYNC = 'GET_EVENTLIST_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

/*  Temporary payload. This is going to be loaded from the backend. */

const payload = [{
  id: 1,
  title: 'Joulusitsit',
  date: 1482697816,
  quotas: [
    {
      title: 'Athene',
      signUpStarts: 1482697816,
      signUpEnds: 1482697816,
      going: 15,
      max: 20,
    },
    {
      title: 'Prodeko',
      signUpStarts: 1482697816,
      signUpEnds: 1482697816,
      going: 10,
      max: 20,
    },
  ],
},
{
  id: 2,
  title: 'Uusivuosi',
  date: 1483221600,
  quotas: [
    {
      title: 'Default',
      signUpStarts: 1482697816,
      signUpEnds: 1482697816,
      going: 50,
      max: 50,
    },
  ],
},
];

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getEventList = () => dispatch => new Promise((resolve) => {
  setTimeout(() => {
    dispatch({
      type: GET_EVENTLIST_ASYNC,
      payload,
    });
    resolve();
  }, 100);
});

export const actions = {
  getEventList,
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
