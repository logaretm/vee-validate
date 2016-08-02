export default {
    msg(field, [confirmedField]) {
        return `The ${field} does not match the ${confirmedField}.`;
    },
    validate(value, [confirmedField]) {
        const field = document.querySelector(`input[name='${confirmedField}']`);

        return !! (field && String(value) === field.value);
    }
};
