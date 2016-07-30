export default {
    msg(name) {
        return `The ${name} may only contain numeric characters.`;
    },
    validate(value) {
        return !! String(value).match(/^[0-9]*$/);
    }
};
