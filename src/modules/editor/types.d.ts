import {
  AdminEventGetResponse, AdminEventUpdateBody, AdminEventUpdateQuestion, AdminEventUpdateQuota,
} from '../../api/adminEvents';
import {
  setEvent,
  setEventError,
  setEventLoading,
  setEventPublishError,
  setEventPublishLoading,
} from './actions';

interface EditorState {
  event: AdminEventGetResponse | null;
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
export interface EditorQuestion extends AdminEventUpdateQuestion {
  options: string[];
}

/** Quota type for event editor */
export interface EditorQuota extends AdminEventUpdateQuota {}

/** Root form data type for event editor */
export interface EditorEvent extends Omit<AdminEventUpdateBody, 'quota'> {
  questions: EditorQuestion[];

  quotas: EditorQuota[];
  useOpenQuota: boolean;
}
