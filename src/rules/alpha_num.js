export default {
    msg(name) {
        return `The ${name} may only contain alpha-numeric characters and spaces.`;
    },
    validate(value) {
        return !! value.match(/^[a-zA-Z0-9 ]*$/);
    }
};
