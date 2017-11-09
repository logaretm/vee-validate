import { assign, get } from 'lodash';

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
  validity: false
};

let currentConfig = assign({}, defaultConfig);

export default class Config {
  static get default () {
    return defaultConfig;
  }

  static get current () {
    return currentConfig;
  }

  /**
   * Merges the config with a new one.
   */
  static merge (config) {
    currentConfig = assign({}, currentConfig, config);
  }

  /**
   * Resolves the working config from a Vue instance.
   */
  static resolve (context: Object): MapObject {
    const selfConfig = get(context, '$options.$_veeValidate', {});

    return assign({}, Config.current, selfConfig);
  }
};
