import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import { AsyncValidationOptions, Schema, ValidationError } from 'joi';
import { merge, normalizeFormPath } from '../../shared';
import { PartialDeep } from 'type-fest';

/**
 * Gets the type of data from the schema
 */
type DataTypeOf<JoiSchema> = JoiSchema extends Schema<infer U> ? U : never;

/**
 * Transform a joi schema into TypedSchema
 *
 * @param joiSchema joi schema for transforming
 * @param opts validation options to pass to the joi validate function
 * @returns TypedSchema for using with vee-validate
 */
export function toTypedSchema<
  TSchema extends Schema,
  TOutput = DataTypeOf<TSchema>,
  TInput = PartialDeep<DataTypeOf<TSchema>>,
>(joiSchema: TSchema, opts?: AsyncValidationOptions): TypedSchema<TInput, TOutput> {
  const validationOptions: AsyncValidationOptions = merge({ abortEarly: false }, opts || {});

  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(value) {
      try {
        const result = await joiSchema.validateAsync(value, validationOptions);

        return {
          value: result,
          errors: [],
        };
      } catch (err) {
        if (!(err instanceof ValidationError)) {
          throw err;
        }

        const error = err as ValidationError;

        return {
          errors: processIssues(error),
          rawError: err,
        };
      }
    },
    cast(values) {
      // Joi doesn't allow us to cast without validating
      const result = joiSchema.validate(values);

      if (result.error) {
        return values;
      }

      return result.value;
    },
  };

  return schema;
}

function processIssues(error: ValidationError): TypedSchemaError[] {
  const errors: Record<string, TypedSchemaError> = {};

  error.details.forEach(detail => {
    const path = normalizeFormPath(detail.path.join('.'));

    if (errors[path]) {
      errors[path].errors.push(detail.message);

      return;
    }

    errors[path] = {
      path,
      errors: [detail.message],
    };
  });

  return Object.values(errors);
}
