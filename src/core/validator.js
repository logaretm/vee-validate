import ErrorBag from './errorBag';
import { isObject, isCallable, toArray, createError, assign, find, isNullOrUndefined, warn } from './utils';
import Field from './field';
import FieldBag from './fieldBag';
import Config from '../config';

// @flow

const RULES: { [string]: Rule } = {};
let STRICT_MODE: boolean = true;
const TARGET_RULES = ['confirmed', 'after', 'before'];

export default class Validator {
  strict: boolean;
  errors: ErrorBag;
  fields: FieldBag;
  flags: MapObject;
  fastExit: boolean;
  paused: boolean;
  ownerId: string | number;
  reset: (matcher) => Promise<void>;

  constructor (validations?: MapObject, options?: MapObject = { fastExit: true }) {
    this.strict = STRICT_MODE;
    this.errors = new ErrorBag();
    this.fields = new FieldBag();
    this.flags = {};
    this._createFields(validations);
    this.paused = false;
    this.fastExit = options.fastExit || false;
    this.ownerId = options.vm && options.vm._uid;
    this._localeListener = () => {
      this.errors.regenerate();
    };

    if (this._vm) {
      this._vm.$on('localeChanged', this._localeListener);
    }
  }

  /**
   * Getter for the dictionary.
   */
  get dictionary (): IDictionary {
    return Config.dependency('dictionary');
  }

  get _vm () {
    return Config.dependency('vm');
  }

  /**
   * Static Getter for the dictionary.
   */
  static get dictionary (): IDictionary {
    return Config.dependency('dictionary');
  }

  /**
   * Getter for the current locale.
   */
  get locale (): string {
    return this.dictionary.locale;
  }

  /**
   * Setter for the validator locale.
   */
  set locale (value: string): void {
    Validator.locale = value;
  }

  /**
  * Static getter for the validator locale.
  */
  static get locale (): string {
    return Validator.dictionary.locale;
  }

  /**
   * Static setter for the validator locale.
   */
  static set locale (value: string): void {
    const hasChanged = value !== Validator.dictionary.locale;
    Validator.dictionary.locale = value;
    if (hasChanged && Config.dependency('vm')) {
      Config.dependency('vm').$emit('localeChanged');
    }
  }

  /**
   * Getter for the rules object.
   */
  get rules (): { [string]: Rule } {
    return RULES;
  }

  /**
   * Static Getter for the rules object.
   */
  static get rules (): { [string]: Rule } {
    return RULES;
  }

