var alpha = (value) => ! Array.isArray(value) && /^[a-zA-Z]*$/.test(value);

var alpha_dash = (value) => ! Array.isArray(value) && /^[a-zA-Z0-9_-]*$/.test(value);

var alpha_num = (value) => ! Array.isArray(value) && /^[a-zA-Z0-9]*$/.test(value);

var alpha_spaces = (value) => /^[a-zA-Z\s]*$/.test(String(value));

var between = (value, [min, max]) => Number(min) <= value && Number(max) >= value;

var confirmed = (value, [confirmedField]) => {
    const field = document.querySelector(`input[name='${confirmedField}']`);

    return !! (field && String(value) === field.value);
};

var decimal = (value, [decimals] = ['*']) => {
    if (Array.isArray(value)) {
        return false;
    }

    if (value === null || value === undefined || value === '') {
        return true;
    }

    const regexPart = decimals === '*' ? '+' : `{1,${decimals}}`;
    const regex = new RegExp(`^-?\\d*(\\.\\d${regexPart})?$`);

    if (! regex.test(value)) {
        return false;
    }

    return ! Number.isNaN(parseFloat(value));
};

var digits = (value, [length]) => {
    const strVal = String(value);

    return /^[0-9]*$/.test(strVal) && strVal.length === Number(length);
};

const validateImage = (file, width, height) => {
    const URL = window.URL || window.webkitURL;
    return new Promise(resolve => {
        const image = new Image();
        image.onerror = () => resolve({ valid: false });
        image.onload = () => resolve({
            valid: image.width === Number(width) && image.height === Number(height)
        });

        image.src = URL.createObjectURL(file);
    });
};

var dimensions = (files, [width, height]) => {
    const list = [];
    for (let i = 0; i < files.length; i++) {
        // if file is not an image, reject.
        if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }

        list.push(files[i]);
    }

    return Promise.all(list.map(file => validateImage(file, width, height)));
};

