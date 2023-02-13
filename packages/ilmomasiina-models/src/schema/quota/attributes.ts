import { Type } from '@sinclair/typebox';

import { Nullable } from '../utils';

export const quotaID = Type.String({
  title: 'QuotaID',
  description: 'Quota ID. Randomly generated alphanumeric string.',
  // TODO: Add validation? max-length?
});

/** Non-editable identity attributes of a quota. */
export const quotaIdentity = Type.Object({
  id: quotaID,
});

/** Editable attributes of a quota. */
export const quotaAttributes = Type.Object({
  title: Type.String({
    description: 'Quota name.',
  }),
  size: Nullable(
    Type.Integer({ minimum: 1 }),
    { description: 'Maximum number of signups in the quota. If null, the size is unlimited.' },
  ),
});
