import { AdminEvent } from '@tietokilta/ilmomasiina-models/src/services/admin/events';
import { AdminSlug } from '@tietokilta/ilmomasiina-models/src/services/admin/slug';
import { Question, Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import {
  checkingSlugAvailability,
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

interface EditorState {
  event: AdminEvent.Details | null;
  formData: EditorEvent | null;
  isNew: boolean;
  loadError: boolean;
  slugAvailability: null | 'checking' | AdminSlug.Check;
  saving: boolean;
  saveError: boolean;
  moveToQueueModal: { count: number } | null;
}

type EditorActions =
  | ReturnType<typeof resetState>
  | ReturnType<typeof loaded>
  | ReturnType<typeof newEvent>
  | ReturnType<typeof loadFailed>
  | ReturnType<typeof checkingSlugAvailability>
  | ReturnType<typeof slugAvailabilityChecked>
  | ReturnType<typeof saving>
  | ReturnType<typeof saveFailed>
  | ReturnType<typeof moveToQueueWarning>
  | ReturnType<typeof moveToQueueCanceled>;

/** Question type for event editor */
export interface EditorQuestion extends AdminEvent.Update.Question {
  key: Question.Id;
  options: string[];
}

/** Quota type for event editor */
export interface EditorQuota extends AdminEvent.Update.Quota {
  key: Quota.Id;
}

type EditorEventType = 'event' | 'event+signup' | 'signup';

/** Root form data type for event editor */
export interface EditorEvent extends Omit<AdminEvent.Update.Body, 'quota'> {
  eventType: EditorEventType;

  date: Date | undefined;

  questions: EditorQuestion[];

  registrationStartDate: Date | undefined;
  registrationEndDate: Date | undefined;
  quotas: EditorQuota[];
  useOpenQuota: boolean;
}