  /**
   * Static constructor.
   */
  static create (validations?: MapObject, options?: MapObject): Validator {
    return new Validator(validations, options);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  static extend (name: string, validator: Rule | Object, options?: ExtendOptions = {}) {
    Validator._guardExtend(name, validator);
    Validator._merge(name, validator);
    if (options && options.hasTarget) {
      TARGET_RULES.push(name);
    }
  }

  /**
   * Removes a rule from the list of validators.
   */
  static remove (name: string): void {
    delete RULES[name];
    const idx = TARGET_RULES.indexOf(name);
    if (idx === -1) return;

    TARGET_RULES.splice(idx, 1);
  }

  /**
   * Checks if the given rule name is a rule that targets other fields.
   */
  static isTargetRule (name: string): boolean {
    return TARGET_RULES.indexOf(name) !== -1;
  }

  /**
   * Sets the operating mode for all newly created validators.
   * strictMode = true: Values without a rule are invalid and cause failure.
   * strictMode = false: Values without a rule are valid and are skipped.
   */
  static setStrictMode (strictMode?: boolean = true) {
    STRICT_MODE = strictMode;
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
      Validator.dictionary.merge(lang);
      return;
    }

    // merge the dictionary.
    if (dictionary) {
      const locale = lang || dictionary.name;
      dictionary = assign({}, dictionary);
      Validator.dictionary.merge({
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
  attach (field: FieldOptions | Field): Field {
    // deprecate: handle old signature.
    /* istanbul ignore next */
    if (arguments.length > 1) {
      warn('This signature of the attach method has been deprecated, please consult the docs.');
      field = assign({}, {
        name: arguments[0],
        rules: arguments[1]
      }, arguments[2] || { vm: { $validator: this } });
    }

    // fixes initial value detection with v-model and select elements.
    const value = field.initialValue;
    if (!(field instanceof Field)) {
      field = new Field(field);
    }

    this.fields.push(field);

    // validate the field initially
    if (field.initial) {
      this.validate(`#${field.id}`, value || field.value);
    } else {
      this._validate(field, value || field.value, true).then(result => {
        field.flags.valid = result.valid;
        field.flags.invalid = !result.valid;
      });
    }

    this._addFlag(field, field.scope);
    return field;
  }

  /**
   * Sets the flags on a field.
   */
  flag (name: string, flags: { [string]: boolean }) {
    const field = this._resolveField(name);
    if (! field || !flags) {
      return;
    }

    field.setFlags(flags);
  }

  /**
   * Removes a field from the validator.
   */
  detach (name: string, scope?: string | null) {
    let field = name instanceof Field ? name : this._resolveField(name, scope);
    if (!field) return;

    field.destroy();
    this.errors.remove(field.name, field.scope, field.id);
    this.fields.remove(field);
    const flags = this.flags;
    if (!isNullOrUndefined(field.scope) && flags[`$${field.scope}`]) {
      delete flags[`$${field.scope}`][field.name];
    } else if (isNullOrUndefined(field.scope)) {
      delete flags[field.name];
    }

    this.flags = assign({}, flags);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   */
  extend (name: string, validator: Rule | MapObject, options?: ExtendOptions = {}) {
    Validator.extend(name, validator, options);
  }

  async reset (matcher) {
    // two ticks
    await this._vm.$nextTick();
    await this._vm.$nextTick();

    this.fields.filter(matcher).forEach(field => {
      field.reset(); // reset field flags.
      this.errors.remove(field.name, field.scope, field.id);
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
    if (!isNullOrUndefined(field.scope) && this.flags[`$${field.scope}`]) {
      delete this.flags[`$${field.scope}`][field.name];
    } else if (isNullOrUndefined(field.scope)) {
      delete this.flags[field.name];
    }

    this._addFlag(field, scope);
  }

  /**
   * Removes a rule from the list of validators.
   */
  remove (name: string) {
    Validator.remove(name);
  }

  /**
   * Validates a value against a registered field validations.
   */
  async validate (name: string, value: any, scope?: string | null = null, silent?: boolean = false): Promise<boolean> {
    if (this.paused) return Promise.resolve(true);

    // overload to validate all.
    if (arguments.length === 0) {
      return this.validateScopes();
    }

    // overload to validate scope-less fields.
    if (arguments.length === 1 && arguments[0] === '*') {
      return this.validateAll();
    }

    // overload to validate a scope.
    if (arguments.length === 1 && typeof arguments[0] === 'string' && /^(.+)\.\*$/.test(arguments[0])) {
      const matched = arguments[0].match(/^(.+)\.\*$/)[1];
      return this.validateAll(matched);
    }

    const field = this._resolveField(name, scope);
    if (!field) {
      return this._handleFieldNotFound(name, scope);
    }

    if (!silent) field.flags.pending = true;
    if (arguments.length === 1) {
      value = field.value;
    }

    if (field.isDisabled) {
      return true;
    }

    const result = await this._validate(field, value);
    if (!silent) {
      this._handleValidationResults([result]);
    }

    return result.valid;
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
  async validateAll (values?: string | MapObject, scope?: string | null = null, silent?: boolean = false): Promise<boolean> {
    if (this.paused) return true;

    let matcher = null;
    let providedValues = false;

    if (typeof values === 'string') {
      matcher = { scope: values };
    } else if (isObject(values)) {
      matcher = Object.keys(values).map(key => {
        return { name: key, scope };
      });
      providedValues = true;
    } else if (Array.isArray(values)) {
      matcher = values.map(key => {
        return { name: key, scope };
      });
    } else {
      matcher = { scope };
    }

    const results = await Promise.all(
      this.fields.filter(matcher).map(field => this._validate(field, providedValues ? values[field.name] : field.value))
    );

    if (!silent) {
      this._handleValidationResults(results);
    }

    return results.every(t => t.valid);
  }

  /**
   * Validates all scopes.
   */
  async validateScopes (silent?: boolean = false): Promise<boolean> {
    if (this.paused) return true;

    const results = await Promise.all(
      this.fields.map(field => this._validate(field, field.value))
    );

    if (!silent) {
      this._handleValidationResults(results);
    }

    return results.every(t => t.valid);
  }

  /**
   * Perform cleanup.
   */
  destroy () {
    this._vm.$off('localeChanged', this._localeListener);
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

    return format || this.dictionary.getDateFormat(this.locale);
  }

  /**
   * Checks if the passed rule is a date rule.
   */
  _isADateRule (rule: string) {
    return !! ~['after', 'before', 'date_between', 'date_format'].indexOf(rule);
  }

  /**
   * Formats an error message for field and a rule.
   */
  _formatErrorMessage (field: Field, rule: MapObject, data?: MapObject = {}, targetName?: string | null = null) {
    const name = this._getFieldDisplayName(field);
    const params = this._getLocalizedParams(rule, targetName);

    return this.dictionary.getFieldMessage(this.locale, field.name, rule.name, [name, params, data]);
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  _getLocalizedParams (rule: MapObject, targetName?: string | null = null) {
    if (~TARGET_RULES.indexOf(rule.name) && rule.params && rule.params[0]) {
      const localizedName = targetName || this.dictionary.getAttribute(this.locale, rule.params[0], rule.params[0]);
      return [localizedName].concat(rule.params.slice(1));
    }

    return rule.params;
  }

  /**
   * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
   */
  _getFieldDisplayName (field: Field) {
    return field.alias || this.dictionary.getAttribute(this.locale, field.name, field.name);
  }

  /**
   * Adds a field flags to the flags collection.
   */
  _addFlag (field: Field, scope?: string | null = null) {
    if (isNullOrUndefined(scope)) {
      this.flags = assign({}, this.flags, { [`${field.name}`]: field.flags });
      return;
    }

    const scopeObj = assign({}, this.flags[`$${scope}`] || {}, { [`${field.name}`]: field.flags });
    this.flags = assign({}, this.flags, { [`$${scope}`]: scopeObj });
  }

  /**
   * Tests a single input value against a rule.
   */
  _test (field: Field, value: any, rule: MapObject): ValidationResult | Promise<ValidationResult> {
    const validator = RULES[rule.name];
    let params = Array.isArray(rule.params) ? toArray(rule.params) : [];
    let targetName = null;
    if (!validator || typeof validator !== 'function') {
      throw createError(`No such validator '${rule.name}' exists.`);
    }

    // has field dependencies.
    if (TARGET_RULES.indexOf(rule.name) !== -1) {
      const target = find(field.dependencies, d => d.name === rule.name);
      if (target) {
        targetName = target.field.alias;
        params = [target.field.value].concat(params.slice(1));
      }
    } else if (rule.name === 'required' && field.rejectsFalse) {
      // invalidate false if no args were specified and the field rejects false by default.
      params = params.length ? params : [true];
    }

    if (this._isADateRule(rule.name)) {
      const dateFormat = this._getDateFormat(field.rules);
      if (rule.name !== 'date_format') {
        params.push(dateFormat);
      }
    }

    let result = validator(value, params);

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
          errors: allValid ? [] : [this._createFieldError(field, rule, data, targetName)]
        };
      });
    }

    if (!isObject(result)) {
      result = { valid: result, data: {} };
    }

    return {
      valid: result.valid,
      errors: result.valid ? [] : [this._createFieldError(field, rule, result.data, targetName)]
    };
  }

  /**
   * Merges a validator object into the RULES and Messages.
   */
  static _merge (name: string, validator: Rule) {
    if (isCallable(validator)) {
      RULES[name] = validator;
      return;
    }

    RULES[name] = validator.validate;
    if (validator.getMessage) {
      Validator.dictionary.setMessage(this.locale, name, validator.getMessage);
    }
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
  _resolveField (name: string, scope: string | null): ?Field {
    if (!isNullOrUndefined(scope)) {
      return this.fields.find({ name, scope });
    }

    if (name[0] === '#') {
      return this.fields.find({ id: name.slice(1) });
    }

    if (name.indexOf('.') > -1) {
      const [fieldScope, ...fieldName] = name.split('.');
      const field = this.fields.find({ name: fieldName.join('.'), scope: fieldScope });
      if (field) {
        return field;
      }
    }

    return this.fields.find({ name, scope: null });
  }

  /**
   * Handles when a field is not found depending on the strict flag.
   */
  _handleFieldNotFound (name: string, scope?: string | null) {
    if (!this.strict) return true;

    const fullName = isNullOrUndefined(scope) ? name : `${!isNullOrUndefined(scope) ? scope + '.' : ''}${name}`;
    throw createError(
      `Validating a non-existent field: "${fullName}". Use "attach()" first.`
    );
  }

  _handleValidationResults (results) {
    const matchers = results.map(result => ({ id: result.id }));
    this.errors.removeById(matchers.map(m => m.id));
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

  /**
   * Starts the validation process.
   */
  async _validate (field: Field, value: any): Promise<ValidationResult> {
    if (!field.isRequired && (isNullOrUndefined(value) || value === '')) {
      return { valid: true, id: field.id, errors: [] };
    }

    const promises = [];
    const errors = [];
    let isExitEarly = false;
    // use of '.some()' is to break iteration in middle by returning true
    Object.keys(field.rules).some(rule => {
      const result = this._test(field, value, { name: rule, params: field.rules[rule] });
      if (isCallable(result.then)) {
        promises.push(result);
      } else if (this.fastExit && !result.valid) {
        errors.push(...result.errors);
        isExitEarly = true;
      } else {
        // promisify the result.
        promises.push(new Promise(resolve => resolve(result)));
      }

      return isExitEarly;
    });

    if (isExitEarly) {
      return { valid: false, errors, id: field.id };
    }

    return (await Promise.all(promises)).reduce((prev, v) => {
      if (!v.valid) {
        prev.errors.push(...v.errors);
      }

      prev.valid = prev.valid && v.valid;

      return prev;
    }, { valid: true, errors, id: field.id });
  }
}
