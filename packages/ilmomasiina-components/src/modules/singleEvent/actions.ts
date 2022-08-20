/* eslint-disable import/prefer-default-export */
import { CreatedSignupSchema, QuotaID } from '@tietokilta/ilmomasiina-models/src/schema';
import apiFetch from '../../api';

export function beginSignup(quotaId: QuotaID) {
  return apiFetch('signups', {
    method: 'POST',
    body: { quotaId },
  }) as Promise<CreatedSignupSchema>;
}