var email = (value) => /^(([^<>()[\]\\.,;:#\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/.test(value);

var ext = (files, extensions) => {
    const regex = new RegExp(`\.(${extensions.join('|')})$`, 'i');
    for (let i = 0; i < files.length; i++) {
        if (! regex.test(files[i].name)) {
            return false;
        }
    }

    return true;
};

var image = (files) => {
    for (let i = 0; i < files.length; i++) {
        if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
            return false;
        }
    }

    return true;
};

var In = (value, options) => !! options.filter(option => option == value).length; // eslint-disable-line

// TODO: Maybe add ipv6 flag?
var ip = (value) =>
/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
.test(value);

var max = (value, [length]) => {
    if (value === undefined || value === null) {
        return length >= 0;
    }

    return String(value).length <= length;
};

var mimes = (files, mimes) => {
    const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
    for (let i = 0; i < files.length; i++) {
        if (! regex.test(files[i].type)) {
            return false;
        }
    }

    return true;
};

var min = (value, [length]) => {
    if (value === undefined || value === null) {
        return false;
    }
    return String(value).length >= length;
};

var not_in = (value, options) => ! options.filter(option => option == value).length; // eslint-disable-line

var numeric = (value) => ! Array.isArray(value) && /^[0-9]*$/.test(value);

var regex = (value, [regex, ...flags]) => {
    if (regex instanceof RegExp) {
        return regex.test(value);
    }

    return new RegExp(regex, flags).test(String(value));
};

var required = (value) => {
    if (Array.isArray(value)) {
        return !! value.length;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return !! String(value).trim().length;
};

var size = (files, [size]) => {
    if (isNaN(size)) {
        return false;
    }

    const nSize = Number(size) * 1024;
    for (let i = 0; i < files.length; i++) {
        if (files[i].size > nSize) {
            return false;
        }
    }

    return true;
};

var url = (value, params) => {
    const isUrl = /^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.\(\)%-]*)*\/?$/
    .test(value);

    const domain = params && params[0];

    if (domain && isUrl) {
        return new RegExp(`^https?:\/\/(([\da-z\.-]+)\.)*(${params[0].replace('.', '\\$&')})`)
        .test(value);
    }

    return isUrl;
};

/* eslint-disable camelcase */
var Rules = {
    alpha_dash,
    alpha_num,
    alpha_spaces,
    alpha,
    between,
    confirmed,
    decimal,
    digits,
    dimensions,
    email,
    ext,
    image,
    in: In,
    ip,
    max,
    mimes,
    min,
    not_in,
    numeric,
    regex,
    required,
    size,
    url
};

class ErrorBag
{
    constructor() {
        this.errors = [];
    }

    /**
     * Adds an error to the internal array.
     *
     * @param {string} field The field name.
     * @param {string} msg The error message.
     * @param {String} scope The Scope name, optional.
     */
    add(field, msg, scope) {
        const error = {
            field,
            msg
        };

        if (scope) {
            error.scope = scope;
        }

        this.errors.push(error);
    }

    /**
     * Gets all error messages from the internal array.
     *
     * @param {String} scope The Scope name, optional.
     * @return {Array} errors Array of all error messages.
     */
    all(scope) {
        if (scope) {
            return this.errors.filter(e => e.scope === scope).map(e => e.msg);
        }

        return this.errors.map(e => e.msg);
    }

    /**
     * Checks if there is any errrors in the internal array.
     * @param {String} scope The Scope name, optional.
     * @return {boolean} result True if there was at least one error, false otherwise.
     */
    any(scope) {
        if (scope) {
            return !! this.errors.filter(e => e.scope === scope).length;
        }

        return !! this.errors.length;
    }

    /**
     * Removes all items from the internal array.
     * @param {String} scope The Scope name, optional.
     */
    clear(scope) {
        if (scope) {
            this.errors = this.errors.filter(e => e.scope !== scope);

            return;
        }

        this.errors = [];
    }

    /**
     * Collects errors into groups or for a specific field.
     *
     * @param  {string} field The field name.
     * @param  {string} scope The scope name.
     * @return {Array} errors The errors for the specified field.
     */
    collect(field, scope) {
        if (! field) {
            const collection = {};
            this.errors.forEach(e => {
                if (! collection[e.field]) {
                    collection[e.field] = [];
                }

                collection[e.field].push(e.msg);
            });

            return collection;
        }

        if (scope) {
            return this.errors.filter(e => e.field === field && e.scope === scope).map(e => e.msg);
        }

        return this.errors.filter(e => e.field === field).map(e => e.msg);
    }
    /**
     * Gets the internal array length.
     *
     * @return {Number} length The internal array length.
     */
    count() {
        return this.errors.length;
    }

    /**
     * Gets the first error message for a specific field.
     *
     * @param  {string} field The field name.
     * @return {string|null} message The error message.
     */
    first(field, scope) {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i].field === field) {
                if (scope) {
                    if (this.errors[i].scope === scope) {
                        return this.errors[i].msg;
                    }
                } else {
                    return this.errors[i].msg;
                }
            }
        }

        return null;
    }

    /**
     * Checks if the internal array has at least one error for the specified field.
     *
     * @param  {string} field The specified field.
     * @return {Boolean} result True if at least one error is found, false otherwise.
     */
    has(field, scope) {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i].field === field) {
                if (scope) {
                    if (this.errors[i].scope === scope) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Removes all error messages assoicated with a specific field.
     *
     * @param  {string} field The field which messages are to be removed.
     * @param {String} scope The Scope name, optional.
     */
    remove(field, scope) {
        if (scope) {
            this.errors = this.errors.filter(e => e.field !== field || e.scope !== scope);

            return;
        }

        this.errors = this.errors.filter(e => e.field !== field);
    }
}

var ValidatorException = class
{
    constructor(msg) {
        this.msg = msg;
    }

    toString() {
        return this.msg;
    }
};

/**
 * Determines the input field scope.
 */
const getScope = (el) => el.dataset.scope || (el.form && el.form.dataset.scope);

/**
 * Debounces a function.
 */
const debounce = (func, threshold = 100, execAsap = false) => {
    if (! threshold) {
        return func;
    }

    let timeout;

    return function debounced([...args]) {
        const obj = this;

        function delayed() {
            if (!execAsap) {
                func.apply(obj, args);
            }
            timeout = null;
        }

        if (timeout) {
            clearTimeout(timeout);
        } else if (execAsap) {
            func.apply(obj, ...args);
        }

        timeout = setTimeout(delayed, threshold || 100);
    };
};

/**
 * Emits a warning to the console.
 */
const warn = (message) => {
    if (! console) {
        return;
    }

    console.warn(`vee-validate: ${message}`); // eslint-disable-line
};

/**
 * Checks if the value is an object.
 */
 // eslint-disable-next-line
const isObject = (object) => {
    return object && typeof object === 'object' && ! Array.isArray(object) && object !== null;
};

/* eslint-disable prefer-rest-params */
class Dictionary
{
    constructor(dictionary = {}) {
        this.dictionary = {};
        this.merge(dictionary);
    }

    hasLocale(locale) {
        return !! this.dictionary[locale];
    }

    getMessage(locale, key, fallback = '') {
        if (! this.hasMessage(locale, key)) {
            return fallback;
        }

        return this.dictionary[locale].messages[key];
    }

    getAttribute(locale, key, fallback = '') {
        if (! this.hasAttribute(locale, key)) {
            return fallback;
        }

        return this.dictionary[locale].attributes[key];
    }

    hasMessage(locale, key) {
        return !! (
            this.hasLocale(locale) &&
            this.dictionary[locale].messages &&
            this.dictionary[locale].messages[key]
        );
    }

    hasAttribute(locale, key) {
        return !! (
            this.hasLocale(locale) &&
            this.dictionary[locale].attributes &&
            this.dictionary[locale].attributes[key]
        );
    }

    merge(dictionary) {
        this._merge(this.dictionary, dictionary);
    }

    setMessage(locale, key, message) {
        if (! this.hasLocale(locale)) {
            this.dictionary[locale] = {
                messages: {},
                attributes: {}
            };
        }

        this.dictionary[locale].messages[key] = message;
    }

    setAttribute(locale, key, attribute) {
        if (! this.hasLocale(locale)) {
            this.dictionary[locale] = {
                messages: {},
                attributes: {}
            };
        }

        this.dictionary[locale].attributes[key] = attribute;
    }

    _merge(target, source) {
        if (! (isObject(target) && isObject(source))) {
            return target;
        }

        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (! target[key]) {
                    Object.assign(target, { [key]: {} });
                }

                this._merge(target[key], source[key]);
                return;
            }

            Object.assign(target, { [key]: source[key] });
        });

        return target;
    }
}

