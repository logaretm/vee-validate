export default (message) => {
    if (! window.console) {
        return;
    }

    console.warn(`vee-validate: ${message}`); // eslint-disable-line
};
