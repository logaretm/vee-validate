import { isObject } from './utils';
import Validator from './validator';

export default (Vue, options) => {
  const mixin = {};

  mixin.provide = function providesValidator() {
    return {
      $validator: this.$validator
    };
  };

  mixin.beforeCreate = function beforeCreate() {
    let reactive = false;
    // if its a root instance, inject anyways.
    if (options.inject || !this.$parent) {
      this.$validator = new Validator(null, { init: false, vm: this });
    } else {
      const injectionOpts = this.$options.inject;
      if (! injectionOpts) {
        return;
      }

      if (Array.isArray(injectionOpts) && ! ~injectionOpts.indexOf('$validator')) {
        return;
      }

      if (isObject(injectionOpts) && ! injectionOpts.$validator) {
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
