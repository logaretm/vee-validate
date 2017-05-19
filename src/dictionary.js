import { isObject, assign } from './utils';

export default class Dictionary {
  constructor(dictionary = {}) {
    this.dictionary = {};
    this.merge(dictionary);
  }

  hasLocale(locale) {
    return !! this.dictionary[locale];
  }

  getMessage(locale, key, fallback) {
    if (! this.hasMessage(locale, key)) {
      return fallback || this._getDefaultMessage(locale);
    }

    return this.dictionary[locale].messages[key];
  }

  /**
   * Gets a specific message for field. fallsback to the rule message.
   *
   * @param {String} locale
   * @param {String} field
   * @param {String} key
   */
  getFieldMessage(locale, field, key) {
    if (! this.hasLocale(locale)) {
      return this.getMessage(locale, key);
    }

    const dict = this.dictionary[locale].custom && this.dictionary[locale].custom[field];
    if (! dict || ! dict[key]) {
      return this.getMessage(locale, key);
    }

    return dict[key];
  }

  _getDefaultMessage(locale) {
    if (this.hasMessage(locale, '_default')) {
      return this.dictionary[locale].messages._default;
    }

    return this.dictionary.en.messages._default;
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
          assign(target, { [key]: {} });
        }

        this._merge(target[key], source[key]);
        return;
      }

      assign(target, { [key]: source[key] });
    });

    return target;
  }
}
