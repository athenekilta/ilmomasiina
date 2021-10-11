import moment from 'moment';

import apiFetch from '../../api';
import { AdminEvent, AdminSlug } from '../../api/adminEvents';
import { Signup } from '../../api/signups';
import { DispatchAction, GetState } from '../../store/types';
import {
  EVENT_LOAD_FAILED,
  EVENT_LOADED,
  EVENT_SAVE_FAILED,
  EVENT_SAVING,
  EVENT_SLUG_CHECKED,
  EVENT_SLUG_CHECKING,
  RESET,
} from './actionTypes';
import { EditorEvent } from './types';

const defaultEvent = (): EditorEvent => ({
  title: '',
  slug: '',
  date: undefined,
  webpageUrl: '',
  facebookUrl: '',
  location: '',
  description: '',
  price: '',
  signupsPublic: false,

  registrationStartDate: undefined,
  registrationEndDate: undefined,

  openQuotaSize: 0,
  useOpenQuota: false,
  quotas: [
    {
      key: 'new',
      title: 'Kiintiö',
      size: 20,
    },
  ],

  questions: [],

  verificationEmail: '',

  draft: true,
  listed: true,
});

export const resetState = () => <const>{
  type: RESET,
};

export const loaded = (event: AdminEvent.Details, formData: EditorEvent | null) => <const>{
  type: EVENT_LOADED,
  payload: {
    event,
    formData,
    isNew: false,
  },
};

export const newEvent = () => <const>{
  type: EVENT_LOADED,
  payload: {
    event: null,
    formData: defaultEvent(),
    isNew: true,
  },
};

export const loadFailed = () => <const>{
  type: EVENT_LOAD_FAILED,
};

export const checkingSlugAvailability = () => <const>{
  type: EVENT_SLUG_CHECKING,
};

export const slugAvailabilityChecked = (
  result: AdminSlug.Check | null,
) => <const>{
  type: EVENT_SLUG_CHECKED,
  payload: result,
};

export const saving = () => <const>{
  type: EVENT_SAVING,
};

export const saveFailed = () => <const>{
  type: EVENT_SAVE_FAILED,
};

const serverEventToEditor = (event: AdminEvent.Details): EditorEvent => ({
  ...event,
  date: event.date ? moment(event.date) : undefined,
  registrationStartDate: event.registrationStartDate ? moment(event.registrationStartDate) : undefined,
  registrationEndDate: event.registrationEndDate ? moment(event.registrationEndDate) : undefined,
  quotas: event.quotas.map((quota) => ({
    ...quota,
    key: quota.id,
  })),
  useOpenQuota: event.openQuotaSize > 0,
  questions: event.questions.map((question) => ({
    ...question,
    key: question.id,
    options: question.options || [''],
  })),
});

const editorEventToServer = (form: EditorEvent): AdminEvent.Update.Body => ({
  ...form,
  date: form.date?.toISOString() ?? null,
  registrationStartDate: form.registrationStartDate?.toISOString() ?? null,
  registrationEndDate: form.registrationEndDate?.toISOString() ?? null,
  quotas: form.quotas,
  openQuotaSize: form.useOpenQuota ? form.openQuotaSize : 0,
  questions: form.questions.map((question) => ({
    ...question,
    options: question.type === 'select' || question.type === 'checkbox' ? question.options.join(';') : null,
  })),
});

export const getEvent = (id: AdminEvent.Id) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;
  try {
    const response = await apiFetch(`admin/events/${id}`, { accessToken }) as AdminEvent.Details;
    const formData = serverEventToEditor(response);
    dispatch(loaded(response, formData));
  } catch (e) {
    dispatch(loadFailed());
  }
};

export const checkSlugAvailability = (slug: string) => async (dispatch: DispatchAction, getState: GetState) => {
  const { accessToken } = getState().auth;
  try {
    const response = await apiFetch(`admin/slug/${slug}`, {
      accessToken,
    }) as AdminSlug.Check;
    dispatch(slugAvailabilityChecked(response));
  } catch (e) {
    dispatch(slugAvailabilityChecked(null));
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
    throw e;
  }
};

export const publishEventUpdate = (
  id: AdminEvent.Id, data: EditorEvent,
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
    throw e;
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
