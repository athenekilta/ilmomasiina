import _ from 'lodash';
import request from 'then-request';
import { isArray } from 'util';

import * as ActionTypes from './actionTypes';

// ------------------------------------
// Actions
// ------------------------------------

export const setEvent = event => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENT,
    payload: event,
  });
};

export const setEventLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENT_LOADING,
  });
};

export const setEventError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENT_ERROR,
  });
};

export const setEventPublishLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENT_PUBLISH_LOADING,
  });
};

export const setEventPublishError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_EVENT_PUBLISH_ERROR,
  });
};

export const updateEventField = (field, value) => dispatch => {
  dispatch({
    type: ActionTypes.UPDATE_EVENT_FIELD,
    payload: {
      field,
      value,
    },
  });
};

const cleanEventData = event => ({
  ...event,
  openQuotaSize: event.useOpenQuota ? event.openQuotaSize : 0,
  questions: _.map(event.questions, q => {
    if (q.existsInDb === false) {
      delete q.id;
    }
    if (q.options && Array.isArray(q.options)) {
      q.options = q.options.join(';');
    }
    return q;
  }),
  quota: _.map(event.quota, q => {
    if (q.existsInDb === false) {
      delete q.id;
    }
    return q;
  }),
});

const cleanServerEventdata = res => {
  if (res.questions) {
    res.questions = _.map(res.questions, q => {
      if (q.options && !isArray(q.options)) {
        q.options = q.options.split(';');
      }
      return q;
    });
  }
  res.useOpenQuota = res.openQuotaSize > 0;
  return res;
};

export const publishEventAsync = (data, token) => async dispatch => {
  dispatch(setEventPublishLoading());
  const cleaned = cleanEventData(data);
  console.log('CLEANED', cleaned);
  const event = await request('POST', `${PREFIX_URL}/api/admin/events`, {
    json: cleaned,
    headers: { Authorization: token },
  })
    .then(res => {
      if (res.statusCode > 201) {
        throw new Error(res.body);
      }
      return JSON.parse(res.body);
    })
    .then(res => {
      const cleaned = cleanServerEventdata(res);
      dispatch(setEvent(cleaned));
      return cleaned;
    })
    .catch(error => {
      console.error('Error in publishEventAsync', error);
      dispatch(setEventPublishError());
      throw new Error(error);
    });

  return event;
};

export const updateEventAsync = (data, token) => async dispatch => {
  dispatch(setEventPublishLoading());
  const cleaned = cleanEventData(data);
  console.log('CLEANED', cleaned);
  const event = await request(
    'PATCH',
    `${PREFIX_URL}/api/admin/events/${data.id}`,
    {
      json: cleaned,
      headers: { Authorization: token },
    }
  )
    .then(res => {
      if (res.statusCode > 201) {
        throw new Error(res.body);
      }
      return JSON.parse(res.body);
    })
    .then(res => {
      const cleaned = cleanServerEventdata(res);
      dispatch(setEvent(cleaned));
      return cleaned;
    })
    .catch(error => {
      console.error('Error in updateEventAsync', error);
      dispatch(setEventPublishError());
      throw new Error(error);
    });

  return event;
};

export const getEventAsync = (eventId, token) => async dispatch => {
  dispatch(setEventLoading());
  const res = await request(
    'GET',
    `${PREFIX_URL}/api/admin/events/${eventId}`,
    {
      headers: { Authorization: token },
    }
  )
    .then(res => JSON.parse(res.body))
    .then(res => {
      res.useOpenQuota = res.openQuotaSize > 0;
      dispatch(setEvent(res));
      return res;
    })
    .catch(error => {
      console.error('Error in getEventAsync', error);
      dispatch(setEventError());
    });

  return res;
};
