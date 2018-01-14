// @flow

/**
 * Gets the data attribute. the name must be kebab-case.
 */
export const getDataAttribute = (el: HTMLElement, name: string) => el.getAttribute(`data-vv-${name}`);

/**
 * Checks if the value is either null or undefined.
 */
export const isNullOrUndefined = (value: mixed): boolean => {
  return value === null || value === undefined;
};

/**
 * Sets the data attribute.
 */
export const setDataAttribute = (el: HTMLElement, name: string, value: string): void => el.setAttribute(`data-vv-${name}`, value);

/**
 * Creates the default flags object.
 */
export const createFlags = (): Object => ({
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: null,
  invalid: null,
  validated: false,
  pending: false,
  required: false
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
    return Object.keys(lhs).every(key => {
      return isEqual(lhs[key], rhs[key]);
    }) && Object.keys(rhs).every(key => {
      return isEqual(lhs[key], rhs[key]);
    });
  }

  return lhs === rhs;
};

/**
 * Determines the input field scope.
 */
export const getScope = (el: HTMLInputElement) => {
  let scope = getDataAttribute(el, 'scope');
  if (isNullOrUndefined(scope) && el.form) {
    scope = getDataAttribute(el.form, 'scope');
  }

  return !isNullOrUndefined(scope) ? scope : null;
};

/**
 * Gets the value in an object safely.
 */
export const getPath = (path: string, target: ?Object, def: any = undefined) => {
  if (!path || !target) return def;

  let value = target;
  path.split('.').every(prop => {
    if (! Object.prototype.hasOwnProperty.call(value, prop) && value[prop] === undefined) {
      value = def;

      return false;
    }

    value = value[prop];

    return true;
  });

  return value;
};

/**
 * Checks if path exists within an object.
 */
export const hasPath = (path: string, target: Object) => {
  let obj = target;
  return path.split('.').every(prop => {
    if (! Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }

    obj = obj[prop];

    return true;
  });
};

/**
 * Parses a rule string expression.
 */
