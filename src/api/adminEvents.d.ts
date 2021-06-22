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

export namespace AdminEvent {
  export type List = StringifyApi<_AdminEventListResponse>;
  export namespace List {
    export type Event = StringifyApi<_AdminEventListItem>;
    export type Quota = StringifyApi<_AdminEventListQuotaItem>;
  }

  export type Details = StringifyApi<_AdminEventGetResponse>;
  export namespace Details {
    export type Quota = StringifyApi<_AdminEventGetQuotaItem>;
    export type Signup = StringifyApi<_AdminEventGetSignupItem>;
    export type Question = StringifyApi<_AdminEventGetQuestionItem>;
    export type Answer = StringifyApi<_AdminEventGetAnswerItem>;
  }

  export namespace Create {
    export type Body = StringifyApi<_AdminEventCreateBody>;
    export type Question = StringifyApi<_AdminEventCreateQuestion>;
    export type Quota = StringifyApi<_AdminEventCreateQuota>;
  }

  export namespace Update {
    export type Body = StringifyApi<_AdminEventUpdateBody>;
    export type Question = StringifyApi<_AdminEventUpdateQuestion>;
    export type Quota = StringifyApi<_AdminEventUpdateQuota>;
  }
}
