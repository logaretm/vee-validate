import { InferType, Schema, ValidateOptions, ValidationError } from 'yup';
import { TypedSchema, TypedSchemaError } from 'vee-validate';
import { PartialDeep } from 'type-fest';

export function toTypedSchema<TSchema extends Schema, TOutput = InferType<TSchema>, TInput = PartialDeep<TOutput>>(
  yupSchema: TSchema,
  opts: ValidateOptions = { abortEarly: false },
): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(values) {
      try {
        // we spread the options because yup mutates the opts object passed
        const output = await yupSchema.validate(values, { ...opts });

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

        const errors: Record<string, TypedSchemaError> = error.inner.reduce(
          (acc, curr) => {
            const path = curr.path || '';
            if (!acc[path]) {
              acc[path] = { errors: [], path };
            }

            acc[path].errors.push(...curr.errors);

            return acc;
          },
          {} as Record<string, TypedSchemaError>,
        );

        // list of aggregated errors
        return { errors: Object.values(errors) };
      }
    },
    cast(values) {
      try {
        return yupSchema.cast(values);
      } catch {
        return values;
      }
    },
  };

  return schema;
}
