/**
 * Gets the data attribute. the name must be kebab-case.
 */
export const getDataAttribute = (el, name) => el.getAttribute(`data-vv-${name}`);

/**
 * Determines the input field scope.
 */
export const getScope = (el) => {
  let scope = getDataAttribute(el, 'scope');
  if (! scope && el.form) {
    scope = getDataAttribute(el.form, 'scope');
  }

  return scope;
};

/**
 * Gets the value in an object safely.
 * @param {String} propPath
 * @param {Object} target
 * @param {*} def
 */
export const getPath = (propPath, target, def = undefined) => {
  if (!propPath || !target) return def;
  let value = target;
  propPath.split('.').every(prop => {
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
 * Debounces a function.
 */
export const debounce = (fn, wait = 0, immediate = false) => {
  if (wait === 0) {
    return fn;
  }

  let timeout;

  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) fn(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) fn(...args);
  };
};

/**
 * Emits a warning to the console.
 */
export const warn = (message) => {
  console.warn(`[vee-validate] ${message}`); // eslint-disable-line
};

/**
 * Creates a branded error object.
 * @param {String} message
 */
export const createError = (message) => new Error(`[vee-validate] ${message}`);

/**
 * Checks if the value is an object.
 */
export const isObject = (object) =>
  object !== null && object && typeof object === 'object' && ! Array.isArray(object);

/**
 * Checks if a function is callable.
 */
export const isCallable = (func) => typeof func === 'function';

/**
 * Check if element has the css class on it.
 */
export const hasClass = (el, className) => {
  if (el.classList) {
    return el.classList.contains(className);
  }

  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

/**
 * Adds the provided css className to the element.
 */
export const addClass = (el, className) => {
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
export const removeClass = (el, className) => {
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
 * Converts an array-like object to array.
 * Simple polyfill for Array.from
 */
export const toArray = (arrayLike) => {
  if (Array.from) {
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
export const assign = (target, ...others) => {
  if (Object.assign) {
    return Object.assign(target, ...others);
  }

  if (target == null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  const to = Object(target);
  others.forEach(arg => {
    // Skip over if undefined or null
    if (arg != null) {
      Object.keys(arg).forEach(key => {
        to[key] = arg[key];
      });
    }
  });

  return to;
};

/**
 * Generates a unique id.
 * @return {String}
 */
export const uniqId = () => `_${Math.random().toString(36).substr(2, 9)}`;

/**
 * polyfills array.find
 * @param {Array} array
 * @param {Function} predicate
 */
export const find = (array, predicate) => {
  if (isObject(array)) {
    array = Array.from(array);
  }
  if (array.find) {
    return array.find(predicate);
  }
  let result;
  array.some(item => {
    if (predicate(item)) {
      result = item;
      return true;
    }

    return false;
  });

  return result;
};

/**
 * Gets the rules from a binding value or the element dataset.
 *
 * @param {String} expression The binding expression.
 * @param {Object|String} value The binding value.
 * @param {element} el The element.
 * @returns {String|Object}
 */
export const getRules = (expression, value, el) => {
  if (! expression) {
    return getDataAttribute(el, 'rules');
  }

  if (typeof value === 'string') {
    return value;
  }

  if (~['string', 'object'].indexOf(typeof value.rules)) {
    return value.rules;
  }

  return value;
};

export const getInputEventName = (el) => {
  if (el.tagName === 'SELECT' || ~['radio', 'checkbox', 'file'].indexOf(el.type)) {
    return 'change';
  }

  return 'input';
};
