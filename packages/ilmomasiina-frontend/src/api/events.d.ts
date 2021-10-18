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

export namespace Event {
  export type Slug = Details['slug'];

  export type Details = StringifyApi<_EventGetResponse>;
  export namespace Details {
    export type Quota = StringifyApi<_EventGetQuotaItem>;
    export type Signup = StringifyApi<_EventGetSignupItem>;
    export type Question = StringifyApi<_EventGetQuestionItem>;
    export type Answer = StringifyApi<_EventGetAnswerItem>;
  }

  export type List = StringifyApi<_EventListResponse>;
  export namespace List {
    export type Event = StringifyApi<_EventListItem>;
    export type Quota = StringifyApi<_EventListQuotaItem>;
  }
}

export namespace Question {
  export type Id = Event.Details.Question['id'];
}

export namespace Quota {
  export type Id = Event.Details.Quota['id'];
}
