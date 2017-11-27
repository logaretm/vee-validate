import { warn, isCallable } from '../core/utils';

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

let installed: boolean = false;

export default function i18nPlugin ({ Validator }, { vueI18n, locales, rootKey = 'validation' } = {}): void {
  if (!vueI18n) {
    warn('You must provide a valid VueI18n instance');
    return;
  }

  // prevent duplicate installs.
  if (installed) {
    return;
  }

  // convert specified locales from VeeValidate format to Vuei18n format.
  if (locales) {
    Object.keys(locales).forEach(key => {
      const locale = convertFormat(locales[key]);
      vueI18n.mergeLocaleMessage(key, { [rootKey]: locale });
      if (locale.dateFormat) {
        vueI18n.mergeDateTimeFormat(key, locale.dateFormat);
      }
    });
  }

  // Patch the localization functions.
  Validator.prototype._getLocalizedParams = function (rule: MapObject, targetName?: string | null = null) {
    // if it can be localized.
    if (~['after', 'before', 'confirmed'].indexOf(rule.name) && rule.params && rule.params[0]) {
      const localizedName = targetName || vueI18n.t(`${rootKey}.attributes.${rule.params[0]}`) || rule.params[0];
      return [localizedName].concat(rule.params.slice(1));
    }

    return rule.params;
  };

  console.log(vueI18n.locales);

  Validator.prototype._formatErrorMessage = function (field, rule, data, targetName) {
    let name = field.alias;
    if (!name && vueI18n.te(`${rootKey}.attributes.${field.name}`)) {
      name = vueI18n.t(`${rootKey}.attributes.${field.name}`);
    }

    const params = this._getLocalizedParams(rule, targetName);

    return vueI18n.t(`${rootKey}.messages.${rule.name}`, vueI18n.locale, [name || field.name, ...params]);
  };

  Validator.prototype._getDateFormat = function (validations) {
    let format = null;
    if (validations.date_format && Array.isArray(validations.date_format)) {
      format = validations.date_format[0];
    }

    return format || vueI18n.getDateTimeFormat(vueI18n.locale);
  };
};
