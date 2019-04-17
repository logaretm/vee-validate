
import Dictionary from '../dictionary';
import RuleContainer from './ruleContainer';
import {
  isObject,
  getPath,
  isCallable,
  toArray,
  createError,
  assign,
  find,
  isNullOrUndefined,
  normalizeRules,
  isEmptyArray
} from '../utils';

let $vee;

export default class Validator {
  bails: boolean;
  constructor (options = { bails: true }) {
    this.bails = !isNullOrUndefined(options && options.bails) ? options.bails : true;
  }

  /**
   * Getter for the current locale.
   */
  get locale () {
    return Validator.locale;
  }

  /**
   * Setter for the validator locale.
   */
  set locale (value) {
    Validator.locale = value;
  }

  static get locale () {
    return Dictionary.getDriver().locale;
  }

  /**
   * Setter for the validator locale.
   */
  static set locale (value) {
    const hasChanged = value !== Dictionary.getDriver().locale;
    Dictionary.getDriver().locale = value;
    if (hasChanged && $vee && $vee.vm) {
      $vee.vm.$emit('localeChanged');
    }
  }

  static setVeeContext (value) {
    $vee = value;
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  static extend (name, validator, options: any = {}) {
    Validator._guardExtend(name, validator);
    // rules imported from the minimal bundle
    // will have the options embedded in them
    const mergedOpts = validator.options || {};
    Validator._merge(name, {
      validator,
      paramNames: (options && options.paramNames) || validator.paramNames,
      options: assign({ hasTarget: false, immediate: true }, mergedOpts, options || {})
    });
  }

  /**
   * Adds and sets the current locale for the validator.
  */
  localize (lang, dictionary) {
    Validator.localize(lang, dictionary);
  }

  static localize(rootDictionary): void;
  static localize(lang, langDictionary): void;


  /**
   * Adds and sets the current locale for the validator.
   */
  static localize (lang, dictionary?: any) {
    if (isObject(lang)) {
      Dictionary.getDriver().merge(lang);
      return;
    }

    // merge the dictionary.
    if (dictionary) {
      const locale = lang || dictionary.name;
      dictionary = assign({}, dictionary);
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
  extend (name, validator, options) {
    Validator.extend(name, validator, options);
  }

  /**
   * Validates a value against the rules.
   */
  verify (value, rules, options: any = {}) {
    const field = {
      name: (options && options.name) || '{field}',
      rules: getPath('isNormalized', options, false) ? rules : normalizeRules(rules),
      bails: getPath('bails', options, true),
      forceRequired: false,
      dependencies: [],
      get isRequired () {
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
      const errors = [];
      const ruleMap = {};
      result.errors.forEach(e => {
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
  _formatErrorMessage (field, rule, data = {}, targetName = null) {
    const name = this._getFieldDisplayName(field);
    const params = this._getLocalizedParams(rule, targetName);

    return Dictionary.getDriver().getFieldMessage(this.locale, field.name, rule.name, [name, params, data]);
  }

  /**
   * We need to convert any object param to an array format since the locales do not handle params as objects yet.
   */
  _convertParamObjectToArray (obj, ruleName) {
    if (Array.isArray(obj)) {
      return obj;
    }

    const paramNames = RuleContainer.getParamNames(ruleName);
    if (!paramNames || !isObject(obj)) {
      return obj;
    }

    return paramNames.reduce((prev, paramName) => {
      if (paramName in obj) {
        prev.push(obj[paramName]);
      }

      return prev;
    }, []);
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  _getLocalizedParams (rule, targetName = null) {
    let params = this._convertParamObjectToArray(rule.params, rule.name);
    if (rule.options.hasTarget && params && params[0]) {
      const localizedName = targetName || Dictionary.getDriver().getAttribute(this.locale, params[0], params[0]);
      return [localizedName].concat(params.slice(1));
    }

    return params;
  }

  /**
   * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
   */
  _getFieldDisplayName (field) {
    return field.alias || Dictionary.getDriver().getAttribute(this.locale, field.name, field.name);
  }

  /**
   * Converts an array of params to an object with named properties.
   * Only works if the rule is configured with a paramNames array.
   * Returns the same params if it cannot convert it.
   */
  _convertParamArrayToObj (params, ruleName) {
    const paramNames = RuleContainer.getParamNames(ruleName);
    if (!paramNames) {
      return params;
    }

    if (isObject(params)) {
      // check if the object is either a config object or a single parameter that is an object.
      const hasKeys = paramNames.some(name => Object.keys(params).indexOf(name) !== -1);
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
  _test (field, value, rule) {
    const validator = RuleContainer.getValidatorMethod(rule.name);
    let params = Array.isArray(rule.params) ? toArray(rule.params) : rule.params;
    if (!params) {
      params = [];
    }

    let targetName = null;
    if (!validator || typeof validator !== 'function') {
      return Promise.reject(createError(`No such validator '${rule.name}' exists.`));
    }

    // has field dependencies.
    if (rule.options.hasTarget && field.dependencies) {
      const target = find(field.dependencies, d => d.name === rule.name);
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
    if (isCallable(result.then)) {
      return result.then(values => {
        let allValid = true;
        let data = {};
        if (Array.isArray(values)) {
          allValid = values.every(t => (isObject(t) ? t.valid : t));
        } else { // Is a single object/boolean.
          allValid = isObject(values) ? values.valid : values;
          data = values.data;
        }

        return {
          valid: allValid,
          data: result.data,
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
  static _merge (name, { validator, options, paramNames }) {
    const validate = isCallable(validator) ? validator : validator.validate;
    if (validator.getMessage) {
      Dictionary.getDriver().merge({
        [Validator.locale]: {
          messages: {
            [name]: validator.getMessage
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
  static _guardExtend (name, validator) {
    if (isCallable(validator)) {
      return;
    }

    if (!isCallable(validator.validate)) {
      throw createError(
        `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
      );
    }
  }

  /**
   * Creates a Field Error Object.
   */
  _createFieldError (field, rule, data, targetName) {
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

  _shouldSkip (field, value) {
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

  _shouldBail (field) {
    // if the field was configured explicitly.
    if (field.bails !== undefined) {
      return field.bails;
    }

    return this.bails;
  }

  /**
   * Starts the validation process.
   */
  _validate (field, value, { initial = false } = {}) {
    let requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);

    field.forceRequired = false;
    requireRules.forEach(rule => {
      let ruleOptions = RuleContainer.getOptions(rule);
      let result = this._test(field, value, { name: rule, params: field.rules[rule], options: ruleOptions });

      if (isCallable(result.then)) { throw createError('Require rules cannot be async'); }
      if (!isObject(result)) { throw createError('Require rules has to return an object (see docs)'); }

      if (result.data.required === true) {
        field.forceRequired = true;
      }
    });

    if (this._shouldSkip(field, value)) {
      return Promise.resolve({ valid: true, id: field.id, field: field.name, scope: field.scope, errors: [] });
    }

    const promises = [];
    const errors = [];
    let isExitEarly = false;
    // use of '.some()' is to break iteration in middle by returning true
    Object.keys(field.rules).filter(rule => {
      if (!initial) return true;

      return RuleContainer.isImmediate(rule);
    }).some(rule => {
      const ruleOptions = RuleContainer.getOptions(rule);
      const result = this._test(field, value, { name: rule, params: field.rules[rule], options: ruleOptions });
      if (isCallable(result.then)) {
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
      return Promise.resolve({ valid: false, errors, id: field.id, field: field.name, scope: field.scope });
    }

    return Promise.all(promises).then(results => {
      return results.reduce((prev, v) => {
        if (!v.valid) {
          prev.errors.push(...v.errors);
        }

        prev.valid = prev.valid && v.valid;

        return prev;
      }, { valid: true, errors, id: field.id, field: field.name, scope: field.scope });
    });
  }
}
