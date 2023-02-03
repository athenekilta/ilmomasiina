import { Type } from '@sinclair/typebox';

export const userID = Type.Integer({
  title: 'UserID',
});

/** Non-editable identity attributes of a user. */
export const userIdentity = Type.Object({
  id: userID,
});

/** Editable attributes of a user. */
export const userAttributes = Type.Object({
  email: Type.String({
    format: 'email',
    description: 'Email address, used as username.',
    // TODO: Add validation RegExp for email
  }),
});

/** Password of a user. */
export const password = Type.String({
  minLength: 10,
  maxLength: 255,
});
