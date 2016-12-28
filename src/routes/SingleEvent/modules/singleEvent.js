// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENT_ASYNC = 'GET_EVENT_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

/*  Temporary payload. This is going to be loaded from the backend. */

const payload = {
  id: 1,
  name: 'Joulusitsit',
  date: 1482697816,
  quota: [
    {
      quotaName:'Athene',
      signUpStarts: 1482697816,
      signUpEnds: 1482697816,
      going: 15,
      max: 20,
      attendees: [
        'epic',
        'long',
        'list',
        'of',
        'people',
        'who',
        'are',
        'coming',
      ],
    },
    {
      quotaName:'Tietokilta',
      signUpStarts: 1482697816,
      signUpEnds: 1482697816,
      going: 10,
      max: 20,
      attendees: [
        'epic',
        'long',
        'list',
        'of',
        'people',
        'who',
        'are',
        'coming',
      ],
    },
  ],
  description: 'Sitsit, Jee! Trololoo..',
  price: '0€',
};

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getEventInfo = () => dispatch => new Promise((resolve) => {
  setTimeout(() => {
    dispatch({
      type    : GET_EVENT_ASYNC,
      payload,
    });
    resolve();
  }, 1000);
});

export const actions = {
  getEventInfo,
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_EVENT_ASYNC] : (state, action) => action.payload,
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};
export default function counterReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
