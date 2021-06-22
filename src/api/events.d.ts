import {
  EventGetAnswerItem as _EventGetAnswerItem,
  EventGetQuestionItem as _EventGetQuestionItem,
  EventGetQuotaItem as _EventGetQuotaItem,
  EventGetResponse as _EventGetResponse,
  EventGetSignupItem as _EventGetSignupItem,
} from '../../server/services/event/getEventDetails';
import {
  EventListItem as _EventListItem,
  EventListQuotaItem as _EventListQuotaItem,
  EventListResponse as _EventListResponse,
} from '../../server/services/event/getEventsList';
import { StringifyApi } from './utils';

export type EventGetResponse = StringifyApi<_EventGetResponse>;
export type EventGetQuotaItem = StringifyApi<_EventGetQuotaItem>;
export type EventGetSignupItem = StringifyApi<_EventGetSignupItem>;
export type EventGetQuestionItem = StringifyApi<_EventGetQuestionItem>;
export type EventGetAnswerItem = StringifyApi<_EventGetAnswerItem>;

export type EventListResponse = StringifyApi<_EventListResponse>;
export type EventListItem = StringifyApi<_EventListItem>;
export type EventListQuotaItem = StringifyApi<_EventListQuotaItem>;
