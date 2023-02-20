import { SignupStatus } from '../enum';
import QuotaAttributes from './quota';

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
