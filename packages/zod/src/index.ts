import {
  ZodObject,
  input,
  output,
  ZodDefault,
  ZodSchema,
  ParseParams,
  ZodIssue,
  AnyZodObject,
  ZodArrayDef,
  ZodArray,
  ZodFirstPartyTypeKind,
} from 'zod';
import { PartialDeep } from 'type-fest';
import { isNotNestedPath, type TypedSchema, type TypedSchemaError, cleanupNonNestedPath } from 'vee-validate';
import { isIndex, isObject, merge, normalizeFormPath } from '../../shared';

/**
 * Transforms a Zod object schema to Yup's schema
 */
export function toTypedSchema<
  TSchema extends ZodSchema,
  TOutput = output<TSchema>,
  TInput = PartialDeep<input<TSchema>>,
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

      const errors: Record<string, TypedSchemaError> = {};
      processIssues(result.error.issues, errors);

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
    describe(path) {
      if (!path) {
        return {
          required: !zodSchema.isOptional(),
          exists: true,
        };
      }

      const description = getSchemaForPath(path, zodSchema);
      if (!description) {
        return {
          required: false,
          exists: false,
        };
      }

      return {
        required: !description.isOptional(),
        exists: true,
      };
    },
  };

  return schema;
}

function processIssues(issues: ZodIssue[], errors: Record<string, TypedSchemaError>): void {
  issues.forEach(issue => {
    const path = normalizeFormPath(issue.path.join('.'));
    if (issue.code === 'invalid_union') {
      processIssues(
        issue.unionErrors.flatMap(ue => ue.issues),
        errors,
      );

      if (!path) {
        return;
      }
    }

    if (!errors[path]) {
      errors[path] = { errors: [], path };
    }

    errors[path].errors.push(issue.message);
  });
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
    }),
  );
}

/**
 * @deprecated use toTypedSchema instead.
 */
const toFieldValidator = toTypedSchema;

/**
 * @deprecated use toTypedSchema instead.
 */
const toFormValidator = toTypedSchema;

export { toFieldValidator, toFormValidator };

function getSchemaForPath(path: string, schema: ZodSchema): ZodSchema | null {
  if (!isObjectSchema(schema)) {
    return null;
  }

  if (isNotNestedPath(path)) {
    return schema.shape[cleanupNonNestedPath(path)];
  }

  const paths = (path || '').split(/\.|\[(\d+)\]/).filter(Boolean);

  let currentSchema: ZodSchema = schema;
  for (let i = 0; i <= paths.length; i++) {
    const p = paths[i];
    if (!p || !currentSchema) {
      return currentSchema;
    }

    if (isObjectSchema(currentSchema)) {
      currentSchema = currentSchema.shape[p] || null;
      continue;
    }

    if (isIndex(p) && isArraySchema(currentSchema)) {
      currentSchema = (currentSchema._def as ZodArrayDef).type;
    }
  }

  return null;
}

function getDefType(schema: ZodSchema) {
  return (schema._def as any).typeName as ZodFirstPartyTypeKind;
}

function isArraySchema(schema: ZodSchema): schema is ZodArray<any, any> {
  return getDefType(schema) === ZodFirstPartyTypeKind.ZodArray;
}

function isObjectSchema(schema: ZodSchema): schema is AnyZodObject {
  return getDefType(schema) === ZodFirstPartyTypeKind.ZodObject;
}
