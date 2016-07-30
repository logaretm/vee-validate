export default {
    msg(name) {
        return `The ${name} format is invalid.`;
    },
    validate(value, [regex, ...flags]) {
        return !! String(value).match(new RegExp(regex, flags));
    }
};
