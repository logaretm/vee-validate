import { AnyObjectSchema, ArraySchema, InferType, Schema, ValidateOptions, ValidationError } from 'yup';
import {
  TypedSchema,
  TypedSchemaError,
  isNotNestedPath,
  cleanupNonNestedPath,
  TypedSchemaPathDescription,
} from 'vee-validate';
import { PartialDeep } from 'type-fest';
import { isIndex, isObject, merge } from '../../shared';

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
        const defaults = yupSchema.getDefault();
        if (isObject(defaults) && isObject(values)) {
          return merge(defaults, values);
        }

        return values;
      }
    },
    describe(path) {
      if (!path) {
        return getDescriptionFromYupSpec(yupSchema.spec);
      }

      const description = getSpecForPath(path, yupSchema);
      if (!description) {
        return {
          required: false,
          exists: false,
        };
      }

      return getDescriptionFromYupSpec(description);
    },
  };

  return schema;
}

function getDescriptionFromYupSpec(spec: AnyObjectSchema['spec']): TypedSchemaPathDescription {
  return {
    required: !spec.optional,
    exists: true,
  };
}

function getSpecForPath(path: string, schema: Schema): AnyObjectSchema['spec'] | null {
  if (!isObjectSchema(schema)) {
    return null;
  }

  if (isNotNestedPath(path)) {
    const field = schema.fields[cleanupNonNestedPath(path)];

    return (field as AnyObjectSchema)?.spec || null;
  }

  const paths = (path || '').split(/\.|\[(\d+)\]/).filter(Boolean);

  let currentSchema = schema;
  for (let i = 0; i < paths.length; i++) {
    const p = paths[i];
    if (isObjectSchema(currentSchema) && p in currentSchema.fields) {
      currentSchema = currentSchema.fields[p] as AnyObjectSchema;
    } else if (isIndex(p) && isArraySchema(currentSchema)) {
      currentSchema = currentSchema.innerType as AnyObjectSchema;
    }

    if (i === paths.length - 1) {
      return currentSchema.spec;
    }
  }

  return null;
}

function isObjectSchema(schema: unknown): schema is AnyObjectSchema {
  return isObject(schema) && schema.type === 'object';
}

function isArraySchema(schema: unknown): schema is ArraySchema<any, any> {
  return isObject(schema) && schema.type === 'array';
}
