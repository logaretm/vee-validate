import { resolveRule } from './defineRule';
import { klona as deepCopy } from 'klona/full';
import { isLocator, normalizeRules, keysOf, getFromPath, isTypedSchema, isYupValidator } from './utils';
import { getConfig } from './config';
import {
  ValidationResult,
  GenericValidateFunction,
  TypedSchema,
  FlattenAndMapPathsValidationResult,
  FormValidationResult,
  RawFormSchema,
  YupSchema,
  GenericObject,
  TypedSchemaError,
  Path,
  TypedSchemaContext,
} from './types';
import { isCallable, FieldValidationMetaInfo } from '../../shared';

/**
 * Used internally
 */
interface FieldValidationContext<TInput = unknown, TOutput = TInput> {
  name: string;
  label?: string;
  rules:
    | GenericValidateFunction<TInput>
    | GenericValidateFunction<TInput>[]
    | TypedSchema<TInput, TOutput>
    | string
    | Record<string, unknown>;
  bails: boolean;
  formData: Record<string, unknown>;
}

interface ValidationOptions {
  name?: string;
  label?: string;
  values?: Record<string, unknown>;
  bails?: boolean;
}

/**
 * Validates a value against the rules.
 */
export async function validate<TInput, TOutput>(
  value: TInput,
  rules:
    | string
    | Record<string, unknown | unknown[]>
    | GenericValidateFunction<TInput>
    | GenericValidateFunction<TInput>[]
    | TypedSchema<TInput, TOutput>,
  options: ValidationOptions = {},
): Promise<ValidationResult<TOutput>> {
  const shouldBail = options?.bails;
  const field: FieldValidationContext<TInput, TOutput> = {
    name: options?.name || '{field}',
    rules,
    label: options?.label,
    bails: shouldBail ?? true,
    formData: options?.values || {},
  };

  const result = await _validate(field, value);

  return {
    ...result,
    valid: !result.errors.length,
  };
}

/**
 * Starts the validation process.
 */
async function _validate<TInput = unknown, TOutput = TInput>(
  field: FieldValidationContext<TInput, TOutput>,
  value: TInput,
) {
  const rules = field.rules;
  if (isTypedSchema(rules) || isYupValidator(rules)) {
    return validateFieldWithTypedSchema(value, { ...field, rules });
  }

  // if a generic function or chain of generic functions
  if (isCallable(rules) || Array.isArray(rules)) {
    const ctx = {
      field: field.label || field.name,
      name: field.name,
      label: field.label,
      form: field.formData,
      value,
    };

    // Normalize the pipeline
    const pipeline = Array.isArray(rules) ? rules : [rules];
    const length = pipeline.length;
    const errors: ReturnType<typeof _generateFieldError>[] = [];

    for (let i = 0; i < length; i++) {
      const rule = pipeline[i];
      const result = await rule(value, ctx);
      const isValid = typeof result !== 'string' && !Array.isArray(result) && result;
      if (isValid) {
        continue;
      }

      if (Array.isArray(result)) {
        errors.push(...result);
      } else {
        const message = typeof result === 'string' ? result : _generateFieldError(ctx);
        errors.push(message);
      }

      if (field.bails) {
        return {
          errors,
        };
      }
    }

    return {
      errors,
    };
  }

  const normalizedContext = {
    ...field,
    rules: normalizeRules(rules),
  };
  const errors: ReturnType<typeof _generateFieldError>[] = [];
  const rulesKeys = Object.keys(normalizedContext.rules);
  const length = rulesKeys.length;
  for (let i = 0; i < length; i++) {
    const rule = rulesKeys[i];
    const result = await _test(normalizedContext, value, {
      name: rule,
      params: normalizedContext.rules[rule],
    });

    if (result.error) {
      errors.push(result.error);
      if (field.bails) {
        return {
          errors,
        };
      }
    }
  }

  return {
    errors,
  };
}

interface YupError {
  name: 'ValidationError';
  path?: string;
  errors: string[];
  inner: { path?: string; errors: string[] }[];
}

function isYupError(err: unknown): err is YupError {
  return !!err && (err as any).name === 'ValidationError';
}