/* istanbul ignore next */
/* eslint-disable max-len */
var messages = {
    alpha_dash: (field) => `The ${field} may contain alpha-numeric characters as well as dashes and underscores.`,
    alpha_num: (field) => `The ${field} may only contain alpha-numeric characters.`,
    alpha_spaces: (field) => `The ${field} may only contain alphabetic characters as well as spaces.`,
    alpha: (field) => `The ${field} may only contain alphabetic characters.`,
    between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
    confirmed: (field, [confirmedField]) => `The ${field} does not match the ${confirmedField}.`,
    decimal: (field, [decimals] = ['*']) => `The ${field} must be numeric and may contain ${decimals === '*' ? '' : decimals} decimal points.`,
    digits: (field, [length]) => `The ${field} must be numeric and exactly contain ${length} digits.`,
    dimensions: (field, [width, height]) => `The ${field} must be ${width} pixels by ${height} pixels.`,
    email: (field) => `The ${field} must be a valid email.`,
    ext: (field) => `The ${field} must be a valid file.`,
    image: (field) => `The ${field} must be an image.`,
    in: (field) => `The ${field} must be a valid value.`,
    ip: (field) => `The ${field} must be a valid ip address.`,
    max: (field, [length]) => `The ${field} may not be greater than ${length} characters.`,
    mimes: (field) => `The ${field} must have a valid file type.`,
    min: (field, [length]) => `The ${field} must be at least ${length} characters.`,
    not_in: (field) => `The ${field} must be a valid value.`,
    numeric: (field) => `The ${field} may only contain numeric characters.`,
    regex: (field) => `The ${field} format is invalid.`,
    required: (field) => `The ${field} is required.`,
    size: (field, [size]) => `The ${field} must be less than ${size} KB.`,
    url: (field) => `The ${field} is not a valid URL.`
};

var after = (moment) => (value, [targetField, format]) => {
    const dateValue = moment(value, format, true);
    const field = document.querySelector(`input[name='${targetField}']`);

    if (! (dateValue.isValid() && field)) {
        return false;
    }

    const other = moment(field.value, format, true);

    if (! other.isValid()) {
        return false;
    }

    return dateValue.isAfter(other);
};

var before = (moment) => (value, [targetField, format]) => {
    const dateValue = moment(value, format, true);
    const field = document.querySelector(`input[name='${targetField}']`);

    if (! dateValue.isValid() || ! field) {
        return false;
    }

    const other = moment(field.value, format, true);

    if (! other.isValid()) {
        return false;
    }

    return dateValue.isBefore(other);
};

var date_format = (moment) => (value, [format]) => moment(value, format, true).isValid();

var date_between = (moment) => (value, [min, max, format]) => {
    const minDate = moment(min, format, true);
    const maxDate = moment(max, format, true);
    const dateVal = moment(value, format, true);

    if (! (minDate.isValid() && maxDate.isValid() && dateVal.isValid())) {
        return false;
    }

    return dateVal.isBetween(minDate, maxDate);
};

/* istanbul ignore next */
/* eslint-disable max-len */
var messages$1 = {
    after: (field, [target]) => `The ${field} must be after ${target}.`,
    before: (field, [target]) => `The ${field} must be before ${target}.`,
    date_between: (field, [min, max]) => `The ${field} must be between ${min} and ${max}.`,
    date_format: (field, [format]) => `The ${field} must be in the format ${format}.`
};

