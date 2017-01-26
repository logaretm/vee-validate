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
    } else if (!hasClass(el, className)) {
        el.className += ` ${className}`;
    }
};

/**
 * Remove the provided css className from the element.
 */
export const removeClass = (el, className) => {
    if (el.classList) {
        el.classList.remove(className);
    } else if (hasClass(el, className)) {
        const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
        el.className = el.className.replace(reg, ' ');
    }
};
