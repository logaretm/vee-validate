import DefaultDictionary from './core/i18n';

const drivers = {
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
  static setDriver (implementation) {
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
