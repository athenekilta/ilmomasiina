import {
  AdminEventCreateBody as _AdminEventCreateBody,
  AdminEventCreateQuestion as _AdminEventCreateQuestion,
  AdminEventCreateQuota as _AdminEventCreateQuota,
} from '../../server/services/admin/event/createEvent';
import {
  AdminEventUpdateBody as _AdminEventUpdateBody,
  AdminEventUpdateQuestion as _AdminEventUpdateQuestion,
  AdminEventUpdateQuota as _AdminEventUpdateQuota,
} from '../../server/services/admin/event/updateEvent';
import {
  AdminEventGetAnswerItem as _AdminEventGetAnswerItem,
  AdminEventGetQuestionItem as _AdminEventGetQuestionItem,
  AdminEventGetQuotaItem as _AdminEventGetQuotaItem,
  AdminEventGetResponse as _AdminEventGetResponse,
  AdminEventGetSignupItem as _AdminEventGetSignupItem,
} from '../../server/services/event/getEventDetails';
import {
  AdminEventListItem as _AdminEventListItem,
  AdminEventListQuotaItem as _AdminEventListQuotaItem,
  AdminEventListResponse as _AdminEventListResponse,
} from '../../server/services/event/getEventsList';
import { StringifyApi } from './utils';

export type AdminEventListResponse = StringifyApi<_AdminEventListResponse>;
export type AdminEventListItem = StringifyApi<_AdminEventListItem>;
export type AdminEventListQuotaItem = StringifyApi<_AdminEventListQuotaItem>;

export type AdminEventGetResponse = StringifyApi<_AdminEventGetResponse>;
export type AdminEventGetQuotaItem = StringifyApi<_AdminEventGetQuotaItem>;
export type AdminEventGetSignupItem = StringifyApi<_AdminEventGetSignupItem>;
export type AdminEventGetQuestionItem = StringifyApi<_AdminEventGetQuestionItem>;
export type AdminEventGetAnswerItem = StringifyApi<_AdminEventGetAnswerItem>;

export type AdminEventCreateBody = StringifyApi<_AdminEventCreateBody>;
export type AdminEventCreateQuestion = StringifyApi<_AdminEventCreateQuestion>;
export type AdminEventCreateQuota = StringifyApi<_AdminEventCreateQuota>;

export type AdminEventUpdateBody = StringifyApi<_AdminEventUpdateBody>;
export type AdminEventUpdateQuestion = StringifyApi<_AdminEventUpdateQuestion>;
export type AdminEventUpdateQuota = StringifyApi<_AdminEventUpdateQuota>;
