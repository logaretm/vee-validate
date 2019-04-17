import { isCallable, merge } from '../utils';

let LOCALE = 'en';

export default class Dictionary {
  container: any;
  constructor (dictionary) {
    this.container = {};
    this.merge(dictionary);
  }

  get locale () {
    return LOCALE;
  }

  set locale (value) {
    LOCALE = value || 'en';
  }

  hasLocale (locale) {
    return !!this.container[locale];
  }

  getMessage (locale, key, data) {
    let message = null;
    if (!this._hasMessage(locale, key)) {
      message = this._getDefaultMessage(locale);
    } else {
      message = this.container[locale].messages[key];
    }

    return isCallable(message) ? message(...data) : message;
  }

  /**
   * Gets a specific message for field. falls back to the rule message.
   */
  getFieldMessage (locale, field, key, data) {
    if (!this.hasLocale(locale)) {
      return this.getMessage(locale, key, data);
    }

    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (!dict || !dict[key]) {
      return this.getMessage(locale, key, data);
    }

    const message = dict[key];
    return isCallable(message) ? message(...data) : message;
  }

  _getDefaultMessage (locale) {
    if (this._hasMessage(locale, '_default')) {
      return this.container[locale].messages._default;
    }

    return this.container.en.messages._default;
  }

  getAttribute (locale, key, fallback = '') {
    if (!this._hasAttribute(locale, key)) {
      return fallback;
    }

    return this.container[locale].attributes[key];
  }

  _hasMessage (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].messages &&
            this.container[locale].messages[key]
    );
  }

  _hasAttribute (locale, key) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].attributes &&
            this.container[locale].attributes[key]
    );
  }

  merge (dictionary) {
    merge(this.container, dictionary);
  }
}
