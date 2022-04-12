import { createSelector } from 'reselect'

const _getEvents = state => state.admin.events;
export const eventsLoading = state => state.admin.eventsLoading;
export const eventsError = state => state.admin.eventsError;

export const getEvents = createSelector(
    [
        _getEvents,
        eventsLoading,
        eventsError
    ],
    (events, loading, error) => {
        if (!events || loading || error) {
            return [];
        }

        return events;
    }
)

const _getUsers = state => state.admin.users;
export const usersLoading = state => state.admin.usersLoading;
export const usersError = state => state.admin.usersError;

export const getUsers = createSelector(
    [
        _getUsers
    ],
    (users) => {
        return users;
    }
)


// export const isAuthenticated = (state) => state.admin.accessToken !== null;
// export const getToken = (state) => state.admin.accessToken;

export const getOpenQuotas = (event) => {
    if (!event.quota || !event.signupsPublic) {
        return []
    }

    const extraSignups = [];

    _.each(event.quota, (quota) => {
        _.each(quota.signups.slice(quota.size), (signup) => {
            extraSignups.push({ ...signup, quotaTitle: quota.title });
        });
    });

    const byTimestamp = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    const openQuota = extraSignups.slice(0, event.openQuotaSize).sort(byTimestamp);
    return openQuota
}