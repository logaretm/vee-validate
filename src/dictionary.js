/* eslint-disable prefer-rest-params */
import { isObject } from './utils/helpers';

export default class Dictionary
{
  constructor(dictionary = {}) {
    this.dictionary = {};
    this.merge(dictionary);
  }

  hasLocale(locale) {
    return !! this.dictionary[locale];
  }

  getMessage(locale, key, fallback = '') {
    if (! this.hasMessage(locale, key)) {
      return fallback;
    }

    return this.dictionary[locale].messages[key];
  }

  getAttribute(locale, key, fallback = '') {
    if (! this.hasAttribute(locale, key)) {
      return fallback;
    }

    return this.dictionary[locale].attributes[key];
  }

  hasMessage(locale, key) {
    return !! (
            this.hasLocale(locale) &&
            this.dictionary[locale].messages &&
            this.dictionary[locale].messages[key]
        );
  }

  hasAttribute(locale, key) {
    return !! (
            this.hasLocale(locale) &&
            this.dictionary[locale].attributes &&
            this.dictionary[locale].attributes[key]
        );
  }

  merge(dictionary) {
    this._merge(this.dictionary, dictionary);
  }

  setMessage(locale, key, message) {
    if (! this.hasLocale(locale)) {
      this.dictionary[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.dictionary[locale].messages[key] = message;
  }

  setAttribute(locale, key, attribute) {
    if (! this.hasLocale(locale)) {
      this.dictionary[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.dictionary[locale].attributes[key] = attribute;
  }

  _merge(target, source) {
    if (! (isObject(target) && isObject(source))) {
      return target;
    }

    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (! target[key]) {
          Object.assign(target, { [key]: {} });
        }

        this._merge(target[key], source[key]);
        return;
      }

      Object.assign(target, { [key]: source[key] });
    });

    return target;
  }
}
