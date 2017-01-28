import Rules from './rules';
import ErrorBag from './errorBag';
import ValidatorException from './exceptions/validatorException';
import Dictionary from './dictionary';
import messages from './messages';
import { warn, isObject, isCallable } from './utils/helpers';
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
    constructor(validations, $vm, options = { init: true }) {
        this.strictMode = STRICT_MODE;
        this.$scopes = { __global__: {} };
        this.fieldBag = new FieldBag();
        this._createFields(validations);
        this.errorBag = new ErrorBag();
        this.$vm = $vm;
        // Some fields will be later evaluated, because the vm isn't mounted yet
        // so it may register it under an inaccurate scope.
        this.$deferred = [];
        this.$ready = false;

        // if momentjs is present, install the validators.
        if (typeof moment === 'function') {
            // eslint-disable-next-line
            this.installDateTimeValidators(moment);
        }

        if (options.init) {
            this.init();
        }
    }

    /**
     * Merges a validator object into the Rules and Messages.
     *
     * @param  {string} name The name of the validator.
     * @param  {function|object} validator The validator object.
     */
    static _merge(name, validator) {
        if (isCallable(validator)) {
            Rules[name] = validator;
            dictionary.setMessage('en', name, (field) => `The ${field} value is not valid.`);
            return;
        }

        Rules[name] = validator.validate;

        if (validator.getMessage && isCallable(validator.getMessage)) {
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

        if (isCallable(validator)) {
            return;
        }

        if (! isCallable(validator.validate)) {
            throw new ValidatorException(
                // eslint-disable-next-line
                `Extension Error: The validator '${name}' must be a function or have a 'validate' method.`
            );
        }

        if (! isCallable(validator.getMessage) && ! isObject(validator.messages)) {
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
    static create(validations, $vm, options) {
        return new Validator(validations, $vm, options);
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
     * Resolves the scope value. Only strings and functions are allowed.
     * @param {Function|String} scope
     * @returns {String}
     */
    _resolveScope(scope) {
        if (typeof scope === 'string') {
            return scope;
        }

        // The resolved value should be string.
        if (isCallable(scope)) {
            const value = scope();
            return typeof value === 'string' ? value : '__global__';
        }

        return '__global__';
    }

    /**
     * Resolves the field values from the getter functions.
     */
    _resolveValuesFromGetters(scope = '__global__') {
        if (! this.$scopes[scope]) {
            return {};
        }
        const values = {};
        Object.keys(this.$scopes[scope]).forEach(name => {
            const field = this.$scopes[scope][name];
            const getter = field.getter;
            const context = field.context;
            const fieldScope = this._resolveScope(field.scope);
            if (getter && context && (scope === '__global__' || fieldScope === scope)) {
                values[name] = {
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
     * @param {String|Array} checks.
     */
    _createField(name, checks, scope = '__global__') {
        scope = this._resolveScope(scope);
        if (! this.$scopes[scope]) {
            this.$scopes[scope] = {};
        }

        if (! this.$scopes[scope][name]) {
            this.$scopes[scope][name] = {};
        }

        const field = this.$scopes[scope][name];
        this.fieldBag._add(name);
        field.validations = this._normalizeRules(name, checks, scope);
        field.required = this._isRequired(field);
    }

    /**
     * Normalizes rules.
     * @return {Object}
     */
    _normalizeRules(name, checks, scope) {
        if (! checks) return {};

        if (typeof checks === 'string') {
            return this._normalizeString(checks);
        }

        if (! isObject(checks)) {
            warn(`Your checks for '${scope}.${name}' must be either a string or an object.`);
            return {};
        }

        return this._normalizeObject(checks);
    }

    /**
     * Checks if a field has a required rule.
     */
    _isRequired(field) {
        return field.validations && field.validations.required;
    }

    /**
     * Normalizes an object of rules.
     */
    _normalizeObject(rules) {
        const validations = {};
        Object.keys(rules).forEach(rule => {
            let params = [];
            if (rules[rule] === true) {
                params = [];
            } else if (Array.isArray(rules[rule])) {
                params = rules[rule];
            } else {
                params = [rules[rule]];
            }

            if (rules[rule] === false) {
                delete validations[rule];
            } else {
                validations[rule] = params;
            }

            if (date.installed && this._isADateRule(rule)) {
                validations[rule].push(this._getDateFormat(validations));
            }
        });

        return validations;
    }

    /**
     * Date rules need the existance of a format, so date_format must be supplied.
     * @param {String} name The rule name.
     * @param {Array} validations the field validations.
     */
    _getDateFormat(validations) {
        if (validations.date_format && Array.isArray(validations.date_format)) {
            return validations.date_format[0];
        }

        return null;
    }

    /**
     * Checks if the passed rule is a date rule.
     */
    _isADateRule(rule) {
        return !! ~['after', 'before', 'date_between'].indexOf(rule);
    }

    /**
     * Normalizes string rules.
     * @param {String} rules The rules that will be normalized.
     * @param {Object} field The field object that is being operated on.
     */
    _normalizeString(rules) {
        const validations = {};
        rules.split('|').forEach(rule => {
            const parsedRule = this._parseRule(rule);
            if (! parsedRule.name) {
                return;
            }

            if (parsedRule.name === 'required') {
                validations.required = true;
            }

            validations[parsedRule.name] = parsedRule.params;
            if (date.installed && this._isADateRule(parsedRule.name)) {
                validations[parsedRule.name].push(this._getDateFormat(validations));
            }
        });

        return validations;
    }

    /**
     * Normalizes a string rule.
     *
     * @param {string} rule The rule to be normalized.
     * @return {object} rule The normalized rule.
     */
    _parseRule(rule) {
        let params = [];
        const name = rule.split(':')[0];

        if (~rule.indexOf(':')) {
            params = rule.split(':').slice(1).join(':').split(',');
        }

        return { name, params };
    }

    /**
     * Formats an error message for field and a rule.
     *
     * @param  {string} field The field name.
     * @param  {object} rule Normalized rule object.
     * @param {object} data Additional Information about the validation result.
     * @param {string} scope The field scope.
     * @return {string} msg Formatted error message.
     */
    _formatErrorMessage(field, rule, data = {}, scope = '__global__') {
        const name = this._getFieldDisplayName(field, scope);
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
    _getFieldDisplayName(field, scope = '__global__') {
        return this.$scopes[scope][field].name || dictionary.getAttribute(LOCALE, field, field);
    }

    /**
     * Tests a single input value against a rule.
     *
     * @param  {*} name The name of the field.
     * @param  {*} value  the value of the field.
     * @param  {object} rule the rule object.
     * @param {scope} scope The field scope.
     * @return {boolean} Whether it passes the check.
     */
    _test(name, value, rule, scope = '__global__') {
        const validator = Rules[rule.name];
        if (! validator || typeof validator !== 'function') {
            throw new ValidatorException(`No such validator '${rule.name}' exists.`);
        }

        let result = validator(value, rule.params, name);

        // If it is a promise.
        if (isCallable(result.then)) {
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
                        this._formatErrorMessage(name, rule, data, scope),
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
                this._formatErrorMessage(name, rule, result.data, scope),
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
     * @param  {String|Array|Object} checks validations expression.
     * @param {string} prettyName Custom name to be used as field name in error messages.
     * @param {Function} getter A function used to retrive a fresh value for the field.
     */
    attach(name, checks, options = {}) {
        const attach = () => {
            options.scope = this._resolveScope(options.scope);
            this.updateField(name, checks, options);
            const field = this.$scopes[options.scope][name];
            field.scope = options.scope;
            field.name = options.prettyName;
            field.getter = options.getter;
            field.context = options.context;
            field.listeners = options.listeners || { detach() {} };
        };

        const scope = isCallable(options.scope) ? options.scope() : options.scope;
        if (! scope && ! this.$ready) {
            this.$deferred.push(attach);
            return;
        }


        attach();
    }

    /**
     * Initializes the non-scoped fields and any bootstrap logic.
     */
    init() {
        this.$ready = true;
        this.$deferred.forEach(attach => {
            attach();
        });
        this.$deferred = [];

        return this;
    }

    /**
     * Append another validation to an existing field.
     *
     * @param  {string} name The field name.
     * @param  {string} checks validations expression.
     */
    append(name, checks, options = {}) {
        options.scope = this._resolveScope(options.scope);
        // No such field
        if (! this.$scopes[options.scope] || ! this.$scopes[options.scope][name]) {
            this.attach(name, checks, options);
        }

        const field = this.$scopes[options.scope][name];
        const newChecks = this._normalizeRules(name, checks, options.scope);
        Object.keys(newChecks).forEach(key => {
            field.validations[key] = newChecks[key];
        });
    }

    /**
     * Updates the field rules with new ones.
     */
    updateField(name, checks, options = {}) {
        let field = (this.$scopes[options.scope] && this.$scopes[options.scope][name]) || null;
        const oldChecks = field ? JSON.stringify(field.validations) : '';
        this._createField(name, checks, options.scope);
        field = (this.$scopes[options.scope] && this.$scopes[options.scope][name]) || null;
        const newChecks = field ? JSON.stringify(field.validations) : '';

        // compare both newChecks and oldChecks to make sure we don't trigger uneccessary directive
        // update by changing the errorBag (prevents infinite loops).
        if (newChecks !== oldChecks) {
            this.errorBag.remove(name, options.scope);
        }
    }

    /**
     * Removes a field from the validator.
     *
     * @param  {String} name The name of the field.
     * @param {String} scope The name of the field scope.
     */
    detach(name, scope = '__global__') {
        // No such field.
        if (! this.$scopes[scope] || ! this.$scopes[scope][name]) {
            return;
        }


        this.$scopes[scope][name].listeners.detach();
        this.errorBag.remove(name, scope);
        this.fieldBag._remove(name);
        delete this.$scopes[scope][name];
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
     * Adds a scope.
     */
    addScope(scope) {
        if (scope && ! this.$scopes[scope]) {
            this.$scopes[scope] = {};
        }
    }

    /**
     * Validates a value against a registered field validations.
     *
     * @param  {string} name the field name.
     * @param  {*} value The value to be validated.
     * @param {String} scope The scope of the field.
     * @return {boolean|Promise} result returns a boolean or a promise that will resolve to
     *  a boolean.
     */
    validate(name, value, scope = '__global__') {
        if (name && name.indexOf('.') > -1) {
            [scope, name] = name.split('.');
        }
        if (! scope) scope = '__global__';
        if (! this.$scopes[scope] || ! this.$scopes[scope][name]) {
            if (! this.strictMode) { return true; }
            const fullName = scope === '__global__' ? name : `${scope}.${name}`;
            warn(`Validating a non-existant field: "${fullName}". Use "attach()" first.`);

            return false;
        }

        const field = this.$scopes[scope][name];
        this.errorBag.remove(name, scope);
        // if its not required and is empty or null or undefined then it passes.
        if (! field.required && ~[null, undefined, ''].indexOf(value)) {
            this.fieldBag._setFlags(name, { valid: true, dirty: true });
            return true;
        }

        let test = true;
        const promises = [];
        Object.keys(field.validations).forEach(rule => {
            const result = this._test(
                name,
                value,
                { name: rule, params: field.validations[rule] },
                scope);
            if (isCallable(result.then)) {
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
        if (! values || typeof values === 'string') {
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
            if (isCallable(result.then)) {
                promises.push(result);
                return;
            }

            test = test && result;
        });

        return Promise.all(promises).then(vals => {
            const valid = vals.every(t => t) && test;

            if (! valid) {
                throw new ValidatorException('Validation Failed');
            }

            return valid;
        });
    }

    /**
     * Validates all scopes.
     * @returns {Promise} All promises resulted from each scope.
     */
    validateScopes() {
        return Promise.all(
            Object.keys(this.$scopes).map(scope => this.validateAll(scope))
        );
    }
}
