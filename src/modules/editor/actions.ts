import apiFetch from '../../api';
import { AdminEvent } from '../../api/adminEvents';
import { Event } from '../../api/events';
import { Signup } from '../../api/signups';
import { DispatchAction, GetState } from '../../store/types';
import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  EVENT_SAVE_FAILED,
  EVENT_SAVING,
  RESET,
} from './actionTypes';
import { EditorEvent } from './types';

export const resetState = () => <const>{
  type: RESET,
};

export const loaded = (event: AdminEvent.Details | null, formData: EditorEvent | null) => <const>{
  type: EVENT_LOADED,
  payload: {
    event,
    formData,
  },
};

export const loadFailed = () => <const>{
  type: EVENT_LOAD_FAILED,
};

export const saving = () => <const>{
  type: EVENT_SAVING,
};

export const saveFailed = () => <const>{
  type: EVENT_SAVE_FAILED,
};

const serverEventToEditor = (event: AdminEvent.Details): EditorEvent => ({
  ...event,
  quotas: event.quota,
  useOpenQuota: event.openQuotaSize > 0,
  questions: event.questions.map((question) => ({
    ...question,
    options: question.options || [''],
  })),
});

const editorEventToServer = (form: EditorEvent): AdminEvent.Update.Body => ({
  ...form,
  quota: form.quotas,
  openQuotaSize: form.useOpenQuota ? form.openQuotaSize : 0,
  questions: form.questions.map((question) => ({
    ...question,
    options: question.type === 'select' || question.type === 'checkbox' ? question.options.join(';') : null,
  })),
});

export const getEvent = (id: Event.Id | string) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;
  try {
    const response = await apiFetch(`admin/events/${id}`, { accessToken }) as AdminEvent.Details;
    const formData = serverEventToEditor(response);
    dispatch(loaded(response, formData));
  } catch (e) {
    dispatch(loadFailed());
  }
};

export const publishNewEvent = (data: EditorEvent) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(saving());

  const cleaned = editorEventToServer(data);
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch('admin/events', {
      accessToken,
      method: 'POST',
      body: cleaned,
    }) as AdminEvent.Details;
    const newFormData = serverEventToEditor(response);
    dispatch(loaded(response, newFormData));
    return response;
  } catch (e) {
    dispatch(saveFailed());
    throw new Error(e);
  }
};

export const publishEventUpdate = (
  id: Event.Id | string, data: EditorEvent,
) => async (dispatch: DispatchAction, getState: GetState) => {
  dispatch(saving());

  const cleaned = editorEventToServer(data);
  const { accessToken } = getState().auth;

  try {
    const response = await apiFetch(`admin/events/${id}`, {
      accessToken,
      method: 'PATCH',
      body: cleaned,
    }) as AdminEvent.Details;
    const newFormData = serverEventToEditor(response);
    dispatch(loaded(response, newFormData));
    return response;
  } catch (e) {
    dispatch(saveFailed());
    throw new Error(e);
  }
};

export const deleteSignup = (id: Signup.Id) => async (
  dispatch: DispatchAction,
  getState: GetState,
) => {
  const { accessToken } = getState().auth;

  try {
    await apiFetch(`admin/signups/${id}`, {
      accessToken,
      method: 'DELETE',
    });
    return true;
  } catch (e) {
    return false;
  }
};
