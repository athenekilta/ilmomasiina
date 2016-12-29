import request from 'then-request';

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
  date: '2016-12-31T00:12:00+02:00',
  quotas: [
    {
      title: 'Athene',
      signUpStarts: '2016-12-31T00:12:00+02:00',
      signUpEnds: '2017-01-15T00:15:00+02:00',
      going: 15,
      max: 20,
    },
    {
      title: 'Prodeko',
      // signUpStarts: '2016-12-31T00:12:00+02:00',
      // signUpEnds: '2017-01-15T00:15:00+02:00',
      signUpStarts: '2016-12-28T00:12:00+02:00',
      signUpEnds: '2016-12-31T00:15:00+02:00',
      going: 10,
      max: 20,
    },
  ],
},
{
  id: 2,
  title: 'Uusivuosi',
  date: '2015-12-31T00:12:00+02:00',
  quotas: [
    {
      title: 'Default',
      signUpStarts: '2016-12-24T00:20:00+02:00',
      signUpEnds: '2016-12-25T00:15:00+02:00',
      going: 50,
      max: 50,
    },
  ],
},
];

function getApi() {
  return request('GET', '/api/events');
}

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const getEventList = () => (dispatch) => {
  getApi()
    .then(res => JSON.parse(res.getBody()))
    .then(r => console.log(r))
    .then((res) => {
      dispatch({
        type: GET_EVENTLIST_ASYNC,
        payload: res,
      });
    });
};

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
