import { Static, Type } from '@sinclair/typebox';

import { quotaAttributes, quotaID, quotaIdentity } from './attributes';

export { quotaID } from './attributes';

/** Schema for a quota. */
export const quota = Type.Intersect([
  quotaIdentity,
  quotaAttributes,
]);

/** Schema for creating a quota. */
export const quotaCreate = quotaAttributes;

/** Schema for updating a quota. */
export const quotaUpdate = Type.Intersect(
  [
    Type.Partial(quotaIdentity),
    quotaCreate,
  ],
  { description: 'Set id to reuse an existing quota, or leave it empty to create a new one.' },
);

/** Quota ID type. Randomly generated alphanumeric string. */
export type QuotaID = Static<typeof quotaID>;

/** Schema for updating a quota. */
export type QuotaUpdate = Static<typeof quotaUpdate>;
