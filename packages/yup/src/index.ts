import { InferType, TypeOf, BaseSchema, ValidationError } from 'yup';
import { TypedSchema } from 'vee-validate';

export function toTypedSchema<TSchema extends BaseSchema, TInput = TypeOf<TSchema>, TOutput = InferType<TSchema>>(
  yupSchema: TSchema
): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async validate(values: TInput) {
      try {
        const output = await yupSchema.validate(values, { abortEarly: false });

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

        // list of aggregated errors
        return { errors: error.inner || [] };
      }
    },
  };

  return schema;
}
