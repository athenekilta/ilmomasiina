/* eslint-disable import/prefer-default-export */
import { Quota, Signup } from '@tietokilta/ilmomasiina-models';
import apiFetch from '../../api';

export function beginSignup(quotaId: Quota.Id) {
  return apiFetch('signups', {
    method: 'POST',
    body: { quotaId },
  }) as Promise<Signup.Create.Response>;
}
