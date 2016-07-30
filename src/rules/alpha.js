export default {
    msg(name) {
        return `The ${name} may only contain alphabetic characters and spaces.`;
    },
    validate(value) {
        return !! value.match(/^[a-zA-Z ]*$/);
    }
};
