import { isCallable, FieldValidationMetaInfo, ValidationMessageGenerator, merge } from '../../shared';
import { InterpolateOptions } from '../../shared/types';
import { interpolate } from './utils';

export { FieldValidationMetaInfo };

export type ValidationMessageTemplate = ValidationMessageGenerator | string;

export interface PartialI18nDictionary {
  name?: string;
  messages?: Record<string, ValidationMessageTemplate>;
  names?: Record<string, string>;
  fields?: Record<string, Record<string, ValidationMessageTemplate>>;
}

export type RootI18nDictionary = Record<string, PartialI18nDictionary>;

class Dictionary {
  public locale: string;
  public fallbackLocale?: string;

  private container: RootI18nDictionary;
  private interpolateOptions: InterpolateOptions;

  public constructor(
    locale: string,
    dictionary: RootI18nDictionary,
    interpolateOptions: InterpolateOptions = { prefix: '{', suffix: '}' },
  ) {
    this.container = {};
    this.locale = locale;
    this.interpolateOptions = interpolateOptions;
    this.merge(dictionary);
  }

  public resolve(ctx: FieldValidationMetaInfo, interpolateOptions?: InterpolateOptions) {
    let result = this.format(this.locale, ctx, interpolateOptions);
    if (!result && this.fallbackLocale && this.fallbackLocale !== this.locale) {
      result = this.format(this.fallbackLocale, ctx, interpolateOptions);
    }

    return result || this.getDefaultMessage(this.locale, ctx);
  }

  public getDefaultMessage(locale: string, ctx: FieldValidationMetaInfo) {
    const { label, name } = ctx;
    const fieldName = this.resolveLabel(locale, name, label);

    return `${fieldName} is not valid`;
  }

  public getLocaleDefault(locale: string, field: string): string | ValidationMessageGenerator | undefined {
    return this.container[locale]?.fields?.[field]?._default || this.container[locale]?.messages?._default;
  }

  public resolveLabel(locale: string, name: string, label?: string): string {
    if (label) {
      return this.container[locale]?.names?.[label] || label;
    }

    return this.container[locale]?.names?.[name] || name;
  }

  public format(locale: string, ctx: FieldValidationMetaInfo, interpolateOptions?: InterpolateOptions) {
    let message!: ValidationMessageTemplate | undefined;
    const { rule, form, label, name } = ctx;
    const fieldName = this.resolveLabel(locale, name, label);

    if (!rule) {
      message = this.getLocaleDefault(locale, name) || '';
      return isCallable(message)
        ? message(ctx)
        : interpolate(message, { ...form, field: fieldName }, interpolateOptions ?? this.interpolateOptions);
    }

    // find if specific message for that field was specified.
    message = this.container[locale]?.fields?.[name]?.[rule.name] || this.container[locale]?.messages?.[rule.name];
    if (!message) {
      message = this.getLocaleDefault(locale, name) || '';
    }

    return isCallable(message)
      ? message(ctx)
      : interpolate(
          message,
          { ...form, field: fieldName, params: rule.params },
          interpolateOptions ?? this.interpolateOptions,
        );
  }

  public merge(dictionary: RootI18nDictionary) {
    merge(this.container, dictionary);
  }
}

const DICTIONARY: Dictionary = new Dictionary('en', {});

function localize(dictionary: RootI18nDictionary): ValidationMessageGenerator;
function localize(locale: string, dictionary?: PartialI18nDictionary): ValidationMessageGenerator;
function localize(
  locale: string,
  dictionary?: PartialI18nDictionary,
  interpolateOptions?: InterpolateOptions,
): ValidationMessageGenerator;

function localize(
  locale: string | RootI18nDictionary,
  dictionary?: PartialI18nDictionary,
  interpolateOptions?: InterpolateOptions,
) {
  const generateMessage: ValidationMessageGenerator = ctx => {
    return DICTIONARY.resolve(ctx, interpolateOptions);
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
 * Sets the fallback locale.
 */
function setFallbackLocale(locale: string) {
  DICTIONARY.fallbackLocale = locale;
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
      // eslint-disable-next-line no-console
      console.error('Could not identify locale, ensure the locale file contains `code` field');
      return;
    }

    localize({ [locale.code]: locale });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load locale `);
  }
}

export { localize, setLocale, loadLocaleFromURL, setFallbackLocale };
