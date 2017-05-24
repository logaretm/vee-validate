import { isObject } from './utils';
import Validator from './validator';

const validatorRequested = (injections) => {
  if (! injections) {
    return false;
  }

  if (Array.isArray(injections) && ! ~injections.indexOf('$validator')) {
    return true;
  }

  if (isObject(injections) && ! injections.$validator) {
    return true;
  }

  return false;
};

export default (Vue, options) => {
  const mixin = {};
  mixin.provide = function providesValidator() {
    if (this.$validator) {
      return {
        $validator: this.$validator
      };
    }

    return {};
  };

  mixin.beforeCreate = function beforeCreate() {
    let reactive = false;
    const requested = validatorRequested(this.$options.inject);
    // if its a root instance, inject anyways, or if it requested an instance.
    if (options.inject || !this.$parent || this.$options.$validates) {
      this.$validator = new Validator(null, { init: false, vm: this });
    } else {
      if (! requested) {
        return;
      }

      reactive = true;
    }


    if (! reactive) {
      Vue.util.defineReactive(this.$validator, 'errorBag', this.$validator.errorBag);
      Vue.util.defineReactive(this.$validator, 'fieldBag', this.$validator.fieldBag);
    }

    if (! this.$options.computed) {
      this.$options.computed = {};
    }

    this.$options.computed[options.errorBagName] = function errorBagGetter() {
      return this.$validator.errorBag;
    };
    this.$options.computed[options.fieldsBagName] = function fieldBagGetter() {
      return this.$validator.fieldBag;
    };
  };

  mixin.mounted = function mounted() {
    if (this.$validator) {
      this.$validator.init();
    }
  };

  return mixin;
};
