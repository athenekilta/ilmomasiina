import { Type } from '@sinclair/typebox';

/** Unique identifier for quota */
export const quotaID = Type.String({
  title: 'quota ID',
  description: 'a unique identifier for quota',
  // TODO: Add validation? max-length?
});

/** Non-editable identity attributes of quota */
export const quotaIdentity = Type.Object({
  id: quotaID,
});

/** Editable attributes of quota */
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
