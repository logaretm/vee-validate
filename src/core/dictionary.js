import { isObject, assign } from './utils';

export default class Dictionary {
  constructor (dictionary = {}) {
    this.container = {};
    this.merge(dictionary);
  }

  hasLocale (locale) {
    return !! this.container[locale];
  }

  setDateFormat (locale, format) {
    if (!this.container[locale]) {
      this.container[locale] = {};
    }

    this.container[locale].dateFormat = format;
  }

  getDateFormat (locale) {
    if (!this.container[locale]) {
      return undefined;
    }

    return this.container[locale].dateFormat;
  }

  getMessage (locale, key, fallback) {
    if (! this.hasMessage(locale, key)) {
      return fallback || this._getDefaultMessage(locale);
    }

    return this.container[locale].messages[key];
  }

  /**
   * Gets a specific message for field. fallsback to the rule message.
   *
   * @param {String} locale
   * @param {String} field
   * @param {String} key
   */
  getFieldMessage (locale, field, key) {
    if (! this.hasLocale(locale)) {
      return this.getMessage(locale, key);
    }

    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (! dict || ! dict[key]) {
      return this.getMessage(locale, key);
    }

    return dict[key];
  }

  _getDefaultMessage (locale) {
    if (this.hasMessage(locale, '_default')) {
      return this.container[locale].messages._default;
    }

    return this.container.en.messages._default;
  }

  getAttribute (locale, key, fallback = '') {
    if (! this.hasAttribute(locale, key)) {
      return fallback;
    }

    return this.container[locale].attributes[key];
  }

  hasMessage (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].messages &&
            this.container[locale].messages[key]
    );
  }

  hasAttribute (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].attributes &&
            this.container[locale].attributes[key]
    );
  }

  merge (dictionary) {
    this._merge(this.container, dictionary);
  }

  setMessage (locale, key, message) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].messages[key] = message;
  }

  setAttribute (locale, key, attribute) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].attributes[key] = attribute;
  }

  _merge (target, source) {
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
