export default {
    msg(name, [length]) {
        return `The ${name} may not be greater than ${length} characters.`;
    },
    validate(value, [length]) {
        return String(value).length <= length;
    }
};
