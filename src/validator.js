import Rules from './rules';
import ErrorBag from './errorBag';
import ValidatorException from './exceptions/validatorException';
import Messages from './messages';
import warn from './utils/warn';
import date from './plugins/date.js';

const EVENT_NAME = 'veeValidate';
let DEFAULT_LOCALE = 'en';

/* eslint-disable no-underscore-dangle */

export default class Validator
{
    constructor(validations, $vm) {
        this.locale = DEFAULT_LOCALE;
        this.$fields = this._normalize(validations);
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
        if (! Messages[language]) {
            // eslint-disable-next-line
            warn('You are setting the validator locale to a locale that is not defined in the dicitionary. English messages may still be generated.');
        }

        DEFAULT_LOCALE = language;
    }

    /**
     * Installs the datetime validators and the messages.
     */
    static installDateTimeValidators(moment) {
        if (typeof moment !== 'function') {
            warn('To use the date-time validators you must provide moment reference.');
        }

        const validators = date.make(moment);
        Object.keys(validators).forEach(name => {
            Validator.extend(name, validators[name]);
        });

        Validator.updateDictionary(date.messages);
    }

    /**
     * Just an alias to the static method for convienece.
     */
    installDateTimeValidators(moment) {
        Validator.installDateTimeValidators(moment);
    }

    /**
     * Updates the messages dicitionary, overwriting existing values and adding new ones.
     *
     * @param  {object} messages The messages object.
=     */
    static updateDictionary(messages) {
        Object.keys(messages).forEach(locale => {
            if (! Messages[locale]) {
                Messages[locale] = {};
            }

            Object.keys(messages[locale]).forEach(name => {
                Messages[locale][name] = messages[locale][name];
            });
        });
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
            Messages.en[name] = (field) => `The ${field} value is not valid.`;
            return;
        }

        Rules[name] = validator.validate;

        if (validator.getMessage && typeof validator.getMessage === 'function') {
            Messages.en[name] = validator.getMessage;
        }

        if (validator.messages) {
            Object.keys(validator.messages).forEach(locale => {
                if (! Messages[locale]) {
                    Messages[locale] = {};
                }

                Messages[locale][name] = validator.messages[locale];
            });
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
        if (! Messages[language]) {
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
        if (! this.$fields[name]) {
            this.$fields[name] = {};
        }

        this.$fields[name].validations = [];
        this.errorBag.remove(name);

        checks.split('|').forEach(rule => {
            this.$fields[name].validations.push(this._normalizeRule(rule));
        });

        if (prettyName) {
            this.$fields[name].name = prettyName;
        }
    }

    /**
     * Updates the messages dicitionary, overwriting existing values and adding new ones.
     *
     * @param  {object} messages The messages object.
     */
    updateDictionary(messages) {
        Validator.updateDictionary(messages);
    }

    /**
     * Removes a field from the validator.
     *
     * @param  {string} name The name of the field.
     */
    detach(name) {
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
     * Validates each value against the corresponding field validations.
     * @param  {object} values The values to be validated.
     * @return {boolean|Promise|void} result Returns a boolean or a promise that will
     * resolve to a boolean.
     */
    validateAll(values) {
        this.errorBag.clear();
        /* istanbul ignore if */
        if (this.$vm && ! values) {
            this.$vm.$emit(EVENT_NAME);

            return;
        }

        let test = true;
        Object.keys(values).forEach(property => {
            test = this.validate(property, values[property]);
        });
        // eslint-disable-next-line
        return test;
    }

    /**
     * Validates a value against a registered field validations.
     *
     * @param  {string} name the field name.
     * @param  {*} value The value to be validated.
     * @return {boolean|Promise} result returns a boolean or a promise that will resolve to
     *  a boolean.
     */
    validate(name, value) {
        if (! this.$fields[name]) {
            warn('You are trying to validate a non-existant field. Use "attach()" first.');

            return false;
        }

        let test = true;
        this.errorBag.remove(name);
        this.$fields[name].validations.forEach(rule => {
            test = this._test(name, value, rule);
        });

        return test;
    }

    /**
     * Normalizes the validations object.
     *
     * @param  {object} validations
     * @return {object} Normalized object.
     */
    _normalize(validations) {
        if (! validations) {
            return {};
        }

        const normalized = {};
        Object.keys(validations).forEach(property => {
            validations[property].split('|').forEach(rule => {
                if (! normalized[property]) {
                    normalized[property] = { validations: [] };
                }

                normalized[property].validations.push(this._normalizeRule(rule));
            });
        });

        return normalized;
    }

    /**
     * Normalizes a single validation object.
     *
     * @param  {string} rule The rule to be normalized.
     * @return {object} rule The normalized rule.
     */
    _normalizeRule(rule) {
        let params = [];
        if (~rule.indexOf(':')) {
            params = rule.split(':')[1].split(',');
        }

        return {
            name: rule.split(':')[0],
            params
        };
    }

    /**
     * Formats an error message for field and a rule.
     *
     * @param  {string} field The field name.
     * @param  {object} rule Normalized rule object.
     * @return {string} msg Formatted error message.
     */
    _formatErrorMessage(field, rule) {
        if (! Messages[this.locale] || typeof Messages[this.locale][rule.name] !== 'function') {
            // Default to english message.
            return Messages.en[rule.name](field, rule.params);
        }

        return Messages[this.locale][rule.name](field, rule.params);
    }

    /**
     * Tests a single input value against a rule.
     *
     * @param  {*} name The name of the field.
     * @param  {*} value  [description]
     * @param  {object} rule the rule object.
     * @return {boolean} Wether if it passes the check.
     */
    _test(name, value, rule) {
        const validator = Rules[rule.name];
        const valid = validator(value, rule.params);
        const displayName = this.$fields[name].name || name;

        if (valid instanceof Promise) {
            return valid.then(values => {
                const allValid = values.reduce((prev, curr) => prev && curr.valid, true);

                if (! allValid) {
                    this.errorBag.add(name, this._formatErrorMessage(displayName, rule));
                }

                return allValid;
            });
        }

        if (! valid) {
            this.errorBag.add(name, this._formatErrorMessage(displayName, rule));
        }

        return valid;
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
