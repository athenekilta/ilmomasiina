import { AdminEvent } from '../../api/adminEvents';
import {
  setEvent,
  setEventError,
  setEventLoading,
  setEventPublishError,
  setEventPublishLoading,
} from './actions';

interface EditorState {
  event: AdminEvent.Details | null;
  formData: EditorEvent | null;
  eventLoading: boolean;
  eventError: boolean;
  eventPublishLoading: boolean;
  eventPublishError: boolean;
}

type EditorActions =
  | ReturnType<typeof setEvent>
  | ReturnType<typeof setEventLoading>
  | ReturnType<typeof setEventError>
  | ReturnType<typeof setEventPublishLoading>
  | ReturnType<typeof setEventPublishError>;

/** Question type for event editor */
export interface EditorQuestion extends AdminEvent.Update.Question {
  options: string[];
}

/** Quota type for event editor */
export interface EditorQuota extends AdminEvent.Update.Quota {}

/** Root form data type for event editor */
export interface EditorEvent extends Omit<AdminEvent.Update.Body, 'quota'> {
  questions: EditorQuestion[];

  quotas: EditorQuota[];
  useOpenQuota: boolean;
}
