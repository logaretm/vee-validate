import { isCallable, merge, interpolate } from './utils';
import { ValidationMessageTemplate } from './types';
import { extend, RuleContainer } from './extend';
import { getConfig } from './config';

interface PartialI18nDictionary {
  name?: string;
  messages?: Record<string, ValidationMessageTemplate>;
  names?: Record<string, string>;
  fields?: Record<string, Record<string, ValidationMessageTemplate>>;
}

type RootI18nDictionary = Record<string, PartialI18nDictionary>;

class Dictionary {
  public locale: string;

  private container: any;

  public constructor(locale: string, dictionary: RootI18nDictionary) {
    this.container = {};
    this.locale = locale;
    this.merge(dictionary);
  }

  public resolve(field: string, rule: string, values: { [k: string]: any }) {
    return this.format(this.locale, field, rule, values);
  }

  private _hasLocale(locale: string) {
    return !!this.container[locale];
  }

  public format(locale: string, field: string, rule: string, values: { [k: string]: any }) {
    let message!: ValidationMessageTemplate;

    // find if specific message for that field was specified.
    const dict = this.container[locale] && this.container[locale].fields && this.container[locale].fields[field];
    if (dict && dict[rule]) {
      message = dict[rule];
    }

    if (!message && this._hasLocale(locale) && this._hasMessage(locale, rule)) {
      message = this.container[locale].messages[rule];
    }

    if (!message) {
      message = getConfig().defaultMessage;
    }

    if (this._hasName(locale, field)) {
      field = this.getName(locale, field);
    }

    return isCallable(message) ? message(field, values) : interpolate(message, { ...values, _field_: field });
  }

  public merge(dictionary: RootI18nDictionary) {
    merge(this.container, dictionary);
  }

  public getName(locale: string, key: string) {
    return this.container[locale].names[key];
  }

  private _hasMessage(locale: string, key: string): boolean {
    return !!(this._hasLocale(locale) && this.container[locale].messages && this.container[locale].messages[key]);
  }

  private _hasName(locale: string, key: string): boolean {
    return !!(this._hasLocale(locale) && this.container[locale].names && this.container[locale].names[key]);
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
      message: (field: string, values?: Record<string, any>) => {
        return DICTIONARY.resolve(field, name, values || {});
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
