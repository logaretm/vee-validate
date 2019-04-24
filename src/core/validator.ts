import VeeValidate from '../plugin';
import Dictionary from '../dictionary';
import RuleContainer from './ruleContainer';
import {
  isObject,
  getPath,
  isCallable,
  toArray,
  createError,
  isNullOrUndefined,
  normalizeRules,
  isEmptyArray
} from '../utils';
import { PartialI18nDictionary, RootI18nDictionary } from './i18n';
import { ValidationResult, ValidationRule, ValidationRuleSchema } from '../types';

let $vee: VeeValidate;

interface ValidatorOptions {
  bails?: boolean;
}

interface FieldMeta {
  name: string;
  rules: { [k: string]: any[] };
  bails: boolean;
  forceRequired: boolean;
  crossTable: { [k: string]: any };
}

export default class Validator {
  bails: boolean;
  constructor(options: ValidatorOptions = { bails: true }) {
    this.bails = !!(!isNullOrUndefined(options && options.bails) ? options.bails : true);
  }

  /**
   * Getter for the current locale.
   */
  get locale() {
    return Validator.locale;
  }

  /**
   * Setter for the validator locale.
   */
  set locale(value) {
    Validator.locale = value;
  }

  static get locale() {
    return Dictionary.getDriver().locale;
  }

  /**
   * Setter for the validator locale.
   */
  static set locale(value) {
    const hasChanged = value !== Dictionary.getDriver().locale;
    Dictionary.getDriver().locale = value;
    if (hasChanged && $vee && $vee.vm) {
      $vee.vm.$emit('localeChanged');
    }
  }

