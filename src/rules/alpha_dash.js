export default {
    msg(name) {
        return `The ${name} may contain alpha-numeric characters well as spaces, dashes and underscores.`;
    },
    validate(value) {
        return !! value.match(/^[a-zA-Z0-9 _-]*$/);
    }
};
