import { Static, Type } from '@sinclair/typebox';

import { quotaWithSignupCount } from '../quota';
import { adminSignupSchema, publicSignupSchema } from '../signup';

/** Describes a schema for quota including public information about the signups in that quota */
const quotaWithSignupsForUser = Type.Intersect(
  [
    quotaWithSignupCount,
    Type.Object({
      signups: Type.Array(
        publicSignupSchema,
        {
          title: 'signups in this quota',
          description: 'Only contains public information',
        },
      ),
    }),
  ],
);

/** Describes a schema for quota including all information about the signups in that quota */
const quotaWithSignupsForAdmin = Type.Intersect(
  [
    quotaWithSignupCount,
    Type.Object({
      signups: Type.Array(
        adminSignupSchema,
        {
          title: 'signups in this quota',
          description: 'Contains full signup data',
        },
      ),
    }),
  ],
);

/** Defines field `quotas` containing all quotas and public information about related signups */
export const signupQuotasWithSignupsForUser = Type.Object({
  quotas: Type.Array(quotaWithSignupsForUser, {
    title: 'quota definitions including signups',
  }),
});

/** Defines field `quotas` containing all quotas and all information about related signups */
export const signupQuotasWithSignupsForAdmin = Type.Object({
  quotas: Type.Array(quotaWithSignupsForAdmin, {
    title: 'quota definitions including signups',
  }),
});

export type QuotaWithSignupsForAdmin = Static<typeof quotaWithSignupsForAdmin>;
export type QuotaWithSignupsForUser = Static<typeof quotaWithSignupsForUser>;
