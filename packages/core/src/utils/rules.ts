import { Locator, GenericValidateFunction } from '../types';
import { isLocator } from './assertions';
import { isCallable, isObject } from '../../../shared';

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
        prev[curr] = buildParams(params);
      }

      return prev;
    }, acc);
  }

  /* istanbul ignore if */
  if (typeof rules !== 'string') {
    return acc;
  }

  return rules.split('|').reduce((prev, rule) => {
    const parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }

    prev[parsedRule.name] = buildParams(parsedRule.params);

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

function buildParams(provided: any[] | Record<string, any>) {
  const mapValueToLocator = (value: unknown) => {
    // A target param using interpolation
    if (typeof value === 'string' && value[0] === '@') {
      return createLocator(value.slice(1));
    }

    return value;
  };

  if (Array.isArray(provided)) {
    return provided.map(mapValueToLocator);
  }

  return Object.keys(provided).reduce((prev, key) => {
    prev[key] = mapValueToLocator(provided[key]);

    return prev;
  }, {} as Record<string, any>);
}

/**
 * Parses a rule string expression.
 */
export const parseRule = (rule: string) => {
  let params: string[] = [];
  const name = rule.split(':')[0];

  if (rule.includes(':')) {
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
