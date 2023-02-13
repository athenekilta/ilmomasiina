/* eslint-disable import/prefer-default-export */
import type { QuotaID, SignupCreateResponse } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';

export function beginSignup(quotaId: QuotaID) {
  return apiFetch('signups', {
    method: 'POST',
    body: { quotaId },
  }) as Promise<SignupCreateResponse>;
}
