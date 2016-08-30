/* istanbul ignore next */
/* eslint-disable max-len */
export default {
    date_format: (field, [format]) => `The ${field} must be in the format ${format}.`,
    before: (field, [target]) => `The ${field} must be before ${target}.`,
    after: (field, [target]) => `The ${field} must be after ${target}.`,
    between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`
};
