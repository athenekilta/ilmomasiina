import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

export { quotaID } from './attributes';

const signupQuotaCreate = Type.Intersect([
  attributes.quotaAttributes,
]);

const signupCount = Type.Object({
  signupCount: Type.Integer({
    title: 'total number of signups in this quota',
  }),
});

export const signupQuotaSchema = Type.Intersect(
  [
    attributes.quotaIdentity,
    attributes.quotaAttributes,
  ],
);

export const signupQuotaWithSignupCount = Type.Intersect(
  [
    signupQuotaSchema,
    signupCount,
  ],
);

const signupQuotaUpdate = Type.Intersect(
  [
    signupQuotaCreate,
    Type.Partial(attributes.quotaIdentity),
  ],
  {
    title: 'updated quota',
    description: 'provide id to edit an existing quota',
  },
);

export const singleSignupQuota = Type.Object({
  quota: signupQuotaSchema,
});

export const signupQuotasWithSignupCount = Type.Object({
  quotas: Type.Array(signupQuotaWithSignupCount, {
    title: 'quota definitions',
  }),
});

export const signupQuotasCreate = Type.Object({
  quotas: Type.Array(signupQuotaCreate, {
    title: 'quota definitions',
  }),
});

export const signupQuotasUpdate = Type.Object({
  quotas: Type.Array(signupQuotaUpdate, {
    title: 'quota definitions',
  }),
});

export type SignupQuotaID = Static<typeof attributes.quotaID>;
