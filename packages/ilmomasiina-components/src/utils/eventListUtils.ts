import every from 'lodash/every';
import sumBy from 'lodash/sumBy';
import moment, { Moment } from 'moment-timezone';

import type { EventSlug, UserEventListItem, UserEventListResponse } from '@tietokilta/ilmomasiina-models';
import { signupState, SignupStateInfo } from './signupStateText';
import { OPENQUOTA, WAITLIST } from './signupUtils';

export { OPENQUOTA, WAITLIST };

export interface EventTableOptions {
  /** If true, quotas are not placed on separate rows. */
  compact?: boolean;
}

export type TableRow = {
  isEvent: true;
  slug: EventSlug,
  title: string,
  date: Moment | null,
  signupState: SignupStateInfo;
  signupCount?: number;
  quotaSize?: number | null;
  totalSignupCount: number;
  totalQuotaSize: number | null;
} | {
  isEvent: false;
  title: string | typeof OPENQUOTA | typeof WAITLIST;
  signupCount: number;
  quotaSize: number | null;
};

/** Converts an event to rows to be shown in the event list. */
export function eventToRows(event: UserEventListItem, { compact }: EventTableOptions = {}) {
  const {
    slug, title, date, registrationStartDate, registrationEndDate, quotas, openQuotaSize,
  } = event;
  const state = signupState(registrationStartDate, registrationEndDate);

  // Event row
  const rows: TableRow[] = [{
    isEvent: true,
    signupState: state,
    slug,
    title,
    date: date ? moment(date) : null,
    signupCount: quotas.length < 2 ? sumBy(quotas, 'signupCount') : undefined,
    quotaSize: quotas.length === 1 ? quotas[0].size : undefined,
    totalSignupCount: sumBy(quotas, 'signupCount') ?? 0,
    totalQuotaSize: every(quotas, 'size') ? sumBy(quotas, 'size') : null,
  }];

  // We're done for compact format
  if (compact) return rows;

  // Multiple quotas go on their own rows
  if (quotas.length > 1) {
    quotas.forEach((quota) => rows.push({
      isEvent: false,
      title: quota.title,
      signupCount: quota.size ? Math.min(quota.signupCount, quota.size) : quota.signupCount,
      quotaSize: quota.size,
    }));
  }

  const overflow = sumBy(quotas, (quota) => (quota.size ? Math.max(0, quota.signupCount - quota.size) : 0));

  // Open quota
  if (openQuotaSize > 0) {
    rows.push({
      isEvent: false,
      title: OPENQUOTA,
      signupCount: Math.min(overflow, openQuotaSize),
      quotaSize: openQuotaSize,
    });
  }

  // Queue/waitlist
  if (overflow > openQuotaSize) {
    rows.push({
      isEvent: false,
      title: WAITLIST,
      signupCount: overflow - openQuotaSize,
      quotaSize: null,
    });
  }

  return rows;
}

/** Converts a list of events to a flat list of rows to be shown in the event list. */
export function eventsToRows(events: UserEventListResponse, options?: EventTableOptions) {
  return events.flatMap((event) => eventToRows(event, options));
}
