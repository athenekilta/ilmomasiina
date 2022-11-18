import {
  AdminEvent, AdminSlug, Question, Quota,
} from '@tietokilta/ilmomasiina-models';

export interface EditorState {
  event: AdminEvent.Details | null;
  isNew: boolean;
  loadError: boolean;
  slugAvailability: null | 'checking' | AdminSlug.Check;
  allCategories: null | string[];
  saving: boolean;
  saveError: boolean;
  moveToQueueModal: { count: number } | null;
  editConflictModal: EditConflictData | null;
}

/** Question type for event editor */
export interface EditorQuestion extends Omit<AdminEvent.Update.Question, 'options'> {
  key: Question.Id;
  options: string[];
}

/** Quota type for event editor */
export interface EditorQuota extends AdminEvent.Update.Quota {
  key: Quota.Id;
}

export enum EditorEventType {
  ONLY_EVENT = 'event',
  EVENT_WITH_SIGNUP = 'event+signup',
  ONLY_SIGNUP = 'signup',
}

/** Root form data type for event editor */
export interface EditorEvent extends Omit<
AdminEvent.Update.Body, 'quotas' | 'questions' | 'date' | 'endDate' | 'registrationStartDate' | 'registrationEndDate'
> {
  eventType: EditorEventType;

  date: Date | undefined;
  endDate: Date | undefined;

  questions: EditorQuestion[];

  registrationStartDate: Date | undefined;
  registrationEndDate: Date | undefined;
  quotas: EditorQuota[];
  useOpenQuota: boolean;
}

export interface EditConflictData {
  updatedAt: string;
  deletedQuotas: Quota.Id[];
  deletedQuestions: Quota.Id[];
}

export type { EditorActions } from './actions';
