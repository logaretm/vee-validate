import { PartialDeep } from 'type-fest';
import type { TypedSchema, TypedSchemaError } from 'vee-validate';
import {
  Output,
  Input,
  BaseSchema,
  BaseSchemaAsync,
  safeParseAsync,
  safeParse,
  Issue,
  getDefault,
  optional,
  ArraySchema,
  ObjectSchema,
} from 'valibot';
import { isIndex, isObject, merge, normalizeFormPath } from '../../shared';

export function toTypedSchema<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TSchema>,
  TInput = PartialDeep<Input<TSchema>>,
>(valibotSchema: TSchema): TypedSchema<TInput, TOutput> {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(value) {
      const result = await safeParseAsync(valibotSchema, value);
      if (result.success) {
        return {
          value: result.data,
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

      const result = safeParse(valibotSchema, values);
      if (result.success) {
        return result.data;
      }

      const defaults = getDefault(optional(valibotSchema));
      if (isObject(defaults) && isObject(values)) {
        return merge(defaults, values);
      }

      return values;
    },
    describe(path) {
      const description = getSchemaForPath(path, valibotSchema);
      if (!description) {
        return {};
      }

      const isOptional = (description as any).type === 'optional';

      return {
        required: !isOptional,
      };
    },
  };

  return schema;
}

function processIssues(issues: Issue[], errors: Record<string, TypedSchemaError>): void {
  issues.forEach(issue => {
    const path = normalizeFormPath((issue.path || []).map(p => p.key).join('.'));
    if (issue.issues?.length) {
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

function getSchemaForPath(path: string, schema: any): BaseSchema | null {
  if (!isObjectSchema(schema)) {
    return null;
  }

  const paths = (path || '').split(/\.|\[(\d+)\]/).filter(Boolean);

  let currentSchema: BaseSchema = schema;
  for (let i = 0; i < paths.length; i++) {
    const p = paths[i];
    if (isObjectSchema(currentSchema) && p in currentSchema.entries) {
      currentSchema = currentSchema.entries[p];
    }

    if (isIndex(p) && isArraySchema(currentSchema)) {
      currentSchema = currentSchema.item;
    }

    if (i === paths.length - 1) {
      return currentSchema;
    }
  }

  return null;
}

function isArraySchema(schema: unknown): schema is ArraySchema<any> {
  return isObject(schema) && schema.type === 'array';
}

function isObjectSchema(schema: unknown): schema is ObjectSchema<any> {
  return isObject(schema) && schema.type === 'object';
}
