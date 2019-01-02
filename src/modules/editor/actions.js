import request from 'then-request';
import _ from 'lodash';
import * as ActionTypes from './actionTypes';

// ------------------------------------
// Actions
// ------------------------------------

export const setEvent = event => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENT,
    payload: event,
  });
};

export const setEventLoading = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENT_LOADING,
  });
};

export const setEventError = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENT_ERROR,
  });
};

export const setEventPublishLoading = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENT_PUBLISH_LOADING,
  });
};

export const setEventPublishError = () => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_EVENT_PUBLISH_ERROR,
  });
};

export const updateEventField = (field, value) => (dispatch) => {
  dispatch({
    type: ActionTypes.UPDATE_EVENT_FIELD,
    payload: {
      field,
      value,
    },
  });
};

const cleanEventData = (event) => {
  return {
    ...event,
    questions: _.map(event.questions, (q) => {
      if (q.existsInDb === false) {
        delete q.id;
      }
      return q;
    }),
    quota: _.map(event.quota, (q) => {
      if (q.existsInDb === false) {
        delete q.id;
      }
      return q;
    })
  }
}

export const publishEventAsync = (data, token) => async (dispatch) => {
  dispatch(setEventPublishLoading());
  const cleaned = cleanEventData(data);
  console.log('CLEANED', cleaned);
  const event = await request('POST', '/api/admin/events', {
    json: cleaned,
    headers: { Authorization: token },
  }).then(res => JSON.parse(res.body))
    .then((res) => {
      console.log('RES PUBLISH', res);
      dispatch(setEvent(res));
      return res;
    })
    .catch((error) => {
      console.log('ERR', error);
      console.error('Error in publishEventAsync', error);
      dispatch(setEventPublishError());
    });

  return event;
};

export const updateEventAsync = (data, token) => async (dispatch) => {
  dispatch(setEventPublishLoading());
  const cleaned = cleanEventData(data);
  console.log('CLEANED', cleaned);
  const event = await request('PATCH', `/api/admin/events/${data.id}`, {
    json: cleaned,
    headers: { Authorization: token },
  }).then(res => JSON.parse(res.body))
    .then((res) => {
      console.log('RES UPDATE', res);
      res.useOpenQuota = res.openQuotaSize > 0
      dispatch(setEvent(res));
      return res;
    })
    .catch((error) => {
      console.error('Error in updateEventAsync', error);
      dispatch(setEventPublishError());
    });

  return event;
};

export const getEventAsync = (eventId, token) => async (dispatch) => {
  dispatch(setEventLoading());
  const res = await request('GET', `/api/admin/events/${eventId}`, {
    headers: { Authorization: token },
  }).then(res => JSON.parse(res.body))
    .then((res) => {
      res.useOpenQuota = res.openQuotaSize > 0
      dispatch(setEvent(res));
      return res;
    })
    .catch((error) => {
      console.error('Error in getEventAsync', error);
      dispatch(setEventError());
    });

  return res;
};

