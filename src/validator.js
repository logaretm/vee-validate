import Rules from './rules';
import ErrorBag from './errorBag';
import ValidatorException from './exceptions/validatorException';
import Dictionary from './dictionary';
import messages from './messages';
import { warn, isObject } from './utils/helpers';
import date from './plugins/date';
import FieldBag from './fieldBag';

let LOCALE = 'en';
let STRICT_MODE = true;
const dictionary = new Dictionary({
    en: {
        messages,
        attributes: {}
    }
});

export default class Validator
{
    constructor(validations, $vm) {
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
     * Removes a rule from the list of validators.
     * @param {String} name The name of the validator/rule.
     */
    static remove(name) {
        delete Rules[name];
    }

    /**
     * Sets the default locale for all validators.
     *
     * @param {String} language The locale id.
     */
    static setLocale(language = 'en') {
        /* istanbul ignore if */
        if (! dictionary.hasLocale(language)) {
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
    static setStrictMode(strictMode = true) {
        STRICT_MODE = strictMode;
    }

    /**
     * Updates the dicitionary, overwriting existing values and adding new ones.
     *
     * @param  {object} data The dictionary object.
     */
    static updateDictionary(data) {
        dictionary.merge(data);
    }

    /**
     * Resolves the field values from the getter functions.
     */
    _resolveValuesFromGetters(scope) {
        const values = {};
        Object.keys(this.$fields).forEach(field => {
            const getter = this.$fields[field].getter;
            const context = this.$fields[field].context;
            const fieldScope = typeof this.$fields[field].scope === 'function' ?
                               this.$fields[field].scope() : undefined;

            if (getter && context && (! scope || fieldScope === scope)) {
                values[field] = {
                    value: getter(context()),
                    scope: fieldScope
                };
            }
        });

        return values;
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

        // Make sure we are not splitting an empty value.
        if (! checks) {
            return;
        }

        checks.split('|').forEach(rule => {
            const normalizedRule = this._normalizeRule(rule, this.$fields[name].validations);
            if (! normalizedRule.name) {
                return;
            }

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
            params = rule.split(':').slice(1).join(':').split(',');
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

        if (! dictionary.hasLocale(LOCALE) ||
         typeof dictionary.getMessage(LOCALE, rule.name) !== 'function') {
            // Default to english message.
            return dictionary.getMessage('en', rule.name)(name, params, data);
        }

        return dictionary.getMessage(LOCALE, rule.name)(name, params, data);
    }

    /**
     * Translates the parameters passed to the rule (mainly for target fields).
     */
    _getLocalizedParams(rule) {
        if (~ ['after', 'before', 'confirmed'].indexOf(rule.name) &&
        rule.params && rule.params[0]) {
            return [dictionary.getAttribute(LOCALE, rule.params[0], rule.params[0])];
        }

        return rule.params;
    }

    /**
     * Resolves an appropiate display name, first checking 'data-as' or the registered 'prettyName'
     * Then the dictionary, then fallsback to field name.
     * @return {String} displayName The name to be used in the errors.
     */
    _getFieldDisplayName(field) {
        return this.$fields[field].name || dictionary.getAttribute(LOCALE, field, field);
    }

    /**
     * Tests a single input value against a rule.
     *
     * @param  {*} name The name of the field.
     * @param  {*} value  [description]
     * @param  {object} rule the rule object.
     * @return {boolean} Whether it passes the check.
     */
    _test(name, value, rule, scope) {
        const validator = Rules[rule.name];
        if (! validator || typeof validator !== 'function') {
            throw new ValidatorException(`No such validator '${rule.name}' exists.`);
        }

        let result = validator(value, rule.params, name);

        // If it is a promise.
        if (typeof result.then === 'function') {
            return result.then(values => {
                let allValid = true;
                let data = {};
                if (Array.isArray(values)) {
                    allValid = values.every(t => t.valid);
                } else { // Is a single object.
                    allValid = values.valid;
                    data = values.data;
                }

                if (! allValid) {
                    this.errorBag.add(
                        name,
                        this._formatErrorMessage(name, rule, data),
                        rule.name,
                        scope
                    );
                }

                return allValid;
            });
        }

        if (! isObject(result)) {
            result = { valid: result, data: {} };
        }

        if (! result.valid) {
            this.errorBag.add(
                name,
                this._formatErrorMessage(name, rule, result.data),
                rule.name,
                scope
            );
        }

        return result.valid;
    }

    /**
     * Registers a field to be validated.
     *
     * @param  {string} name The field name.
     * @param  {string} checks validations expression.
     * @param {string} prettyName Custom name to be used as field name in error messages.
     * @param {Function} getter A function used to retrive a fresh value for the field.
     */
    attach(name, checks, options = {}) {
        this.errorBag.remove(name);
        this._createField(name, checks);
        this.$fields[name].scope = options.scope;
        this.$fields[name].name = options.prettyName;
        this.$fields[name].getter = options.getter;
        this.$fields[name].context = options.context;
        this.$fields[name].listeners = options.listeners || { detach() {} };
    }

    /**
     * Removes a field from the validator.
     *
     * @param  {String} name The name of the field.
     * @param {String} scope The name of the field scope.
     */
    detach(name, scope) {
        // No such field.
        if (! this.$fields[name]) {
            return;
        }


        this.$fields[name].listeners.detach();
        this.errorBag.remove(name, scope);
        this.fieldBag._remove(name);
        delete this.$fields[name];
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
     * Gets the internal errorBag instance.
     *
     * @return {ErrorBag} errorBag The internal error bag object.
     */
    getErrors() {
        return this.errorBag;
    }

    /**
     * Gets the currently active locale.
     *
     * @return {String} Locale identifier.
     */
    getLocale() {
        return LOCALE;
    }

    /**
     * Just an alias to the static method for convienece.
     */
    installDateTimeValidators(moment) {
        Validator.installDateTimeValidators(moment);
    }

    /**
     * Removes a rule from the list of validators.
     * @param {String} name The name of the validator/rule.
     */
    remove(name) {
        Validator.remove(name);
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

        LOCALE = language;
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
     * Updates the messages dicitionary, overwriting existing values and adding new ones.
     *
     * @param  {object} data The messages object.
     */
    updateDictionary(data) {
        Validator.updateDictionary(data);
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
            this.fieldBag._setFlags(name, { valid: true, dirty: true });
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
     * Validates each value against the corresponding field validations.
     * @param  {object} values The values to be validated.
     * @return {Promise} Returns a promise with the validation result.
     */
    validateAll(values) {
        let normalizedValues;
        if (! values) {
            normalizedValues = this._resolveValuesFromGetters();
            this.errorBag.clear();
        } else if (typeof values === 'string') {
            this.errorBag.clear(values);
            normalizedValues = this._resolveValuesFromGetters(values);
        } else {
            normalizedValues = {};
            Object.keys(values).forEach(key => {
                normalizedValues[key] = {
                    value: values[key]
                };
            });
        }

        let test = true;
        const promises = [];
        Object.keys(normalizedValues).forEach(property => {
            const result = this.validate(
                property,
                normalizedValues[property].value,
                normalizedValues[property].scope
            );
            if (typeof result.then === 'function') {
                promises.push(result);
                return;
            }

            test = test && result;
        });

        return Promise.all(promises).then(vals => {
            const valid = vals.every(t => t) && test;

            return valid;
        });
    }
}
