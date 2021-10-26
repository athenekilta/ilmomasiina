import QuotaAttributes from '../../models/quota';
import SignupAttributes, { SignupStatus } from '../../models/signup';

// Expected request schema.
export interface SignupCreateBody {
  quotaId: QuotaAttributes['id'];
}

// Response schema.
export interface SignupCreateResponse {
  id: SignupAttributes['id'];
  position: number | null;
  status: SignupStatus | null;
  quotaId: QuotaAttributes['id'];
  createdAt: Date;
  editToken: string,
}
