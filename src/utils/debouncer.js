export default (func, threshold = 100, execAsap = false) => {
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
