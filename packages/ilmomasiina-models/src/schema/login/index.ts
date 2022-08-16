import { Static, Type } from '@sinclair/typebox';

export const adminLoginSchema = Type.Object({
  email: Type.String({
    title: 'email address',
  }),
  password: Type.String({
    title: 'plaintext password',
  }),
});

export type AdminLoginSchema = Static<typeof adminLoginSchema>;
