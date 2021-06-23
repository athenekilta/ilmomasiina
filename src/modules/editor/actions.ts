import { AdminEvent } from '../../api/adminEvents';
import { DispatchAction } from '../../store/types';
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

export const getEvent = (id: number | string, token: string) => async (dispatch: DispatchAction) => {
  try {
    const response = await fetch(`${PREFIX_URL}/api/admin/events/${id}`, {
      headers: { Authorization: token },
    });
    const event = await response.json() as AdminEvent.Details;
    const formData = serverEventToEditor(event);
    dispatch(loaded(event, formData));
  } catch (e) {
    dispatch(loadFailed());
  }
};

export const publishNewEvent = (data: EditorEvent, token: string) => async (dispatch: DispatchAction) => {
  dispatch(saving());

  const cleaned = editorEventToServer(data);

  try {
    const response = await fetch(`${PREFIX_URL}/api/admin/events`, {
      method: 'POST',
      body: JSON.stringify(cleaned),
      headers: {
        Authorization: token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (response.status > 201) {
      throw new Error(response.statusText);
    }
    const newEvent = await response.json() as AdminEvent.Details;
    const newFormData = serverEventToEditor(newEvent);
    dispatch(loaded(newEvent, newFormData));
    return newEvent;
  } catch (e) {
    dispatch(saveFailed());
    throw new Error(e);
  }
};

export const publishEventUpdate = (id: number | string, data: EditorEvent, token: string) => async (
  dispatch: DispatchAction,
) => {
  dispatch(saving());

  const cleaned = editorEventToServer(data);

  try {
    const response = await fetch(`${PREFIX_URL}/api/admin/events/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cleaned),
      headers: {
        Authorization: token,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (response.status > 201) {
      throw new Error(response.statusText);
    }
    const newEvent = await response.json() as AdminEvent.Details;
    const newFormData = serverEventToEditor(newEvent);
    dispatch(loaded(newEvent, newFormData));
    return newEvent;
  } catch (e) {
    dispatch(saveFailed());
    throw new Error(e);
  }
};
