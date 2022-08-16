import { Type } from '@sinclair/typebox';

import { signupQuotaWithSignupCount } from '../quota';
import { adminSignupSchema, publicSignupSchema } from '../signup';

const quotaWithSignupsForUser = Type.Intersect(
  [
    signupQuotaWithSignupCount,
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

const quotaWithSignupsForAdmin = Type.Intersect(
  [
    signupQuotaWithSignupCount,
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

export const signupQuotasWithSignupsForUser = Type.Object({
  quotas: Type.Array(quotaWithSignupsForUser, {
    title: 'quota definitions including signups',
  }),
});

export const signupQuotasWithSignupsForAdmin = Type.Object({
  quotas: Type.Array(quotaWithSignupsForAdmin, {
    title: 'quota definitions including signups',
  }),
});
