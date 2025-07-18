import { PartialDeep } from 'type-fest';
import { cleanupNonNestedPath, isNotNestedPath, type TypedSchema, type TypedSchemaError } from 'vee-validate';
import {
  InferOutput,
  InferInput,
  InferIssue,
  BaseSchema,
  BaseSchemaAsync,
  safeParseAsync,
  safeParse,
  BaseIssue,
  getDefault,
  optional,
  ArraySchema,
  ObjectSchema,
  ErrorMessage,
  ArrayIssue,
  ObjectEntries,
  LooseObjectIssue,
  ObjectIssue,
  ObjectWithRestSchema,
  ObjectWithRestIssue,
  StrictObjectIssue,
  StrictObjectSchema,
  LooseObjectSchema,
  getDotPath,
  Config,
  IntersectSchema,
  IntersectIssue,
  VariantSchema,
  VariantOptions,
  VariantIssue,
} from 'valibot';
import { isIndex, isObject, merge, normalizeFormPath } from '../../shared';

export function toTypedSchema<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
  TInferOutput = InferOutput<TSchema>,
  TInferInput = PartialDeep<InferInput<TSchema>>,
>(valibotSchema: TSchema, config?: Config<InferIssue<TSchema>>): TypedSchema<TInferInput, TInferOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(value) {
      const result = await safeParseAsync(valibotSchema, value, config);
      if (result.success) {
        return {
          value: result.output,
          errors: [],
        };
      }

      const errors: Record<string, TypedSchemaError> = {};
      processIssues(result.issues, errors);

      return {
        errors: Object.values(errors),
      };
    },
    cast(values) {
      if (valibotSchema.async) {
        return values;
      }

      const result = safeParse(valibotSchema, values, config);
      if (result.success) {
        return result.output;
      }

      const defaults = getDefault(optional(valibotSchema));
      if (isObject(defaults) && isObject(values)) {
        return merge(defaults, values);
      }

      return values;
    },
    describe(path) {
      try {
        if (!path) {
          return {
            required: !queryOptional(valibotSchema),
            exists: true,
          };
        }

        const pathSchema = getSchemaForPath(path, valibotSchema);
        if (!pathSchema) {
          return {
            required: false,
            exists: false,
          };
        }

        return {
          required: !queryOptional(pathSchema),
          exists: true,
        };
      } catch {
        if (__DEV__) {
          // eslint-disable-next-line no-console
          console.warn(`Failed to describe path ${path} on the schema, returning a default description.`);
        }

        return {
          required: false,
          exists: false,
        };
      }
    },
  };

  return schema;
}

function processIssues(issues: BaseIssue<unknown>[], errors: Record<string, TypedSchemaError>): void {
  issues.forEach(issue => {
    const path = normalizeFormPath(getDotPath(issue) || '');
    if (issue.issues) {
      processIssues(
        issue.issues.flatMap(ue => ue.issues || []),
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

function getSchemaForPath(
  path: string,
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
): BaseSchema<unknown, unknown, BaseIssue<unknown>> | null {
  if (isIntersectSchema(schema)) {
    return schema.options.map(o => getSchemaForPath(path, o)).find(Boolean) ?? null;
  }

  if (isVariantSchema(schema)) {
    return schema.options.map(o => getSchemaForPath(path, o)).find(Boolean) ?? null;
  }

  if (!isObjectSchema(schema)) {
    return null;
  }

  if (isNotNestedPath(path)) {
    return schema.entries[cleanupNonNestedPath(path)];
  }

  const paths = (path || '').split(/\.|\[(\d+)\]/).filter(Boolean);

  let currentSchema: BaseSchema<unknown, unknown, BaseIssue<unknown>> = schema;
  for (let i = 0; i <= paths.length; i++) {
    const p = paths[i];
    if (!p || !currentSchema) {
      return currentSchema;
    }

    if (isIntersectSchema(currentSchema)) {
      currentSchema = currentSchema.options.find(o => isObjectSchema(o) && o.entries[p]) ?? currentSchema;
    }

    if (isVariantSchema(currentSchema)) {
      currentSchema = currentSchema.options.find(o => isObjectSchema(o) && o.entries[p]) ?? currentSchema;
    }

    if (isObjectSchema(currentSchema)) {
      currentSchema = currentSchema.entries[p] || null;
      continue;
    }

    if (isIndex(p) && isArraySchema(currentSchema)) {
      currentSchema = currentSchema.item;
    }
  }

  return null;
}

function queryOptional(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
): boolean {
  return schema.type === 'optional';
}

function isArraySchema(
  schema: unknown,
): schema is ArraySchema<BaseSchema<unknown, unknown, BaseIssue<unknown>>, ErrorMessage<ArrayIssue> | undefined> {
  return isObject(schema) && 'item' in schema;
}

function isObjectSchema(
  schema: unknown,
): schema is
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchema<
      ObjectEntries,
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<ObjectEntries, ErrorMessage<StrictObjectIssue> | undefined> {
  return isObject(schema) && 'entries' in schema;
}

function isIntersectSchema(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
): schema is IntersectSchema<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>[],
  ErrorMessage<IntersectIssue> | undefined
> {
  return schema.type === 'intersect';
}

function isVariantSchema(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>> | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
): schema is VariantSchema<string, VariantOptions<string>, ErrorMessage<VariantIssue> | undefined> {
  return schema.type === 'variant';
}
