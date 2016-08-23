const make = (moment) => ({
    date_format: (value, [format]) => moment(value, format, true).isValid(),
    after: (value, [targetField]) => {
        if (! moment(value).isValid()) {
            return false;
        }

        const other = document.querySelector(`input[name='${targetField}']`).value;

        if (! moment(other).isValid()) {
            return false;
        }

        return moment(value).isAfter(other);
    },
    before: (value, [targetField]) => {
        if (! moment(value).isValid()) {
            return false;
        }

        const other = document.querySelector(`input[name='${targetField}']`).value;

        if (! moment(other).isValid()) {
            return false;
        }

        return moment(value).isBefore(other);
    },
    date_between: (value, [min, max]) => moment(value).isBetween(min, max)
});

const messages = {
    en: {
        date_format: (field, [format]) => `The ${field} must be in the format ${format}.`,
        before: (field, [target]) => `The ${field} must be before ${target}.`,
        after: (field, [target]) => `The ${field} must be after ${target}.`,
        between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`
    }
};


export default {
    make,
    messages
};
