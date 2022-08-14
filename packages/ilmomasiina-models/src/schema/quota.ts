import { Static, Type } from '@sinclair/typebox';

export const signupQuotaID = Type.String({
  title: 'quota ID',
  description: 'a unique identifier for quota',
  // TODO: Add validation?
});

const signupQuotaCreate = Type.Object({
  title: Type.String({
    title: 'title of the quota',
  }),
  size: Type.Union([
    Type.Integer({
      title: 'size limit',
      minimum: 1,
    }),
    Type.Null({
      title: 'unlimited quota',
    }),
  ], {
    title: 'size limit of the quota',
  }),
});

const signupCount = Type.Object({
  signupCount: Type.Integer({
    title: 'total number of signups in this quota',
  }),
});

export const signupQuotaSchema = Type.Intersect(
  [
    signupQuotaCreate,
    Type.Object({
      id: signupQuotaID,
    }),
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
    Type.Object({
      id: Type.Optional(signupQuotaID),
    }),
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

export type SignupQuotaID = Static<typeof signupQuotaID>;
