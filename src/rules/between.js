export default {
    msg(field, [min, max]) {
        return `The ${field} must be between ${min} and ${max}.`;
    },
    validate(value, [min, max]) {
        return Number(min) <= value && Number(max) >= value;
    }
};
