import { Static, Type } from '@sinclair/typebox';

const userID = Type.Integer({
  title: 'user id',
});

const userIdentity = Type.Object({
  id: userID,
});

export const userAttributes = Type.Object({
  email: Type.String({
    title: 'email',
    description: 'Used as a username in login',
    // TODO: Add validation RegExp for email
  }),
});

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
  userAttributes,
  userEditPassword,
]);

export const userInviteSchema = Type.Intersect([
  userAttributes,
]);

export const userSchema = Type.Intersect([
  userIdentity,
  userAttributes,
]);

export const userListSchema = Type.Array(
  userSchema,
  {
    title: 'registered Ilmomasiina admins',
  },
);

export const userPathParams = Type.Object({
  id: userID,
});

export type UserCreateSchema = Static<typeof userCreateSchema>;
export type UserInviteSchema = Static<typeof userInviteSchema>;
export type UserSchema = Static<typeof userSchema>;
export type UserLoginSchema = Static<typeof userLoginSchema>;
export type UserListSchema = Static<typeof userListSchema>;
export type UserPathParams = Static<typeof userPathParams>;
