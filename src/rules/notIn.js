export default {
    msg(name) {
        return `The ${name} must be a valid value.`;
    },
    validate(value, options) {
        return ! options.filter(option => option == value).length; // eslint-disable-line
    }
};
