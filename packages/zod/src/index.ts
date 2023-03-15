import { ZodObject, input, output, ZodDefault, ZodSchema, ParseParams } from 'zod';
import { PartialDeep } from 'type-fest';
import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import { isIndex, isObject, merge } from '../../shared';

/**
 * Transforms a Zod object schema to Yup's schema
 */
export function toTypedSchema<
  TSchema extends ZodSchema,
  TOutput = output<TSchema>,
  TInput = PartialDeep<input<TSchema>>
>(zodSchema: TSchema, opts?: Partial<ParseParams>): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(value) {
      const result = await zodSchema.safeParseAsync(value, opts);
      if (result.success) {
        return {
          value: result.data,
          errors: [],
        };
      }

      const errors: Record<string, TypedSchemaError> = result.error.issues.reduce((acc, issue) => {
        const path = joinPath(issue.path);
        if (!acc[path]) {
          acc[path] = { errors: [], path };
        }

        acc[path].errors.push(issue.message);

        return acc;
      }, {} as Record<string, TypedSchemaError>);

      return {
        errors: Object.values(errors),
      };
    },
    cast(values) {
      try {
        return zodSchema.parse(values);
      } catch {
        // Zod does not support "casting" or not validating a value, so next best thing is getting the defaults and merging them with the provided values.
        const defaults = getDefaults(zodSchema);
        if (isObject(defaults) && isObject(values)) {
          return merge(defaults, values);
        }

        return values;
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
function getDefaults<Schema extends ZodSchema>(schema: Schema): unknown {
  if (!(schema instanceof ZodObject)) {
    return undefined;
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

const toFieldValidator = toTypedSchema;
const toFormValidator = toTypedSchema;

export { toFieldValidator, toFormValidator };
