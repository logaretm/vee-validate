import dictionary from './dictionary';
import directive from './directive';
import { warn, isCallable } from './utils';
import Validator from './core/validator';
import I18nDictionary from './localization/i18n';
import { detectPassiveSupport } from './utils/events';
import { setConfig, getConfig } from './config';
import { setValidator } from './state';
import { modes } from './modes';

export let Vue = null;
let pendingPlugins;
let pluginInstance;

class VeeValidate {
  constructor (config, _Vue) {
    this.configure(config);
    pluginInstance = this;
    if (_Vue) {
      Vue = _Vue;
    }
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

  static use (plugin, options = {}) {
    if (!isCallable(plugin)) {
      return warn('The plugin must be a callable function');
    }

    // Don't install plugins until vee-validate is installed.
    if (!pluginInstance) {
      if (!pendingPlugins) {
        pendingPlugins = [];
      }
      pendingPlugins.push({ plugin, options });
      return;
    }

    plugin({ Validator, Rules: Validator.rules }, options);
  };

  static install (_Vue, opts) {
    if (Vue && _Vue === Vue) {
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
    if (pendingPlugins) {
      pendingPlugins.forEach(({ plugin, options }) => {
        VeeValidate.use(plugin, options);
      });
      pendingPlugins = null;
    }
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
    const { dictionary, i18n, i18nRootKey, locale } = config;
    const onLocaleChanged = () => {
      this._validator.errors.regenerate();
    };

    // i18 is being used for localization.
    if (i18n) {
      VeeValidate.setI18nDriver('i18n', new I18nDictionary(i18n, i18nRootKey));
      i18n._vm.$watch('locale', onLocaleChanged);
    } else if (typeof window !== 'undefined') {
      this._vm.$on('localeChanged', onLocaleChanged);
    }

    if (dictionary) {
      this.i18nDriver.merge(dictionary);
    }

    if (locale && !i18n) {
      this._validator.localize(locale);
    }
  }

  configure (cfg) {
    setConfig(cfg);
  }
}

VeeValidate.directive = directive;
VeeValidate.Validator = Validator;

export default VeeValidate;
