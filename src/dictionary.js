import { createError } from './utils';
import DefaultDictionary from './localization/default';

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
  static _checkDriverName (driver) {
    if (!driver) {
      throw createError('you must provide a name to the dictionary driver');
    }
  }

  static setDriver (driver, implementation = null) {
    this._checkDriverName(driver);
    if (implementation) {
      drivers[driver] = implementation;
    }

    currentDriver = driver;
  }

  static getDriver () {
    return drivers[currentDriver];
  }
};
