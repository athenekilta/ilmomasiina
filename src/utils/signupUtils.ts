import _ from 'lodash';
import moment from 'moment-timezone';

import { AdminEvent } from '../api/adminEvents';
import { Event } from '../api/events';
import { Signup } from '../api/signups';

export const WAITLIST = '__waitlist' as const;
export const OPENQUOTA = '__open' as const;

type AnyEventDetails = AdminEvent.Details | Event.Details;
type AnyQuotaDetails = AdminEvent.Details.Quota | Event.Details.Quota;
type AnySignupDetails = AdminEvent.Details.Signup | Event.Details.Signup;
type AnyQuestionDetails = AdminEvent.Details.Question | Event.Details.Question;

type EffectiveQuota = AnyQuotaDetails['id'] | typeof WAITLIST | typeof OPENQUOTA;

export type SignupWithQuotaName = AnySignupDetails & {
  quotaName: string;
};

export type QuotaSignups = {
  id: EffectiveQuota;
  title?: string,
  size: number;
  signups: SignupWithQuotaName[];
};

export function getSignupsByQuota(event: AnyEventDetails) {
  let overflow: SignupWithQuotaName[] = [];
  const quotas: QuotaSignups[] = [];

  event.quota.forEach((quota) => {
    if (!quota.signups) return;

    const sorted = _.sortBy(quota.signups, 'createdAt').map((signup) => ({
      ...signup,
      quotaName: quota.title,
    }));
    const overflowAfter = quota.size || quota.signups.length;

    quotas.push({
      id: quota.id,
      title: quota.title,
      size: quota.size,
      signups: sorted.slice(0, overflowAfter),
    });
    overflow = [...overflow, ...sorted.slice(overflowAfter)];
  });

  overflow = _.sortBy(overflow, 'createdAt');

  if (event.openQuotaSize > 0) {
    quotas.push({
      id: OPENQUOTA,
      size: event.openQuotaSize,
      signups: overflow.slice(0, event.openQuotaSize),
    });
    overflow = overflow.slice(event.openQuotaSize);
  }

  quotas.push({
    id: WAITLIST,
    size: Infinity,
    signups: overflow,
  });

  return quotas;
}

type SignupWithQuotaInfo = SignupWithQuotaName & {
  isWaitlist: boolean;
  isOpenQuota: boolean;
};

function getSignupsAsList(event: AnyEventDetails, includeWaitlist = true): SignupWithQuotaInfo[] {
  const byQuota = getSignupsByQuota(event);

  return _.flatMap(byQuota, ({ id: quotaId, signups }) => {
    if (!includeWaitlist && quotaId === WAITLIST) return [];
    return signups.map((signup) => ({
      ...signup,
      isWaitlist: quotaId === WAITLIST,
      isOpenQuota: quotaId === OPENQUOTA,
    }));
  });
}

function getAnswersFromSignup(event: AdminEvent.Details, signup: SignupWithQuotaInfo) {
  const answers: Record<AnyQuestionDetails['id'], string> = {};

  event.questions.forEach((question) => {
    const answer = _.find(signup.answers, { questionId: question.id });
    answers[question.id] = answer?.answer || '';
  });

  return answers;
}

type FormattedSignup = {
  id?: Signup.Id;
  firstName: string | null;
  lastName: string | null;
  email?: string | null;
  answers: Record<AnyQuestionDetails['id'], string>;
  quota: string;
  createdAt: string;
};

export function getSignupsForAdminList(event: AdminEvent.Details, includeWaitlist = true): FormattedSignup[] {
  const signupsArray = getSignupsAsList(event, includeWaitlist);

  const sorted = _.orderBy(signupsArray, ['isWaitlist', 'isOpenQuota', 'createdAt']);

  return sorted.map((signup) => ({
    ...signup,
    createdAt: moment(signup.createdAt)
      .tz('Europe/Helsinki')
      .format('DD.MM.YYYY HH:mm:ss'),
    quota: `${signup.quotaName}${signup.isOpenQuota ? ' (Avoin)' : ''}${signup.isWaitlist ? ' (Jonossa)' : ''}`,
    answers: getAnswersFromSignup(event, signup),
  }));
}
