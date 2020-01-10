import { isCallable, merge, interpolate } from './utils';
import { ValidationMessageTemplate } from './types';
import { setConfig } from './config';
import { localeChanged } from './localeChanged';

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

  public format(locale: string, field: string, rule: string, values: { [k: string]: any }) {
    let message!: ValidationMessageTemplate;

    // find if specific message for that field was specified.
    message = this.container[locale]?.fields?.[field]?.[rule] || this.container[locale]?.messages?.[rule];
    if (!message) {
      message = '{field} is not valid';
    }

    field = this.container[locale]?.names?.[field] ?? field;

    return isCallable(message) ? message(field, values) : interpolate(message, { ...values, _field_: field });
  }

  public merge(dictionary: RootI18nDictionary) {
    merge(this.container, dictionary);
  }

  public hasRule(name: string) {
    return !!this.container[this.locale]?.messages?.[name];
  }
}

let DICTIONARY: Dictionary;

function localize(dictionary: RootI18nDictionary): void;
function localize(locale: string, dictionary?: PartialI18nDictionary): void;

function localize(locale: string | RootI18nDictionary, dictionary?: PartialI18nDictionary) {
  if (!DICTIONARY) {
    DICTIONARY = new Dictionary('en', {});
    setConfig({
      defaultMessage(field, values) {
        return DICTIONARY.resolve(field, values?._rule_, values || {});
      }
    });
  }

  if (typeof locale === 'string') {
    DICTIONARY.locale = locale;

    if (dictionary) {
      DICTIONARY.merge({ [locale]: dictionary });
    }

    localeChanged();
    return;
  }

  DICTIONARY.merge(locale);
}

export { localize };
