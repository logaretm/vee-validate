import type { ValidationError } from 'yup';
import { resolveRule } from './defineRule';
import { isLocator, normalizeRules, isYupValidator } from './utils';
import { getConfig } from './config';
import { ValidationResult, GenericValidateFunction } from './types';
import { isCallable, FieldContext } from '../../shared';

/**
 * Used internally
 */
interface FieldValidationContext {
  name: string;
  rules: Record<string, any>;
  bails: boolean;
  formData: Record<string, any>;
}

interface ValidationOptions {
  name?: string;
  values?: Record<string, any>;
  bails?: boolean;
  skipIfEmpty?: boolean;
  isInitial?: boolean;
}

/**
 * Validates a value against the rules.
 */
export async function validate(
  value: any,
  rules: string | Record<string, any> | GenericValidateFunction,
  options: ValidationOptions = {}
): Promise<ValidationResult> {
  const shouldBail = options?.bails;
  const field: FieldValidationContext = {
    name: options?.name || '{field}',
    rules: normalizeRules(rules),
    bails: shouldBail ?? true,
    formData: options?.values || {},
  };

  const result = await _validate(field, value);
  const errors = result.errors;

  return {
    errors,
  };
}

/**
 * Starts the validation process.
 */
async function _validate(field: FieldValidationContext, value: any) {
  if (isYupValidator(field.rules)) {
    return validateFieldWithYup(field, value);
  }

  // if a generic function, use it as the pipeline.
  if (isCallable(field.rules)) {
    const result = await field.rules(value);
    const isValid = typeof result !== 'string' && result;
    const message =
      typeof result === 'string'
        ? result
        : _generateFieldError({
            field: field.name,
            value,
            form: field.formData,
          });

    return {
      errors: !isValid ? [message] : [],
    };
  }

  const errors: ReturnType<typeof _generateFieldError>[] = [];
  const rules = Object.keys(field.rules);
  const length = rules.length;
  for (let i = 0; i < length; i++) {
    const rule = rules[i];
    const result = await _test(field, value, {
      name: rule,
      params: field.rules[rule],
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

/**
 * Handles yup validation
 */
async function validateFieldWithYup(field: FieldValidationContext, value: any) {
  const errors = await field.rules
    .validate(value, {
      abortEarly: field.bails,
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
async function _test(field: FieldValidationContext, value: any, rule: { name: string; params: Record<string, any> }) {
  const validator = resolveRule(rule.name);
  if (!validator) {
    throw new Error(`No such validator '${rule.name}' exists.`);
  }

  const params = fillTargetValues(rule.params, field.formData);
  const ctx: FieldContext = {
    field: field.name,
    value,
    form: field.formData,
    rule,
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
function _generateFieldError(fieldCtx: FieldContext) {
  const message = getConfig().generateMessage;

  return message(fieldCtx);
}

function fillTargetValues(params: any[] | Record<string, any>, crossTable: Record<string, any>) {
  const normalize = (value: any) => {
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
  }, {} as Record<string, any>);
}
