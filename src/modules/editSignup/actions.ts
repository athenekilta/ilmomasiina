import { DispatchAction } from "../../store/types";
import { Event, Signup } from "../types";
import {
  RESET,
  SET_DELETED,
  SET_ERROR,
  SET_EVENT,
  SET_LOADING,
  SET_SIGNUP,
  SET_SIGNUP_AND_EVENT
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

export function getSignupAndEvent(id: string, editToken: string) {
  return function(dispatch: DispatchAction) {
    dispatch(setLoading());

    return fetch(`${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`)
      .then(res => res.json())
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
}

export function deleteSignupAsync(id: string, editToken: string) {
  return function(dispatch: DispatchAction) {
    dispatch(setLoading());
    return fetch(`${PREFIX_URL}/api/signups/${id}?editToken=${editToken}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(res => {
        dispatch(setDeleted());
        return true;
      })
      .catch(error => {
        dispatch(setError());
        return false;
      });
  };
}
