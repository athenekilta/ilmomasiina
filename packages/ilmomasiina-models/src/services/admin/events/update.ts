import EventAttributes from '../../../models/event';
import QuestionAttributes from '../../../models/question';
import QuotaAttributes from '../../../models/quota';
import {
  adminEventCreateEventAttrs,
  adminEventCreateQuestionAttrs,
  adminEventCreateQuotaAttrs,
} from './create';

// Data type definitions for the request body, using attribute lists from createEvent.
export interface AdminEventUpdateQuestion
  extends Pick<QuestionAttributes, typeof adminEventCreateQuestionAttrs[number]> {
  id?: QuestionAttributes['id'];
}

export interface AdminEventUpdateQuota extends Pick<QuotaAttributes, typeof adminEventCreateQuotaAttrs[number]> {
  id?: QuotaAttributes['id'];
}

export interface AdminEventUpdateBody extends Pick<EventAttributes, typeof adminEventCreateEventAttrs[number]> {
  questions: AdminEventUpdateQuestion[];
  quotas: AdminEventUpdateQuota[];
}
