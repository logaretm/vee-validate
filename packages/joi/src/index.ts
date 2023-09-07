import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import { Schema, ValidationError } from 'joi';
import { normalizeFormPath } from '../../shared';
import { PartialDeep } from 'type-fest';

/**
 * Gets the type of data from the schema
 */
type GetTypeOfData<T> = T extends Schema<infer U> ? U : never;

export function toTypedSchema<
  TSchema extends Schema,
  TOutput = GetTypeOfData<TSchema>,
  TInput = PartialDeep<GetTypeOfData<TSchema>>,
>(joiSchema: TSchema): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(value) {
      try {
        const result = await joiSchema.validateAsync(value, { abortEarly: false });

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
