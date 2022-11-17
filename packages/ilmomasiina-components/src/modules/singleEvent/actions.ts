/* eslint-disable import/prefer-default-export */
import { Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { Signup } from '@tietokilta/ilmomasiina-models/src/services/signups';
import apiFetch from '../../api';

export function beginSignup(quotaId: Quota.Id) {
  return apiFetch('signups', {
    method: 'POST',
    body: { quotaId },
  }) as Promise<Signup.Create.Response>;
}
