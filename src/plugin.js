import dictionary from './dictionary';
import directive from './directive';
import { warn, isCallable } from './utils';
import Validator from './core/validator';
import { detectPassiveSupport } from './utils/events';
import { setConfig, getConfig } from './config';
import { setValidator } from './state';
import { modes } from './modes';

export let Vue = null;
let pluginInstance;

class VeeValidate {
  constructor (config) {
    this.configure(config);
    pluginInstance = this;
    this._validator = setValidator(
      new Validator(null, { bails: config && config.bails }, this)
    );
    this._vm = new Vue();
    this._initI18n(this.config);
  }

  static setI18nDriver (driver, instance) {
    dictionary.setDriver(driver, instance);
  }

  static configure (cfg) {
    setConfig(cfg);
  }

  static setMode (mode, implementation) {
    setConfig({ mode });
    if (!implementation) {
      return;
    }

    if (!isCallable(implementation)) {
      throw new Error('A mode implementation must be a function');
    }

    modes[mode] = implementation;
  }

  static install (_Vue, opts) {
    if (Vue && _Vue === Vue) {
      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'production') {
        warn('already installed, Vue.use(VeeValidate) should only be called once.');
      }
      return;
    }

    Vue = _Vue;
    pluginInstance = new VeeValidate(opts);
    // inject the plugin container statically into the validator class
    Validator.$vee = pluginInstance;

    detectPassiveSupport();

    Vue.directive('validate', directive);
  }

  get i18nDriver () {
    return dictionary.getDriver();
  }

  static get i18nDriver () {
    return dictionary.getDriver();
  }

  get config () {
    return getConfig();
  }

  static get config () {
    return getConfig();
  }

  _initI18n (config) {
    const { dictionary, locale } = config;

    if (dictionary) {
      this.i18nDriver.merge(dictionary);
    }

    if (locale) {
      this.i18nDriver.locale = locale;
    }
  }

  configure (cfg) {
    setConfig(cfg);
  }
}

VeeValidate.directive = directive;
VeeValidate.Validator = Validator;

export default VeeValidate;
