import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { AdminSlug } from '@tietokilta/ilmomasiina-models/src/services/admin/slug';
import { Question, Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import {
  categoriesLoaded,
  checkingSlugAvailability,
  editConflictDetected,
  editConflictDismissed,
  loaded,
  loadFailed,
  moveToQueueCanceled,
  moveToQueueWarning,
  newEvent,
  resetState,
  saveFailed,
  saving,
  slugAvailabilityChecked,
} from './actions';

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

export type EditorActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof loaded>
  | ReturnType<typeof newEvent>
  | ReturnType<typeof loadFailed>
  | ReturnType<typeof checkingSlugAvailability>
  | ReturnType<typeof slugAvailabilityChecked>
  | ReturnType<typeof saving>
  | ReturnType<typeof saveFailed>
  | ReturnType<typeof moveToQueueWarning>
  | ReturnType<typeof moveToQueueCanceled>
  | ReturnType<typeof editConflictDetected>
  | ReturnType<typeof editConflictDismissed>
  | ReturnType<typeof categoriesLoaded>;

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
AdminEvent.Update.Body, 'quotas' | 'questions' | 'date' | 'registrationStartDate' | 'registrationEndDate'
> {
  eventType: EditorEventType;

  date: Date | undefined;

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
