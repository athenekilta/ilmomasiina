import { Static, Type } from '@sinclair/typebox';

import { userAttributes, userID, userIdentity } from './attributes';

export const passwordSchema = Type.String({
  minLength: 10,
  description: 'password',
  maxLength: 255,
});

/** Request body for creating an admin user. */
export const userCreateSchema = Type.Intersect([
  userAttributes,
  Type.Object({
    password: passwordSchema,
  }),
]);
/** Request body for inviting an admin user. */
export const userInviteSchema = Type.Intersect([
  userAttributes,
]);

/** Schema for a user. */
export const userSchema = Type.Intersect([
  userIdentity,
  userAttributes,
]);
/** Response schema for fetching a list of users. */
export const userListResponse = Type.Array(userSchema);

/** Path parameters necessary to fetch and manipulate users. */
export const userPathParams = Type.Object({
  id: userID,
});
export const userChangePasswordSchema = Type.Object({
  oldPassword: Type.String(), newPassword: passwordSchema,
});
/** User ID type. */
export type UserID = Static<typeof userID>;

/** Request body for creating an admin user. */
export type UserCreateSchema = Static<typeof userCreateSchema>;
/** Request body for inviting an admin user. */
export type UserInviteSchema = Static<typeof userInviteSchema>;
export type UserChangePasswordSchema = Static<typeof userChangePasswordSchema>;
/** Path parameters necessary to fetch and manipulate users. */
export type UserPathParams = Static<typeof userPathParams>;
/** Schema for a user. */
export type UserSchema = Static<typeof userSchema>;
/** Response schema for fetching a list of users. */
export type UserListResponse = Static<typeof userListResponse>;
