import { Type } from '@sinclair/typebox';

export const userID = Type.Integer({
  title: 'user id',
});

export const userIdentity = Type.Object({
  id: userID,
});

export const userAttributes = Type.Object({
  email: Type.String({
    title: 'email',
    description: 'Used as a username in login',
    // TODO: Add validation RegExp for email
  }),
});
