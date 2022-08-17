// Include the same attributes from Event as /api/events.
import { eventGetEventAttrs, eventGetQuestionAttrs } from './event';

export const signupGetEventAttrs = eventGetEventAttrs;

export const signupGetQuestionAttrs = eventGetQuestionAttrs;

// Attributes included from Answer.
export const signupGetAnswerAttrs = [
  'questionId',
  'answer',
] as const;

// Attributes included from Quota.
export const signupGetQuotaAttrs = [
  'id',
  'title',
  'size',
] as const;

// Attributes included from Signup.
export const signupGetSignupAttrs = [
  'id',
  'firstName',
  'lastName',
  'namePublic',
  'email',
  'confirmedAt',
  'status',
  'position',
] as const;
