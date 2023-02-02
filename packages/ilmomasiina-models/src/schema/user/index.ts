import { Static, Type } from '@sinclair/typebox';

import { userAttributes, userID, userIdentity } from './attributes';

/** Request body for creating an admin user. */
export const userCreateSchema = Type.Intersect([
  userAttributes,
  Type.Object({
    password: Type.String({
      description: 'New password as a plain text.',
      // TODO: Add password validation
    }),
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

/** User ID type. */
export type UserID = Static<typeof userID>;

/** Request body for creating an admin user. */
export type UserCreateSchema = Static<typeof userCreateSchema>;
/** Request body for inviting an admin user. */
export type UserInviteSchema = Static<typeof userInviteSchema>;

/** Path parameters necessary to fetch and manipulate users. */
export type UserPathParams = Static<typeof userPathParams>;
/** Schema for a user. */
export type UserSchema = Static<typeof userSchema>;
/** Response schema for fetching a list of users. */
export type UserListResponse = Static<typeof userListResponse>;
