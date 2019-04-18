import { values } from './utils';
import Field from './core/field';

function validateRefs () {
  if (!this.$_veeObserver) return true;

  return Promise.all(
    values(this.$_veeObserver.state.refs).map((field: Field) => {
      return field.validate();
    })
  ).then(results => results.every(r => r.valid));
}

function resetRefs () {
  if (!this.$_veeObserver) return;

  return values(this.$_veeObserver.state.refs).forEach((field: Field) => {
    field.reset();
  });
}

export function mapValidationActions (actions: { [k: string]: string } | string[]) {
  const actionsMap: { [k: string]: CallableFunction } = {
    'validate': validateRefs,
    'reset': resetRefs
  };

  let mappedActions: { [k: string]: CallableFunction } = actionsMap;
  const obj: { [k: string]: CallableFunction } = {};
  if (Array.isArray(actions)) {
    mappedActions = actions.reduce((acc, action) => {
      acc[action] = actionsMap[action];

      return acc;
    }, obj);
  } else {
    mappedActions = Object.keys(actions).reduce((acc, key) => {
      acc[key] = actionsMap[actions[key]];

      return acc;
    }, obj);
  }

  return mappedActions;
};
