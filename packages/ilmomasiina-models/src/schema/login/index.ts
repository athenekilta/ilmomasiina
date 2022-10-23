import { Static, Type } from '@sinclair/typebox';

/** Describes login request body */
export const adminLoginSchema = Type.Object({
  email: Type.String({
    title: 'email address',
  }),
  password: Type.String({
    title: 'plaintext password',
  }),
});

/** Describes login response body */
export const adminSessionSchema = Type.Object({
  accessToken: Type.String({
    title: 'JWT access token',
    description: 'Place it into `Authorization` header to authorize your requests.',
  }),
});

export type AdminLoginSchema = Static<typeof adminLoginSchema>;
export type AdminSessionSchema = Static<typeof adminSessionSchema>;
