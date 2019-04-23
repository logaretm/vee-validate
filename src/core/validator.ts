import VeeValidate from '../plugin';
import Dictionary from '../dictionary';
import RuleContainer from './ruleContainer';
import {
  isObject,
  getPath,
  isCallable,
  toArray,
  createError,
  find,
  isNullOrUndefined,
  normalizeRules,
  isEmptyArray,
  isPromise
} from '../utils';
import { PartialI18nDictionary, RootI18nDictionary } from './i18n';
import { ValidationResult, ValidationRule, ValidationRuleSchema } from '../types';

let $vee: VeeValidate;

interface ValidatorOptions {
  bails?: boolean;
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
  validate(value: any, rules: any, options: any = {}): Promise<ValidationResult> {
    const field: any = {
      name: (options && options.name) || '{field}',
      rules: getPath('isNormalized', options, false) ? rules : normalizeRules(rules),
      bails: getPath('bails', options, true),
      forceRequired: false,
      dependencies: [],
      get isRequired() {
        return !!this.rules.required || this.forceRequired;
      }
    };

    const targetRules = Object.keys(field.rules).filter(RuleContainer.isTargetRule);
    if (targetRules.length && options && isObject(options.values)) {
      field.dependencies = targetRules.map(rule => {
        const [targetKey] = field.rules[rule];

        return {
          name: rule,
          field: { value: options.values[targetKey] }
        };
      });
    }

    return this._validate(field, value, { initial: options.isInitial }).then(result => {
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
  private _test(field: any, value: any, rule: any) {
    const validator = RuleContainer.getValidatorMethod(rule.name);
    let params = Array.isArray(rule.params) ? toArray(rule.params) : rule.params;
    if (!params) {
      params = [];
    }

    let targetName: string = '';
    if (!validator) {
      return Promise.reject(createError(`No such validator '${rule.name}' exists.`));
    }

    // has field dependencies.
    if (rule.options.hasTarget && field.dependencies) {
      const target = find(field.dependencies, (d: any) => d.name === rule.name);
      if (target) {
        targetName = target.field.alias;
        params = [target.field.value].concat(params.slice(1));
      }
    } else if (rule.name === 'required' && field.rejectsFalse) {
      // invalidate false if no args were specified and the field rejects false by default.
      params = params.length ? params : [true];
    }

    let result = validator(value, this._convertParamArrayToObj(params, rule.name));

    // If it is a promise.
    if (isPromise(result)) {
      return result.then((values: any) => {
        let allValid = true;
        let data = {};
        if (Array.isArray(values)) {
          allValid = values.every(t => (isObject(t) ? t.valid : t));
        } else {
          // Is a single object/boolean.
          allValid = isObject(values) ? values.valid : values;
          data = values.data;
        }

        return {
          valid: allValid,
          data,
          errors: allValid ? [] : [this._createFieldError(field, rule, data, targetName)]
        };
      });
    }

    if (!isObject(result)) {
      result = { valid: result, data: {} };
    }

    return {
      valid: result.valid,
      data: result.data,
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
  private _createFieldError(field: any, rule: any, data: any, targetName?: string) {
    return {
      id: field.id,
      vmId: field.vmId,
      field: field.name,
      msg: this._formatErrorMessage(field, rule, data, targetName),
      rule: rule.name,
      scope: field.scope,
      regenerate: () => {
        return this._formatErrorMessage(field, rule, data, targetName);
      }
    };
  }

  private _shouldSkip(field: any, value: any) {
    // field is configured to run through the pipeline regardless
    if (field.bails === false) {
      return false;
    }

    // disabled fields are skipped
    if (field.isDisabled) {
      return true;
    }

    // skip if the field is not required and has an empty value.
    return !field.isRequired && (isNullOrUndefined(value) || value === '' || isEmptyArray(value));
  }

  private _shouldBail(field: any) {
    // if the field was configured explicitly.
    if (field.bails !== undefined) {
      return field.bails;
    }

    return this.bails;
  }

  /**
   * Starts the validation process.
   */
  private _validate(field: any, value: any, { initial = false } = {}) {
    let requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);

    field.forceRequired = false;
    requireRules.forEach(rule => {
      let ruleOptions = RuleContainer.getOptions(rule);
      let result = this._test(field, value, {
        name: rule,
        params: field.rules[rule],
        options: ruleOptions
      });

      if (isPromise(result)) {
        throw createError('Require rules cannot be async');
      }
      if (!isObject(result)) {
        throw createError('Require rules has to return an object (see docs)');
      }

      if (result.data.required === true) {
        field.forceRequired = true;
      }
    });

    if (this._shouldSkip(field, value)) {
      return Promise.resolve({
        valid: true,
        id: field.id,
        field: field.name,
        scope: field.scope,
        errors: []
      });
    }

    const promises: any[] = [];
    const errors: any[] = [];
    let isExitEarly = false;
    // use of '.some()' is to break iteration in middle by returning true
    Object.keys(field.rules)
      .filter(rule => {
        if (!initial) return true;

        return RuleContainer.isImmediate(rule);
      })
      .some(rule => {
        const ruleOptions = RuleContainer.getOptions(rule);
        const result = this._test(field, value, {
          name: rule,
          params: field.rules[rule],
          options: ruleOptions
        });
        if (isPromise(result)) {
          promises.push(result);
        } else if (!result.valid && this._shouldBail(field)) {
          errors.push(...result.errors);
          isExitEarly = true;
        } else {
          // promisify the result.
          promises.push(new Promise(resolve => resolve(result)));
        }

        return isExitEarly;
      });

    if (isExitEarly) {
      return Promise.resolve({
        valid: false,
        errors,
        id: field.id,
        field: field.name,
        scope: field.scope
      });
    }

    return Promise.all(promises).then(results => {
      return results.reduce(
        (prev, v) => {
          if (!v.valid) {
            prev.errors.push(...v.errors);
          }

          prev.valid = prev.valid && v.valid;

          return prev;
        },
        {
          valid: true,
          errors,
          id: field.id,
          field: field.name,
          scope: field.scope
        }
      );
    });
  }
}
