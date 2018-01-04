import { assign, getPath } from './core/utils';
import Dictionary from './core/localization/default';
import I18nDictionary from './core/localization/i18n';

// @flow

const defaultConfig = {
  locale: 'en',
  delay: 0,
  errorBagName: 'errors',
  dictionary: null,
  strict: true,
  fieldsBagName: 'fields',
  classes: false,
  classNames: null,
  events: 'input|blur',
  inject: true,
  fastExit: true,
  aria: true,
  validity: false,
  i18n: null,
  i18nRootKey: 'validation'
};

let currentConfig = assign({}, defaultConfig);
const dependencies = {
  dictionary: new Dictionary({
    en: {
      messages: {},
      attributes: {},
      custom: {}
    }
  })
};

export default class Config {
  static get default () {
    return defaultConfig;
  }

  static get current () {
    return currentConfig;
  }

  static dependency (key) {
    return dependencies[key];
  }

  /**
   * Merges the config with a new one.
   */
  static merge (config) {
    currentConfig = assign({}, currentConfig, config);
    if (currentConfig.i18n) {
      Config.register('dictionary', new I18nDictionary(currentConfig.i18n, currentConfig.i18nRootKey));
    }
  }

  /**
   * Registers a dependency.
   */
  static register (key: string, value: any) {
    dependencies[key] = value;
  }

  /**
   * Resolves the working config from a Vue instance.
   */
  static resolve (context: Object): MapObject {
    const selfConfig = getPath('$options.$_veeValidate', context, {});

    return assign({}, Config.current, selfConfig);
  }
};
