import { Type } from '@sinclair/typebox';

export const signupID = Type.String({
  title: 'signup id',
  // TODO: Validation?
});

export const firstName = Type.String({
  title: 'First name of the attendee',
});

export const lastName = Type.String({
  title: 'Last name of the attendee',
});

export const email = Type.String({
  title: 'email of the attendee',
});

export const namePublic = Type.Boolean({
  title: 'is the name public',
  description: 'is allowed to show `firstName` and `lastName` publicly',
});

export const confirmedAt = Type.Union([
  Type.String({
    title: 'confimation time',
    format: 'date-time',
    description: 'time when the signup details were added (i.e. first update after signup creation)',
  }),
  Type.Null({
    title: 'not confirmed yet',
  }),
], {
  title: 'time when the signup was confirmed',
});

export const editToken = Type.String({
  title: 'edit token',
  description: 'use to make changes to this signup',
});
