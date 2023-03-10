import { InferType, Schema, ValidateOptions, ValidationError } from 'yup';
import { TypedSchema } from 'vee-validate';
import { PartialDeep } from 'type-fest';

export function toTypedSchema<TSchema extends Schema, TOutput = InferType<TSchema>, TInput = PartialDeep<TOutput>>(
  yupSchema: TSchema,
  opts: ValidateOptions = { abortEarly: false }
): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async validate(values) {
      try {
        const output = await yupSchema.validate(values, opts);

        return {
          value: output,
          errors: [],
        };
      } catch (err) {
        const error = err as ValidationError;
        // Yup errors have a name prop one them.
        // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
        if (error.name !== 'ValidationError') {
          throw err;
        }

        if (!error.inner?.length && error.errors.length) {
          return { errors: [{ path: error.path, errors: error.errors }] };
        }

        // list of aggregated errors
        return { errors: error.inner || [] };
      }
    },
    parse(values) {
      try {
        return yupSchema.cast(values);
      } catch {
        return values;
      }
    },
  };

  return schema;
}
