/** User */
// Attributes included in GET /api/events/ID for Event instances.
export const eventGetEventAttrs = [
  'id',
  'title',
  'slug',
  'date',
  'endDate',
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

/** Admin */

// Attributes included in POST /api/events for Event instances.
export const adminEventCreateEventAttrs = [
  'title',
  'slug',
  'date',
  'endDate',
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
  'nameQuestion',
  'emailQuestion',
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

/** Lists */

// Attributes included in GET /api/events for Event instances.
export const eventListEventAttrs = [
  'id',
  'slug',
  'title',
  'date',
  'endDate',
  'registrationStartDate',
  'registrationEndDate',
  'openQuotaSize',
  'signupsPublic',
] as const;

// Attributes included in GET /api/admin/events for Event instances.
export const adminEventListEventAttrs = [
  ...eventListEventAttrs,
  'draft',
  'listed',
] as const;

export const eventListQuotaAttrs = [
  'id',
  'title',
  'size',
] as const;
