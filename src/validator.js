import Rules from './rules';
import ErrorBag from './errorBag';
import ValidatorException from './exceptions/validatorException';
import Messages from './messages';

export default class Validator
{
    constructor(validations) {
        this.locale = 'en';
        this.validations = this.normalize(validations);
        this.errorBag = new ErrorBag();
    }

    setLocale(language) {
        this.locale = language;
    }

    attach(name, checks) {
        this.validations[name] = [];
        this.errorBag.remove(name);

        checks.split('|').forEach(rule => {
            this.validations[name].push(this.normalizeRule(rule));
        });
    }

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

    updateDictionary(messages) {
        Validator.updateDictionary(messages);
    }

    detach(name) {
        delete this.validations[name];
    }

    static create(validations) {
        return new Validator(validations);
    }

    extend(name, validator) {
        Validator.extend(name, validator);
    }

    static extend(name, validator) {
        Validator.guardExtend(name, validator);

        Validator.merge(name, validator);
    }

    static merge(name, validator) {
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
     * @param  {string} name name of the validation rule.
     * @param  {object} validator a validation rule object.
     */
    static guardExtend(name, validator) {
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

    validateAll(values) {
        let test = true;
        this.errorBag.clear();
        Object.keys(values).forEach(property => {
            test = this.validate(property, values[property]);
        });

        return test;
    }

    validate(name, value) {
        let test = true;
        this.errorBag.remove(name);
        this.validations[name].forEach(rule => {
            test = this.test(name, value, rule);
        });

        return test;
    }

    /**
     * Normalizes the validations object.
     * @param  {object} validations
     * @return {object} Normalized object.
     */
    normalize(validations) {
        if (! validations) {
            return {};
        }

        const normalized = {};
        Object.keys(validations).forEach(property => {
            validations[property].split('|').forEach(rule => {
                if (! normalized[property]) {
                    normalized[property] = [];
                }

                normalized[property].push(this.normalizeRule(rule));
            });
        });

        return normalized;
    }

    normalizeRule(rule) {
        let params = null;
        if (~rule.indexOf(':')) {
            params = rule.split(':')[1].split(',');
        }

        return {
            name: rule.split(':')[0],
            params
        };
    }

    formatErrorMessage(field, rule) {
        if (! Messages[this.locale] || typeof Messages[this.locale][rule.name] !== 'function') {
            // Default to english message.
            return Messages.en[rule.name](field, rule.params);
        }

        return Messages[this.locale][rule.name](field, rule.params);
    }

    /**
     * test a single input value against a rule.
     *
     * @param  {*} name The name of the field.
     * @param  {*} value  [description]
     * @param  {object} rule the rule object.
     * @return {boolean} Wether if it passes the check.
     */
    test(name, value, rule) {
        const validator = Rules[rule.name];
        const valid = validator(value, rule.params);

        if (valid instanceof Promise) {
            return valid.then(values => {
                const allValid = values.reduce((prev, curr) => prev && curr.valid, true);

                if (! allValid) {
                    this.errorBag.add(name, this.formatErrorMessage(name, rule));
                }

                return allValid;
            });
        }

        if (! valid) {
            this.errorBag.add(name, this.formatErrorMessage(name, rule));
        }

        return valid;
    }

    /**
     * Gets the internal errorBag instance.
     * @return {ErrorBag} The internal error bag object.
     */
    getErrors() {
        return this.errorBag;
    }
}
