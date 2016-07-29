export default {
    msg(name) {
        return `The ${name} must be a valid email.`;
    },
    validate(value) {
        return !! value.match(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
        );
    }
};
