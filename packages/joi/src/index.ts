import { AsyncValidationOptions, Schema, ValidationError } from 'joi';
import { merge } from '../../shared';
import { PartialDeep } from 'type-fest';
import { StandardSchemaV1 } from '@standard-schema/spec';

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
>(joiSchema: TSchema, opts?: AsyncValidationOptions): StandardSchemaV1<TInput, TOutput> {
  const validationOptions: AsyncValidationOptions = merge({ abortEarly: false }, opts || {});

  const schema: StandardSchemaV1<TInput, TOutput> = {
    '~standard': {
      vendor: 'vee-validate/joi',
      version: 1,
      async validate(value) {
        try {
          const result = await joiSchema.validateAsync(value, validationOptions);

          return {
            value: result,
            issues: undefined,
          };
        } catch (err) {
          if (!(err instanceof ValidationError)) {
            throw err;
          }

          return {
            issues: processIssues(err),
          };
        }
      },
    },
  };

  return schema;
}

function processIssues(error: ValidationError): StandardSchemaV1.Issue[] {
  return error.details.map<StandardSchemaV1.Issue>(detail => {
    return {
      path: detail.path,
      message: detail.message,
    };
  });
}
