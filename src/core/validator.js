import ErrorBag from './errorBag';
import FieldBag from './fieldBag';
import Dictionary from '../dictionary';
import RuleContainer from './ruleContainer';
import Field from './field';
import { getConfig } from '../config';
import {
  isObject,
  getPath,
  isCallable,
  toArray,
  createError,
  assign,
  find,
  isNullOrUndefined,
  includes,
  normalizeRules,
  isEmptyArray,
  warn
} from '../utils';

// @flow

export default class Validator {
  errors: ErrorBag;
  fields: FieldBag;
  flags: MapObject;
  fastExit: boolean;
  paused: boolean;
  reset: (matcher) => Promise<void>;

  constructor (validations?: MapObject, options?: MapObject = { fastExit: true }, pluginContainer?: Object = null) {
    this.errors = new ErrorBag();
    this.fields = new FieldBag();
    this._createFields(validations);
    this.paused = false;
    this.fastExit = !isNullOrUndefined(options && options.fastExit) ? options.fastExit : true;
    this.$vee = pluginContainer || {
      _vm: {
        $nextTick: (cb) => isCallable(cb) ? cb() : Promise.resolve(),
        $emit: () => {},
        $off: () => {}
      }
    };
  }

  /**
   * @deprecated
   */
  static get rules () {
    if (process.env.NODE_ENV !== 'production') {
      warn('this accessor will be deprecated, use `import { rules } from "vee-validate"` instead.');
    }

    return RuleContainer.rules;
  }

  /**
   * @deprecated
   */
  get rules () {
    if (process.env.NODE_ENV !== 'production') {
      warn('this accessor will be deprecated, use `import { rules } from "vee-validate"` instead.');
    }

    return RuleContainer.rules;
  }

  get dictionary () {
    return Dictionary.getDriver();
  }

  static get dictionary () {
    return Dictionary.getDriver();
  }

  get flags () {
    return this.fields.items.reduce((acc, field) => {
      if (field.scope) {
        acc[`$${field.scope}`] = {
          [field.name]: field.flags
        };

        return acc;
      }

      acc[field.name] = field.flags;

      return acc;
    }, {});
  }

  /**
   * Getter for the current locale.
   */
  get locale (): string {
    return Validator.locale;
  }

  /**
   * Setter for the validator locale.
   */
  set locale (value: string): void {
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
    if (hasChanged && Validator.$vee && Validator.$vee._vm) {
      Validator.$vee._vm.$emit('localeChanged');
    }
  }

