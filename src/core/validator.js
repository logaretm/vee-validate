import ErrorBag from './errorBag';
import Dictionary from './dictionary';
import { isObject, isCallable, toArray, warn, createError, assign, find, isNullOrUndefined } from './utils';
import Field from './field';
import FieldBag from './fieldBag';

// @flow

const RULES: { [string]: Rule } = {};
let LOCALE: string = 'en';
let STRICT_MODE: boolean = true;
const DICTIONARY: Dictionary = new Dictionary({
  en: {
    messages: {},
    attributes: {},
    custom: {}
  }
});

export default class Validator {
  strict: boolean;
  errors: ErrorBag;
  fields: FieldBag;
  flags: MapObject;
  fastExit: boolean;
  paused: boolean;
  ownerId: string | number;
  clean: () => void;
  reset: () => Promise;

  constructor (validations?: MapObject, options?: MapObject = { vm: null, fastExit: true }) {
    this.strict = STRICT_MODE;
    this.errors = new ErrorBag();
    this.fields = new FieldBag();
    this.flags = {};
    this._createFields(validations);
    this.paused = false;
    this.fastExit = options.fastExit || false;
    this.ownerId = options.vm && options.vm._uid;
    // create it statically since we don't need constant access to the vm.
    this.reset = options.vm && isCallable(options.vm.$nextTick) ? () => {
      return new Promise((resolve, reject) => {
        options.vm.$nextTick(() => {
          this.fields.items.forEach(i => i.reset());
          this.errors.clear();
          resolve();
        });
      });
    } : () => {
      return new Promise((resolve, reject) => {
        this.fields.items.forEach(i => i.reset());
        this.errors.clear();
        resolve();
      });
    };
    /* istanbul ignore next */
    this.clean = () => {
      warn('validator.clean is marked for deprecation, please use validator.reset instead.');
      this.reset();
    };
  }

  /**
   * Getter for the dictionary.
   */
  get dictionary (): Dictionary {
    return DICTIONARY;
  }

  /**
   * Static Getter for the dictionary.
   */
  static get dictionary (): Dictionary {
    return DICTIONARY;
  }

  /**
   * Getter for the current locale.
   */
  get locale (): string {
    return LOCALE;
  }

  /**
   * Setter for the validator locale.
   */
  set locale (value: string) {
    Validator.locale = value;
  }

  /**
  * Static getter for the validator locale.
  */
  static get locale () {
    return LOCALE;
  }

