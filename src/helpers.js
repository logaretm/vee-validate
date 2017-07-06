import { getPath } from './utils';

const normalize = (fields) => {
  if (Array.isArray(fields)) {
    return fields.reduce((prev, curr) => {
      if (~curr.indexOf('.')) {
        prev[curr.split('.')[1]] = curr;
      } else {
        prev[curr] = curr;
      }

      return prev;
    }, {});
  }

  return fields;
};

/**
 * Maps fields to computed functions.
 *
 * @param {Array|Object} fields
 */
const mapFields = (fields) => {
  const normalized = normalize(fields);
  return Object.keys(normalized).reduce((prev, curr) => {
    const field = normalized[curr];
    prev[curr] = function mappedField () {
      if (this.$validator.fieldBag[field]) {
        return this.$validator.fieldBag[field];
      }

      const index = field.indexOf('.');
      if (index <= 0) {
        return {};
      }
      const [scope, name] = field.split('.');

      return getPath(`$${scope}.${name}`, this.$validator.fieldBag, {});
    };

    return prev;
  }, {});
};

export default mapFields;
