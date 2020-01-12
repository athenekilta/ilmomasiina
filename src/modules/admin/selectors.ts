import { createSelector } from 'reselect';

import { AppState } from '../../store/types';
import { Event, Quota } from '../types';

const _getEvents = (state: AppState) => state.admin.events;
export const eventsLoading = (state: AppState) => state.admin.eventsLoading;
export const eventsError = (state: AppState) => state.admin.eventsError;

export const getEvents = createSelector(
  [_getEvents, eventsLoading, eventsError],
  (events, loading, error) => {
    if (!events || loading || error) {
      return [];
    }

    return events;
  }
);

// export const isAuthenticated = (state) => state.admin.accessToken !== null;
// export const getToken = (state) => state.admin.accessToken;

export const getOpenQuotas = (event: Event) => {
  if (!event.quota || !event.signupsPublic) {
    return [];
  }

  const extraSignups = [];

  _.each(event.quota, (quota: Quota) => {
    _.each(quota.signups.slice(quota.size), signup => {
      extraSignups.push({ ...signup, quotaTitle: quota.title });
    });
  });

  const byTimestamp = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
  const openQuota = extraSignups
    .slice(0, event.openQuotaSize)
    .sort(byTimestamp);
  return openQuota;
};
