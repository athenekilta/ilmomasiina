import request from "then-request";
import { DispatchAction } from "../../store/types";
import { Event, Signup } from "../types";
import {
  SET_SIGNUP_AND_EVENT,
  SET_SIGNUP,
  SET_EVENT,
  SET_LOADING,
  SET_ERROR,
  SET_DELETED,
  RESET
} from "./actionTypes";

export const setSignupAndEvent = (signup: Signup, event: Event) => {
  return <const>{
    type: SET_SIGNUP_AND_EVENT,
    payload: {
      signup,
      event
    }
  };
};

export const setSignup = (signup: Signup) => {
  return <const>{ type: SET_SIGNUP, payload: signup };
};

export const setEvent = (event: Event) => {
  return <const>{ type: SET_EVENT, payload: event };
};

export const setLoading = () => {
  return <const>{ type: SET_LOADING };
};

export const setError = () => {
  return <const>{ type: SET_ERROR };
};

export const setDeleted = () => {
  return <const>{ type: SET_DELETED };
};

export const resetEventState = () => {
  return <const>{ type: RESET };
};

export const getSignupAndEventAsync = (id: string, editToken: string) => (
  dispatch: DispatchAction
) => {
  dispatch(setLoading());

  return request(
    "GET",
    `${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`
  )
    .then(res => JSON.parse(res.body.toString()))
    .then(res => {
      if (res.signup === null) throw new Error("Signup not found");
      dispatch(setSignupAndEvent(res.signup, res.event));
      return true;
    })
    .catch(error => {
      dispatch(setError());
      return false;
    });
};

export const deleteSignupAsync = (id: string, editToken: string) => (
  dispatch: DispatchAction
) => {
  dispatch(setLoading());
  return request(
    "DELETE",
    `${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`
  )
    .then(res => JSON.parse(res.body.toString()))
    .then(res => {
      dispatch(setDeleted());
      return true;
    })
    .catch(error => {
      dispatch(setError());
      return false;
    });
};
