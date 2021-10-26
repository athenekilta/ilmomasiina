import { StringifyApi } from '../../utils';
import { UserCreateBody, UserListItem, UserListResponse } from './details';

// Frontend-side API
export namespace User {
  export type Id = List.User['id'];

  export type List = StringifyApi<UserListResponse>;
  export namespace List {
    export type User = StringifyApi<UserListItem>;
  }

  export namespace Create {
    export type Body = StringifyApi<UserCreateBody>;
  }
}
