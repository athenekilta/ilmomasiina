import {
  SignupCreateBody as _SignupCreateBody,
  SignupCreateResponse as _SignupCreateResponse,
} from '../../server/services/signup/createNewSignup';
import {
  SignupGetAnswerItem as _SignupGetAnswerItem,
  SignupGetEventItem as _SignupGetEventItem,
  SignupGetQuestionItem as _SignupGetQuestionItem,
  SignupGetResponse as _SignupGetResponse,
  SignupGetSignupItem as _SignupGetSignupItem,
} from '../../server/services/signup/getSignupForEdit';
import {
  SignupUpdateBody as _SignupUpdateBody,
  SignupUpdateBodyAnswer as _SignupUpdateBodyAnswer,
  SignupUpdateResponse as _SignupUpdateResponse,
} from '../../server/services/signup/updateSignup';
import { StringifyApi } from './utils';

export namespace Signup {
  export type Id = Details.Signup['id'];

  export type Details = StringifyApi<_SignupGetResponse>;
  export namespace Details {
    export type Event = StringifyApi<_SignupGetEventItem>;
    export type Question = StringifyApi<_SignupGetQuestionItem>;
    export type Signup = StringifyApi<_SignupGetSignupItem>;
    export type Answer = StringifyApi<_SignupGetAnswerItem>;
  }

  export namespace Create {
    export type Body = StringifyApi<_SignupCreateBody>;
    export type Response = StringifyApi<_SignupCreateResponse>;
  }

  export namespace Update {
    export type Body = StringifyApi<_SignupUpdateBody>;
    export namespace Body {
      export type Answer = StringifyApi<_SignupUpdateBodyAnswer>;
    }
    export type Response = StringifyApi<_SignupUpdateResponse>;
  }
}
