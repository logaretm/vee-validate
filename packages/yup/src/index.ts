import {
  AnyObjectSchema,
  ArraySchema,
  InferType,
  reach,
  Schema,
  SchemaDescription,
  TupleSchema,
  ValidateOptions,
  ValidationError,
} from 'yup';
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
    describe(path, values) {
      try {
        if (!path) {
          if (values && yupSchema.conditions?.length > 0) {
            return getDescriptionFromYupDescription(yupSchema.describe({ value: values }));
          }
          return getDescriptionFromYupSpec(yupSchema.spec);
        }

        const pathSchema = reach(yupSchema, path);

        if (pathSchema) {
          if (isSchema(pathSchema)) {
            if (pathSchema.conditions?.length > 0) {
              const description = pathSchema.describe({ value: values });
              return getDescriptionFromYupDescription(description);
            }
            return getDescriptionFromYupSpec(pathSchema.spec);
          }
        }

        const description = getSpecForPath(path, yupSchema);
        if (!description) {
          return {
            required: false,
            exists: false,
          };
        }

        return getDescriptionFromYupSpec(description);
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

function getDescriptionFromYupSpec(spec: AnyObjectSchema['spec']): TypedSchemaPathDescription {
  return {
    required: !spec.optional,
    exists: true,
  };
}

function getDescriptionFromYupDescription(description: SchemaDescription): TypedSchemaPathDescription {
  return {
    required: !description.optional,
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
    } else if (isTupleSchema(currentSchema) && isIndex(p)) {
      currentSchema = currentSchema.spec.types[Number(p)] as AnyObjectSchema;
    } else if (isIndex(p) && isArraySchema(currentSchema)) {
      currentSchema = currentSchema.innerType as AnyObjectSchema;
    }

    if (i === paths.length - 1) {
      return currentSchema.spec;
    }
  }

  return null;
}

function isTupleSchema(schema: unknown): schema is TupleSchema<any, any> {
  return isObject(schema) && schema.type === 'tuple';
}

function isObjectSchema(schema: unknown): schema is AnyObjectSchema {
  return isObject(schema) && schema.type === 'object';
}

function isArraySchema(schema: unknown): schema is ArraySchema<any, any> {
  return isObject(schema) && schema.type === 'array';
}

function isSchema(schema: unknown): schema is Schema<never, never, never, never> {
  return isObject(schema) && !!schema.type && schema.type !== 'lazy';
}
