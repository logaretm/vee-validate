/* istanbul ignore next */
/* eslint-disable max-len */
export default {
  after: (field, [target]) => `The ${field} must be after ${target}.`,
  before: (field, [target]) => `The ${field} must be before ${target}.`,
  date_between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
  date_format: (field, [format]) => `The ${field} must be in the format ${format}.`
};
