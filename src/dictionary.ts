import DefaultDictionary, { I18nDriver } from './core/i18n';

const drivers: { [x: string]: I18nDriver } = {
  default: new DefaultDictionary({
    en: {
      messages: {},
      attributes: {},
      custom: {}
    }
  })
};

let currentDriver = 'default';

export default class DictionaryResolver {
  static setDriver (implementation: I18nDriver | string) {
    if (typeof implementation === 'string') {
      currentDriver = implementation;
      return;
    }

    const tempName = Date.now().toString().substring(7);
    drivers[tempName] = implementation;
    currentDriver = tempName;
  }

  static getDriver () {
    return drivers[currentDriver];
  }
};
