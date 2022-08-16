import { Type } from '@sinclair/typebox';

/** Unique identifier for user */
export const userID = Type.Integer({
  title: 'user id',
});

/** Non-editable identity attributes of user */
export const userIdentity = Type.Object({
  id: userID,
});

/** Editable attributes of user */
export const userAttributes = Type.Object({
  email: Type.String({
    title: 'email',
    description: 'Used as a username in login',
    // TODO: Add validation RegExp for email
  }),
});
