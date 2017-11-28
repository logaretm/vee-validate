import { warn, isCallable } from '../utils';

// @flow

const convertFormat = (locale: Locale) => {
  const messages = Object.keys(locale.messages).reduce((prev, key) => {
    if (isCallable(locale.messages[key])) {
      prev[key] = locale.messages[key]('{0}', ['{1}', '{2}', '{3}']);

      return prev;
    }

    prev[key] = locale.messages[key];

    return prev;
  }, {});

  return {
    messages,
    attributes: locale.attributes,
    dateFormat: locale.dateFormat
  };
};

export default class I18nDictionary {
  rootKey: string;
  i18n: Object;

  constructor (i18n: Object, rootKey: string) {
    this.i18n = i18n;
    this.rootKey = rootKey;
  }

  get locale (): string {
    return this.i18n.locale;
  }

  set locale (value: string) {
    warn('Cannot set locale from the validator when using vue-i18n');
  }

  getDateFormat (): string {
    return this.i18n.getDateTimeFormat(this.locale);
  }

  getMessage (locale: string, key: string, data: any[]): string {
    const path = `${this.rootKey}.messages.${key}`;
    if (!this.i18n.te(path)) {
      return this.i18n.t(`${this.rootKey}.messages._default`, locale, data);
    }

    return this.i18n.t(path, locale, data);
  }

  getAttribute (locale: string, key: string, fallback?: string = ''): string {
    const path = `${this.rootKey}.attributes.${key}`;
    if (!this.i18n.te(path)) {
      return fallback;
    }

    return this.i18n.t(path, locale);
  }

  getFieldMessage (locale: string, field: string, key: string, data: any[]) {
    const path = `${this.rootKey}.custom.${field}.${key}`;
    if (this.i18n.te(path)) {
      return this.i18n.t(path);
    }

    return this.getMessage(locale, key, data);
  }

  merge (dictionary) {
    Object.keys(dictionary).forEach(key => {
      const locale = convertFormat(dictionary[key]);
      this.i18n.mergeLocaleMessage(key, { [this.rootKey]: locale });
      if (locale.dateFormat) {
        this.i18n.mergeDateTimeFormat(key, locale.dateFormat);
      }
    });
  }

  setMessage (locale: string, key: string, value: () => string | string) {
    if (isCallable(value)) {
      value = value('{0}', ['{1}', '{2}', '{3}']);
    }

    this.i18n.mergeLocaleMessage(locale, {
      [this.rootKey]: {
        messages: {
          [key]: value
        }
      }
    });
  }

  setAttribute (locale: string, key: string, value: string) {
    this.i18n.mergeLocaleMessage(locale, {
      [this.rootKey]: {
        attributes: {
          [key]: value
        }
      }
    });
  }
};
