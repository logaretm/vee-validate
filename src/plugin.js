import dictionary from './dictionary';
import mixin from './mixin';
import directive from './directive';
import { assign, getPath, warn, isCallable } from './utils';
import Validator from './core/validator';
import ErrorBag from './core/errorBag';
import mapFields from './core/mapFields';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
import I18nDictionary from './localization/i18n';
import { detectPassiveSupport } from './utils/events';

// @flow

const defaultConfig = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  fieldsBagName: 'fields',
  classes: false,
  classNames: null,
  events: 'input',
  inject: true,
  fastExit: true,
  aria: true,
  validity: false,
  i18n: null,
  i18nRootKey: 'validation'
};

let Vue;
let pendingPlugins;
export let currentConfig = assign({}, defaultConfig);
export let pluginInstance;

class VeeValidate {
  static version: string
  static install: () => void
  static Validator: Function<Validator>

  _vm: any
  _validator: Validator

  constructor (config, _Vue) {
    this.configure(config);
    pluginInstance = this;
    if (_Vue) {
      Vue = _Vue;
    }
    this._validator = new Validator(null, { fastExit: config && config.fastExit });
    this._initVM(this.config);
    this._initI18n(this.config);
  }

  static setI18nDriver (driver: string, instance): void {
    dictionary.setDriver(driver, instance);
  }

  static configure (cfg) {
    currentConfig = assign({}, currentConfig, cfg);
  }

  static use (plugin: (ctx: PluginContext, options?: any) => any, options?: any = {}) {
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

    plugin({ Validator, ErrorBag, Rules: Validator.rules }, options);
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

    detectPassiveSupport();

    Vue.mixin(mixin);
    Vue.directive('validate', directive);
    if (pendingPlugins) {
      pendingPlugins.forEach(({ plugin, options }) => {
        VeeValidate.use(plugin, options);
      });
      pendingPlugins = null;
    }
  }

  static get instance () {
    return pluginInstance;
  }

  get i18nDriver (): IDictionary {
    return dictionary.getDriver();
  }

  static get i18nDriver (): IDictionary {
    return dictionary.getDriver();
  }

  get config () {
    return currentConfig;
  }

  static get config () {
    return currentConfig;
  }

  _initVM (config) {
    this._vm = new Vue({
      data: () => ({
        errors: this._validator.errors,
        fields: this._validator.fields
      })
    });
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
    VeeValidate.configure(cfg);
  }

  resolveConfig (ctx) {
    const selfConfig = getPath('$options.$_veeValidate', ctx, {});

    return assign({}, this.config, selfConfig);
  }
}

VeeValidate.version = '__VERSION__';
VeeValidate.mixin = mixin;
VeeValidate.directive = directive;
VeeValidate.Validator = Validator;
VeeValidate.ErrorBag = ErrorBag;
VeeValidate.mapFields = mapFields;
VeeValidate.ValidationProvider = ValidationProvider;
VeeValidate.ValidationObserver = ValidationObserver;
VeeValidate.withValidation = withValidation;

export default VeeValidate;
