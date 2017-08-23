/**
 * Gets the data attribute. the name must be kebab-case.
 */
export const getDataAttribute = (el, name) => el.getAttribute(`data-vv-${name}`);

/**
 * Formates file size.
 *
 * @param {Number|String} size
 */
export const formatFileSize = (size) => {
  const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const threshold = 1024;
  size = Number(size) * threshold;
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return `${(size / Math.pow(threshold, i)).toFixed(2) * 1} ${units[i]}`;
};

/**
 * Sets the data attribute.
 * @param {*} el
 * @param {String} name
 * @param {String} value
 */
export const setDataAttribute = (el, name, value) => el.setAttribute(`data-vv-${name}`, value);

/**
 * Shallow object comparison.
 *
 * @param {*} lhs 
 * @param {*} rhs 
 * @return {Boolean}
 */
export const isEqual = (lhs, rhs) => {
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
export const getScope = (el) => {
  let scope = getDataAttribute(el, 'scope');
  if (! scope && el.form) {
    scope = getDataAttribute(el.form, 'scope');
  }

  return scope || null;
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
 * Checks if path exists within an object.
 *
 * @param {String} path
 * @param {Object} target
 */
export const hasPath = (path, target) => {
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
 * @param {String} rule
 */
export const parseRule = (rule) => {
  let params = [];
  const name = rule.split(':')[0];

  if (~rule.indexOf(':')) {
    params = rule.split(':').slice(1).join(':').split(',');
  }

  return { name, params };
};

/**
 * Normalizes the given rules expression.
 *
 * @param {Object|String} rules
 */
export const normalizeRules = (rules) => {
  // if falsy value return an empty object.
  if (!rules) {
    return {};
  }

  const validations = {};
  if (isObject(rules)) {
    Object.keys(rules).forEach(rule => {
      let params = [];
      if (rules[rule] === true) {
        params = [];
      } else if (Array.isArray(rules[rule])) {
        params = rules[rule];
      } else {
        params = [rules[rule]];
      }

      if (rules[rule] !== false) {
        validations[rule] = params;
      }
    });

    return validations;
  }

  rules.split('|').forEach(rule => {
    const parsedRule = parseRule(rule);
    if (! parsedRule.name) {
      return;
    }

    validations[parsedRule.name] = parsedRule.params;
  });

  return validations;
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
    /* istanbul ignore next */
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    /* istanbul ignore next */
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
 * Adds or removes a class name on the input depending on the status flag.
 */
export const toggleClass = (el, className, status) => {
  if (!el || !className) return;

  if (status) {
    return addClass(el, className);
  }

  removeClass(el, className);
};

/**
 * Converts an array-like object to array.
 * Simple polyfill for Array.from
 */
export const toArray = (arrayLike) => {
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
 * @param {Object} target
 * @return {Object}
 */
export const assign = (target, ...others) => {
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
    array = toArray(array);
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

export const getInputEventName = (el) => {
  if (el && (el.tagName === 'SELECT' || ~['radio', 'checkbox', 'file'].indexOf(el.type))) {
    return 'change';
  }

  return 'input';
};
