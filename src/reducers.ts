import Vue from 'vue';
import { createFlags } from './utils';
import { createValidationCtx } from './components/common';

function normalizeToRecord<T extends string>(strOrArray: T | T[] | Record<string, T>) {
  if (typeof strOrArray === 'string') {
    return { [strOrArray]: strOrArray };
  }

  if (Array.isArray(strOrArray)) {
    return strOrArray.reduce((acc: Record<string, T>, f) => {
      acc[f] = f;

      return acc;
    }, {});
  }

  return strOrArray;
}

export function mapFieldState(fields: string | string[] | Record<string, string>) {
  const map = normalizeToRecord(fields);
  const reactiveHack = Vue.observable({
    isMounted: false
  });

  return Object.keys(map).reduce((computed: Record<string, Function>, field) => {
    const mappedName = map[field];
    computed[mappedName] = function(this: any) {
      if (!reactiveHack.isMounted) {
        this.$on('hook:mounted', () => {
          reactiveHack.isMounted = true;
        });
      }

      const provider = this.$_veeObserver && this.$_veeObserver.resolveField(field);

      // observer wasn't created yet or not found.
      if (!provider) {
        return {
          ...createFlags(),
          errors: [],
          classes: {},
          failedRules: {}
        };
      }

      return createValidationCtx(provider);
    };

    return computed;
  }, {});
}

export function mapFormState(name: string) {
  const reactiveHack = Vue.observable({
    isMounted: false
  });

  return {
    [name](this: any) {
      if (!reactiveHack.isMounted) {
        this.$on('hook:mounted', () => {
          reactiveHack.isMounted = true;
        });
      }

      const observer = this.__vee_observer;

      // observer wasn't created yet or not found.
      if (!observer) {
        return {
          ...createFlags(),
          errors: {}
        };
      }

      return observer.ctx;
    }
  };
}
