export default {
    msg(name, [length]) {
        return `The ${name} must be at least ${length} characters.`;
    },
    validate(value, [length]) {
        return String(value).length >= length;
    }
};
