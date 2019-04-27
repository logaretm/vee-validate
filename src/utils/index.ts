import { ValidationFlags } from '../types';
import { ValidationClassMap } from '../config';

export const isValidDate = (value: unknown): value is Date => {
  const valueAsDate = value as any;
  if (valueAsDate && isCallable(valueAsDate.getTime)) {
    return !isNaN(valueAsDate.getTime());
  }

  return false;
};

/**
 * Gets the data attribute. the name must be kebab-case.
 */
export const getDataAttribute = (el: HTMLElement, name: string) => el.getAttribute(`data-vv-${name}`);

export const isNaN = (value: unknown) => {
  // NaN is the one value that does not equal itself.
  return value !== value;
};

/**
 * Checks if the values are either null or undefined.
 */
export const isNullOrUndefined = (value: unknown): value is undefined | null => {
  return value === null || value === undefined;
};

/**
 * Creates the default flags object.
 */
export const createFlags = (): ValidationFlags => ({
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: false,
  invalid: false,
  validated: false,
  pending: false,
  required: false,
  changed: false
});

/**
 * Shallow object comparison.
 */
export const isEqual = (lhs: any, rhs: any): boolean => {
  if (lhs instanceof RegExp && rhs instanceof RegExp) {
    return isEqual(lhs.source, rhs.source) && isEqual(lhs.flags, rhs.flags);
  }

  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    if (lhs.length !== rhs.length) return false;

    for (let i = 0; i < lhs.length; i++) {
      if (!isEqual(lhs[i], rhs[i])) {
        return false;
      }
    }

    return true;
  }

  // if both are objects, compare each key recursively.
  if (isObject(lhs) && isObject(rhs)) {
    return (
      Object.keys(lhs).every(key => {
        return isEqual(lhs[key], rhs[key]);
      }) &&
      Object.keys(rhs).every(key => {
        return isEqual(lhs[key], rhs[key]);
      })
    );
  }

  if (isNaN(lhs) && isNaN(rhs)) {
    return true;
  }

  return lhs === rhs;
};

/**
 * Gets the value in an object safely.
 */
export const getPath = (path: string, target: any, def: any = undefined) => {
  if (!path || !target) return def;

  let value = target;
  path.split('.').every(prop => {
    if (prop in value) {
      value = value[prop];

      return true;
    }

    value = def;

    return false;
  });

  return value;
};

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

/**
 * Debounces a function.
 */
export const debounce = (fn: Function, wait = 0, token = { cancelled: false }) => {
  if (wait === 0) {
    return fn;
  }

  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: any[]) => {
    const later = () => {
      timeout = undefined;

      // check if the fn call was cancelled.
      if (!token.cancelled) fn(...args);
    };

    // because we might want to use Node.js setTimout for SSR.
    clearTimeout(timeout as any);
    timeout = setTimeout(later, wait) as any;
    if (!timeout) fn(...args);
  };
};

/**
 * Normalizes the given rules expression.
 */
export const normalizeRules = (rules: any) => {
  // if falsy value return an empty object.
  const acc: { [x: string]: any[] } = {};
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
        prev[curr] = params;
      }

      return prev;
    }, acc);
  }

  if (typeof rules !== 'string') {
    warn('rules must be either a string or an object.');
    return acc;
  }

  return rules.split('|').reduce((prev, rule) => {
    const parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }

    prev[parsedRule.name] = parsedRule.params;
    return prev;
  }, acc);
};

/**
 * Emits a warning to the console.
 */
export const warn = (message: string) => {
  console.warn(`[vee-validate] ${message}`);
};

/**
 * Checks if the value is an object.
 */
export const isObject = (obj: unknown): obj is { [x: string]: any } =>
  obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj);

export function identity<T>(x: T) {
  return x;
}
/**
 * Checks if a function is callable.
 */
export const isCallable = (func: unknown): func is CallableFunction => typeof func === 'function';

export function computeClassObj(names: ValidationClassMap, flags: ValidationFlags) {
  const acc: { [k: string]: boolean } = {};
  const keys = Object.keys(flags);
  const length = keys.length;
  for (let i = 0; i < length; i++) {
    const flag = keys[i];
    const className = (names && names[flag]) || flag;
    const value = flags[flag];
    if (isNullOrUndefined(value)) {
      continue;
    }

    if ((flag === 'valid' || flag === 'invalid') && !flags.validated) {
      continue;
    }

    if (typeof className === 'string') {
      acc[className] = value;
    } else if (Array.isArray(className)) {
      className.forEach(cls => {
        acc[cls] = value;
      });
    }
  }

  return acc;
}

/**
 * Converts an array-like object to array, provides a simple polyfill for Array.from
 */
export function toArray<T>(arrayLike: ArrayLike<T>): T[] {
  if (isCallable(Array.from)) {
    return Array.from(arrayLike);
  }

  const array = [];
  const length = arrayLike.length;
  /* istanbul ignore next */
  for (let i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  /* istanbul ignore next */
  return array;
}

export function findIndex<T>(arrayLike: ArrayLike<T>, predicate: (item: T) => boolean): number {
  const array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return i;
    }
  }

  return -1;
}

/**
 * finds the first element that satisfies the predicate callback, polyfills array.find
 */
export function find<T>(arrayLike: ArrayLike<T>, predicate: (item: T) => boolean): T | undefined {
  const array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  const idx = findIndex(array, predicate);

  return idx === -1 ? undefined : array[idx];
}

export const merge = (target: any, source: any) => {
  if (!(isObject(target) && isObject(source))) {
    return target;
  }

  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }

      merge(target[key], source[key]);
      return;
    }

    target[key] = source[key];
  });

  return target;
};

export function values<T>(obj: { [x: string]: T }): T[] {
  if (isCallable(Object.values)) {
    return Object.values(obj);
  }

  // fallback to keys()
  /* istanbul ignore next */
  return Object.keys(obj).map(k => obj[k]);
}

export const includes = (collection: any[] | string, item: any) => {
  return collection.indexOf(item) !== -1;
};

export const isEmptyArray = (arr: any[]): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};

export const defineNonReactive = (obj: any, prop: string, value: any) => {
  Object.defineProperty(obj, prop, {
    configurable: false,
    writable: true,
    value
  });
};
