import request from 'then-request';

// ------------------------------------
// Constants
// ------------------------------------
export const GET_EVENTLIST_ASYNC = 'GET_EVENTLIST_ASYNC';

// ------------------------------------
// Actions
// ------------------------------------

/*  Temporary payload. This is going to be loaded from the backend. */

const payload = [
  {
    id:1,
    title:"Tapahtuma1",
    date:"2017-01-01T21:59:59.000Z",
    description:"Hassu tapahtuma",
    price:"sata euroo",
    location:"wat",
    homepage:"ei oo",
    facebooklink:"ei oo",
    _include:["quotas"],
    quotas:[
      {
        id:1,
        eventId:1,
        title:"Kiintiö tapahtumalle ",
        going:10,
        size:20,
        signupOpens:"2017-01-01T21:59:59.000Z",
        signupCloses:"2017-01-01T21:59:59.000Z"
      }
    ]
  },
  {
    id:2,
    title:"Tapahtuma2",
    date:"2017-01-01T21:59:59.000Z",
    description:"Hassu tapahtuma",
    price:"sata euroo",
    location:"wat",
    homepage:"ei oo",
    facebooklink:"ei oo",
    _include:["quotas"],
    quotas:[
      {
        id:2,
        eventId:2,
        title:"Kiintiö tapahtumalle ",
        going:10,
        size:20,
        signupOpens:"2017-01-01T21:59:59.000Z",
        signupCloses:"2017-01-01T21:59:59.000Z"
      }
    ]
  }
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
