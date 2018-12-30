import { createSelector } from 'reselect'

const getEvent = state => state

export const getOpenQuotas = createSelector(
    [getEvent],
    (event) => {
        if (!event.quota || !event.signupsPublic) {
            return {
                openQuota: [],
                waitList: [],
                formattedQuestions: null,
            };
        }

        const extraSignups = [];

        _.each(event.quota, (quota) => {
            _.each(quota.signups.slice(quota.size), (signup) => {
                signup.answers.push({
                    questionId: 0,
                    answer: quota.title,
                });
                extraSignups.push(signup);
            });
        });

        const byTimestamp = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

        const openQuota = extraSignups.slice(0, event.openQuotaSize).sort(byTimestamp);
        const waitList = extraSignups.slice(event.openQuotaSize).sort(byTimestamp);

        const formattedQuestions = event.questions.slice();

        formattedQuestions.push({
            id: 0,
            options: null,
            public: true,
            question: 'Kiintiö',
            type: 'text',
        });

        return {
            openQuota,
            waitList,
            formattedQuestions,
        };
    });