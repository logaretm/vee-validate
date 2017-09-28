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
      // if field exists
      if (this.$validator.flags[field]) {
        return this.$validator.flags[field];
      }

      // if it has a scope defined
      const index = field.indexOf('.');
      if (index <= 0) {
        return {};
      }

      let [scope, ...name] = field.split('.');
      scope = this.$validator.flags[`$${scope}`];
      name = name.join('.');

      if (scope && scope[name]) {
        return scope[name];
      }

      return {};
    };

    return prev;
  }, {});
};

export default mapFields;
