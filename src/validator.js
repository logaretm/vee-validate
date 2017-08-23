import Rules from './rules';
import ErrorBag from './errorBag';
import Dictionary from './dictionary';
import messages from './messages';
import { isObject, isCallable, toArray, warn, createError, assign, find } from './utils';
import Field from './field';
import FieldBag from './fieldBag';
import datePlugin from './plugins/date';

let LOCALE = 'en';
let STRICT_MODE = true;
const DICTIONARY = new Dictionary({
  en: {
    messages,
    attributes: {},
    custom: {}
  }
});

export default class Validator {
  constructor (validations, options = { vm: null, fastExit: true }) {
    this.strict = STRICT_MODE;
    this.errors = new ErrorBag();
    this.fields = new FieldBag();
    this.fieldBag = {};
    this._createFields(validations);
    this.paused = false;
    this.fastExit = options.fastExit || false;
    this.ownerId = options.vm && options.vm._uid;
    // create it statically since we don't need constant access to the vm.
    this.reset = options.vm && isCallable(options.vm.$nextTick) ? () => {
      options.vm.$nextTick(() => {
        this.fields.items.forEach(i => i.reset());
        this.errors.clear();
      });
    } : () => {
      this.fields.items.forEach(i => i.reset());
      this.errors.clear();
    };
    this.clean = () => {
      warn('validator.clean is marked for deprecation, please use validator.reset instead.');
      this.reset();
    };

    // if momentjs is present, install the validators.
    if (typeof moment === 'function') {
      // eslint-disable-next-line
      this.installDateTimeValidators(moment);
    }
  }

  /**
   * @return {Dictionary}
   */
  get dictionary () {
    return DICTIONARY;
  }

  /**
   * @return {Dictionary}
   */
  static get dictionary () {
    return DICTIONARY;
  }

  /**
   * @return {String}
   */
  get locale () {
    return LOCALE;
  }

  /**
   * @return {Object}
   */
  get rules () {
    return Rules;
  }

  /**
   * @return {Object}
   */
  static get rules () {
    return Rules;
  }

  /**
   * Merges a validator object into the Rules and Messages.
   *
   * @param  {string} name The name of the validator.
   * @param  {function|object} validator The validator object.
   */
  static _merge (name, validator) {
    if (isCallable(validator)) {
      Rules[name] = validator;
      return;
    }

    Rules[name] = validator.validate;
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
   * Guards from extnsion violations.
   *
   * @param  {string} name name of the validation rule.
   * @param  {object} validator a validation rule object.
   */
  static _guardExtend (name, validator) {
    if (isCallable(validator)) {
      return;
    }

    if (! isCallable(validator.validate)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
      );
    }

    if (! isCallable(validator.getMessage) && ! isObject(validator.messages)) {
      throw createError(
        // eslint-disable-next-line
        `Extension Error: The validator '${name}' must have a 'getMessage' method or have a 'messages' object.`
      );
    }
  }

