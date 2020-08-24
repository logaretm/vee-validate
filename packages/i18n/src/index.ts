import { isCallable, merge, FieldContext, ValidationMessageGenerator } from '../../shared';
import { interpolate } from './utils';

type ValidationMessageTemplate = ValidationMessageGenerator | string;

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

  public resolve(ctx: FieldContext) {
    return this.format(this.locale, ctx);
  }

  public format(locale: string, ctx: FieldContext) {
    let message!: ValidationMessageTemplate;
    const { field, rule, form } = ctx;

    // find if specific message for that field was specified.
    message = this.container[locale]?.fields?.[field]?.[rule.name] || this.container[locale]?.messages?.[rule.name];
    if (!message) {
      message = `${field} is not valid`;
    }

    const fieldName = this.container[locale]?.names?.[field] ?? field;

    return isCallable(message) ? message(ctx) : interpolate(message, { ...form, _field_: fieldName });
  }

  public merge(dictionary: RootI18nDictionary) {
    merge(this.container, dictionary);
  }
}

let DICTIONARY: Dictionary;

function localize(dictionary: RootI18nDictionary): ValidationMessageGenerator;
function localize(locale: string, dictionary?: PartialI18nDictionary): ValidationMessageGenerator;

function localize(locale: string | RootI18nDictionary, dictionary?: PartialI18nDictionary) {
  if (!DICTIONARY) {
    DICTIONARY = new Dictionary('en', {});
  }

  const generateMessage: ValidationMessageGenerator = ctx => {
    return DICTIONARY.resolve(ctx);
  };

  if (typeof locale === 'string') {
    DICTIONARY.locale = locale;

    if (dictionary) {
      DICTIONARY.merge({ [locale]: dictionary });
    }

    return generateMessage;
  }

  DICTIONARY.merge(locale);

  return generateMessage;
}

/**
 * Sets the locale
 */
function setLocale(locale: string) {
  DICTIONARY.locale = locale;
}

export { localize, setLocale };
