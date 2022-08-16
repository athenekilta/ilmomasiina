import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

export const userEditPassword = Type.Object({
  password: Type.String({
    title: 'new password as a plain text',
    // TODO: Add password validation RegExp
  }),
});

export const userLoginSchema = Type.Object({
  username: Type.String({
    title: 'username',
    // TODO: Add reasonable upper bound for size but no further validation
  }),
  password: Type.String({
    title: 'plain text password',
    // TODO: Add reasonable upper bound for size but no further validation
  }),
});

export const userPasswordHash = Type.Object({
  password: Type.String({
    title: 'password hash',
  }),
});

export const userCreateSchema = Type.Intersect([
  attributes.userAttributes,
  userEditPassword,
]);

export const userInviteSchema = Type.Intersect([
  attributes.userAttributes,
]);

export const userSchema = Type.Intersect([
  attributes.userIdentity,
  attributes.userAttributes,
]);

export const userListSchema = Type.Array(
  userSchema,
  {
    title: 'registered Ilmomasiina admins',
  },
);

export const userPathParams = Type.Object({
  id: attributes.userID,
});

export type UserID = Static<typeof attributes.userID>;
export type UserCreateSchema = Static<typeof userCreateSchema>;
export type UserInviteSchema = Static<typeof userInviteSchema>;
export type UserSchema = Static<typeof userSchema>;
export type UserLoginSchema = Static<typeof userLoginSchema>;
export type UserListSchema = Static<typeof userListSchema>;
export type UserPathParams = Static<typeof userPathParams>;
