import { Locator, RuleParamConfig } from '../types';
import { RuleContainer } from '../extend';
import { includes, isObject, warn, isLocator } from './index';

/**
 * Normalizes the given rules expression.
 */
export function normalizeRules(rules: any) {
  // if falsy value return an empty object.
  const acc: { [x: string]: any } = {};
  Object.defineProperty(acc, '_$$isNormalized', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });

  if (!rules) {
    return acc;
  }

  // Object is already normalized, skip.
  if (isObject(rules) && rules._$$isNormalized) {
    return rules as typeof acc;
  }

  if (isObject(rules)) {
    return Object.keys(rules).reduce((prev, curr) => {
      let params = [];
      if (rules[curr] === true) {
        params = [];
      } else if (Array.isArray(rules[curr])) {
        params = rules[curr];
      } else if (isObject(rules[curr])) {
        params = rules[curr];
      } else {
        params = [rules[curr]];
      }

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

  let definedParams: RuleParamConfig[];
  // collect the params schema.
  if (!ruleSchema.params || (ruleSchema.params.length < provided.length && Array.isArray(provided))) {
    let lastDefinedParam: RuleParamConfig;
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
    const options = definedParams[i];
    let value = options.default;
    // if the provided is an array, map element value.
    if (Array.isArray(provided)) {
      if (i in provided) {
        value = provided[i];
      }
    } else {
      // If the param exists in the provided object.
      if (options.name in provided) {
        value = provided[options.name];
        // if the provided is the first param value.
      } else if (definedParams.length === 1) {
        value = provided;
      }
    }

    // if the param is a target, resolve the target value.
    if (options.isTarget) {
      value = createLocator(value, options.cast);
    }

    // A target param using interpolation
    if (typeof value === 'string' && value[0] === '@') {
      value = createLocator(value.slice(1), options.cast);
    }

    // If there is a transformer defined.
    if (!isLocator(value) && options.cast) {
      value = options.cast(value);
    }

    // already been set, probably multiple values.
    if (params[options.name]) {
      params[options.name] = Array.isArray(params[options.name]) ? params[options.name] : [params[options.name]];
      params[options.name].push(value);
    } else {
      // set the value.
      params[options.name] = value;
    }
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
    params = rule
      .split(':')
      .slice(1)
      .join(':')
      .split(',');
  }

  return { name, params };
};

function createLocator(value: string, castFn?: Function): Locator {
  const locator: Locator = (crossTable: Record<string, any>) => {
    const val = crossTable[value];

    return castFn ? castFn(val) : val;
  };

  locator.__locatorRef = value;

  return locator;
}

export function extractLocators(params: Record<string, string> | string[]): (string | Locator)[] {
  if (Array.isArray(params)) {
    return params.filter(param => {
      return isLocator(param) || (typeof param === 'string' && param[0] === '@');
    });
  }

  return Object.keys(params)
    .filter(key => isLocator(params[key]))
    .map(key => params[key]);
}
