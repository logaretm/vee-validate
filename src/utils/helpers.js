/**
 * Determines the input field scope.
 */
export const getScope = (el) => el.dataset.scope || (el.form && el.form.dataset.scope);

/**
 * Debounces a function.
 */
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

/**
 * Emits a warning to the console.
 */
export const warn = (message) => {
    if (! console) {
        return;
    }

    console.warn(`vee-validate: ${message}`); // eslint-disable-line
};
