import _ from 'lodash';
import moment from 'moment-timezone';

import { AdminEvent } from '../api/adminEvents';
import { Event, Quota } from '../api/events';
import { Signup } from '../api/signups';

export const WAITLIST = '\x00waitlist';
export const OPENQUOTA = '\x00open';

type AnyEventDetails = AdminEvent.Details | Event.Details;
type AnySignupDetails = AdminEvent.Details.Signup | Event.Details.Signup;
type AnyQuestionDetails = AdminEvent.Details.Question | Event.Details.Question;

export type SignupWithQuota = AnySignupDetails & {
  quotaId: Quota.Id;
  quotaName: string;
};

function getSignupsAsList(event: AnyEventDetails): SignupWithQuota[] {
  return event.quotas.flatMap(
    (quota) => quota.signups?.map(
      (signup) => ({
        ...signup,
        quotaId: quota.id,
        quotaName: quota.title,
      }),
    ) ?? [],
  );
}

export type QuotaSignups = {
  id: Quota.Id | typeof OPENQUOTA | typeof WAITLIST;
  title: string;
  size: number | null;
  signups: SignupWithQuota[];
};

export function getSignupsByQuota(event: AnyEventDetails): QuotaSignups[] {
  const signups = getSignupsAsList(event);
  const quotas = [
    ...event.quotas.map(
      (quota) => ({
        ...quota,
        signups: signups.filter((signup) => signup.quotaId === quota.id && signup.status === 'in-quota'),
      }),
    ),
  ];

  const openSignups = signups.filter((signup) => signup.status === 'in-open');
  // Open quota is shown if the event has one, or if signups have been assigned there nevertheless.
  const openQuota = openSignups.length > 0 || event.openQuotaSize > 0 ? [{
    id: OPENQUOTA as typeof OPENQUOTA,
    title: 'Avoin kiintiö',
    size: event.openQuotaSize,
    signups: openSignups,
  }] : [];

  const queueSignups = signups.filter((signup) => signup.status === 'in-queue');
  // Queue is shown if signups have been assigned there.
  const queue = queueSignups.length > 0 ? [{
    id: WAITLIST as typeof WAITLIST,
    title: 'Jonossa',
    size: null,
    signups: queueSignups,
  }] : [];

  return [
    ...quotas,
    ...openQuota,
    ...queue,
  ];
}

function getAnswersFromSignup(event: AdminEvent.Details, signup: AnySignupDetails) {
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

export function getSignupsForAdminList(event: AdminEvent.Details): FormattedSignup[] {
  const signupsArray = getSignupsAsList(event);
  const sorted = _.orderBy(signupsArray, [
    (signup) => ['in-quota', 'in-open', 'in-queue', null].indexOf(signup.status),
    'createdAt',
  ]);

  return sorted.map((signup) => {
    let quotaType = '';
    if (signup.status === 'in-open') {
      quotaType = ' (Avoin)';
    } else if (signup.status === 'in-queue') {
      quotaType = ' (Jonossa)';
    }
    return {
      ...signup,
      createdAt: moment(signup.createdAt)
        .tz('Europe/Helsinki')
        .format('DD.MM.YYYY HH:mm:ss'),
      quota: `${signup.quotaName}${quotaType}`,
      answers: getAnswersFromSignup(event, signup),
    };
  });
}
