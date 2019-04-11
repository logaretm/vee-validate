import { values, isObject } from './utils';

function validateRefs () {
  if (!this.$_veeObserver) return true;

  return Promise.all(
    values(this.$_veeObserver.refs).map(field => {
      return field.validate();
    })
  ).then(results => results.every(r => r.valid));
}

function resetRefs () {
  if (!this.$_veeObserver) return;

  return values(this.$_veeObserver.refs).forEach(field => {
    field.reset();
  });
}

export function mapValidationActions (actions) {
  const actionsMap = {
    'validate': validateRefs,
    'reset': resetRefs
  };

  let mappedActions = actionsMap;
  if (isObject(actions)) {
    mappedActions = Object.keys(actions).reduce((acc, key) => {
      acc[key] = actionsMap[actions[key]];

      return acc;
    }, {});
  } else if (Array.isArray(actions)) {
    mappedActions = actions.reduce((acc, action) => {
      acc[action] = actionsMap[action];

      return acc;
    }, {});
  }

  return mappedActions;
};
