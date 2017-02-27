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
 * Debounces a function.
 */
export const debounce = (callback, wait = 0, immediate) => {
  let timeout;
  return (...args) => {
    const later = () => {
      timeout = null;
      if (!immediate) callback(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) callback(args);
  };
};

/**
 * Emits a warning to the console.
 */
export const warn = (message) => {
  if (! console) {
    return;
  }

    console.warn(`[vee-validate]: ${message}`); // eslint-disable-line
};

/**
 * Checks if the value is an object.
 */
 // eslint-disable-next-line
export const isObject = (object) => {
  return object !== null && object && typeof object === 'object' && ! Array.isArray(object);
};

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

  /* istanbul ignore next */
  const array = [];
  /* istanbul ignore next */
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
export const assign = (target, ...others) => {
  if (Object.assign) {
    return Object.assign(target, ...others);
  }

  /* istanbul ignore next */
  if (target == null) { // TypeError if undefined or null
    throw new TypeError('Cannot convert undefined or null to object');
  }

  /* istanbul ignore next */
  const to = Object(target);
  /* istanbul ignore next */
  others.forEach(arg => {
    if (arg != null) { // Skip over if undefined or null
      Object.keys(arg).forEach(key => {
        to[key] = arg[key];
      });
    }
  });

  /* istanbul ignore next */
  return to;
};

/**
 * polyfills array.find
 * @param {Array} array
 * @param {Function} predicate
 */
export const find = (array, predicate) => {
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

export const getRules = (expression, value, el) => {
  if (! expression) {
    return getDataAttribute(el, 'rules');
  }

  if (typeof value === 'string') {
    return value;
  }

  return isObject(value.rules) ? value.rules : value;
};
