import { InferType, TypeOf, BaseSchema, ValidationError } from 'yup';
import { TypedSchema, TypedSchemaError } from 'vee-validate';

export function toTypedSchema<TSchema extends BaseSchema, TInput = TypeOf<TSchema>, TOutput = InferType<TSchema>>(
  yupSchema: TSchema
): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async validate(values: TInput) {
      const errorObjects: TypedSchemaError[] = await yupSchema
        .validate(values, { abortEarly: false })
        .then(() => [])
        .catch((err: ValidationError) => {
          // Yup errors have a name prop one them.
          // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
          if (err.name !== 'ValidationError') {
            throw err;
          }

          // list of aggregated errors
          return err.inner || [];
        });

      return errorObjects;
    },
  };

  return schema;
}