  /**
   * Static setter for the validator locale.
   */
  static set locale (value: string) {
    /* istanbul ignore if */
    if (!DICTIONARY.hasLocale(value)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dictionary. English messages may still be generated.');
    }

    LOCALE = value;
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
  static extend (name: string, validator: Rule | Object) {
    Validator._guardExtend(name, validator);
    Validator._merge(name, validator);
  }

  /**
   * Removes a rule from the list of validators.
   */
  static remove (name: string) {
    delete RULES[name];
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
  localize (lang: string, dictionary?: MapObject) {
    Validator.localize(lang, dictionary);
  }

  /**
   * Adds and sets the current locale for the validator.
   */
  static localize (lang: string | MapObject, dictionary?: MapObject) {
    if (isObject(lang)) {
      DICTIONARY.merge(lang);
      return;
    }

    // merge the dictionary.
    if (dictionary) {
      const locale = lang || dictionary.name;
      dictionary = assign({}, dictionary);
      DICTIONARY.merge({
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
    if (arguments.length > 1) {
      field = assign({}, {
        name: arguments[0],
        rules: arguments[1]
      }, arguments[2] || { vm: { $validator: this } });
    }

    // fixes initial value detection with v-model and select elements.
    const value = field.initialValue;
    if (!(field instanceof Field)) {
      field = new Field(field.el || null, field);
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
  extend (name: string, validator: Rule | MapObject) {
    Validator.extend(name, validator);
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
  validate (name: string, value: any, scope?: string | null = null): Promise<boolean> {
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

    field.flags.pending = true;
    if (arguments.length === 1) {
      value = field.value;
    }

    const silentRun = field.isDisabled;

    return this._validate(field, value, silentRun).then(result => {
      field.setFlags({
        pending: false,
        valid: result.valid,
        validated: true
      });

      this.errors.remove(field.name, field.scope, field.id);
      if (silentRun) {
        return Promise.resolve(true);
      } else if (result.errors) {
        result.errors.forEach(e => this.errors.add(e));
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
  validateAll (values?: string | MapObject): Promise<boolean> {
    if (this.paused) return Promise.resolve(true);

    let matcher = null;
    let providedValues = false;

    if (typeof values === 'string') {
      matcher = { scope: values };
    } else if (isObject(values)) {
      matcher = Object.keys(values).map(key => {
        return { name: key, scope: arguments[1] || null };
      });
      providedValues = true;
    } else if (arguments.length === 0) {
      matcher = { scope: null }; // global scope.
    } else if (Array.isArray(values)) {
      matcher = values.map(key => {
        return { name: key, scope: arguments[1] || null };
      });
    }

    const promises = this.fields.filter(matcher).map(field => this.validate(
      `#${field.id}`,
      providedValues ? values[field.name] : field.value
    ));

    return Promise.all(promises).then(results => results.every(t => t));
  }

  /**
   * Validates all scopes.
   */
  validateScopes (): Promise<boolean> {
    if (this.paused) return Promise.resolve(true);

    const promises = this.fields.map(field => this.validate(
      `#${field.id}`,
      field.value
    ));

    return Promise.all(promises).then(results => results.every(t => t));
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
    // Defaults to english message.
    if (!this.dictionary.hasLocale(LOCALE)) {
      const msg = this.dictionary.getFieldMessage('en', field.name, rule.name);

      return isCallable(msg) ? msg(name, params, data) : msg;
    }

    const msg = this.dictionary.getFieldMessage(LOCALE, field.name, rule.name);

    return isCallable(msg) ? msg(name, params, data) : msg;
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  _getLocalizedParams (rule: MapObject, targetName?: string | null = null) {
    if (~['after', 'before', 'confirmed'].indexOf(rule.name) && rule.params && rule.params[0]) {
      const localizedName = targetName || this.dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0]);
      return [localizedName].concat(rule.params.slice(1));
    }

    return rule.params;
  }

  /**
   * Resolves an appropriate display name, first checking 'data-as' or the registered 'prettyName'
   */
  _getFieldDisplayName (field: Field) {
    return field.alias || this.dictionary.getAttribute(LOCALE, field.name, field.name);
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
    if (/(confirmed|after|before)/.test(rule.name)) {
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
          error: allValid ? undefined : {
            id: field.id,
            field: field.name,
            msg: this._formatErrorMessage(field, rule, data, targetName),
            rule: rule.name,
            scope: field.scope
          }
        };
      });
    }

    if (!isObject(result)) {
      result = { valid: result, data: {} };
    }

    return {
      valid: result.valid,
      error: result.valid ? undefined : {
        id: field.id,
        field: field.name,
        msg: this._formatErrorMessage(field, rule, result.data, targetName),
        rule: rule.name,
        scope: field.scope
      }
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
    if (isCallable(validator.getMessage)) {
      DICTIONARY.setMessage(LOCALE, name, validator.getMessage);
    }

    if (validator.messages) {
      DICTIONARY.merge(
        Object.keys(validator.messages).reduce((prev, curr) => {
          const dict = prev;
          dict[curr] = {
            messages: {
              [name]: validator.messages[curr]
            }
          };

          return dict;
        }, {})
      );
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
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
      );
    }

    if (!isCallable(validator.getMessage) && !isObject(validator.messages)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must have a 'getMessage' method or have a 'messages' object.`
      );
    }
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
    if (!this.strict) return Promise.resolve(true);

    const fullName = isNullOrUndefined(scope) ? name : `${!isNullOrUndefined(scope) ? scope + '.' : ''}${name}`;
    throw createError(
      `Validating a non-existent field: "${fullName}". Use "attach()" first.`
    );
  }

  /**
   * Starts the validation process.
   */
  _validate (field: Field, value: any, silent?: boolean = false): Promise<ValidationResult> {
    if (!field.isRequired && (isNullOrUndefined(value) || value === '')) {
      return Promise.resolve({ valid: true });
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
        errors.push(result.error);
        isExitEarly = true;
      } else {
        // promisify the result.
        promises.push(new Promise(resolve => {
          resolve(result);
        }));
      }

      return isExitEarly;
    });

    if (isExitEarly) {
      return Promise.resolve({
        valid: false,
        errors
      });
    }

    return Promise.all(promises).then(values => values.map(v => {
      if (!v.valid) {
        errors.push(v.error);
      }

      return v.valid;
    }).every(t => t)
    ).then(result => {
      return {
        valid: result,
        errors
      };
    });
  }
}
