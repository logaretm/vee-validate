import { createDecorator } from 'vue-class-component';
import { mapValidationState } from './mapValidationState';
import { mapValidationActions } from './mapValidationActions';
import { MapStateOptions } from './types';

export function ValidationState(opts: MapStateOptions = { inherit: false }) {
  return createDecorator((componentOptions: any, key: string) => {
    const mappedState = mapValidationState(key, opts);

    if (!componentOptions.computed) {
      componentOptions.computed = {};
    }

    componentOptions.computed[key] = mappedState[key];
    delete componentOptions.props[key];
  });
}

export function ValidationAction(action: 'validate' | 'reset' = 'validate') {
  return createDecorator((componentOptions: any, key: string) => {
    const actions = mapValidationActions([action]);

    const originalMethod = componentOptions.methods[key];

    if (action === 'validate') {
      componentOptions.methods[key] = function() {
        actions[action].call(this).then((result: boolean) => {
          originalMethod.call(this, result);
        });
      };

      return;
    }

    if (action === 'reset') {
      componentOptions.methods[key] = function() {
        originalMethod.call(this);
        requestAnimationFrame(() => {
          actions[key].call(this);
        });
      };

      return;
    }

    throw new Error('Only "validate" and "reset" are allowed as validation actions.');
  });
}
