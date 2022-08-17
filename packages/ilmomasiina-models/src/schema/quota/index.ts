import { Static, Type } from '@sinclair/typebox';

import * as attributes from './attributes';

export { quotaID } from './attributes';

/** Describes a schema for creating a single quota for event */
const quotaCreate = Type.Intersect([
  attributes.quotaAttributes,
]);

/** Defines a field for signupCount */
const signupCount = Type.Object({
  signupCount: Type.Integer({
    title: 'total number of signups in this quota',
  }),
});

/** Describes a schema for a single quota */
export const quotaSchema = Type.Intersect(
  [
    attributes.quotaIdentity,
    attributes.quotaAttributes,
  ],
);

/** Describes a schema for a single quota, including a count of its signups */
export const quotaWithSignupCount = Type.Intersect(
  [
    quotaSchema,
    signupCount,
  ],
);

/** Describes a schema for updating a quota */
const quotaUpdateSchema = Type.Intersect(
  [
    quotaCreate,
    Type.Partial(attributes.quotaIdentity),
  ],
  {
    title: 'updated quota',
    description: 'provide id to edit an existing quota',
  },
);

/** Provides field `quota` describing a single quota */
export const singleQuota = Type.Object({
  quota: quotaSchema,
});

/** Provides field `quotas` describing multiple quotas along including signup counts */
export const quotasWithSignupCount = Type.Object({
  quotas: Type.Array(quotaWithSignupCount, {
    title: 'quota definitions',
  }),
});

/** Describes schema for creating quotas for a single event */
export const quotasCreate = Type.Object({
  quotas: Type.Array(quotaCreate, {
    title: 'quota definitions',
  }),
});

/** Describes schema for updating quotas for a single event */
export const quotasUpdate = Type.Object({
  quotas: Type.Array(quotaUpdateSchema, {
    title: 'quota definitions',
  }),
});

export type QuotaID = Static<typeof attributes.quotaID>;
export type QuotaUpdateSchema = Static<typeof quotaUpdateSchema>;