var date = {
    make: (moment) => ({
        date_format: date_format(moment),
        after: after(moment),
        before: before(moment),
        date_between: date_between(moment)
    }),
    messages: messages$1,
    installed: false
};

class FieldBag {
    constructor() {
        this.fields = {};
    }

    /**
     * Initializes and adds a new field to the bag.
     */
    _add(name) {
        this.fields[name] = {};
        this._setFlags(name, { dirty: false, valid: false, }, true);
    }

    /**
     * Remooves a field from the bag.
     */
    _remove(name) {
        delete this.fields[name];
    }

    /**
     * Resets the flags state for a specified field or all fields.
     */
    reset(name) {
        if (! name) {
            Object.keys(this.fields).forEach(field => {
                this._setFlags(field, { dirty: false, valid: false, }, true);
            });

            return;
        }

        this._setFlags(name, { dirty: false, valid: false, }, true);
    }

    /**
     * Sets the flags for a specified field.
     */
    _setFlags(name, flags, initial = false) {
        return Object.keys(flags).every(
            flag => this._setFlag(name, flag, flags[flag], initial)
        );
    }

    /**
     * Sets a flag for a specified field.
     */
    _setFlag(name, flag, value, initial = false) {
        const method = `set${flag.charAt(0).toUpperCase()}${flag.slice(1)}`;
        if (typeof this[method] !== 'function') {
            return false;
        }

        this[method](name, value, initial);

        return true;
    }

    /**
     * Sets the dirty flag along with dependant flags.
     */
    setDirty(name, value, initial = false) {
        this.fields[name].dirty = value;
        this.fields[name].clean = initial || ! value;
        this.fields[name].passed = this.fields[name].valid && value;
        this.fields[name].failed = ! this.fields[name].valid && value;
    }

    /**
     * Sets the valid flag along with dependant flags.
     */
    setValid(name, value) {
        this.fields[name].valid = value;
        this.fields[name].passed = this.fields[name].dirty && value;
        this.fields[name].failed = this.fields[name].dirty && ! value;
    }

    /**
     * Gets a field flag value.
     */
    _getFieldFlag(name, flag) {
        if (this.fields[name]) {
            return this.fields[name][flag];
        }

        return false;
    }

    dirty(name) {
        if (! name) {
            return Object.keys(this.fields).some(field => this.fields[field].dirty);
        }

        return this._getFieldFlag(name, 'dirty');
    }

    valid(name) {
        if (! name) {
            return Object.keys(this.fields).every(field => this.fields[field].valid);
        }

        return this._getFieldFlag(name, 'valid');
    }

    passed(name) {
        if (! name) {
            return Object.keys(this.fields).every(field => this.fields[field].passed);
        }

        return this._getFieldFlag(name, 'passed');
    }

    failed(name) {
        if (! name) {
            return Object.keys(this.fields).some(field => this.fields[field].failed);
        }

        return this._getFieldFlag(name, 'failed');
    }

    clean(name) {
        if (! name) {
            return ! this.dirty();
        }

        return this._getFieldFlag(name, 'clean');
    }
}

const EVENT_NAME = 'veeValidate';
let DEFAULT_LOCALE = 'en';
let STRICT_MODE = true;

const dictionary = new Dictionary({
    en: {
        messages,
        attributes: {}
    }
});

class Validator
{
    constructor(validations, $vm) {
        this.locale = DEFAULT_LOCALE;
        this.strictMode = STRICT_MODE;
        this.$fields = {};
        this.fieldBag = new FieldBag();
        this._createFields(validations);
        this.errorBag = new ErrorBag();
        this.$vm = $vm;

        // if momentjs is present, install the validators.
        if (typeof moment === 'function') {
            // eslint-disable-next-line
            this.installDateTimeValidators(moment);
        }
    }

    /**
     * Sets the default locale for all validators.
     *
     * @param {String} language The locale id.
     */
    static setDefaultLocale(language = 'en') {
        /* istanbul ignore if */
        if (! dictionary.hasLocale(language)) {
            // eslint-disable-next-line
            warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
        }

        DEFAULT_LOCALE = language;
    }

    /**
     * Sets the operating mode for all newly created validators.
     * strictMode = true: Values without a rule are invalid and cause failure.
     * strictMode = false: Values without a rule are valid and are skipped.
     * @param {Boolean} strictMode.
     */
    static setStrictMode(strictMode = true) {
        STRICT_MODE = strictMode;
    }

    /**
     * Installs the datetime validators and the messages.
     */
    static installDateTimeValidators(moment) {
        if (typeof moment !== 'function') {
            warn('To use the date-time validators you must provide moment reference.');

            return false;
        }

        if (date.installed) {
            return true;
        }

        const validators = date.make(moment);
        Object.keys(validators).forEach(name => {
            Validator.extend(name, validators[name]);
        });

        Validator.updateDictionary({
            en: {
                messages: date.messages
            }
        });
        date.installed = true;

        return true;
    }

