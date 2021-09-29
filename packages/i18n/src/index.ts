import { isCallable, FieldValidationMetaInfo, ValidationMessageGenerator } from '../../shared';
import { interpolate, merge } from './utils';

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

  private container: RootI18nDictionary;

  public constructor(locale: string, dictionary: RootI18nDictionary) {
    this.container = {};
    this.locale = locale;
    this.merge(dictionary);
  }

  public resolve(ctx: FieldValidationMetaInfo) {
    return this.format(this.locale, ctx);
  }

  public getLocaleDefault(locale: string, field: string): string | ValidationMessageGenerator | undefined {
    return this.container[locale]?.fields?.[field]?._default || this.container[locale]?.messages?._default;
  }

  public format(locale: string, ctx: FieldValidationMetaInfo) {
    let message!: ValidationMessageTemplate | undefined;
    const { field, rule, form } = ctx;
    const fieldName = this.container[locale]?.names?.[field] ?? field;

    if (!rule) {
      message = this.getLocaleDefault(locale, field) || `${fieldName} is not valid`;
      return isCallable(message) ? message(ctx) : interpolate(message, { ...form, field: fieldName });
    }

    // find if specific message for that field was specified.
    message = this.container[locale]?.fields?.[field]?.[rule.name] || this.container[locale]?.messages?.[rule.name];
    if (!message) {
      message = this.getLocaleDefault(locale, field) || `${fieldName} is not valid`;
    }

    return isCallable(message)
      ? message(ctx)
      : interpolate(message, { ...form, field: fieldName, params: rule.params });
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

/**
 * Loads a locale file from URL and merges it with the current dictionary
 */
async function loadLocaleFromURL(url: string) {
  try {
    const locale: { code: string; messages: Record<string, string> } = await fetch(url, {
      headers: {
        'content-type': 'application/json',
      },
    }).then(res => res.json());

    if (!locale.code) {
      console.error('Could not identify locale, ensure the locale file contains `code` field');
      return;
    }

    localize({ [locale.code]: locale });
  } catch (err) {
    console.error(`Failed to load locale `);
  }
}

export { localize, setLocale, loadLocaleFromURL };
