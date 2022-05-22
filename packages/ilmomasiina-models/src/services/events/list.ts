import EventAttributes from '../../models/event';
import QuotaAttributes from '../../models/quota';

// Attributes included in GET /api/events for Event instances.
export const eventListEventAttrs = [
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
  'id',
  'draft',
  'listed',
] as const;

export const eventListQuotaAttrs = [
  'id',
  'title',
  'size',
] as const;

// Type definitions for the endpoint: pick the columns above and add relations.

export interface EventListQuotaItem extends Pick<QuotaAttributes, typeof eventListQuotaAttrs[number]> {
  signupCount: number;
}

export interface EventListItem extends Pick<EventAttributes, typeof eventListEventAttrs[number]> {
  quotas: EventListQuotaItem[];
}

export type EventListResponse = EventListItem[];

// Type definitions for the admin variant of the endpoint.

export type AdminEventListQuotaItem = EventListQuotaItem;

export interface AdminEventListItem extends Pick<EventAttributes, typeof adminEventListEventAttrs[number]> {
  quotas: AdminEventListQuotaItem[];
}

export type AdminEventListResponse = AdminEventListItem[];
