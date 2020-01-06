import request from "then-request";
import { DispatchAction } from "../../store/types";
import { Event, Signup } from "../types";
import {
  SET_EVENT,
  SET_EVENT_LOADING,
  SET_EVENT_ERROR,
  SET_SIGNUP,
  SET_SIGNUP_LOADING,
  SET_SIGNUP_ERROR
} from "./actionTypes";

export const setEvent = (event: Event) => {
  return <const>{ type: SET_EVENT, payload: event };
};

export const setEventLoading = () => {
  return <const>{ type: SET_EVENT_LOADING };
};

export const setEventError = () => {
  return <const>{ type: SET_EVENT_ERROR };
};

export const setSignup = (signup: Signup) => {
  return <const>{ type: SET_SIGNUP, payload: signup };
};

export const setSignupLoading = () => {
  return <const>{ type: SET_SIGNUP_LOADING };
};

export const setSignupError = () => {
  return <const>{ type: SET_SIGNUP_ERROR };
};

export const updateEventAsync = (eventId: String) => (
  dispatch: DispatchAction
) => {
  dispatch(setEventLoading());
  return request("GET", `${PREFIX_URL}/api/events/${eventId}`)
    .then(res => JSON.parse(res.body.toString()))
    .then(res => {
      dispatch(setEvent(res));
    })
    .catch(error => {
      dispatch(setEventError());
    });
};

export const attachPositionAsync = (quotaId: string) => (
  dispatch: DispatchAction
) => {
  dispatch(setSignupLoading());
  return request("POST", `${PREFIX_URL}/api/signups`, { json: { quotaId } })
    .then(res => JSON.parse(res.body.toString()))
    .then(res => {
      dispatch(setSignup(res));
    })
    .catch(error => {
      dispatch(setSignupError());
    });
};

export const completeSignupAsync = (signupId: string, data: any) => (
  dispatch: DispatchAction
) => {
  dispatch(setSignupLoading());

  return request("PATCH", `${PREFIX_URL}/api/signups/${signupId}`, {
    json: {
      editToken: data.editToken,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      answers: data.answers
    }
  })
    .then(res => JSON.parse(res.body.toString()))
    .then(res => {
      if (res.code && res.code !== 200) {
        throw new Error(res.message);
      }
      dispatch(setSignup(res));
      return true;
    })
    .catch(error => {
      dispatch(setSignupError());
      return false;
    });
};

export const cancelSignupAsync = (signupId: string, editToken: string) => (
  dispatch: DispatchAction
) => {
  dispatch(setSignupLoading());
  return request(
    "DELETE",
    `${PREFIX_URL}/api/signups/${signupId}?editToken=${editToken}`
  )
    .then(res => JSON.parse(res.body.toString()))
    .then(() => {
      dispatch(setSignup({}));
    })
    .catch(error => {
      dispatch(setSignupError());
    });
};