    /**
     * Just an alias to the static method for convienece.
     */
    installDateTimeValidators(moment) {
        Validator.installDateTimeValidators(moment);
    }

    /**
     * Sets the operating mode for this validator.
     * strictMode = true: Values without a rule are invalid and cause failure.
     * strictMode = false: Values without a rule are valid and are skipped.
     * @param {Boolean} strictMode.
     */
    setStrictMode(strictMode = true) {
        this.strictMode = strictMode;
    }

    /**
     * Updates the dicitionary, overwriting existing values and adding new ones.
     *
     * @param  {object} data The dictionary object.
=     */
    static updateDictionary(data) {
        dictionary.merge(data);
    }

    /**
     * Static constructor.
     *
     * @param  {object} validations The validations object.
     * @return {Validator} validator A validator object.
     */
    static create(validations, $vm) {
        return new Validator(validations, $vm);
    }

    /**
     * Adds a custom validator to the list of validation rules.
     *
     * @param  {string} name The name of the validator.
     * @param  {object|function} validator The validator object/function.
     */
    static extend(name, validator) {
        Validator._guardExtend(name, validator);
        Validator._merge(name, validator);
    }

    /**
     * Merges a validator object into the Rules and Messages.
     *
     * @param  {string} name The name of the validator.
     * @param  {function|object} validator The validator object.
     */
    static _merge(name, validator) {
        if (typeof validator === 'function') {
            Rules[name] = validator;
            dictionary.setMessage('en', name, (field) => `The ${field} value is not valid.`);
            return;
        }

        Rules[name] = validator.validate;

        if (validator.getMessage && typeof validator.getMessage === 'function') {
            dictionary.setMessage('en', name, validator.getMessage);
        }

        if (validator.messages) {
            dictionary.merge(
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
    static _guardExtend(name, validator) {
        if (Rules[name]) {
            throw new ValidatorException(
                `Extension Error: There is an existing validator with the same name '${name}'.`
            );
        }

        if (typeof validator === 'function') {
            return;
        }

        if (typeof validator.validate !== 'function') {
            throw new ValidatorException(
                // eslint-disable-next-line
                `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
            );
        }

        if (typeof validator.getMessage !== 'function' && typeof validator.messages !== 'object') {
            throw new ValidatorException(
                // eslint-disable-next-line
                `Extension Error: The validator '${name}' must have a 'getMessage' method or have a 'messages' object.`
            );
        }
    }

    /**
     * Sets the validator current langauge.
     *
     * @param {string} language locale or language id.
     */
    setLocale(language) {
        /* istanbul ignore if */
        if (! dictionary.hasLocale(language)) {
            // eslint-disable-next-line
            warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
        }

        this.locale = language;
    }

    /**
     * Registers a field to be validated.
     *
     * @param  {string} name The field name.
     * @param  {string} checks validations expression.
     * @param {string} prettyName Custom name to be used as field name in error messages.
     */
    attach(name, checks, prettyName = null) {
        this.errorBag.remove(name);
        this._createField(name, checks);

        if (prettyName) {
            this.$fields[name].name = prettyName;
        }
    }

    /**
     * Updates the messages dicitionary, overwriting existing values and adding new ones.
     *
     * @param  {object} data The messages object.
     */
    updateDictionary(data) {
        Validator.updateDictionary(data);
    }

    /**
     * Removes a field from the validator.
     *
     * @param  {string} name The name of the field.
     */
    detach(name) {
        /* istanbul ignore if */
        if (this.$vm && typeof this.$vm.$emit === 'function') {
            this.$vm.$emit('VALIDATOR_OFF', name);
        }

        delete this.$fields[name];
        this.fieldBag._remove(name);
    }

    /**
     * Adds a custom validator to the list of validation rules.
     *
     * @param  {string} name The name of the validator.
     * @param  {object|function} validator The validator object/function.
     */
    extend(name, validator) {
        Validator.extend(name, validator);
    }

    /**
     * Validates each value against the corresponding field validations.
     * @param  {object} values The values to be validated.
     * @return {boolean|Promise|void} result Returns a boolean or a promise that will
     * resolve to a boolean.
     */
    validateAll(values) {
        /* istanbul ignore if */
        if (this.$vm && (! values || typeof values === 'string')) {
            this.errorBag.clear(values);
            this.$vm.$emit(EVENT_NAME, values);

            return;
        }

        let test = true;
        const promises = [];
        this.errorBag.clear();
        Object.keys(values).forEach(property => {
            const result = this.validate(property, values[property]);
            if (typeof result.then === 'function') {
                promises.push(result);
                return;
            }

            test = test && result;
        });

        if (promises.length) {
            // eslint-disable-next-line
            return Promise.all(promises).then(values => values.every(t => t) && test);
        }

        return test; // eslint-disable-line
    }

    /**
     * Validates a value against a registered field validations.
     *
     * @param  {string} name the field name.
     * @param  {*} value The value to be validated.
     * @return {boolean|Promise} result returns a boolean or a promise that will resolve to
     *  a boolean.
     */
    validate(name, value, scope) {
        if (! this.$fields[name]) {
            if (! this.strictMode) { return true; }
            warn(`Trying to validate a non-existant field: "${name}". Use "attach()" first.`);

            return false;
        }

        this.errorBag.remove(name, scope);
        // if its not required and is empty or null or undefined then it passes.
        if (! this.$fields[name].required && ~[null, undefined, ''].indexOf(value)) {
            return true;
        }

        let test = true;
        const promises = [];
        this.$fields[name].validations.forEach(rule => {
            const result = this._test(name, value, rule, scope);
            if (typeof result.then === 'function') {
                promises.push(result);
                return;
            }

            test = test && result;
        });

        if (promises.length) {
            return Promise.all(promises).then(values => {
                const valid = values.every(t => t) && test;
                this.fieldBag._setFlags(name, { valid, dirty: true });

                return valid;
            });
        }

        this.fieldBag._setFlags(name, { valid: test, dirty: true });

        return test;
    }

    /**
     * Creates the fields to be validated.
     *
     * @param  {object} validations
     * @return {object} Normalized object.
     */
    _createFields(validations) {
        if (! validations) {
            return;
        }

        Object.keys(validations).forEach(field => {
            this._createField(field, validations[field]);
        });
    }

    /**
     * Creates a field entry in the fields object.
     * @param {String} name.
     * @param {String} Checks.
     */
    _createField(name, checks) {
        if (! this.$fields[name]) {
            this.$fields[name] = {};
        }

        this.fieldBag._add(name);
        this.$fields[name].validations = [];

        if (Array.isArray(checks)) {
            this.$fields[name].validations = checks;

            return;
        }

        checks.split('|').forEach(rule => {
            const normalizedRule = this._normalizeRule(rule, this.$fields[name].validations);
            if (normalizedRule.name === 'required') {
                this.$fields[name].required = true;
            }

            this.$fields[name].validations.push(normalizedRule);
        });
    }

    /**
     * Normalizes a single validation object.
     *
     * @param  {string} rule The rule to be normalized.
     * @return {object} rule The normalized rule.
     */
    _normalizeRule(rule, validations) {
        let params = [];
        const name = rule.split(':')[0];
        if (~rule.indexOf(':')) {
            params = rule.split(':')[1].split(',');
        }

        // Those rules need the date format to parse and compare correctly.
        if (date.installed && ~ ['after', 'before', 'date_between'].indexOf(name)) {
            const dateFormat = validations.filter(v => v.name === 'date_format')[0];
            if (dateFormat) {
                // pass it as the last param.
                params.push(dateFormat.params[0]);
            }
        }

        return { name, params };
    }

    /**
     * Formats an error message for field and a rule.
     *
     * @param  {string} field The field name.
     * @param  {object} rule Normalized rule object.
     * @param {object} data Additional Information about the validation result.
     * @return {string} msg Formatted error message.
     */
    _formatErrorMessage(field, rule, data = {}) {
        const name = this._getFieldDisplayName(field);
        const params = this._getLocalizedParams(rule);

        if (! dictionary.hasLocale(this.locale) ||
         typeof dictionary.getMessage(this.locale, rule.name) !== 'function') {
            // Default to english message.
            return dictionary.getMessage('en', rule.name)(name, params, data);
        }

        return dictionary.getMessage(this.locale, rule.name)(name, params, data);
    }

    /**
     * Translates the parameters passed to the rule (mainly for target fields).
     */
    _getLocalizedParams(rule) {
        if (~ ['after', 'before', 'confirmed'].indexOf(rule.name) &&
        rule.params && rule.params[0]) {
            return [dictionary.getAttribute(this.locale, rule.params[0], rule.params[0])];
        }

        return rule.params;
    }

    /**
     * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
     * Then the dictionary, then fallsback to field name.
     * @return {String} displayName The name to be used in the errors.
     */
    _getFieldDisplayName(field) {
        return this.$fields[field].name || dictionary.getAttribute(this.locale, field, field);
    }

    /**
     * Tests a single input value against a rule.
     *
     * @param  {*} name The name of the field.
     * @param  {*} value  [description]
     * @param  {object} rule the rule object.
     * @return {boolean} Wether if it passes the check.
     */
    _test(name, value, rule, scope) {
        const validator = Rules[rule.name];
        const result = validator(value, rule.params);

        if (typeof result.then === 'function') {
            return result.then(values => {
                let allValid = true;
                if (Array.isArray(values)) {
                    allValid = values.every(t => t.valid);
                    if (! allValid) {
                        this.errorBag.add(name, this._formatErrorMessage(name, rule), scope);
                    }
                } else { // Is a single object.
                    allValid = values.valid;
                    this.errorBag.add(
                        name,
                        this._formatErrorMessage(name, rule, values.data),
                        scope
                    );
                }

                return allValid;
            });
        }

        if (isObject(result)) {
            if (! result.valid) {
                this.errorBag.add(name, this._formatErrorMessage(name, rule, result.data), scope);
            }

            return result.valid;
        }

        if (! result) {
            this.errorBag.add(name, this._formatErrorMessage(name, rule), scope);
        }

        return result;
    }

    /**
     * Gets the internal errorBag instance.
     *
     * @return {ErrorBag} errorBag The internal error bag object.
     */
    getErrors() {
        return this.errorBag;
    }
}

/**
 * Keeps track of $vm, $validator instances.
 * @type {Array}
 */
const instances = [];

/**
 * Finds a validator instance from the instances array.
 * @param  {[type]} $vm The Vue instance.
 * @return {object} pair the $vm,$validator pair.
 */
const find = ($vm) => {
    for (let i = 0; i < instances.length; i++) {
        if (instances[i].$vm === $vm) {
            return instances[i].$validator;
        }
    }

    return undefined;
};

/**
 * Registers a validator for a $vm instance.
 * @param  {*} $vm The Vue instance.
 * @return {Validator} $validator The validator instance.
 */
const register = ($vm) => {
    let instance = find($vm);
    if (! instance) {
        instance = Validator.create(undefined, $vm);

        instances.push({
            $vm,
            $validator: instance
        });
    }

    return instance;
};

const unregister = ($vm) => {
    for (let i = 0; i < instances.length; i++) {
        if (instances[i].$vm === $vm) {
            instances.splice(i, 1);

            return true;
        }
    }

    return false;
};

var mixin = (options) => ({
    data() {
        return {
            [options.errorBagName]: this.$validator.errorBag,
        };
    },
    computed: {
        [options.fieldsBagName]: {
            get() {
                return this.$validator.fieldBag;
            }
        }
    },
    mounted() {
        this.$emit('validatorReady');
    },
    destroyed() {
        unregister(this);
    }
});

const DEFAULT_EVENT_NAME = 'veeValidate';

class ListenerGenerator
{
    constructor(el, binding, context, options) {
        this.callbacks = [];
        this.el = el;
        this.binding = binding;
        this.vm = context;
        this.options = options;
        this.fieldName = binding.expression || el.name;
    }

    /**
     * Determines if the validation rule requires additional listeners on target fields.
     */
    _hasFieldDependency(rules) {
        const results = rules.split('|').filter(r => !! r.match(/confirmed|after|before/));
        if (! results.length) {
            return false;
        }

        return results[0].split(':')[1];
    }

    /**
     * Validates input value, triggered by 'input' event.
     */
    _inputListener() {
        this.vm.$validator.validate(this.fieldName, this.el.value, getScope(this.el));
    }

    /**
     * Validates files, triggered by 'change' event.
     */
    _fileListener() {
        const isValid = this.vm.$validator.validate(
            this.fieldName, this.el.files, getScope(this.el)
        );
        if (! isValid && this.binding.modifiers.reject) {
            // eslint-disable-next-line
            el.value = '';
        }
    }

    /**
     * Validates radio buttons, triggered by 'change' event.
     */
    _radioListener() {
        const checked = document.querySelector(`input[name="${this.el.name}"]:checked`);
        if (! checked) {
            this.vm.$validator.validate(this.fieldName, null, getScope(this.el));
            return;
        }

        this.vm.$validator.validate(this.fieldName, checked.value, getScope(this.el));
    }

    /**
     * Validates checkboxes, triggered by change event.
     */
    _checkboxListener() {
        const checkedBoxes = document.querySelectorAll(`input[name="${this.el.name}"]:checked`);
        if (! checkedBoxes || ! checkedBoxes.length) {
            this.vm.$validator.validate(this.fieldName, null, getScope(this.el));
            return;
        }

        [...checkedBoxes].forEach(box => {
            this.vm.$validator.validate(this.fieldName, box.value, getScope(this.el));
        });
    }

    /**
     * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
     * From the event.
     */
    _getScopedListener(callback) {
        return (scope) => {
            if (! scope || scope === getScope(this.el) || scope instanceof Event) {
                callback();
            }
        };
    }

    /**
     * Attaches validator event-triggered validation.
     */
    _attachValidatorEvent() {
        const listener = this._getScopedListener(this._getSuitableListener().listener.bind(this));

        this.vm.$on(DEFAULT_EVENT_NAME, listener);
        this.callbacks.push({ name: DEFAULT_EVENT_NAME, listener });
        this.vm.$on('VALIDATOR_OFF', (field) => {
            if (this.fieldName === field) {
                this.detach();
            }
        });

        const fieldName = this._hasFieldDependency(this.el.dataset.rules);
        if (fieldName) {
            // Wait for the validator ready triggered when vm is mounted because maybe
            // the element isn't mounted yet.
            this.vm.$once('validatorReady', () => {
                const target = document.querySelector(`input[name='${fieldName}']`);
                if (! target) {
                    warn('Cannot find target field, no additional listeners were attached.');
                    return;
                }

                target.addEventListener('input', listener);
                this.callbacks.push({ name: 'input', listener, el: target });
            });
        }
    }

    /**
     * Determines a suitable listener for the element.
     */
    _getSuitableListener() {
        if (this.el.type === 'file') {
            return {
                name: 'change',
                listener: this._fileListener
            };
        }

        if (this.el.type === 'radio') {
            return {
                name: 'change',
                listener: this._radioListener
            };
        }

        if (this.el.type === 'checkbox') {
            return {
                name: 'change',
                listener: this._checkboxListener
            };
        }

        return {
            name: 'input',
            listener: this._inputListener
        };
    }

    /**
     * Attachs a suitable listener for the input.
     */
    _attachFieldListeners() {
        const handler = this._getSuitableListener();
        const listener = debounce(
            handler.listener.bind(this),
            this.el.dataset.delay || this.options.delay
        );

        if (~['radio', 'checkbox'].indexOf(this.el.type)) {
            this.vm.$once('validatorReady', () => {
                [...document.querySelectorAll(`input[name="${this.el.name}"]`)].forEach(input => {
                    input.addEventListener(handler.name, listener);
                    this.callbacks.push({ name: handler.name, listener, el: input });
                });
            });

            return;
        }

        this.el.addEventListener(handler.name, listener);
        this.callbacks.push({ name: handler.name, listener, el: this.el });
    }

    /**
     * Attaches the Event Listeners.
     */
    attach() {
        this.vm.$validator.attach(this.fieldName, this.el.dataset.rules, this.el.dataset.as);
        this._attachValidatorEvent();

        if (this.binding.expression) {
            // if its bound, validate it. (since update doesn't trigger after bind).
            if (! this.binding.modifiers.initial) {
                this.vm.$validator.validate(
                    this.binding.expression,
                    this.binding.value,
                    getScope(this.el)
                );
            }

            return;
        }

        this._attachFieldListeners();
    }

    /**
     * Removes all attached event listeners.
     */
    detach() {
        this.callbacks.filter(({ name }) => name === DEFAULT_EVENT_NAME).forEach(h => {
            this.vm.$off(DEFAULT_EVENT_NAME, h.listener);
        });

        this.callbacks.filter(({ name }) => name !== DEFAULT_EVENT_NAME).forEach(h => {
            h.el.removeEventListener(h.name, h.listener);
        });
    }
}

const listenersInstances = [];

var directive = (options) => ({
    bind(el, binding, { context }) {
        const listener = new ListenerGenerator(el, binding, context, options);
        listener.attach();
        listenersInstances.push({ vm: context, el, instance: listener });
    },
    update(el, { expression, value, modifiers, oldValue }, { context }) {
        if (! expression || value === oldValue) {
            return;
        }

        context.$validator.validate(expression || el.name, value, getScope(el));
    },
    unbind(el, binding, { context }) {
        const holder = listenersInstances.filter(l => l.vm === context && l.el === el)[0];
        holder.instance.detach();
        listenersInstances.splice(listenersInstances.indexOf(holder), 1);
    }
});

// eslint-disable-next-line
const install = (Vue, { locale = 'en', delay = 0, errorBagName = 'errors', dictionary = null, strict = true, fieldsBagName = 'fields' } = {}) => {
    if (dictionary) {
        Validator.updateDictionary(dictionary);
    }

    Validator.setDefaultLocale(locale);
    Validator.setStrictMode(strict);

    const options = {
        locale,
        delay,
        dictionary,
        errorBagName,
        fieldsBagName
    };

    Object.defineProperties(Vue.prototype, {
        $validator: {
            get() {
                return register(this);
            }
        }
    });

    Vue.mixin(mixin(options)); // Install Mixin.
    Vue.directive('validate', directive(options)); // Install directive.
};

var index = { install, Validator, ErrorBag };

export default index;
