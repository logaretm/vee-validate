import { isCallable, merge } from '../utils';

export type ValidatorMessageGenerator = string | ((field: string, args: any[], data: any) => string);

export interface PartialI18nDictionary {
  name?: string;
  messages?: { [k: string]: ValidatorMessageGenerator };
  attributes?: { [k: string]: string };
  custom?: { [k: string]: { [r: string]: ValidatorMessageGenerator } };
}

export interface RootI18nDictionary {
  [k: string]: PartialI18nDictionary;
}

export interface I18nDriver {
  locale: string;

  getFieldMessage(locale: string, field: string, key: string, data: any): string;

  getAttribute(locale: string, key: string): string;

  merge(partial: RootI18nDictionary): void;
}

let LOCALE = 'en';

export default class Dictionary implements I18nDriver {
  private container: any;
  constructor(dictionary: RootI18nDictionary) {
    this.container = {};
    this.merge(dictionary);
  }

  get locale() {
    return LOCALE;
  }

  set locale(value) {
    LOCALE = value || 'en';
  }

  _hasLocale(locale: string) {
    return !!this.container[locale];
  }

  getMessage(locale: string, key: string, data: any) {
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
  getFieldMessage(locale: string, field: string, key: string, data: any) {
    if (!this._hasLocale(locale)) {
      return this.getMessage(locale, key, data);
    }

    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (!dict || !dict[key]) {
      return this.getMessage(locale, key, data);
    }

    const message = dict[key];
    return isCallable(message) ? message(...data) : message;
  }

  merge(dictionary: RootI18nDictionary) {
    merge(this.container, dictionary);
  }

  _getDefaultMessage(locale: string) {
    if (this._hasMessage(locale, '_default')) {
      return this.container[locale].messages._default;
    }

    return this.container.en.messages._default;
  }

  getAttribute(locale: string, key: string, fallback = '') {
    if (!this._hasAttribute(locale, key)) {
      return fallback;
    }

    return this.container[locale].attributes[key];
  }

  _hasMessage(locale: string, key: string): boolean {
    return !!(this._hasLocale(locale) && this.container[locale].messages && this.container[locale].messages[key]);
  }

  _hasAttribute(locale: string, key: string): boolean {
    return !!(this._hasLocale(locale) && this.container[locale].attributes && this.container[locale].attributes[key]);
  }
}
