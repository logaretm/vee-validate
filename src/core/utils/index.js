import { isPlainObject } from 'lodash';

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
 * Creates a proxy object if available in the environment.
 */
export const createProxy = (target: Object, handler: Object) => {
  if (typeof Proxy === 'undefined') {
    return target;
  }

  return new Proxy(target, handler);
};

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
 * Normalizes the given rules expression.
 */
export const normalizeRules = (rules: string | { [string]: boolean | any[] }) => {
  // if falsy value return an empty object.
  if (!rules) {
    return {};
  }

  if (isPlainObject(rules)) {
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
 * Returns a suitable event name for the input element.
 */
export const getInputEventName = (el: HTMLInputElement) => {
  if (el && (el.tagName === 'SELECT' || ~['radio', 'checkbox', 'file'].indexOf(el.type))) {
    return 'change';
  }

  return 'input';
};

export const isBuiltInComponent = (vnode): boolean => {
  if (!vnode) {
    return false;
  }

  const tag = vnode.componentOptions.tag;

  return /keep-alive|transition|transition-group/.test(tag);
};

export const makeEventsArray = (events: string) => {
  return (typeof events === 'string' && events.length) ? events.split('|') : [];
};

export const makeDelayObject = (events: string[], delay: object | number) => {
  let delayObject = {};

  // We already have a valid delay object
  if (typeof delay === 'object' && !('global' in delay) && !('local' in delay) && Object.keys(delay).length) return delay;

  let globalDelay = (typeof delay === 'object' && 'global' in delay) ? delay.global : delay || 0;
  let localDelay = (typeof delay === 'object' && 'local' in delay) ? delay.local : {};

  events.forEach(e => {
    delayObject[e] = (typeof globalDelay === 'object') ? localDelay[e] || globalDelay[e] || 0 : localDelay[e] || globalDelay;
  });

  return delayObject;
};

export const deepParseInt = (input: object | string) => {
  if (typeof input === 'string') return parseInt(input);

  for (const element in input) {
    input[element] = parseInt(input[element]);
  }

  return input;
};