  static setVeeContext(value: VeeValidate) {
    $vee = value;
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  static extend(name: string, validator: ValidationRule, options: any = {}) {
    Validator._guardExtend(name, validator);
    // rules imported from the minimal bundle
    // will have the options embedded in them
    let mergedOpts = {};
    if ('options' in validator) {
      mergedOpts = validator.options;
    }

    Validator._merge(name, {
      validate: typeof validator === 'function' ? validator : validator.validate,
      getMessage: typeof validator === 'function' ? undefined : validator.getMessage,
      paramNames: (options && options.paramNames) || (validator as ValidationRuleSchema).paramNames,
      options: { hasTarget: false, immediate: true, ...mergedOpts, ...(options || {}) }
    });
  }

  /**
   * Adds and sets the current locale for the validator.
   */
  localize(lang: string, dictionary: PartialI18nDictionary) {
    Validator.localize(lang, dictionary);
  }

  static localize(rootDictionary: RootI18nDictionary): void;
  static localize(lang: string, langDictionary: PartialI18nDictionary): void;

  /**
   * Adds and sets the current locale for the validator.
   */
  static localize(lang: string | RootI18nDictionary, dictionary?: PartialI18nDictionary) {
    if (isObject(lang)) {
      Dictionary.getDriver().merge(lang);
      return;
    }

    // merge the dictionary.
    if (dictionary) {
      const locale = lang || dictionary.name;
      if (!locale) return;

      Dictionary.getDriver().merge({
        [locale]: dictionary
      });
    }

    if (lang) {
      // set the locale.
      Validator.locale = lang;
    }
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  extend(name: string, validator: ValidationRule, options: any) {
    Validator.extend(name, validator, options);
  }

  /**
   * Validates a value against the rules.
   */
  async validate(value: any, rules: string | { [k: string]: any }, options: any = {}): Promise<ValidationResult> {
    const field: FieldMeta = {
      name: (options && options.name) || '{field}',
      rules: normalizeRules(rules),
      bails: getPath('bails', options, this.bails),
      forceRequired: false,
      crossTable: options && options.values
    };

    return this._validate(field, value, options).then(result => {
      const errors: string[] = [];
      const ruleMap: { [k: string]: string } = {};
      result.errors.forEach((e: any) => {
        errors.push(e.msg);
        ruleMap[e.rule] = e.msg;
      });

      return {
        valid: result.valid,
        errors,
        failedRules: ruleMap
      };
    });
  }

  /**
   * Formats an error message for field and a rule.
   */
  private _formatErrorMessage(field: any, rule: any, data = {}, targetName: any = null) {
    const name = this._getFieldDisplayName(field);
    const params = this._getLocalizedParams(rule, targetName);

    return Dictionary.getDriver().getFieldMessage(this.locale, field.name, rule.name, [name, params, data]);
  }

  /**
   * We need to convert any object param to an array format since the locales do not handle params as objects yet.
   */
  private _convertParamObjectToArray(obj: any, ruleName: string) {
    if (Array.isArray(obj)) {
      return obj;
    }

    const paramNames = RuleContainer.getParamNames(ruleName);
    if (!paramNames || !isObject(obj)) {
      return obj;
    }

    return paramNames.reduce((prev: any, paramName: any) => {
      if (paramName in obj) {
        prev.push(obj[paramName]);
      }

      return prev;
    }, []);
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  private _getLocalizedParams(rule: any, targetName: string = '') {
    let params = this._convertParamObjectToArray(rule.params, rule.name);
    if (rule.options.hasTarget && params && params[0]) {
      const localizedName = targetName || Dictionary.getDriver().getAttribute(this.locale, params[0]) || params[0];

      return [localizedName].concat(params.slice(1));
    }

    return params;
  }

  /**
   * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
   */
  private _getFieldDisplayName(field: { alias?: string; name: string }) {
    return field.alias || Dictionary.getDriver().getAttribute(this.locale, field.name) || field.name;
  }

  /**
   * Converts an array of params to an object with named properties.
   * Only works if the rule is configured with a paramNames array.
   * Returns the same params if it cannot convert it.
   */
  private _convertParamArrayToObj(params: any[], ruleName: string) {
    const paramNames = RuleContainer.getParamNames(ruleName);
    if (!paramNames) {
      return params;
    }

    if (isObject(params)) {
      // check if the object is either a config object or a single parameter that is an object.
      const hasKeys = paramNames.some((name: string) => Object.keys(params).indexOf(name) !== -1);
      // if it has some of the keys, return it as is.
      if (hasKeys) {
        return params;
      }
      // otherwise wrap the object in an array.
      params = [params];
    }

    // Reduce the paramsNames to a param object.
    return params.reduce((prev, value, idx) => {
      prev[paramNames[idx]] = value;

      return prev;
    }, {});
  }

  /**
   * Tests a single input value against a rule.
   */
  private async _test(field: FieldMeta, value: any, rule: any) {
    const validator = RuleContainer.getValidatorMethod(rule.name);
    let params = Array.isArray(rule.params) ? toArray(rule.params) : rule.params;
    if (!params) {
      params = [];
    }

    let targetName: string = '';
    if (!validator) {
      throw createError(`No such validator '${rule.name}' exists.`);
    }

    // has field dependencies.
    if (rule.options.hasTarget && field.crossTable) {
      const targetId = params[0];
      if (targetId in field.crossTable) {
        const targetValue = field.crossTable[targetId];
        params = [targetValue].concat(params.slice(1));
      }
    } else if (rule.name === 'required' && field) {
      // invalidate false if no args were specified and the field rejects false by default.
      params = params.length ? params : [true];
    }

    let result = await validator(value, this._convertParamArrayToObj(params, rule.name));
    if (!isObject(result)) {
      result = { valid: result, data: {} };
    }

    return {
      valid: result.valid,
      data: result.data || {},
      errors: result.valid ? [] : [this._createFieldError(field, rule, result.data, targetName)]
    };
  }

  /**
   * Merges a validator object into the RULES and Messages.
   */
  private static _merge(name: string, { validate, options, paramNames, getMessage }: ValidationRuleSchema) {
    if (getMessage) {
      Dictionary.getDriver().merge({
        [Validator.locale]: {
          messages: {
            [name]: getMessage
          }
        }
      });
    }

    RuleContainer.add(name, {
      validate,
      options,
      paramNames
    });
  }

  /**
   * Guards from extension violations.
   */
  private static _guardExtend(name: string, validator: ValidationRule) {
    if (isCallable(validator)) {
      return;
    }

    if (isCallable(validator.validate)) {
      return;
    }

    throw createError(`Extension Error: The validator '${name}' must be a function or have a 'validate' method.`);
  }

  /**
   * Creates a Field Error Object.
   */
  private _createFieldError(field: FieldMeta, rule: any, data: any, targetName?: string) {
    return {
      field: field.name,
      msg: this._formatErrorMessage(field, rule, data, targetName),
      rule: rule.name,
      regenerate: () => {
        return this._formatErrorMessage(field, rule, data, targetName);
      }
    };
  }

  private async _shouldSkip(field: FieldMeta, value: any) {
    const requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);
    const length = requireRules.length;
    let isRequired = false;
    for (let i = 0; i < length; i++) {
      let rule = requireRules[i];
      let ruleOptions = RuleContainer.getOptions(rule);
      let result = await this._test(field, value, {
        name: rule,
        params: field.rules[rule],
        options: ruleOptions
      });

      if (!isObject(result)) {
        throw createError('Require rules has to return an object (see docs)');
      }

      if (result.data.required) {
        isRequired = true;
      }
    }

    // field is configured to run through the pipeline regardless
    if (!field.bails) {
      return false;
    }

    // skip if the field is not required and has an empty value.
    return !isRequired && (isNullOrUndefined(value) || value === '' || isEmptyArray(value));
  }

  /**
   * Starts the validation process.
   */
  private async _validate(field: FieldMeta, value: any, { isInitial = false } = {}) {
    const shouldSkip = await this._shouldSkip(field, value);
    if (shouldSkip) {
      return {
        valid: true,
        errors: []
      };
    }

    const errors: any[] = [];
    const rules = Object.keys(field.rules);
    const length = rules.length;
    for (let i = 0; i < length; i++) {
      if (isInitial && !RuleContainer.isImmediate(rules[i])) {
        continue;
      }

      const rule = rules[i];
      const ruleOptions = RuleContainer.getOptions(rule);
      const result = await this._test(field, value, {
        name: rule,
        params: field.rules[rule],
        options: ruleOptions
      });

      if (!result.valid) {
        errors.push(...result.errors);
        if (field.bails) {
          return {
            valid: false,
            errors
          };
        }
      }
    }

    return {
      valid: !errors.length,
      errors
    };
  }
}
