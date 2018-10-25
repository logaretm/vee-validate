import { isCallable, merge } from '../utils';

// @flow

let LOCALE: string = 'en';

export default class Dictionary implements IDictionary {
  container: { [string]: Locale };

  constructor (dictionary?: Object = {}) {
    this.container = {};
    this.merge(dictionary);
  }

  get locale () {
    return LOCALE;
  }

  set locale (value) {
    LOCALE = value || 'en';
  }

  hasLocale (locale: string): boolean {
    return !!this.container[locale];
  }

  setDateFormat (locale: string, format: string) {
    if (!this.container[locale]) {
      this.container[locale] = {};
    }

    this.container[locale].dateFormat = format;
  }

  getDateFormat (locale: string) {
    if (!this.container[locale] || !this.container[locale].dateFormat) {
      return null;
    }

    return this.container[locale].dateFormat;
  }

  getMessage (locale: string, key: string, data: any[]) {
    let message = null;
    if (!this.hasMessage(locale, key)) {
      message = this._getDefaultMessage(locale);
    } else {
      message = this.container[locale].messages[key];
    }

    return isCallable(message) ? message(...data) : message;
  }

  /**
   * Gets a specific message for field. falls back to the rule message.
   */
  getFieldMessage (locale: string, field: string, key: string, data: any[]) {
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

  _getDefaultMessage (locale: string) {
    if (this.hasMessage(locale, '_default')) {
      return this.container[locale].messages._default;
    }

    return this.container.en.messages._default;
  }

  getAttribute (locale: string, key: string, fallback?: string = '') {
    if (!this.hasAttribute(locale, key)) {
      return fallback;
    }

    return this.container[locale].attributes[key];
  }

  hasMessage (locale: string, key: string) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].messages &&
            this.container[locale].messages[key]
    );
  }

  hasAttribute (locale: string, key: string) {
    return !! (
      this.hasLocale(locale) &&
            this.container[locale].attributes &&
            this.container[locale].attributes[key]
    );
  }

  merge (dictionary: Dict) {
    merge(this.container, dictionary);
  }

  setMessage (locale: string, key: string, message: MessageGenerator | string) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].messages[key] = message;
  }

  setAttribute (locale: string, key: string, attribute: string) {
    if (! this.hasLocale(locale)) {
      this.container[locale] = {
        messages: {},
        attributes: {}
      };
    }

    this.container[locale].attributes[key] = attribute;
  }
}
