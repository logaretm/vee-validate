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
  private validator: any;
  private vm;

  constructor (config) {
    this.configure(config);
    pluginInstance = this;
    this.validator = setValidator(new Validator({ bails: config && config.bails }));
    this.vm = new Vue();
    this._initI18n(this.config);
  }

  static setI18nDriver (driver) {
    dictionary.setDriver(driver);
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
    Validator.setVeeContext(pluginInstance);

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

export default VeeValidate;
