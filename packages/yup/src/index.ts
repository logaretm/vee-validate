import { StandardSchemaV1 } from '@standard-schema/spec';

/**
 * Transforms a Yup object schema to a StandardSchemaV1 schema
 * @deprecated No longer needed, use yup's schema directly.
 */
export function toTypedSchema<TSchema extends StandardSchemaV1>(schema: TSchema): StandardSchemaV1 {
  return schema;
}

/**
 * @deprecated use toTypedSchema instead.
 */
const toFieldValidator = toTypedSchema;

/**
 * @deprecated use toTypedSchema instead.
 */
const toFormValidator = toTypedSchema;

export { toFieldValidator, toFormValidator };
