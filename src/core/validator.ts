import VeeValidate from '../plugin';
import Dictionary from '../dictionary';
import RuleContainer from './ruleContainer';
import { PartialI18nDictionary, RootI18nDictionary } from './i18n';
import { isObject, getPath, isCallable, createError, isNullOrUndefined, normalizeRules, isEmptyArray } from '../utils';
import { ValidationResult, ValidationRule, ValidationRuleSchema, RuleParamSchema } from '../types';

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
  names: { [k: string]: any };
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
  static extend(name: string, schema: ValidationRule) {
    // makes sure new rules are properly formatted.
    Validator._guardExtend(name, schema);

    // Full schema object.
    if (typeof schema === 'object') {
      Validator._extendRule(name, schema);
      return;
    }

    Validator._extendRule(name, {
      validate: schema
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
  extend(name: string, schema: ValidationRule) {
    Validator.extend(name, schema);
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
      crossTable: options && options.values,
      names: (options && options.names) || {}
    };

    const result = await this._validate(field, value, options);
    const errors: string[] = [];
    const ruleMap: { [k: string]: string } = {};
    result.errors.forEach(e => {
      errors.push(e.msg);
      ruleMap[e.rule] = e.msg;
    });

    return {
      valid: result.valid,
      errors,
      failedRules: ruleMap
    };
  }

  /**
   * Starts the validation process.
   */
  private async _validate(field: FieldMeta, value: any, { isInitial = false } = {}) {
    const { shouldSkip, errors } = await this._shouldSkip(field, value);
    if (shouldSkip) {
      return {
        valid: !errors.length,
        errors
      };
    }

    // Filter out non-require rules since we already checked them.
    const rules = Object.keys(field.rules).filter(rule => !RuleContainer.isRequireRule(rule));
    const length = rules.length;
    for (let i = 0; i < length; i++) {
      if (isInitial && !RuleContainer.isImmediate(rules[i])) {
        continue;
      }

      const rule = rules[i];
      const result = await this._test(field, value, {
        name: rule,
        params: field.rules[rule]
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

  private async _shouldSkip(field: FieldMeta, value: any) {
    const requireRules = Object.keys(field.rules).filter(RuleContainer.isRequireRule);
    const length = requireRules.length;
    const errors: ReturnType<typeof Validator.prototype._createFieldError>[] = [];
    let isRequired = false;
    for (let i = 0; i < length; i++) {
      let rule = requireRules[i];
      let result = await this._test(field, value, {
        name: rule,
        params: field.rules[rule]
      });

      if (!isObject(result)) {
        throw createError('Require rules has to return an object (see docs)');
      }

      if (result.data.required) {
        isRequired = true;
      }

      if (!result.valid) {
        errors.push(...result.errors);
        // Exit early as the field is required and failed validation.
        if (field.bails) {
          return {
            shouldSkip: true,
            errors
          };
        }
      }
    }

    // field is configured to run through the pipeline regardless
    if (!field.bails) {
      return {
        shouldSkip: false,
        errors
      };
    }

    // skip if the field is not required and has an empty value.
    return {
      shouldSkip: !isRequired && (isNullOrUndefined(value) || value === '' || isEmptyArray(value)),
      errors
    };
  }

  /**
   * Tests a single input value against a rule.
   */
  private async _test(field: FieldMeta, value: any, rule: { name: string; params: any[] | object }) {
    const ruleSchema = RuleContainer.getRuleDefinition(rule.name);
    if (!ruleSchema.validate) {
      throw createError(`No such validator '${rule.name}' exists.`);
    }

    // build params
    const params = this._buildParams(rule.params, ruleSchema.params, field.crossTable);
    let result = await ruleSchema.validate(value, params);
    if (!isObject(result)) {
      result = { valid: result, data: {} };
    }

    return {
      valid: result.valid,
      data: result.data || {},
      errors: result.valid ? [] : [this._createFieldError(field, rule, params, result.data)]
    };
  }

  private _buildParams(
    provided: any[] | { [k: string]: any },
    defined: RuleParamSchema[] | undefined,
    crossTable: { [k: string]: any }
  ) {
    const params: { [k: string]: any } = {};
    if (!defined && !Array.isArray(provided)) {
      throw createError('You provided an object params to a rule that has no defined schema.');
    }

    // Rule probably uses an array for their args, keep it as is.
    if (Array.isArray(provided) && !defined) {
      return provided;
    }

    let definedRules: RuleParamSchema[];
    // collect the params schema.
    if (!defined || defined.length < provided.length) {
      let lastDefinedParam: RuleParamSchema;
      // collect any additional parameters in the last item.
      definedRules = provided.map((_: any, idx: number) => {
        let param = defined && defined[idx];
        lastDefinedParam = param || lastDefinedParam;
        if (!param) {
          param = lastDefinedParam;
        }

        return param;
      });
    } else {
      definedRules = defined;
    }

    // Match the provided array length with a temporary schema.
    for (let i = 0; i < definedRules.length; i++) {
      const options = definedRules[i];
      let value = options.default;
      // if the provided is an array, map element value.
      if (Array.isArray(provided)) {
        if (i in provided) {
          value = provided[i];
        }
      } else {
        // map it from the object if it exists.
        value = options.name in provided ? provided[options.name] : value;
      }

      // if the param is a target, resolve the target value.
      if (options.isTarget) {
        value = crossTable[value];
      }

      // If there is a transformer defined.
      if (options.cast) {
        value = options.cast(value);
      }

      // already been set, probably multiple values.
      if (params[options.name]) {
        params[options.name] = Array.isArray(params[options.name]) ? params[options.name] : [params[options.name]];
        params[options.name].push(value);
      } else {
        // set the value.
        params[options.name] = value;
      }
    }

    return params;
  }

  /**
   * Merges a validator object into the RULES and Messages.
   */
  private static _extendRule(name: string, schema: ValidationRuleSchema) {
    if (schema.message) {
      Dictionary.getDriver().merge({
        [Validator.locale]: {
          messages: {
            [name]: schema.message
          }
        }
      });
    }

    RuleContainer.extend(name, schema);
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

    if (RuleContainer.getRuleDefinition(name)) {
      return;
    }

    throw createError(`Extension Error: The validator '${name}' must be a function or have a 'validate' method.`);
  }

  /**
   * Creates a Field Error Object.
   */
  private _createFieldError(field: FieldMeta, rule: any, params: any, data: any) {
    return {
      field: field.name,
      msg: this._formatErrorMessage(field, rule, params, data),
      rule: rule.name,
      regenerate: () => {
        return this._formatErrorMessage(field, rule, params, data);
      }
    };
  }

  /**
   * Formats an error message for field and a rule.
   */
  private _formatErrorMessage(field: FieldMeta, rule: any, params: any, data: any = {}) {
    const name = this._getFieldDisplayName(field);
    data.targetName = field.names[rule.name] || '{target}';
    data.targetName = Dictionary.getDriver().getAttribute(this.locale, data.targetName) || data.targetName;

    return Dictionary.getDriver().getFieldMessage(this.locale, field.name, rule.name, [name, params, data]);
  }

  /**
   * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
   */
  private _getFieldDisplayName(field: { alias?: string; name: string }) {
    return field.alias || Dictionary.getDriver().getAttribute(this.locale, field.name) || field.name;
  }
}
