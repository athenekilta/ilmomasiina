import QuotaAttributes from '../../models/quota';
import SignupAttributes from '../../models/signup';

// Expected request schema.
export interface SignupCreateBody {
  quotaId: QuotaAttributes['id'];
}

// Response schema.
export interface SignupCreateResponse {
  id: SignupAttributes['id'];
  editToken: string,
}
