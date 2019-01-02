import { createSelector } from 'reselect'
import { getSignupsByQuota } from '../../utils/signupUtils';

const getEvent = state => state.singleEvent.event;
const eventLoading = state => state.singleEvent.eventLoading;
const eventError = state => state.singleEvent.eventError;

export const getQuotaData = createSelector(
    [
        getEvent,
        eventLoading,
        eventError
    ],
    (event, loading, error) => {
        if (!event || loading || error) {
            return null;
        }
        return getSignupsByQuota(event);
    }
);

export const getFormattedQuestions = createSelector(
    [
        getEvent,
        eventLoading,
        eventError,
    ],
    (event, loading, error) => {
        if (!event || loading || error) {
            return [];
        }
        return _.concat(event.questions, {
            id: 0,
            options: null,
            public: true,
            question: 'Kiintiö',
            type: 'text'
        });
    }
)