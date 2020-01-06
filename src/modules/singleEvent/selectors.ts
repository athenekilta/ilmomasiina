import _ from "lodash";
import { createSelector } from "reselect";
import { AppState } from "../../store/types";
import { getSignupsByQuota } from "../../utils/signupUtils";

const getEvent = (state: AppState) => state.singleEvent.event;
const eventLoading = (state: AppState) => state.singleEvent.eventLoading;
const eventError = (state: AppState) => state.singleEvent.eventError;

export const getQuotaData = createSelector(
  [getEvent, eventLoading, eventError],
  (event, loading, error) => {
    if (!event || loading || error) {
      return null;
    }
    return getSignupsByQuota(event);
  }
);

export const getFormattedQuestions = createSelector(
  [getEvent, eventLoading, eventError],
  (event, loading, error) => {
    if (!event || loading || error) {
      return [];
    }
    return _.concat(event.questions, {
      id: "quota",
      options: null,
      public: true,
      question: "Kiintiö",
      type: "text"
    });
  }
);
