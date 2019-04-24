import { values } from './utils';
import Field from './core/field';
import { VueValidationContext } from './types';

type RefMap = { [k: string]: Field };

function validateRefs(this: VueValidationContext) {
  if (!this.$_veeObserver) return true;

  return Promise.all(
    values(this.$_veeObserver.refs as RefMap).map((field: Field) => {
      return field.validate();
    })
  ).then(results => results.every(r => r.valid));
}

function resetRefs(this: VueValidationContext) {
  if (!this.$_veeObserver) return;

  return values(this.$_veeObserver.refs as RefMap).forEach((field: Field) => {
    field.reset();
  });
}

export function mapValidationActions(actions: { [k: string]: string } | string[]) {
  const actionsMap: { [k: string]: (...args: any[]) => any } = {
    validate: validateRefs,
    reset: resetRefs
  };

  let mappedActions: { [k: string]: (...args: any[]) => any } = actionsMap;
  const obj: { [k: string]: (...args: any[]) => any } = {};
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
}
