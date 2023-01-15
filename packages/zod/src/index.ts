import type { input, output, ZodSchema } from 'zod';
import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import { isIndex, Optional } from '../../shared';

/**
 * Transforms a Zod object schema to Yup's schema
 */
export function toTypedSchema<TSchema extends ZodSchema, TInput = Optional<input<TSchema>>, TOutput = output<TSchema>>(
  zodSchema: TSchema
): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async validate(value) {
      const result = await zodSchema.safeParseAsync(value);
      if (result.success) {
        return {
          value: result.data,
          errors: [],
        };
      }

      const errors: TypedSchemaError[] = result.error.issues.map<TypedSchemaError>(issue => {
        return { path: joinPath(issue.path), errors: [issue.message] };
      });

      return {
        errors,
      };
    },
  };

  return schema;
}

/**
 * Constructs a path with brackets to be compatible with vee-validate path syntax
 */
function joinPath(path: (string | number)[]): string {
  let fullPath = String(path[0]);
  for (let i = 1; i < path.length; i++) {
    if (isIndex(path[i])) {
      fullPath += `[${path[i]}]`;
      continue;
    }

    fullPath += `.${path[i]}`;
  }

  return fullPath;
}
