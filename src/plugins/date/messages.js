export default {
  after: (field, [target, inclusion]) => `The ${field} must be after ${inclusion ? 'or equal to ' : ''}${target}.`,
  before: (field, [target, inclusion]) => `The ${field} must be before ${inclusion ? 'or equal to ' : ''}${target}.`,
  date_between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
  date_format: (field, [format]) => `The ${field} must be in the format ${format}.`
};