  /**
   * Static constructor.
   * @deprecated
   */
  static create (validations?: MapObject, options?: MapObject): Validator {
    if (process.env.NODE_ENV !== 'production') {
      warn('Please use `new` to create new validator instances.');
    }

    return new Validator(validations, options);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  static extend (name: string, validator: Rule | Object, options?: ExtendOptions = {}) {
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
   * Removes a rule from the list of validators.
   * @deprecated
   */
  static remove (name: string): void {
    if (process.env.NODE_ENV !== 'production') {
      warn('this method will be deprecated, you can still override your rules with `extend`');
    }

    RuleContainer.remove(name);
  }

  /**
   * Adds and sets the current locale for the validator.
  */
  localize (lang: string, dictionary?: MapObject): void {
    Validator.localize(lang, dictionary);
  }

  /**
   * Adds and sets the current locale for the validator.
   */
  static localize (lang: string | MapObject, dictionary?: MapObject) {
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
   * Registers a field to be validated.
   */
  attach (fieldOpts: FieldOptions): Field {
    // We search for a field with the same name & scope, having persist enabled
    const oldFieldMatcher = { name: fieldOpts.name, scope: fieldOpts.scope, persist: true };
    const oldField = fieldOpts.persist ? this.fields.find(oldFieldMatcher) : null;

    if (oldField) {
      // We keep the flags of the old field, then we remove its instance
      fieldOpts.flags = oldField.flags;
      oldField.destroy();
      this.fields.remove(oldField);
    }

    // fixes initial value detection with v-model and select elements.
    const value = fieldOpts.initialValue;
    const field = new Field(fieldOpts);
    this.fields.push(field);

    // validate the field initially
    if (field.immediate) {
      this.$vee._vm.$nextTick(() => this.validate(`#${field.id}`, value || field.value, { vmId: fieldOpts.vmId }));
    } else {
      this._validate(field, value || field.value, { initial: true }).then(result => {
        field.flags.valid = result.valid;
        field.flags.invalid = !result.valid;
      });
    }

    return field;
  }

  /**
   * Sets the flags on a field.
   */
  flag (name: string, flags: { [string]: boolean }, uid = null) {
    const field = this._resolveField(name, undefined, uid);
    if (!field || !flags) {
      return;
    }

    field.setFlags(flags);
  }

  /**
   * Removes a field from the validator.
   */
  detach (name: string, scope?: string | null, uid) {
    let field = isCallable(name.destroy) ? name : this._resolveField(name, scope, uid);
    if (!field) return;

    // We destroy/remove the field & error instances if it's not a `persist` one
    if (!field.persist) {
      field.destroy();
      this.errors.remove(field.name, field.scope, field.vmId);
      this.fields.remove(field);
    }
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  extend (name: string, validator: Rule | MapObject, options?: ExtendOptions = {}) {
    Validator.extend(name, validator, options);
  }

  reset (matcher) {
    // two ticks
    return this.$vee._vm.$nextTick().then(() => {
      return this.$vee._vm.$nextTick();
    }).then(() => {
      this.fields.filter(matcher).forEach(field => {
        field.waitFor(null);
        field.reset(); // reset field flags.
        this.errors.remove(field.name, field.scope, matcher && matcher.vmId);
      });
    });
  }

  /**
   * Updates a field, updating both errors and flags.
   */
  update (id: string, { scope }) {
    const field = this._resolveField(`#${id}`);
    if (!field) return;

    // remove old scope.
    this.errors.update(id, { scope });
  }

  /**
   * Removes a rule from the list of validators.
   * @deprecated
   */
  remove (name: string) {
    Validator.remove(name);
  }

  /**
   * Validates a value against a registered field validations.
   */
  validate (fieldDescriptor: string, value?: any, { silent, vmId } = {}): Promise<boolean> {
    if (this.paused) return Promise.resolve(true);

    // overload to validate all.
    if (isNullOrUndefined(fieldDescriptor)) {
      return this.validateScopes({ silent, vmId });
    }

    // overload to validate scope-less fields.
    if (fieldDescriptor === '*') {
      return this.validateAll(undefined, { silent, vmId });
    }

    // if scope validation was requested.
    if (/^(.+)\.\*$/.test(fieldDescriptor)) {
      const matched = fieldDescriptor.match(/^(.+)\.\*$/)[1];
      return this.validateAll(matched);
    }

    const field = this._resolveField(fieldDescriptor);
    if (!field) {
      return this._handleFieldNotFound(fieldDescriptor);
    }

    if (!silent) field.flags.pending = true;
    if (value === undefined) {
      value = field.value;
    }

    const validationPromise = this._validate(field, value);
    field.waitFor(validationPromise);

    return validationPromise.then(result => {
      if (!silent && field.isWaitingFor(validationPromise)) {
        // allow next validation to mutate the state.
        field.waitFor(null);
        this._handleValidationResults([result], vmId);
      }

      return result.valid;
    });
  }

  /**
   * Pauses the validator.
   */
  pause (): Validator {
    this.paused = true;

    return this;
  }

  /**
   * Resumes the validator.
   */
  resume (): Validator {
    this.paused = false;

    return this;
  }

  /**
   * Validates each value against the corresponding field validations.
   */
  validateAll (values?: string | MapObject, { silent, vmId } = {}): Promise<boolean> {
    if (this.paused) return Promise.resolve(true);

    let matcher = null;
    let providedValues = false;

    if (typeof values === 'string') {
      matcher = { scope: values, vmId };
    } else if (isObject(values)) {
      matcher = Object.keys(values).map(key => {
        return { name: key, vmId: vmId, scope: null };
      });
      providedValues = true;
    } else if (Array.isArray(values)) {
      matcher = values.map(key => {
        return typeof key === 'object' ? Object.assign({ vmId: vmId }, key) : { name: key, vmId: vmId };
      });
    } else {
      matcher = { scope: null, vmId: vmId };
    }

    return Promise.all(
      this.fields.filter(matcher).map(field => this._validate(field, providedValues ? values[field.name] : field.value))
    ).then(results => {
      if (!silent) {
        this._handleValidationResults(results, vmId);
      }

      return results.every(t => t.valid);
    });
  }

  /**
   * Validates all scopes.
   */
  validateScopes ({ silent, vmId } = {}): Promise<boolean> {
    if (this.paused) return Promise.resolve(true);

    return Promise.all(
      this.fields.filter({ vmId }).map(field => this._validate(field, field.value))
    ).then(results => {
      if (!silent) {
        this._handleValidationResults(results, vmId);
      }

      return results.every(t => t.valid);
    });
  }

  /**
   * Validates a value against the rules.
   */
  verify (value: any, rules: string | MapObject, options?: VerifyOptions = {}): Promise<VerifyOptions> {
    const field = {
      name: (options && options.name) || '{field}',
      rules: normalizeRules(rules),
      bails: getPath('bails', options, true),
      forceRequired: false,
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

    return this._validate(field, value).then(result => {
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
   * Perform cleanup.
   */
  destroy () {
    this.$vee._vm.$off('localeChanged');
  }

  /**
   * Creates the fields to be validated.
   */
  _createFields (validations?: MapObject) {
    if (!validations) return;

    Object.keys(validations).forEach(field => {
      const options = assign({}, { name: field, rules: validations[field] });
      this.attach(options);
    });
  }

  /**
   * Date rules need the existence of a format, so date_format must be supplied.
   */
  _getDateFormat (validations: Array<MapObject>): ?string {
    let format = null;
    if (validations.date_format && Array.isArray(validations.date_format)) {
      format = validations.date_format[0];
    }

    return format || Dictionary.getDriver().getDateFormat(this.locale);
  }

  /**
   * Formats an error message for field and a rule.
   */
  _formatErrorMessage (field: Field, rule: MapObject, data?: MapObject = {}, targetName?: string | null = null) {
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
  _getLocalizedParams (rule: MapObject, targetName?: string | null = null) {
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
  _getFieldDisplayName (field: Field) {
    return field.alias || Dictionary.getDriver().getAttribute(this.locale, field.name, field.name);
  }

  /**
   * Converts an array of params to an object with named properties.
   * Only works if the rule is configured with a paramNames array.
   * Returns the same params if it cannot convert it.
   */
  _convertParamArrayToObj (params, ruleName): MapObject | Array {
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
  _test (field: Field, value: any, rule: MapObject): ValidationResult | Promise<ValidationResult> {
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

    if (rule.options.isDate) {
      const dateFormat = this._getDateFormat(field.rules);
      if (rule.name !== 'date_format') {
        params.push(dateFormat);
      }
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
  static _merge (name: string, { validator, options, paramNames }) {
    const validate = isCallable(validator) ? validator : validator.validate;
    if (validator.getMessage) {
      Dictionary.getDriver().setMessage(Validator.locale, name, validator.getMessage);
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
  static _guardExtend (name: string, validator: Rule) {
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
  _createFieldError (field: Field, rule: MapObject, data: MapObject, targetName?: string): FieldError {
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

  /**
   * Tries different strategies to find a field.
   */
  _resolveField (name: string, scope: string | null, uid): ?Field {
    if (name[0] === '#') {
      return this.fields.findById(name.slice(1));
    }

    if (!isNullOrUndefined(scope)) {
      return this.fields.find({ name, scope, vmId: uid });
    }

    if (includes(name, '.')) {
      const [fieldScope, ...fieldName] = name.split('.');
      const field = this.fields.find({ name: fieldName.join('.'), scope: fieldScope, vmId: uid });
      if (field) {
        return field;
      }
    }

    return this.fields.find({ name, scope: null, vmId: uid });
  }

  /**
   * Handles when a field is not found.
   */
  _handleFieldNotFound (name: string, scope?: string | null) {
    const fullName = isNullOrUndefined(scope) ? name : `${!isNullOrUndefined(scope) ? scope + '.' : ''}${name}`;

    return Promise.reject(createError(
      `Validating a non-existent field: "${fullName}". Use "attach()" first.`
    ));
  }

  /**
   * Handles validation results.
   */
  _handleValidationResults (results, vmId) {
    const matchers = results.map(result => ({ id: result.id }));
    this.errors.removeById(matchers.map(m => m.id));
    // remove by name and scope to remove any custom errors added.
    results.forEach(result => {
      this.errors.remove(result.field, result.scope, vmId);
    });
    const allErrors = results.reduce((prev, curr) => {
      prev.push(...curr.errors);

      return prev;
    }, []);

    this.errors.add(allErrors);

    // handle flags.
    this.fields.filter(matchers).forEach(field => {
      const result = find(results, r => r.id === field.id);
      field.setFlags({
        pending: false,
        valid: result.valid,
        validated: true
      });
    });
  }

  _shouldSkip (field, value) {
    // field is configured to run through the pipeline regardless
    if (field.bails === false) {
      return false;
    }

    // disabled fields are skipped if useConstraintAttrs is enabled in config
    if (field.isDisabled && getConfig().useConstraintAttrs) {
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

    return this.fastExit;
  }

  /**
   * Starts the validation process.
   */
  _validate (field: Field, value: any, { initial } = {}): Promise<ValidationResult> {
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
    if (isCallable(field.checkValueChanged)) {
      field.flags.changed = field.checkValueChanged();
    }

    // use of '.some()' is to break iteration in middle by returning true
    Object.keys(field.rules).filter(rule => {
      if (!initial || !RuleContainer.has(rule)) return true;

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
