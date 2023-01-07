import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import sumBy from 'lodash/sumBy';
import moment from 'moment-timezone';

import type {
  AdminEventSchema, QuestionID, QuotaID, SignupID, UserEventSchema,
} from '@tietokilta/ilmomasiina-models';
import { timezone } from '../config';

export const WAITLIST = '\x00waitlist';
export const OPENQUOTA = '\x00open';

type AnyEventDetails = AdminEventSchema | UserEventSchema;
export type AnySignupDetails = AnyEventDetails['quotas'][number]['signups'][number];

export type SignupWithQuota = AnySignupDetails & {
  quotaId: QuotaID;
  quotaName: string;
  confirmed: boolean;
};

function getSignupsAsList(event: AnyEventDetails): SignupWithQuota[] {
  return event.quotas.flatMap(
    (quota) => quota.signups?.map(
      (signup) => ({
        ...signup,
        quotaId: quota.id,
        quotaName: quota.title,
        confirmed:
          ('confirmed' in signup && signup.confirmed) || ('confirmedAt' in signup && signup.confirmedAt !== null),
      }),
    ) ?? [],
  );
}

export type QuotaCounts = Pick<UserEventSchema['quotas'][number], 'size' | 'signupCount'>;

/** Computes the number of signups in the open quota and queue. */
export function countOverflowSignups(quotas: QuotaCounts[], openQuotaSize: number) {
  const overflow = sumBy(quotas, (quota) => Math.max(0, quota.signupCount - (quota.size ?? Infinity)));
  return {
    openQuotaCount: Math.min(overflow, openQuotaSize),
    queueCount: Math.max(overflow - openQuotaSize, 0),
  };
}

export type QuotaSignups = {
  id: QuotaID | typeof OPENQUOTA | typeof WAITLIST;
  title: string;
  size: number | null;
  signups: SignupWithQuota[];
  signupCount: number;
};

export function getSignupsByQuota(event: AnyEventDetails): QuotaSignups[] {
  const signups = getSignupsAsList(event);
  const quotas = [
    ...event.quotas.map(
      (quota) => {
        const quotaSignups = signups.filter((signup) => signup.quotaId === quota.id && signup.status === 'in-quota');
        return {
          ...quota,
          signups: quotaSignups,
          // Trust signupCount and size, unless we have concrete information that more signups exist
          signupCount: Math.max(quotaSignups.length, Math.min(quota.signupCount, quota.size ?? Infinity)),
        };
      },
    ),
  ];

  const { openQuotaCount, queueCount } = countOverflowSignups(event.quotas, event.openQuotaSize);

  const openSignups = signups.filter((signup) => signup.status === 'in-open');
  // Open quota is shown if the event has one, or if signups have been assigned there nevertheless.
  const openQuota = openSignups.length > 0 || event.openQuotaSize > 0 ? [{
    id: OPENQUOTA as typeof OPENQUOTA,
    title: 'Avoin kiintiö',
    size: event.openQuotaSize,
    signups: openSignups,
    signupCount: Math.max(openQuotaCount, openSignups.length),
  }] : [];

  const queueSignups = signups.filter((signup) => signup.status === 'in-queue');
  // Queue is shown if signups have been assigned there.
  const queue = queueSignups.length > 0 ? [{
    id: WAITLIST as typeof WAITLIST,
    title: 'Jonossa',
    size: null,
    signups: queueSignups,
    signupCount: Math.max(queueCount, queueSignups.length),
  }] : [];

  return [
    ...quotas,
    ...openQuota,
    ...queue,
  ];
}

function getAnswersFromSignup(event: AdminEventSchema, signup: AnySignupDetails) {
  const answers: Record<QuestionID, string> = {};

  event.questions.forEach((question) => {
    const answer = find(signup.answers, { questionId: question.id });
    answers[question.id] = answer?.answer || '';
  });

  return answers;
}

type FormattedSignup = {
  id?: SignupID;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  answers: Record<QuestionID, string>;
  quota: string;
  createdAt: string;
  confirmed: boolean;
};

export function getSignupsForAdminList(event: AdminEventSchema): FormattedSignup[] {
  const signupsArray = getSignupsAsList(event);
  const sorted = orderBy(signupsArray, [
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
        .tz(timezone())
        .format('DD.MM.YYYY HH:mm:ss'),
      quota: `${signup.quotaName}${quotaType}`,
      answers: getAnswersFromSignup(event, signup),
    };
  });
}

export function convertSignupsToCSV(event: AdminEventSchema, signups: FormattedSignup[]): string[][] {
  return [
    // Headers
    [
      ...(event.nameQuestion ? ['Etunimi', 'Sukunimi'] : []),
      ...(event.emailQuestion ? ['Sähköpostiosoite'] : []),
      'Kiintiö',
      ...event.questions.map(({ question }) => question),
      'Ilmoittautumisaika',
    ],
    // Data rows
    ...signups.map((signup) => [
      ...(event.nameQuestion ? [signup.firstName || '', signup.lastName || ''] : []),
      ...(event.emailQuestion ? [signup.email || ''] : []),
      signup.quota,
      ...event.questions.map((question) => signup.answers[question.id] || ''),
      signup.createdAt,
    ]),
  ];
}
