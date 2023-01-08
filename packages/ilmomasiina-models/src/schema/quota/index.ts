import { Static, Type } from '@sinclair/typebox';

import { adminSignupSchema, publicSignupSchema } from '../signup';
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

/** Schema for a quota with a count of its signups. */
export const quotaWithSignupCount = Type.Intersect([
  quota,
  Type.Object({
    signupCount: Type.Integer({
      description: 'Total number of signups in this quota.',
    }),
  }),
]);

/** Schema for a quota with public information of its signups. */
export const userQuotaWithSignups = Type.Intersect([
  quotaWithSignupCount,
  Type.Object({
    signups: Type.Array(
      publicSignupSchema,
      { description: 'Public information of signups in the quota.' },
    ),
  }),
]);

/** Schema for a quota with full information of its signups. */
export const adminQuotaWithSignups = Type.Intersect([
  quotaWithSignupCount,
  Type.Object({
    signups: Type.Array(
      adminSignupSchema,
      { description: 'Signups in the quota.' },
    ),
  }),
]);

/** Quota ID type. Randomly generated alphanumeric string. */
export type QuotaID = Static<typeof quotaID>;

/** Schema for updating a quota. */
export type QuotaUpdate = Static<typeof quotaUpdate>;

/** Schema for a quota with a count of its signups. */
export type QuotaWithSignupCount = Static<typeof quotaWithSignupCount>;
/** Schema for a quota, with public information of its signups. */
export type UserQuotaWithSignups = Static<typeof userQuotaWithSignups>;
/** Schema for a quota, with full information of its signups. */
export type AdminQuotaWithSignups = Static<typeof adminQuotaWithSignups>;
