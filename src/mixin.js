import { isObject } from './utils';
import Validator from './validator';

export default (Vue, options) => {
  const mixin = {};

  mixin.provide = function provide() {
    const v = new Validator(null, { init: false });
    Vue.util.defineReactive(v, 'errorBag', v.errorBag);
    Vue.util.defineReactive(v, 'fieldBag', v.fieldBag);
    this.$v = v;

    return {
      $validator: v,
      $parentValidator: (this.$parent && this.$parent.$v)
    };
  };

  if (options.inject) {
    mixin.inject = ['$validator'];
  }
  mixin.beforeCreate = function beforeCreate() {
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
