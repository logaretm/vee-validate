import { warn, isCallable, isObject, merge, getPath, isNullOrUndefined } from '../utils';

const normalizeValue = (value) => {
  if (isObject(value)) {
    return Object.keys(value).reduce((prev, key) => {
      prev[key] = normalizeValue(value[key]);

      return prev;
    }, {});
  }

  if (isCallable(value)) {
    return value('{0}', ['{1}', '{2}', '{3}']);
  }

  return value;
};

const normalizeFormat = (locale) => {
  // normalize messages
  const dictionary = {};
  if (locale.messages) {
    dictionary.messages = normalizeValue(locale.messages);
  }

  if (locale.custom) {
    dictionary.custom = normalizeValue(locale.custom);
  }

  if (locale.attributes) {
    dictionary.attributes = locale.attributes;
  }

  if (!isNullOrUndefined(locale.dateFormat)) {
    dictionary.dateFormat = locale.dateFormat;
  }

  return dictionary;
};

export default class I18nDictionary {
  constructor (i18n, rootKey) {
    this.i18n = i18n;
    this.rootKey = rootKey;
  }

  get locale () {
    return this.i18n.locale;
  }

  set locale (value) {
    warn('Cannot set locale from the validator when using vue-i18n, use i18n.locale setter instead');
  }

  getDateFormat (locale) {
    return this.i18n.getDateTimeFormat(locale || this.locale);
  }

  setDateFormat (locale, value) {
    this.i18n.setDateTimeFormat(locale || this.locale, value);
  }

  getMessage (_, key, data) {
    const path = `${this.rootKey}.messages.${key}`;
    if (this.i18n.te(path)) {
      return this.i18n.t(path, data);
    }

    // fallback to the fallback message
    if (this.i18n.te(path, this.i18n.fallbackLocale)) {
      return this.i18n.t(path, this.i18n.fallbackLocale, data);
    }

    // fallback to the root message
    return this.i18n.t(`${this.rootKey}.messages._default`, data);
  }

  getAttribute (_, key, fallback = '') {
    const path = `${this.rootKey}.attributes.${key}`;
    if (this.i18n.te(path)) {
      return this.i18n.t(path);
    }

    return fallback;
  }

  getFieldMessage (_, field, key, data) {
    const path = `${this.rootKey}.custom.${field}.${key}`;
    if (this.i18n.te(path)) {
      return this.i18n.t(path, data);
    }

    return this.getMessage(_, key, data);
  }

  merge (dictionary) {
    Object.keys(dictionary).forEach(localeKey => {
      // i18n doesn't deep merge
      // first clone the existing locale (avoid mutations to locale)
      const clone = merge({}, getPath(`${localeKey}.${this.rootKey}`, this.i18n.messages, {}));
      // Merge cloned locale with new one
      const locale = merge(clone, normalizeFormat(dictionary[localeKey]));
      this.i18n.mergeLocaleMessage(localeKey, { [this.rootKey]: locale });
      if (locale.dateFormat) {
        this.i18n.setDateTimeFormat(localeKey, locale.dateFormat);
      }
    });
  }

  setMessage (locale, key, value) {
    this.merge({
      [locale]: {
        messages: {
          [key]: value
        }
      }
    });
  }

  setAttribute (locale, key, value) {
    this.merge({
      [locale]: {
        attributes: {
          [key]: value
        }
      }
    });
  }
};
