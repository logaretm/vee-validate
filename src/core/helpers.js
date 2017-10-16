// @flow

const normalize = (fields: Array<any> | Object): Object => {
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
 */
const mapFields = (fields: Array<any> | Object): Object => {
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
