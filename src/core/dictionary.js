import { isObject, assign } from './utils';

// @flow

type MessageGenerator = (...args: any[]) => string;

type Locale = {
  messages: Object | { [string]: MessageGenerator },
  attributes: Object | { [string]: string },
  custom: Object | { [string]: MessageGenerator },
  dateFormat: ?string
};

type Dict = { [string]: Locale };

export default class Dictionary {
  container: { [string]: Locale };

  constructor (dictionary?: Object = {}) {
    this.container = {};
    this.merge(dictionary);
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
    if (!this.container[locale]) {
      return undefined;
    }

    return this.container[locale].dateFormat;
  }

  getMessage (locale: string, key: string, fallback ?: string) {
    if (!this.hasMessage(locale, key)) {
      return fallback || this._getDefaultMessage(locale);
    }

    return this.container[locale].messages[key];
  }

  /**
   * Gets a specific message for field. falls back to the rule message.
   */
  getFieldMessage (locale: string, field: string, key: string) {
    if (!this.hasLocale(locale)) {
      return this.getMessage(locale, key);
    }

    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (!dict || !dict[key]) {
      return this.getMessage(locale, key);
    }

    return dict[key];
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
    this._merge(this.container, dictionary);
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

  _merge (target: Dict, source: Dict) {
    if (! (isObject(target) && isObject(source))) {
      return target;
    }

    Object.keys(source).forEach((key: string) => {
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
