import { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Transforms a Zod object schema to Yup's schema
 * @deprecated No longer needed, use the valibot's schema directly.
 */
export function toTypedSchema<TSchema extends StandardSchemaV1>(schema: TSchema): StandardSchemaV1 {
  return schema;
}
