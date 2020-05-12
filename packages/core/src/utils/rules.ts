import { Locator, GenericValidateFunction } from '../types';
import { RuleContainer } from '../extend';
import { includes, isObject, warn, isLocator } from './index';
import { isCallable } from '@vee-validate/shared';

/**
 * Normalizes the given rules expression.
 */
export function normalizeRules(rules: any): GenericValidateFunction | Record<string, any> {
  // if falsy value return an empty object.
  const acc: { [x: string]: any } = {};
  Object.defineProperty(acc, '_$$isNormalized', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  if (!rules) {
    return acc;
  }

  // If its a single validate function, leave as is.
  if (isCallable(rules)) {
    return rules;
  }

  // Object is already normalized, skip.
  if (isObject(rules) && rules._$$isNormalized) {
    return rules as typeof acc;
  }

  if (isObject(rules)) {
    return Object.keys(rules).reduce((prev, curr) => {
      const params = normalizeParams(rules[curr]);

      if (rules[curr] !== false) {
        prev[curr] = buildParams(curr, params);
      }

      return prev;
    }, acc);
  }

  /* istanbul ignore if */
  if (typeof rules !== 'string') {
    warn('rules must be either a string or an object.');
    return acc;
  }

  return rules.split('|').reduce((prev, rule) => {
    const parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }

    prev[parsedRule.name] = buildParams(parsedRule.name, parsedRule.params);

    return prev;
  }, acc);
}

/**
 * Normalizes a rule param.
 */
function normalizeParams(params: unknown) {
  if (params === true) {
    return [];
  }

  if (Array.isArray(params)) {
    return params;
  }

  if (isObject(params)) {
    return params;
  }

  return [params];
}

function buildParams(ruleName: string, provided: any[] | Record<string, any>) {
  const ruleSchema = RuleContainer.getRuleDefinition(ruleName);
  if (!ruleSchema) {
    return provided;
  }

  const params: Record<string, any> = {};
  if (!ruleSchema.params && !Array.isArray(provided)) {
    throw new Error('You provided an object params to a rule that has no defined schema.');
  }

  // Rule probably uses an array for their args, keep it as is.
  if (Array.isArray(provided) && !ruleSchema.params) {
    return provided;
  }

  let definedParams: string[];
  // collect the params schema.
  if (!ruleSchema.params || (ruleSchema.params.length < provided.length && Array.isArray(provided))) {
    let lastDefinedParam: string;
    // collect any additional parameters in the last item.
    definedParams = provided.map((_: any, idx: number) => {
      let param = ruleSchema.params?.[idx];
      lastDefinedParam = param || lastDefinedParam;
      if (!param) {
        param = lastDefinedParam;
      }

      return param;
    });
  } else {
    definedParams = ruleSchema.params;
  }

  // Match the provided array length with a temporary schema.
  for (let i = 0; i < definedParams.length; i++) {
    const param = definedParams[i];
    let value;
    // if the provided is an array, map element value.
    if (Array.isArray(provided)) {
      if (i in provided) {
        value = provided[i];
      }
    } else {
      // If the param exists in the provided object.
      if (param in provided) {
        value = provided[param];
        // if the provided is the first param value.
      } else if (definedParams.length === 1) {
        value = provided;
      }
    }

    // A target param using interpolation
    if (typeof value === 'string' && value[0] === '@') {
      value = createLocator(value.slice(1));
    }

    // already been set, probably multiple values.
    if (params[param]) {
      params[param] = Array.isArray(params[param]) ? params[param] : [params[param]];
      params[param].push(value);
      continue;
    }

    // set the value.
    params[param] = value;
  }

  return params;
}

/**
 * Parses a rule string expression.
 */
export const parseRule = (rule: string) => {
  let params: string[] = [];
  const name = rule.split(':')[0];

  if (includes(rule, ':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name, params };
};

function createLocator(value: string): Locator {
  const locator: Locator = (crossTable: Record<string, any>) => {
    const val = crossTable[value];

    return val;
  };

  locator.__locatorRef = value;

  return locator;
}

export function extractLocators(params: Record<string, string> | string[]): string[] {
  if (Array.isArray(params)) {
    return params.filter(isLocator);
  }

  return Object.keys(params)
    .filter(key => isLocator(params[key]))
    .map(key => params[key]);
}
