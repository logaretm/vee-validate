export default {
    msg(name) {
        return `The ${name} is required.`;
    },
    validate(value) {
        if (Array.isArray(value)) {
            return !! value.length;
        }

        return !! String(value).length;
    }
};
