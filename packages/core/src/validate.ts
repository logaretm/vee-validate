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
  skipIfEmpty: boolean;
  forceRequired: boolean;
  crossTable: Record<string, any>;
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
  const skipIfEmpty = options?.skipIfEmpty;
  const field: FieldValidationContext = {
    name: options?.name || '{field}',
    rules: normalizeRules(rules),
    bails: shouldBail ?? true,
    skipIfEmpty: skipIfEmpty ?? true,
    forceRequired: false,
    crossTable: options?.values || {},
  };

  const result = await _validate(field, value);
  const errors: string[] = [];
  result.errors.forEach(e => {
    const msg = e.msg;
    errors.push(msg);
  });

  return {
    valid: result.valid,
    errors,
  };
}

/**
 * Starts the validation process.
 */
async function _validate(field: FieldValidationContext, value: any) {
  // if a generic function, use it as the pipeline.
  if (isCallable(field.rules)) {
    const result = await field.rules(value);
    const isValid = typeof result !== 'string' && result;

    return {
      valid: isValid,
      errors: !isValid ? [{ msg: result, rule: '' }] : [],
    };
  }

  if (isYupValidator(field.rules)) {
    return validateFieldWithYup(field, value);
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

    if (!result.valid && result.error) {
      errors.push(result.error);
      if (field.bails) {
        return {
          valid: false,
          errors,
        };
      }
    }
  }

  return {
    valid: !errors.length,
    errors,
  };
}

/**
 * Handles yup validation
 */
async function validateFieldWithYup(field: FieldValidationContext, value: any) {
  const result = await field.rules
    .validate(value)
    .then(() => true)
    .catch((err: Error) => {
      // Yup errors have a name prop one them.
      // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
      if (err.name === 'ValidationError') {
        return err.message;
      }

      // re-throw the error so we don't hide it
      throw err;
    });

  const isValid = typeof result !== 'string' && result;

  return {
    valid: isValid,
    errors: !isValid ? [{ msg: result, rule: '' }] : [],
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

  const params = fillTargetValues(rule.params, field.crossTable);
  const ctx: FieldContext = {
    field: field.name,
    value,
    form: field.crossTable,
    rule,
  };

  const result = await validator(value, params, ctx);

  if (typeof result === 'string') {
    return {
      valid: false,
      error: { rule: rule.name, msg: result },
    };
  }

  return {
    valid: result,
    error: result ? undefined : _generateFieldError(ctx),
  };
}

/**
 * Generates error messages.
 */
function _generateFieldError(fieldCtx: FieldContext) {
  const message = getConfig().defaultMessage;

  return {
    msg: message(fieldCtx),
    rule: fieldCtx.rule.name,
  };
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
