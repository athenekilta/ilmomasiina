import { Static, Type } from '@sinclair/typebox';

import { quota } from '../quota';
import { adminSignupSchema, publicSignupSchema } from '../signup';

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

/** Schema for a quota with a count of its signups. */
export type QuotaWithSignupCount = Static<typeof quotaWithSignupCount>;
/** Schema for a quota, with public information of its signups. */
export type UserQuotaWithSignups = Static<typeof userQuotaWithSignups>;
/** Schema for a quota, with full information of its signups. */
export type AdminQuotaWithSignups = Static<typeof adminQuotaWithSignups>;
