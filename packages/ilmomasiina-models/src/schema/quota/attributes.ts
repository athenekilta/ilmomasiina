import { Type } from '@sinclair/typebox';

export const quotaID = Type.String({
  title: 'quota ID',
  description: 'a unique identifier for quota',
  // TODO: Add validation?
});

export const quotaIdentity = Type.Object({
  id: quotaID,
});

export const quotaAttributes = Type.Object({
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
