import { StringifyApi } from '../../../utils';
import {
  AdminEventGetAnswerItem,
  AdminEventGetQuestionItem,
  AdminEventGetQuotaItem,
  AdminEventGetResponse,
  AdminEventGetSignupItem,
} from '../../events/details';
import {
  AdminEventListItem,
  AdminEventListQuotaItem,
  AdminEventListResponse,
} from '../../events/list';
import {
  AdminEventCreateBody,
  AdminEventCreateQuestion,
  AdminEventCreateQuota,
} from './create';
import {
  AdminEventUpdateBody,
  AdminEventUpdateQuestion,
  AdminEventUpdateQuota,
} from './update';

export type AdminEventsServiceTypes =
  AdminEventListResponse
  | AdminEventGetResponse
  | AdminEventCreateBody | AdminEventGetResponse
  | AdminEventUpdateBody | AdminEventGetResponse
  | null;

export namespace AdminEvent {
  export type Id = Details['id'];

  export type List = StringifyApi<AdminEventListResponse>;
  export namespace List {
    export type Event = StringifyApi<AdminEventListItem>;
    export type Quota = StringifyApi<AdminEventListQuotaItem>;
  }

  export type Details = StringifyApi<AdminEventGetResponse>;
  export namespace Details {
    export type Quota = StringifyApi<AdminEventGetQuotaItem>;
    export type Signup = StringifyApi<AdminEventGetSignupItem>;
    export type Question = StringifyApi<AdminEventGetQuestionItem>;
    export type Answer = StringifyApi<AdminEventGetAnswerItem>;
  }

  export namespace Create {
    export type Body = StringifyApi<AdminEventCreateBody>;
    export type Question = StringifyApi<AdminEventCreateQuestion>;
    export type Quota = StringifyApi<AdminEventCreateQuota>;
  }

  export namespace Update {
    export type Body = StringifyApi<AdminEventUpdateBody>;
    export type Question = StringifyApi<AdminEventUpdateQuestion>;
    export type Quota = StringifyApi<AdminEventUpdateQuota>;
  }
}
