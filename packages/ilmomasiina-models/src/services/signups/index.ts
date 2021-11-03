import { StringifyApi } from '../../utils';
import { SignupCreateBody, SignupCreateResponse } from './create';
import {
  SignupGetAnswerItem,
  SignupGetEventItem,
  SignupGetQuestionItem,
  SignupGetQuotaItem,
  SignupGetResponse,
  SignupGetSignupItem,
} from './getForEdit';
import {
  SignupUpdateBody,
  SignupUpdateBodyAnswer,
  SignupUpdateResponse,
} from './update';

export type SignupsServiceResponses = SignupGetResponse | SignupCreateResponse | SignupUpdateResponse | null;

export namespace Signup {
  export type Id = Details.Signup['id'];

  export type Details = StringifyApi<SignupGetResponse>;
  export namespace Details {
    export type Event = StringifyApi<SignupGetEventItem>;
    export type Question = StringifyApi<SignupGetQuestionItem>;
    export type Signup = StringifyApi<SignupGetSignupItem>;
    export type Quota = StringifyApi<SignupGetQuotaItem>;
    export type Answer = StringifyApi<SignupGetAnswerItem>;
  }

  export namespace Create {
    export type Body = StringifyApi<SignupCreateBody>;
    export type Response = StringifyApi<SignupCreateResponse>;
  }

  export namespace Update {
    export type Body = StringifyApi<SignupUpdateBody>;
    export namespace Body {
      export type Answer = StringifyApi<SignupUpdateBodyAnswer>;
    }
    export type Response = StringifyApi<SignupUpdateResponse>;
  }
}
