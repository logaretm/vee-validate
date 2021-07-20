import type { SchemaOf, ValidationError } from 'yup';
import { resolveRule } from './defineRule';
import { isLocator, normalizeRules, isYupValidator, keysOf, getFromPath } from './utils';
import { getConfig } from './config';
import { ValidationResult, GenericValidateFunction, YupValidator, FormValidationResult, RawFormSchema } from './types';
import { isCallable, FieldValidationMetaInfo } from '../../shared';

/**
 * Used internally
 */
interface FieldValidationContext {
  name: string;
  rules: GenericValidateFunction | YupValidator | string | Record<string, unknown>;
  bails: boolean;
  formData: Record<string, unknown>;
}

interface ValidationOptions {
  name?: string;
  values?: Record<string, unknown>;
  bails?: boolean;
}

/**
 * Validates a value against the rules.
 */
export async function validate(
  value: unknown,
  rules: string | Record<string, unknown | unknown[]> | GenericValidateFunction | YupValidator,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const shouldBail = options?.bails;
  const field: FieldValidationContext = {
    name: options?.name || '{field}',
    rules,
    bails: shouldBail ?? true,
    formData: options?.values || {},
  };

  const result = await _validate(field, value);
  const errors = result.errors;

  return {
    errors,
    valid: !errors.length,
  };
}

/**
 * Starts the validation process.
 */
async function _validate(field: FieldValidationContext, value: unknown) {
  if (isYupValidator(field.rules)) {
    return validateFieldWithYup(value, field.rules, { bails: field.bails });
  }

  // if a generic function, use it as the pipeline.
  if (isCallable(field.rules)) {
    const ctx = {
      field: field.name,
      form: field.formData,
      value: value,
    };

    const result = await field.rules(value, ctx);
    const isValid = typeof result !== 'string' && result;
    const message = typeof result === 'string' ? result : _generateFieldError(ctx);

    return {
      errors: !isValid ? [message] : [],
    };
  }

  const normalizedContext = {
    ...field,
    rules: normalizeRules(field.rules),
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

interface YupValidationOptions {
  bails: boolean;
}

/**
 * Handles yup validation
 */
async function validateFieldWithYup(value: unknown, validator: YupValidator, opts: Partial<YupValidationOptions>) {
  const errors = await validator
    .validate(value, {
      abortEarly: opts.bails ?? true,
    })
    .then(() => [])
    .catch((err: ValidationError) => {
      // Yup errors have a name prop one them.
      // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
      if (err.name === 'ValidationError') {
        return err.errors;
      }

      // re-throw the error so we don't hide it
      throw err;
    });

  return {
    errors,
  };
}

/**
 * Tests a single input value against a rule.
 */
async function _test(
  field: FieldValidationContext,
  value: unknown,
  rule: { name: string; params: Record<string, unknown> | unknown[] }
) {
  const validator = resolveRule(rule.name);
  if (!validator) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }

  const params = fillTargetValues(rule.params, field.formData);
  const ctx: FieldValidationMetaInfo = {
    field: field.name,
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

  return Object.keys(params).reduce((acc, param) => {
    acc[param] = normalize(params[param]);

    return acc;
  }, {} as Record<string, unknown>);
}

export async function validateYupSchema<TValues>(
  schema: SchemaOf<TValues>,
  values: TValues
): Promise<FormValidationResult<TValues>> {
  const errorObjects: ValidationError[] = await (schema as YupValidator)
    .validate(values, { abortEarly: false })
    .then(() => [])
    .catch((err: ValidationError) => {
      // Yup errors have a name prop one them.
      // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
      if (err.name !== 'ValidationError') {
        throw err;
      }

      // list of aggregated errors
      return err.inner || [];
    });

  const results: Partial<Record<keyof TValues, ValidationResult>> = {};
  const errors: Partial<Record<keyof TValues, string>> = {};
  for (const error of errorObjects) {
    const messages = error.errors;
    results[error.path as keyof TValues] = { valid: !messages.length, errors: messages };
    if (messages.length) {
      errors[error.path as keyof TValues] = messages[0];
    }
  }

  return {
    valid: !errorObjects.length,
    results,
    errors,
  };
}

export async function validateObjectSchema<TValues>(
  schema: RawFormSchema<TValues>,
  values: TValues,
  opts?: Partial<{ names: Record<string, string>; bailsMap: Record<string, boolean> }>
): Promise<FormValidationResult<TValues>> {
  const paths = keysOf(schema) as string[];
  const validations = paths.map(async path => {
    const fieldResult = await validate(getFromPath(values as any, path), schema[path as keyof TValues], {
      name: opts?.names?.[path] || path,
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

  const results: Partial<Record<keyof TValues, ValidationResult>> = {};
  const errors: Partial<Record<keyof TValues, string>> = {};
  for (const result of validationResults) {
    results[result.path as keyof TValues] = {
      valid: result.valid,
      errors: result.errors,
    };

    if (!result.valid) {
      isAllValid = false;
      errors[result.path as keyof TValues] = result.errors[0];
    }
  }

  return {
    valid: isAllValid,
    results,
    errors,
  };
}