  /**
   * Static constructor.
   *
   * @param  {object} validations The validations object.
   * @return {Validator} validator A validator object.
   */
  static create (validations, options) {
    return new Validator(validations, options);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   *
   * @param  {string} name The name of the validator.
   * @param  {object|function} validator The validator object/function.
   */
  static extend (name, validator) {
    Validator._guardExtend(name, validator);
    Validator._merge(name, validator);
  }

  /**
   * Installs the datetime validators and the messages.
   */
  static installDateTimeValidators (moment) {
    if (typeof moment !== 'function') {
      warn('To use the date-time validators you must provide moment reference.');
      return false;
    }

    datePlugin({ Validator }, { moment });

    return true;
  }

  /**
   * Removes a rule from the list of validators.
   * @param {String} name The name of the validator/rule.
   */
  static remove (name) {
    delete Rules[name];
  }

  /**
   * Sets the default locale for all validators.
   *
   * @param {String} language The locale id.
   */
  static setLocale (language = 'en') {
    /* istanbul ignore if */
    if (! DICTIONARY.hasLocale(language)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
    }

    LOCALE = language;
  }

  /**
   * Sets the operating mode for all newly created validators.
   * strictMode = true: Values without a rule are invalid and cause failure.
   * strictMode = false: Values without a rule are valid and are skipped.
   * @param {Boolean} strictMode.
   */
  static setStrictMode (strictMode = true) {
    STRICT_MODE = strictMode;
  }

  /**
   * Updates the dicitionary, overwriting existing values and adding new ones.
   *
   * @param  {object} data The dictionary object.
   */
  static updateDictionary (data) {
    DICTIONARY.merge(data);
  }

  static addLocale (locale) {
    if (! locale.name) {
      warn('Your locale must have a name property');
      return;
    }

    this.updateDictionary({
      [locale.name]: locale
    });
  }

  addLocale (locale) {
    Validator.addLocale(locale);
  }

  /**
   * Creates the fields to be validated.
   *
   * @param  {object} validations
   * @return {object} Normalized object.
   */
  _createFields (validations) {
    if (! validations) return;

    Object.keys(validations).forEach(field => {
      const options = assign({}, { name: field, rules: validations[field] });
      this.attach(options);
    });
  }

  /**
   * Date rules need the existance of a format, so date_format must be supplied.
   * @param {String} name The rule name.
   * @param {Array} validations the field validations.
   */
  _getDateFormat (validations) {
    let format = null;
    if (validations.date_format && Array.isArray(validations.date_format)) {
      format = validations.date_format[0];
    }

    return format || this.dictionary.getDateFormat(this.locale);
  }

  /**
   * Checks if the passed rule is a date rule.
   */
  _isADateRule (rule) {
    return !! ~['after', 'before', 'date_between', 'date_format'].indexOf(rule);
  }

  /**
   * Formats an error message for field and a rule.
   *
   * @param  {Field} field The field object.
   * @param  {object} rule Normalized rule object.
   * @param {object} data Additional Information about the validation result.
   * @return {string} Formatted error message.
   */
  _formatErrorMessage (field, rule, data = {}) {
    const name = this._getFieldDisplayName(field);
    const params = this._getLocalizedParams(rule);
    // Defaults to english message.
    if (! this.dictionary.hasLocale(LOCALE)) {
      const msg = this.dictionary.getFieldMessage('en', field.name, rule.name);

      return isCallable(msg) ? msg(name, params, data) : msg;
    }

    const msg = this.dictionary.getFieldMessage(LOCALE, field.name, rule.name);

    return isCallable(msg) ? msg(name, params, data) : msg;
  }

  /**
   * Translates the parameters passed to the rule (mainly for target fields).
   */
  _getLocalizedParams (rule) {
    if (~ ['after', 'before', 'confirmed'].indexOf(rule.name) && rule.params && rule.params[0]) {
      if (rule.params.length > 1) {
        return [this.dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0]), rule.params[1]];
      } else {
        return [this.dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0])];
      }
    }

    return rule.params;
  }

  /**
   * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
   * Then the dictionary, then fallsback to field name.
   * @param {Field} field The field object.
   * @return {String} The name to be used in the errors.
   */
  _getFieldDisplayName (field) {
    return field.displayName || this.dictionary.getAttribute(LOCALE, field.name, field.name);
  }

  /**
   * Tests a single input value against a rule.
   *
   * @param  {Field} field The field under validation.
   * @param  {*} value  the value of the field.
   * @param  {object} rule the rule object.
   * @return {boolean} Whether it passes the check.
   */
  _test (field, value, rule) {
    const validator = Rules[rule.name];
    let params = Array.isArray(rule.params) ? toArray(rule.params) : [];
    if (! validator || typeof validator !== 'function') {
      throw createError(`No such validator '${rule.name}' exists.`);
    }

    // has field depenencies
    if (/(confirmed|after|before)/.test(rule.name)) {
      const target = find(field.dependencies, d => d.name === rule.name);
      if (target) {
        if (params.length > 1) {
          params = [target.field.value, params[1]];
        } else {
          params = [target.field.value];
        }
      }
    } else if (rule.name === 'required' && field.rejectsFalse) {
      // invalidate false if no args were specified and the field rejects false by default.
      params = params.length ? params : [true];
    }

    if (datePlugin.installed && this._isADateRule(rule.name)) {
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

        if (! allValid) {
          this.errors.add({
            id: field.id,
            field: field.name,
            msg: this._formatErrorMessage(field, rule, data),
            rule: rule.name,
            scope: field.scope
          });
        }

        return allValid;
      });
    }

    if (! isObject(result)) {
      result = { valid: result, data: {} };
    }

    if (! result.valid) {
      this.errors.add({
        id: field.id,
        field: field.name,
        msg: this._formatErrorMessage(field, rule, result.data),
        rule: rule.name,
        scope: field.scope
      });
    }

    return result.valid;
  }

  /**
   * Registers a field to be validated.
   *
   * @param  {Field|Object} name The field name.
   * @return {Field}
   */
  attach (field) {
    // deprecate: handle old signature.
    if (arguments.length > 1) {
      field = assign({}, {
        name: arguments[0],
        rules: arguments[1]
      }, arguments[2] || { vm: { $validator: this } });
    }

    if (!(field instanceof Field)) {
      field = new Field(field.el || null, field);
    }

    this.fields.push(field);
    // validate if initial.
    if (field.initial) {
      this.validate(`#${field.id}`, field.value);
    }
    if (!field.scope) {
      this.fieldBag = assign({}, this.fieldBag, { [`${field.name}`]: field.flags });
      return field;
    }

    const scopeObj = assign({}, this.fieldBag[`$${field.scope}`] || {}, { [`${field.name}`]: field.flags });
    this.fieldBag = assign({}, this.fieldBag, { [`$${field.scope}`]: scopeObj });

    return field;
  }

  /**
   * Sets the flags on a field.
   *
   * @param {String} name
   * @param {Object} flags
   */
  flag (name, flags) {
    const field = this._resolveField(name);
    if (! field || !flags) {
      return;
    }

    field.setFlags(flags);
  }

  /**
   * Removes a field from the validator.
   *
   * @param  {String} name The name of the field.
   * @param {String} scope The name of the field scope.
   */
  detach (name, scope) {
    let field = name instanceof Field ? name : this._resolveField(name, scope);
    if (!field) return;

    field.destroy();
    this.errors.removeById(field.id);
    this.fields.remove(field);
    const flags = this.fieldBag;
    if (field.scope) {
      delete flags[`$${field.scope}`][field.name];
    } else {
      delete flags[field.name];
    }
    this.fieldBag = Object.assign({}, flags);
  }

  /**
   * Adds a custom validator to the list of validation rules.
   *
   * @param  {string} name The name of the validator.
   * @param  {object|function} validator The validator object/function.
   */
  extend (name, validator) {
    Validator.extend(name, validator);
  }

  /**
   * Just an alias to the static method for convienece.
   */
  installDateTimeValidators (moment) {
    Validator.installDateTimeValidators(moment);
  }

  /**
   * Removes a rule from the list of validators.
   * @param {String} name The name of the validator/rule.
   */
  remove (name) {
    Validator.remove(name);
  }

  /**
   * Sets the validator current langauge.
   *
   * @param {string} language locale or language id.
   */
  setLocale (language) {
    /* istanbul ignore if */
    if (! this.dictionary.hasLocale(language)) {
      // eslint-disable-next-line
      warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
    }

    LOCALE = language;
  }

  /**
   * Updates the messages dicitionary, overwriting existing values and adding new ones.
   *
   * @param  {object} data The messages object.
   */
  updateDictionary (data) {
    Validator.updateDictionary(data);
  }

  /**
   * Tries different strategies to find a field.
   * @param {String} name
   * @param {String} scope
   * @return {Field}
   */
  _resolveField (name, scope) {
    if (scope) {
      return this.fields.find({ name, scope });
    }

    if (name[0] === '#') {
      return this.fields.find({ id: name.slice(1) });
    }

    if (name.indexOf('.') > -1) {
      const parts = name.split('.');
      const field = this.fields.find({ name: parts[1], scope: parts[0] });
      if (field) {
        return field;
      }
    }

    return this.fields.find({ name, scope: null });
  }

  /**
   * Handles when a field is not found depending on the strict flag.
   *
   * @param {String} name
   * @param {String} scope
   */
  _handleFieldNotFound (name, scope) {
    if (! this.strict) return Promise.resolve(true);

    const fullName = scope ? name : `${scope ? scope + '.' : ''}${name}`;
    throw createError(
      `Validating a non-existant field: "${fullName}". Use "attach()" first.`
    );
  }

  /**
   * Starts the validation process.
   *
   * @param {Field} field
   * @param {Promise} value
   */
  _validate (field, value) {
    if (! field.isRequired && ~[null, undefined, ''].indexOf(value)) {
      return Promise.resolve(true);
    }

    const promises = [];
    let isExitEarly = false;
    // use of '.some()' is to break iteration in middle by returning true
    Object.keys(field.rules).some(rule => {
      const result = this._test(
        field,
        value,
        { name: rule, params: field.rules[rule] }
      );

      if (isCallable(result.then)) {
        promises.push(result);
      } else if (this.fastExit && !result) {
        isExitEarly = true;
      } else {
        const resultAsPromise = new Promise(resolve => {
          resolve(result);
        });
        promises.push(resultAsPromise);
      }

      return isExitEarly;
    });

    if (isExitEarly) return Promise.resolve(false);

    return Promise.all(promises).then(values => {
      const valid = values.every(t => t);
      return valid;
    });
  }

  /**
   * Validates a value against a registered field validations.
   *
   * @param  {string} name the field name.
   * @param  {*} value The value to be validated.
   * @param {String} scope The scope of the field.
   * @return {Promise}
   */
  validate (name, value, scope = null) {
    if (this.paused) return Promise.resolve(true);

    // overload to validate all.
    if (arguments.length === 0) {
      return this.validateScopes();
    }

    // overload to validate scopeless fields.
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
    this.errors.removeById(field.id);
    if (field.isDisabled) {
      return Promise.resolve(true);
    }
    field.flags.pending = true;
    if (arguments.length === 1) {
      value = field.value;
    }

    return this._validate(field, value).then(result => {
      field.setFlags({
        pending: false,
        valid: result,
        validated: true
      });

      return result;
    });
  }

  /**
   * Pauses the validator.
   *
   * @return {Validator}
   */
  pause () {
    this.paused = true;

    return this;
  }

  /**
   * Resumes the validator.
   *
   * @return {Validator}
   */
  resume () {
    this.paused = false;

    return this;
  }

  /**
   * Validates each value against the corresponding field validations.
   * @param  {Object|String} values The values to be validated.
   * @return {Promise} Returns a promise with the validation result.
   */
  validateAll (values) {
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
    }

    const promises = this.fields.filter(matcher).map(field => this.validate(
      `#${field.id}`,
      providedValues ? values[field.name] : field.value
    ));

    return Promise.all(promises).then(results => results.every(t => t));
  }

  /**
   * Validates all scopes.
   *
   * @returns {Promise} All promises resulted from each scope.
   */
  validateScopes () {
    if (this.paused) return Promise.resolve(true);

    const promises = this.fields.map(field => this.validate(
      `#${field.id}`,
      field.value
    ));

    return Promise.all(promises).then(results => results.every(t => t));
  }
}
