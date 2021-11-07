import { StringifyApi } from '../../utils';
import {
  EventGetAnswerItem,
  EventGetQuestionItem,
  EventGetQuotaItem,
  EventGetResponse,
  EventGetSignupItem,
} from './details';
import { EventListItem, EventListQuotaItem, EventListResponse } from './list';

export type EventsServiceTypes = EventListResponse | EventGetResponse;

export namespace Event {
  export type Slug = Details['slug'];

  export type Details = StringifyApi<EventGetResponse>;
  export namespace Details {
    export type Quota = StringifyApi<EventGetQuotaItem>;
    export type Signup = StringifyApi<EventGetSignupItem>;
    export type Question = StringifyApi<EventGetQuestionItem>;
    export type Answer = StringifyApi<EventGetAnswerItem>;
  }

  export type List = StringifyApi<EventListResponse>;
  export namespace List {
    export type Event = StringifyApi<EventListItem>;
    export type Quota = StringifyApi<EventListQuotaItem>;
  }
}

export namespace Question {
  export type Id = Event.Details.Question['id'];
}

export namespace Quota {
  export type Id = Event.Details.Quota['id'];
}
