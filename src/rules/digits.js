export default {
    msg(name, [length]) {
        return `The ${name} must be numeric and exactly contain ${length} digits.`;
    },
    validate(value, [length]) {
        const strVal = String(value);

        return !! (strVal.match(/^[0-9]*$/) && strVal.length === Number(length));
    }
};
