import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

/** Defines field `password` for changing or setting a password for user */
export const userEditPassword = Type.Object({
  password: Type.String({
    title: 'new password as a plain text',
    // TODO: Add password validation RegExp
  }),
});

/** Describes request body for login endpoint */
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

/** Describes request body for creating a new user */
export const userCreateSchema = Type.Intersect([
  attributes.userAttributes,
  userEditPassword,
]);

/** Describes request body for inviting a user */
export const userInviteSchema = Type.Intersect([
  attributes.userAttributes,
]);

/** Describes a schema for a single user */
export const userSchema = Type.Intersect([
  attributes.userIdentity,
  attributes.userAttributes,
]);

/** Describes response body for GET users endpoint */
export const userListSchema = Type.Array(
  userSchema,
  {
    title: 'registered Ilmomasiina admins',
  },
);

/** Describes path params for user endpoints */
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
