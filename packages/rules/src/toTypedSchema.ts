import { keysOf } from '../../vee-validate/src/utils';
import { TypedSchema, RawFormSchema, validateObject, TypedSchemaError, validate } from 'vee-validate';
import { Optional, isObject } from '../../shared';

export function toTypedSchema<TOutput = any, TInput extends Optional<TOutput> = Optional<TOutput>>(
  rawSchema: RawFormSchema<TInput> | string,
): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(values: TInput) {
      // single field
      if (typeof rawSchema === 'string') {
        const result = await validate(values, rawSchema);

        return {
          errors: [
            {
              errors: result.errors,
            },
          ],
        };
      }

      const result = await validateObject<TInput, TOutput>(rawSchema, values);

      return {
        errors: keysOf(result.errors).map(path => {
          const error: TypedSchemaError = {
            path: path as string,
            errors: result.results[path]?.errors || [],
          };

          return error;
        }),
      };
    },
    describe(path) {
      if (!path) {
        return getDescriptionFromExpression(rawSchema);
      }

      if (isObject(rawSchema) && path in rawSchema) {
        return getDescriptionFromExpression((rawSchema as any)[path]);
      }

      return {
        required: false,
        exists: false,
      };
    },
  };

  return schema;
}

function getDescriptionFromExpression(rules: string | Record<string, any>) {
  if (typeof rules === 'string') {
    return {
      exists: true,
      required: rules.includes('required'),
    };
  }

  if (isObject(rules)) {
    return {
      exists: true,
      required: !!rules.required,
    };
  }

  return {
    required: false,
    exists: true,
  };
}
