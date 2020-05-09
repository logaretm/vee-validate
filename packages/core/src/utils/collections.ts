import { isObject } from './assertions';
import { toArray, includes } from '@vee-validate/shared';

export { toArray, includes };

export function merge(target: any, source: any) {
  Object.keys(source).forEach(key => {
    if (isObject(source[key])) {
      if (!target[key]) {
        target[key] = {};
      }

      merge(target[key], source[key]);
      return;
    }

    target[key] = source[key];
  });

  return target;
}
