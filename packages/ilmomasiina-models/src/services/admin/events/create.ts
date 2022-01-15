import EventAttributes from '../../../models/event';
import QuestionAttributes from '../../../models/question';
import QuotaAttributes from '../../../models/quota';

// Attributes included in POST /api/events for Event instances.
export const adminEventCreateEventAttrs = [
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
  'draft',
  'listed',
  'signupsPublic',
  'verificationEmail',
] as const;

// Attributes included in POST /api/events for Question instances.
export const adminEventCreateQuestionAttrs = [
  'question',
  'type',
  'options',
  'required',
  'public',
] as const;

// Attributes included in POST /api/events for Quota instances.
export const adminEventCreateQuotaAttrs = [
  'title',
  'size',
] as const;

// Data type definitions for the request body.
export interface AdminEventCreateQuestion
  extends Pick<QuestionAttributes, typeof adminEventCreateQuestionAttrs[number]> {}

export interface AdminEventCreateQuota extends Pick<QuotaAttributes, typeof adminEventCreateQuotaAttrs[number]> {}

export interface AdminEventCreateBody extends Pick<EventAttributes, typeof adminEventCreateEventAttrs[number]> {
  questions: AdminEventCreateQuestion[];
  quotas: AdminEventCreateQuota[];
}
