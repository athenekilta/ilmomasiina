import { createSelector } from 'reselect'

const getEvents = state => state

export const getSignups = createSelector(
    [getEvents],
    (events) => {
        let signups = []

        events.forEach(event => {
            if (Object.keys(event).length > 0) {
                let event_signups = []
                event.quota.forEach(quota => {
                    quota.signups.slice(0, quota.size).forEach(y =>
                        event_signups.push({
                            "Etunimi": y.firstName,
                            "Sukunimi": y.lastName,
                            "Ilmoittautumisaika": new Date(y.createdAt).toLocaleString(),
                            "Kiintiö": quota.title
                        }));
                });
                getOpenQuotas(event).forEach(y =>
                    event_signups.push({
                        "Etunimi": y.firstName,
                        "Sukunimi": y.lastName,
                        "Ilmoittautumisaika": new Date(y.createdAt).toLocaleString(),
                        "Kiintiö": y.quotaTitle
                    }));
                signups.push(event_signups);
            }
        });
        return signups
    });

const getOpenQuotas = (event) => {
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