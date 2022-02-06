import AnswerAttributes from '../../models/answer';
import EventAttributes from '../../models/event';
import QuestionAttributes from '../../models/question';
import QuotaAttributes from '../../models/quota';
import SignupAttributes from '../../models/signup';

// Attributes included in GET /api/events/ID for Event instances.
export const eventGetEventAttrs = [
  'title',
  'slug',
  'date',
  'registrationStartDate',
  'registrationEndDate',
  'openQuotaSize',
  'description',
  'price',
  'location',
  'webpageUrl',
  'facebookUrl',
  'category',
  'signupsPublic',
  'nameQuestion',
  'emailQuestion',
] as const;

// Attributes included in GET /api/admin/events/ID for Event instances.
export const adminEventGetEventAttrs = [
  ...eventGetEventAttrs,
  'id',
  'draft',
  'listed',
  'verificationEmail',
  'updatedAt',
] as const;

// Attributes included in results for Question instances.
export const eventGetQuestionAttrs = [
  'id',
  'question',
  'type',
  'options',
  'required',
  'public',
] as const;

// Attributes included in results for Quota instances.
export const eventGetQuotaAttrs = [
  'id',
  'title',
  'size',
] as const;

// Attributes included in GET /api/events/ID for Signup instances.
export const eventGetSignupAttrs = [
  'firstName',
  'lastName',
  'namePublic',
  'status',
  'position',
  'createdAt',
] as const;

// Attributes included in GET /api/admin/events/ID for Signup instances.
export const adminEventGetSignupAttrs = [
  ...eventGetSignupAttrs,
  'id',
  'email',
  'confirmedAt',
] as const;

// Attributes included in results for Answer instances.
export const eventGetAnswerAttrs = [
  'questionId',
  'answer',
] as const;

// Type definitions for the endpoint: pick the columns above and add relations.

export interface EventGetQuestionItem
  extends Omit<Pick<QuestionAttributes, typeof eventGetQuestionAttrs[number]>, 'options'> {
  options: string[] | null;
}

export interface EventGetAnswerItem extends Pick<AnswerAttributes, typeof eventGetAnswerAttrs[number]> {}

export interface EventGetSignupItem extends Pick<SignupAttributes, typeof eventGetSignupAttrs[number]> {
  answers: EventGetAnswerItem[];
  confirmed: boolean;
}

export interface EventGetQuotaItem extends Pick<QuotaAttributes, typeof eventGetQuotaAttrs[number]> {
  signups: EventGetSignupItem[] | null;
  signupCount: number;
}

export interface EventGetResponse extends Pick<EventAttributes, typeof eventGetEventAttrs[number]> {
  questions: EventGetQuestionItem[];
  quotas: EventGetQuotaItem[];
  millisTillOpening: number | null;
  registrationClosed: boolean;
}

// Type definitions for the admin variant of the endpoint.

export type AdminEventGetQuestionItem = EventGetQuestionItem;

export type AdminEventGetAnswerItem = EventGetAnswerItem;

export interface AdminEventGetSignupItem extends Pick<SignupAttributes, typeof adminEventGetSignupAttrs[number]> {
  answers: AdminEventGetAnswerItem[];
}

export interface AdminEventGetQuotaItem extends Pick<QuotaAttributes, typeof eventGetQuotaAttrs[number]> {
  signups: AdminEventGetSignupItem[];
  signupCount: number;
}

export interface AdminEventGetResponse extends Pick<EventAttributes, typeof adminEventGetEventAttrs[number]> {
  questions: AdminEventGetQuestionItem[];
  quotas: AdminEventGetQuotaItem[];
}
