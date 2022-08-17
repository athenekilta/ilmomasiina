import {
  AdminEventSchema,
  CheckSlugResponse,
  EditConflictError,
  EventEditSchema,
  QuestionID,
  QuestionUpdateSchema,
  QuotaID,
  QuotaUpdateSchema,
} from '@tietokilta/ilmomasiina-models/src/schema';

export interface EditorState {
  event: AdminEventSchema | null;
  isNew: boolean;
  loadError: boolean;
  slugAvailability: null | 'checking' | CheckSlugResponse;
  allCategories: null | string[];
  saving: boolean;
  saveError: boolean;
  moveToQueueModal: { count: number } | null;
  editConflictModal: EditConflictError | null;
}

/** Question type for event editor */
export interface EditorQuestion extends Omit<QuestionUpdateSchema, 'options'> {
  key: QuestionID;
  options: string[];
}

/** Quota type for event editor */
export type EditorQuota = QuotaUpdateSchema & {
  key: QuotaID;
};

export enum EditorEventType {
  ONLY_EVENT = 'event',
  EVENT_WITH_SIGNUP = 'event+signup',
  ONLY_SIGNUP = 'signup',
}

/** Root form data type for event editor */
export interface EditorEvent extends Omit<
EventEditSchema, 'quotas' | 'questions' | 'date' | 'endDate' | 'registrationStartDate' | 'registrationEndDate'
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

export type { EditorActions } from './actions';
