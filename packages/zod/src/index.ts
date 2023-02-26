import { ZodObject, input, output, ZodDefault, ZodSchema } from 'zod';
import { PartialDeep } from 'type-fest';
import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import { isIndex, merge } from '../../shared';

/**
 * Transforms a Zod object schema to Yup's schema
 */
export function toTypedSchema<
  TSchema extends ZodSchema,
  TOutput = output<TSchema>,
  TInput = PartialDeep<input<TSchema>>
>(zodSchema: TSchema): TypedSchema<TInput, TOutput> {
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
    parse(values) {
      try {
        return zodSchema.parse(values);
      } catch {
        // Zod does not support "casting" or not validating a value, so next best thing is getting the defaults and merging them with the provided values.
        const defaults = getDefaults(zodSchema);

        return merge(defaults, values);
      }
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

// Zod does not support extracting default values so the next best thing is manually extracting them.
// https://github.com/colinhacks/zod/issues/1944#issuecomment-1406566175
function getDefaults<Schema extends ZodSchema>(schema: Schema): any {
  if (!(schema instanceof ZodObject)) {
    return;
  }

  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof ZodDefault) {
        return [key, value._def.defaultValue()];
      }

      if (value instanceof ZodObject) {
        return [key, getDefaults(value)];
      }

      return [key, undefined];
    })
  );
}
