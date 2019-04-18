import dictionary from './dictionary';
import directive from './directive';
import { warn, isCallable } from './utils';
import Validator from './core/validator';
import { detectPassiveSupport } from './utils/events';
import { setConfig, getConfig, VeeValidateConfig } from './config';
import { setValidator } from './state';
import { modes, InteractionModeFactory } from './modes';
import Vue, { VueConstructor } from 'vue';
import { I18nDriver } from './core/i18n';

export let _Vue: VueConstructor;
let pluginInstance;

class VeeValidate {
  public validator: Validator;
  public vm: Vue;

  constructor(localVue: VueConstructor, config: Partial<VeeValidateConfig>) {
    setConfig(config);
    pluginInstance = this;
    this.validator = setValidator(new Validator({ bails: config && config.bails }));
    this.vm = new localVue();
    this._initI18n(this.config);
  }

  static setI18nDriver (driver: I18nDriver) {
    dictionary.setDriver(driver);
  }

  static configure (cfg: Partial<VeeValidateConfig>) {
    setConfig(cfg);
  }

  static setMode(mode: string, implementation: InteractionModeFactory) {
    setConfig({ mode });
    if (!implementation) {
      return;
    }

    if (!isCallable(implementation)) {
      throw new Error('A mode implementation must be a function');
    }

    modes[mode] = implementation;
  }

  static install (vue: VueConstructor, opts: Partial<VeeValidateConfig>) {
    if (_Vue && _Vue === vue) {
      /* istanbul ignore next */
      if (process.env.NODE_ENV !== 'production') {
        warn('already installed, Vue.use(VeeValidate) should only be called once.');
      }
      return;
    }


    _Vue = vue;
    pluginInstance = new VeeValidate(_Vue, opts);
    // inject the plugin container statically into the validator class
    Validator.setVeeContext(pluginInstance);

    detectPassiveSupport();

    _Vue.directive('validate', directive);
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

  _initI18n (config: VeeValidateConfig) {
    const { dictionary, locale } = config;

    if (dictionary) {
      this.i18nDriver.merge(dictionary);
    }

    if (locale) {
      this.i18nDriver.locale = locale;
    }
  }
}

export default VeeValidate;
