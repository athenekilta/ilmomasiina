import _ from "lodash";
import request from "then-request";
import { isArray } from "util";
import { Event, Question } from "../types";
import { DispatchAction } from "../../store/types";
import {
  SET_EVENT,
  SET_EVENT_ERROR,
  SET_EVENT_LOADING,
  SET_EVENT_PUBLISH_ERROR,
  SET_EVENT_PUBLISH_LOADING,
  UPDATE_EVENT_FIELD
} from "./actionTypes";

export const setEvent = (event: Event) => {
  return <const>{
    type: SET_EVENT,
    payload: event
  };
};

export const setEventLoading = () => {
  return <const>{
    type: SET_EVENT_LOADING
  };
};

export const setEventError = () => {
  return <const>{
    type: SET_EVENT_ERROR
  };
};

export const setEventPublishLoading = () => {
  return <const>{
    type: SET_EVENT_PUBLISH_LOADING
  };
};

export const setEventPublishError = () => {
  return <const>{
    type: SET_EVENT_PUBLISH_ERROR
  };
};

export const updateEventField = (field: string, value: any) => {
  return <const>{
    type: UPDATE_EVENT_FIELD,
    payload: {
      field,
      value
    }
  };
};

const cleanEventData = (event: Event) => ({
  ...event,
  openQuotaSize: event.useOpenQuota ? event.openQuotaSize : 0,
  questions: _.map(event.questions, (q: Question) => {
    if (q.existsInDb === false) {
      delete q.id;
    }
    if (q.options && Array.isArray(q.options)) {
      q.options = q.options.join(";");
    }
    return q;
  }),
  quota: _.map(event.quota, (q: Question) => {
    if (q.existsInDb === false) {
      delete q.id;
    }
    return q;
  })
});

const cleanServerEventdata = res => {
  if (res.questions) {
    res.questions = _.map(res.questions, q => {
      if (q.options && !isArray(q.options)) {
        q.options = q.options.split(";");
      }
      return q;
    });
  }
  res.useOpenQuota = res.openQuotaSize > 0;
  return res;
};

export const publishEventAsync = (data, token) => async (
  dispatch: DispatchAction
) => {
  dispatch(setEventPublishLoading());
  const cleaned = cleanEventData(data);
  const event = await request("POST", `${PREFIX_URL}/api/admin/events`, {
    json: cleaned,
    headers: { Authorization: token }
  })
    .then(res => {
      if (res.statusCode > 201) {
        throw new Error(res.body.toString());
      }
      return JSON.parse(res.body.toString());
    })
    .then(res => {
      const cleaned = cleanServerEventdata(res);
      dispatch(setEvent(cleaned));
      return cleaned;
    })
    .catch(error => {
      dispatch(setEventPublishError());
      throw new Error(error);
    });

  return event;
};

export const updateEventAsync = (data, token) => async (
  dispatch: DispatchAction
) => {
  dispatch(setEventPublishLoading());
  const cleaned = cleanEventData(data);
  const event = await request(
    "PATCH",
    `${PREFIX_URL}/api/admin/events/${data.id}`,
    {
      json: cleaned,
      headers: { Authorization: token }
    }
  )
    .then(res => {
      if (res.statusCode > 201) {
        throw new Error(res.body.toString());
      }
      return JSON.parse(res.body.toString());
    })
    .then(res => {
      const cleaned = cleanServerEventdata(res);
      dispatch(setEvent(cleaned));
      return cleaned;
    })
    .catch(error => {
      dispatch(setEventPublishError());
      throw new Error(error);
    });

  return event;
};

export const getEventAsync = (eventId: string, token: string) => async (
  dispatch: DispatchAction
) => {
  dispatch(setEventLoading());
  const res = await request(
    "GET",
    `${PREFIX_URL}/api/admin/events/${eventId}`,
    {
      headers: { Authorization: token }
    }
  )
    .then(res => JSON.parse(res.body.toString()))
    .then((res: Event) => {
      res.useOpenQuota = res.openQuotaSize > 0;
      dispatch(setEvent(res));
      return res;
    })
    .catch(error => {
      dispatch(setEventError());
    });

  return res;
};
