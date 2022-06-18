import QuotaAttributes from './quota';

export const signupStatuses = ['in-quota', 'in-open', 'in-queue'] as const;
export type SignupStatus = typeof signupStatuses[number];

export default interface SignupAttributes {
  id: string;
  firstName: string | null;
  lastName: string | null;
  namePublic: boolean;
  email: string | null;
  confirmedAt: Date | null;
  status: SignupStatus | null;
  position: number | null;
  createdAt: Date;
  quotaId: QuotaAttributes['id'];
}
