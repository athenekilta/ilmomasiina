import _ from 'lodash';

export const WAITLIST = '__waitlist';
export const OPENQUOTA = '__open';

export const getSignupsByQuota = (event) => {

	let extraSignups = [];
	const quotas = {};

	if (event.quota) {
		_.each(event.quota, quota => {
			const sorted = _.sortBy(quota.signups, (s) => new Date(s.createdAt));
			const quotaSignups = [];
			_.each(sorted, (s, index) => {
				if (index < quota.size) {
					quotaSignups.push({
						...s,
						quota: quota.title,
					});
				} else {
					extraSignups.push({
						...s,
						quota: quota.title,
					});
				}
			});

			quotas[quota.title] = {
				size: quota.size,
				signups: quotaSignups
			};
		});
	}

	extraSignups = _.sortBy(extraSignups, (s) => new Date(s.createdAt));

	if (event.openQuotaSize > 0) {
		quotas[OPENQUOTA] = {
			size: event.openQuotaSize,
			signups: extraSignups.slice(0, event.openQuotaSize),
		};

		quotas[WAITLIST] = {
			size: Infinity,
			signups: extraSignups.slice(event.openQuotaSize),
		};
	} else {
		quotas[WAITLIST] = {
			size: Infinity,
			signups: extraSignups,
		}
	}

	return quotas;
};

export const getSignupsArray = (event, includeWaitlist = true) => {
	const byQuota = getSignupsByQuota(event);

	const signups = [];

	_.forOwn(byQuota, (data, quotaName) => {

		if (quotaName !== WAITLIST || includeWaitlist) {
			_.each(data.signups, (s) => {
				signups.push({
					...s,
					isWaitlist: quotaName === WAITLIST,
					isOpenQuota: quotaName === OPENQUOTA,
				});
			});
		}
	});

	return signups;
}