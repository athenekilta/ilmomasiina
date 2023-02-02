import { SchemaOptions, TSchema, Type } from '@sinclair/typebox';

// eslint-disable-next-line import/prefer-default-export
export const Nullable = <T extends TSchema>(type: T, options?: SchemaOptions) => (
  Type.Union([type, Type.Null()], options)
);
