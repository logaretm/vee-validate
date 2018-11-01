// @flow

export const isTextInput = (el: HTMLInputElement) => {
  return includes(['text', 'password', 'search', 'email', 'tel', 'url', 'textarea', 'number'], el.type);
};

export const isCheckboxOrRadioInput = (el: HTMLInputElement) => {
  return includes(['radio', 'checkbox'], el.type);
};

export const isDateInput = (el: HTMLInputElement) => {
  return includes(['date', 'week', 'month', 'datetime-local', 'time'], el.type);
};

/**
 * Gets the data attribute. the name must be kebab-case.
 */
export const getDataAttribute = (el: HTMLElement, name: string) => el.getAttribute(`data-vv-${name}`);

/**
 * Checks if the values are either null or undefined.
 */
export const isNullOrUndefined = (...values): boolean => {
  return values.every(value => {
    return value === null || value === undefined;
  });
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
  if (isNullOrUndefined(scope)) {
    let form = getForm(el);

    if (form) {
      scope = getDataAttribute(form, 'scope');
    }
  }

  return !isNullOrUndefined(scope) ? scope : null;
};

/**
 * Get the closest form element.
 */
export const getForm = (el: HTMLInputElement) => {
  if (isNullOrUndefined(el)) return null;

  if (el.tagName === 'FORM') return el;

  if (!isNullOrUndefined(el.form)) return el.form;

  return !isNullOrUndefined(el.parentNode) ? getForm(el.parentNode) : null;
};

/**
 * Gets the value in an object safely.
 */
export const getPath = (path: string, target: ?Object, def: any = undefined) => {
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
 * Checks if path exists within an object.
 */
export const hasPath = (path: string, target: Object) => {
  let obj = target;
  return path.split('.').every(prop => {
    if (prop in obj) {
      obj = obj[prop];

      return true;
    }

    return false;
  });
};

/**
 * Parses a rule string expression.
 */
export const parseRule = (rule: string): Object => {
  let params = [];
  const name = rule.split(':')[0];

  if (includes(rule, ':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name, params };
};

/**
 * Debounces a function.
 */
export const debounce = (fn: () => any, wait: number = 0, token: { cancelled: boolean } = { cancelled: false }) => {
  if (wait === 0) {
    return fn;
  }

  let timeout;

  return (...args: any[]) => {
    const later = () => {
      timeout = null;

      // check if the fn call was cancelled.
      if (!token.cancelled) fn(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (!timeout) fn(...args);
  };
};

/**
 * Appends a rule definition to a list of rules.
 */
export const appendRule = (rule: string, rules: string | { [string]: boolean | any[] }) => {
  if (!rules) {
    return normalizeRules(rule);
  }

  if (!rule) {
    return normalizeRules(rules);
  }

  if (typeof rules === 'string') {
    rules = normalizeRules(rules);
  }

  return assign({}, rules, normalizeRules(rule));
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
      } else if (isObject(rules[curr])) {
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
export const toggleClass = (el: ?HTMLElement, className: ?string | ?string[], status: boolean) => {
  if (!el || !className) return;

  if (Array.isArray(className)) {
    className.forEach(item => toggleClass(el, item, status));
    return;
  }

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
  /* istanbul ignore next */
  for (let i = 0; i < length; i++) {
    array.push(arrayLike[i]);
  }

  /* istanbul ignore next */
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
export const find = (arrayLike: { length: number } | any[], predicate: (any) => boolean): any => {
  const array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      return array[i];
    }
  }

  return undefined;
};

export const isBuiltInComponent = (vnode: Object): boolean => {
  if (!vnode) {
    return false;
  }

  const tag = vnode.componentOptions.tag;

  return /^(keep-alive|transition|transition-group)$/.test(tag);
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

export const fillRulesFromElement = (el: HTMLInputElement, rules: string | { [string]: boolean | any[] }) => {
  if (el.required) {
    rules = appendRule('required', rules);
  }

  if (isTextInput(el)) {
    if (el.type === 'email') {
      rules = appendRule(`email${el.multiple ? ':multiple' : ''}`, rules);
    }

    if (el.pattern) {
      rules = appendRule({ regex: el.pattern }, rules);
    }

    // 524288 is the max on some browsers and test environments.
    if (el.maxLength >= 0 && el.maxLength < 524288) {
      rules = appendRule(`max:${el.maxLength}`, rules);
    }

    if (el.minLength > 0) {
      rules = appendRule(`min:${el.minLength}`, rules);
    }

    if (el.type === 'number') {
      rules = appendRule('decimal', rules);
      if (el.min !== '') {
        rules = appendRule(`min_value:${el.min}`, rules);
      }

      if (el.max !== '') {
        rules = appendRule(`max_value:${el.max}`, rules);
      }
    }

    return rules;
  }

  if (isDateInput(el)) {
    const timeFormat = el.step && Number(el.step) < 60 ? 'HH:mm:ss' : 'HH:mm';

    if (el.type === 'date') {
      return appendRule('date_format:YYYY-MM-DD', rules);
    }

    if (el.type === 'datetime-local') {
      return appendRule(`date_format:YYYY-MM-DDT${timeFormat}`, rules);
    }

    if (el.type === 'month') {
      return appendRule('date_format:YYYY-MM', rules);
    }

    if (el.type === 'week') {
      return appendRule('date_format:YYYY-[W]WW', rules);
    }

    if (el.type === 'time') {
      return appendRule(`date_format:${timeFormat}`, rules);
    }
  }

  return rules;
};

export const values = (obj) => {
  if (isCallable(Object.values)) {
    return Object.values(obj);
  }

  // fallback to keys()
  /* istanbul ignore next */
  return Object.keys(obj).map(k => obj[k]);
};

export const parseSelector = (selector) => {
  let rule = null;
  if (includes(selector, ':')) {
    rule = selector.split(':').pop();
    selector = selector.replace(`:${rule}`, '');
  }

  if (selector[0] === '#') {
    return {
      id: selector.slice(1),
      rule,
      name: null,
      scope: null
    };
  }

  let scope = null;
  let name = selector;
  if (includes(selector, '.')) {
    const parts = selector.split('.');
    scope = parts[0];
    name = parts.slice(1).join('.');
  }

  return {
    id: null,
    scope,
    name,
    rule
  };
};

export const includes = (collection: String | any[], item: any) => {
  return collection.indexOf(item) !== -1;
};

export const isEmptyArray = (arr: any): boolean => {
  return Array.isArray(arr) && arr.length === 0;
};
