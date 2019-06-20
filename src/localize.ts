import { isCallable, merge, interpolate } from './utils';
import { ValidationMessageTemplate } from './types';
import { extend, RuleContainer } from './extend';
import { getConfig } from './config';

interface PartialI18nDictionary {
  name?: string;
  messages?: { [k: string]: ValidationMessageTemplate };
  attributes?: { [k: string]: string };
  custom?: { [k: string]: { [r: string]: ValidationMessageTemplate } };
}

interface RootI18nDictionary {
  [k: string]: PartialI18nDictionary;
}

class Dictionary {
  locale: string;
  private container: any;

  constructor(locale: string, dictionary: RootI18nDictionary) {
    this.container = {};
    this.locale = locale || 'en';
    this.merge(dictionary);
  }

  resolve(field: string, rule: string, values?: { [k: string]: any }) {
    return this.format(this.locale, field, rule, values || {});
  }

  _hasLocale(locale: string) {
    return !!this.container[locale];
  }

  _normalizeMessage(template: ValidationMessageTemplate | string, field: string, values: { [k: string]: any }) {
    if (typeof template === 'function') {
      return template(field, values);
    }

    return interpolate(template, {
      ...values,
      _field_: field
    });
  }

  format(locale: string, field: string, rule: string, values: { [k: string]: any }) {
    let message: ValidationMessageTemplate | null = null;

    // find if specific message for that field was specified.
    const dict = this.container[locale].custom && this.container[locale].custom[field];
    if (dict && dict[rule]) {
      message = dict[rule];
    }

    if (!message && this._hasLocale(locale) && this._hasMessage(locale, rule)) {
      message = this.container[locale].messages[rule];
    }

    // Assign the default message if it does not exist.
    if (!message) {
      message = getConfig().defaultMessage;
    }

    return isCallable(message) ? message(field, values) : interpolate(message, { ...values, _field_: field });
  }

  merge(dictionary: RootI18nDictionary) {
    merge(this.container, dictionary);
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

let DICTIONARY: Dictionary;
let INSTALLED = false;

function updateRules() {
  if (INSTALLED) {
    return;
  }

  RuleContainer.iterate(name => {
    extend(name, {
      message: (field: string, values?: { [k: string]: any }) => {
        return DICTIONARY.resolve(field, name, values);
      }
    });
  });

  INSTALLED = true;
}

function localize(dictionary: RootI18nDictionary): void;
function localize(locale: string, dictionary?: PartialI18nDictionary): void;

function localize(locale: string | RootI18nDictionary, dictionary?: PartialI18nDictionary) {
  if (!DICTIONARY) {
    DICTIONARY = new Dictionary('en', {});
  }

  if (typeof locale === 'string') {
    DICTIONARY.locale = locale;

    if (dictionary) {
      DICTIONARY.merge({ [locale]: dictionary });
    }

    updateRules();
    return;
  }

  DICTIONARY.merge(locale);
  updateRules();
}

export { localize };
