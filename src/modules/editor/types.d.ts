import { Moment } from 'moment';

import { AdminEvent } from '../../api/adminEvents';
import { Question, Quota } from '../../api/events';
import {
  loaded,
  loadFailed,
  resetState,
  saveFailed,
  saving,
} from './actions';

interface EditorState {
  event: AdminEvent.Details | null;
  formData: EditorEvent | null;
  loadError: boolean;
  saving: boolean;
  saveError: boolean;
}

type EditorActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof loaded>
  | ReturnType<typeof loadFailed>
  | ReturnType<typeof saving>
  | ReturnType<typeof saveFailed>;

/** Question type for event editor */
export interface EditorQuestion extends AdminEvent.Update.Question {
  key: Question.Id | string;
  options: string[];
}

/** Quota type for event editor */
export interface EditorQuota extends AdminEvent.Update.Quota {
  key: Quota.Id | string;
}

/** Root form data type for event editor */
export interface EditorEvent extends Omit<AdminEvent.Update.Body, 'quota'> {
  date: Moment | undefined;

  questions: EditorQuestion[];

  registrationStartDate: Moment | undefined;
  registrationEndDate: Moment | undefined;
  quotas: EditorQuota[];
  useOpenQuota: boolean;
}
