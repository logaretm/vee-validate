/**
 * Gets the data attribute. the name must be kebab-case.
 */
export const getDataAttribute = (el, name) => el.getAttribute(`data-vv-${name}`);

/**
 * Determines the input field scope.
 */
export const getScope = (el) =>
    getDataAttribute(el, 'scope') || (el.form && getDataAttribute(el.form, 'scope'));

export const debounce = (func, threshold = 100, execAsap = false) => {
    if (! threshold) {
        return func;
    }

    let timeout;

    return function debounced([...args]) {
        const obj = this;

        function delayed() {
            if (!execAsap) {
                func.apply(obj, args);
            }
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        } else if (execAsap) {
            func.apply(obj, ...args);
        }

        timeout = setTimeout(delayed, threshold || 100);
    };
};

export const warn = (message) => {
    if (! console) {
        return;
    }

    console.warn(`vee-validate: ${message}`); // eslint-disable-line
};

// eslint-disable-next-line
export const isObject = (object) => {
    return object !== null && object && typeof object === 'object' && ! Array.isArray(object);
};
