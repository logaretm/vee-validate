import { assign } from './utils/index';

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

// Combines two flags using either AND or OR depending on the flag type.
const combine = (lhs: MapObject, rhs: MapObject): boolean => {
  const mapper = {
    pristine: (lhs, rhs) => lhs && rhs,
    dirty: (lhs, rhs) => lhs || rhs,
    touched: (lhs, rhs) => lhs || rhs,
    untouched: (lhs, rhs) => lhs && rhs,
    valid: (lhs, rhs) => lhs && rhs,
    invalid: (lhs, rhs) => lhs || rhs,
    pending: (lhs, rhs) => lhs || rhs,
    required: (lhs, rhs) => lhs || rhs,
    validated: (lhs, rhs) => lhs && rhs
  };

  return Object.keys(mapper).reduce((flags, flag) => {
    flags[flag] = mapper[flag](lhs[flag], rhs[flag]);

    return flags;
  }, {});
};

const mapScope = (scope: MapObject, deep: boolean = true): MapObject => {
  return Object.keys(scope).reduce((flags, field) => {
    if (!flags) {
      flags = assign({}, scope[field]);
      return flags;
    }

    // scope.
    const isScope = field.indexOf('$') === 0;
    if (deep && isScope) {
      return combine(mapScope(scope[field]), flags);
    } else if (!deep && isScope) {
      return flags;
    }

    flags = combine(flags, scope[field]);

    return flags;
  }, null);
};

/**
 * Maps fields to computed functions.
 */
const mapFields = (fields?: Array<any> | Object): Object | Function => {
  if (!fields) {
    return function () {
      return mapScope(this.$validator.flags);
    };
  }

  const normalized = normalize(fields);
  return Object.keys(normalized).reduce((prev, curr) => {
    const field = normalized[curr];
    prev[curr] = function mappedField () {
      // if field exists
      if (this.$validator.flags[field]) {
        return this.$validator.flags[field];
      }

      // scopeless fields were selected.
      if (normalized[curr] === '*') {
        return mapScope(this.$validator.flags, false);
      }

      // if it has a scope defined
      const index = field.indexOf('.');
      if (index <= 0) {
        return {};
      }

      let [scope, ...name] = field.split('.');

      scope = this.$validator.flags[`$${scope}`];
      name = name.join('.');

      // an entire scope was selected: scope.*
      if (name === '*' && scope) {
        return mapScope(scope);
      }

      if (scope && scope[name]) {
        return scope[name];
      }

      return {};
    };

    return prev;
  }, {});
};

export default mapFields;