export const parseRule = (rule: string): Object => {
  let params = [];
  const name = rule.split(':')[0];

  if (~rule.indexOf(':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name, params };
};

/**
 * Debounces a function.
 */
export const debounce = (fn: () => any, wait: number = 0, immediate: boolean = false) => {
  if (wait === 0) {
    return fn;
  }

  let timeout;

  return (...args: any[]) => {
    const later = () => {
      timeout = null;
      if (!immediate) fn(...args);
    };
    /* istanbul ignore next */
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    /* istanbul ignore next */
    if (callNow) fn(...args);
  };
};

/**
 * Normalizes the given rules expression.
 */
export const normalizeRules = (rules: string | { [string]: boolean | any[] }) => {
  // if falsy value return an empty object.
  if (!rules) {
    return {};
  }

  if (isObject(rules)) {
    // $FlowFixMe
    return Object.keys(rules).reduce((prev, curr) => {
      let params = [];
      // $FlowFixMe
      if (rules[curr] === true) {
        params = [];
      } else if (Array.isArray(rules[curr])) {
        params = rules[curr];
      } else {
        params = [rules[curr]];
      }

      // $FlowFixMe
      if (rules[curr] !== false) {
        prev[curr] = params;
      }

      return prev;
    }, {});
  }

  if (typeof rules !== 'string') {
    warn('rules must be either a string or an object.');
    return {};
  }

  return rules.split('|').reduce((prev, rule) => {
    const parsedRule = parseRule(rule);
    if (!parsedRule.name) {
      return prev;
    }

    prev[parsedRule.name] = parsedRule.params;
    return prev;
  }, {});
};

/**
 * Emits a warning to the console.
 */
export const warn = (message: string) => {
  console.warn(`[vee-validate] ${message}`); // eslint-disable-line
};

/**
 * Creates a branded error object.
 */
export const createError = (message: string): Error => new Error(`[vee-validate] ${message}`);

/**
 * Checks if the value is an object.
 */
export const isObject = (obj: any): boolean => obj !== null && obj && typeof obj === 'object' && ! Array.isArray(obj);

/**
 * Checks if a function is callable.
 */
export const isCallable = (func: any): boolean => typeof func === 'function';

/**
 * Check if element has the css class on it.
 */
export const hasClass = (el: HTMLElement, className: string) => {
  if (el.classList) {
    return el.classList.contains(className);
  }

  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

/**
 * Adds the provided css className to the element.
 */
export const addClass = (el: HTMLElement, className: string) => {
  if (el.classList) {
    el.classList.add(className);
    return;
  }

  if (!hasClass(el, className)) {
    el.className += ` ${className}`;
  }
};

/**
 * Remove the provided css className from the element.
 */
export const removeClass = (el: HTMLElement, className: string) => {
  if (el.classList) {
    el.classList.remove(className);
    return;
  }

  if (hasClass(el, className)) {
    const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
    el.className = el.className.replace(reg, ' ');
  }
};

/**
 * Adds or removes a class name on the input depending on the status flag.
 */
export const toggleClass = (el: ?HTMLElement, className: ?string, status: boolean) => {
  if (!el || !className) return;

  if (status) {
    return addClass(el, className);
  }

  removeClass(el, className);
};

/**
 * Converts an array-like object to array, provides a simple polyfill for Array.from
 */
export const toArray = (arrayLike: { length: number }) => {
  if (isCallable(Array.from)) {
    return Array.from(arrayLike);
  }

  const array = [];
  const length = arrayLike.length;
  for (let i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  return array;
};

/**
 * Assign polyfill from the mdn.
 */
export const assign = (target: Object, ...others: any[]) => {
  /* istanbul ignore else */
  if (isCallable(Object.assign)) {
    return Object.assign(target, ...others);
  }

  /* istanbul ignore next */
  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  /* istanbul ignore next */
  const to = Object(target);
  /* istanbul ignore next */
  others.forEach(arg => {
    // Skip over if undefined or null
    if (arg != null) {
      Object.keys(arg).forEach(key => {
        to[key] = arg[key];
      });
    }
  });
  /* istanbul ignore next */
  return to;
};

let id = 0;
let idTemplate = '{id}';

/**
 * Generates a unique id.
 */
export const uniqId = (): string => {
  // handle too many uses of uniqId, although unlikely.
  if (id >= 9999) {
    id = 0;
    // shift the template.
    idTemplate = idTemplate.replace('{id}', '_{id}');
  }

  id++;
  const newId = idTemplate.replace('{id}', String(id));

  return newId;
};

/**
 * finds the first element that satisfies the predicate callback, polyfills array.find
 */
export const find = (arrayLike: { length: number }, predicate: (any) => boolean): any => {
  const array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }

  return undefined;
};

/**
 * Returns a suitable event name for the input element.
 */
export const getInputEventName = (el: HTMLInputElement) => {
  if (el && (el.tagName === 'SELECT' || ~['radio', 'checkbox', 'file'].indexOf(el.type))) {
    return 'change';
  }

  return 'input';
};

export const isBuiltInComponent = (vnode: Object): boolean => {
  if (!vnode) {
    return false;
  }

  const tag = vnode.componentOptions.tag;

  return /keep-alive|transition|transition-group/.test(tag);
};

export const makeEventsArray = (events: string) => {
  return (typeof events === 'string' && events.length) ? events.split('|') : [];
};

export const makeDelayObject = (events: string[], delay: Object | number, delayConfig: Object | number) => {
  if (typeof delay === 'number') {
    return events.reduce((prev, e) => {
      prev[e] = delay;
      return prev;
    }, {});
  }

  return events.reduce((prev, e) => {
    if (typeof delay === 'object' && e in delay) {
      prev[e] = delay[e];
      return prev;
    }

    if (typeof delayConfig === 'number') {
      prev[e] = delayConfig;
      return prev;
    }

    prev[e] = (delayConfig && delayConfig[e]) || 0;

    return prev;
  }, {});
};

export const deepParseInt = (input: Object | string | number) => {
  if (typeof input === 'number') return input;

  if (typeof input === 'string') return parseInt(input);

  const map = {};
  for (const element in input) {
    map[element] = parseInt(input[element]);
  }

  return map;
};

export const merge = (target: MapObject, source: MapObject): MapObject => {
  if (! (isObject(target) && isObject(source))) {
    return target;
  }

  Object.keys(source).forEach((key: string) => {
    if (isObject(source[key])) {
      if (! target[key]) {
        assign(target, { [key]: {} });
      }

      merge(target[key], source[key]);
      return;
    }

    assign(target, { [key]: source[key] });
  });

  return target;
};