function yupToTypedSchema(yupSchema: YupSchema): TypedSchema {
  const schema: TypedSchema = {
    __type: 'VVTypedSchema',
    async parse(values: any, context?: TypedSchemaContext) {
      try {
        const output = await yupSchema.validate(values, { abortEarly: false, context: context?.formData || {} });

        return {
          output,
          errors: [],
        };
      } catch (err: unknown) {
        // Yup errors have a name prop one them.
        // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
        if (!isYupError(err)) {
          throw err;
        }

        if (!err.inner?.length && err.errors.length) {
          return { errors: [{ path: err.path, errors: err.errors }] };
        }

        const errors: Record<string, TypedSchemaError> = err.inner.reduce(
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

        return { errors: Object.values(errors) };
      }
    },
  };

  return schema;
}

/**
 * Handles yup validation
 */
async function validateFieldWithTypedSchema(
  value: unknown,
  context: FieldValidationContext<any> & { rules: TypedSchema | YupSchema },
) {
  const typedSchema = isTypedSchema(context.rules) ? context.rules : yupToTypedSchema(context.rules);
  const result = await typedSchema.parse(value, { formData: context.formData });

  const messages: string[] = [];
  for (const error of result.errors) {
    if (error.errors.length) {
      messages.push(...error.errors);
    }
  }

  return {
    value: result.value,
    errors: messages,
  };
}

/**
 * Tests a single input value against a rule.
 */
async function _test(
  field: FieldValidationContext,
  value: unknown,
  rule: { name: string; params: Record<string, unknown> | unknown[] },
) {
  const validator = resolveRule(rule.name);
  if (!validator) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }

  const params = fillTargetValues(rule.params, field.formData);
  const ctx: FieldValidationMetaInfo = {
    field: field.label || field.name,
    name: field.name,
    label: field.label,
    value,
    form: field.formData,
    rule: {
      ...rule,
      params,
    },
  };

  const result = await validator(value, params, ctx);

  if (typeof result === 'string') {
    return {
      error: result,
    };
  }

  return {
    error: result ? undefined : _generateFieldError(ctx),
  };
}

/**
 * Generates error messages.
 */
function _generateFieldError(fieldCtx: FieldValidationMetaInfo) {
  const message = getConfig().generateMessage;
  if (!message) {
    return 'Field is invalid';
  }

  return message(fieldCtx);
}

function fillTargetValues(params: unknown[] | Record<string, unknown>, crossTable: Record<string, unknown>) {
  const normalize = (value: unknown) => {
    if (isLocator(value)) {
      return value(crossTable);
    }

    return value;
  };

  if (Array.isArray(params)) {
    return params.map(normalize);
  }

  return Object.keys(params).reduce(
    (acc, param) => {
      acc[param] = normalize(params[param]);

      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export async function validateTypedSchema<TValues extends GenericObject, TOutput extends GenericObject = TValues>(
  schema: TypedSchema<TValues> | YupSchema<TValues>,
  values: TValues,
): Promise<FormValidationResult<TValues, TOutput>> {
  const typedSchema = isTypedSchema(schema) ? schema : yupToTypedSchema(schema);
  const validationResult = await typedSchema.parse(deepCopy(values), { formData: deepCopy(values) });

  const results: Partial<FlattenAndMapPathsValidationResult<TValues, TOutput>> = {};
  const errors: Partial<Record<Path<TValues>, string>> = {};
  for (const error of validationResult.errors) {
    const messages = error.errors;
    // Fixes issue with path mapping with Yup 1.0 including quotes around array indices
    const path = (error.path || '').replace(/\["(\d+)"\]/g, (_, m) => {
      return `[${m}]`;
    }) as Path<TValues>;

    results[path] = { valid: !messages.length, errors: messages };
    if (messages.length) {
      errors[path] = messages[0];
    }
  }

  return {
    valid: !validationResult.errors.length,
    results,
    errors,
    values: validationResult.value,
    source: 'schema',
  };
}

export async function validateObjectSchema<TValues extends GenericObject, TOutput extends GenericObject>(
  schema: RawFormSchema<TValues>,
  values: TValues | undefined,
  opts?: Partial<{ names: Record<string, { name: string; label: string }>; bailsMap: Record<string, boolean> }>,
): Promise<FormValidationResult<TValues, TOutput>> {
  const paths = keysOf(schema) as Path<TValues>[];
  const validations = paths.map(async path => {
    const strings = opts?.names?.[path];
    const fieldResult = await validate(getFromPath(values as any, path), schema[path], {
      name: strings?.name || path,
      label: strings?.label,
      values: values as any,
      bails: opts?.bailsMap?.[path] ?? true,
    });

    return {
      ...fieldResult,
      path,
    };
  });

  let isAllValid = true;
  const validationResults = await Promise.all(validations);

  const results: Partial<FlattenAndMapPathsValidationResult<TValues, TOutput>> = {};
  const errors: Partial<Record<Path<TValues>, string>> = {};
  for (const result of validationResults) {
    results[result.path] = {
      valid: result.valid,
      errors: result.errors,
    };

    if (!result.valid) {
      isAllValid = false;
      errors[result.path] = result.errors[0];
    }
  }

  return {
    valid: isAllValid,
    results,
    errors,
    source: 'schema',
  };
}
