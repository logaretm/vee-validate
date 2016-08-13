export default (message) => {
    if (! window.console) {
        return;
    }

    const warn = console.warn || console.log; // eslint-disable-line

    warn(`vee-validate: ${message}`);
};
