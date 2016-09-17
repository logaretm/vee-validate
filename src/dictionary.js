/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-rest-params */
export default class Dictionary
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

    _isObject(object) {
        return object && typeof object === 'object' && ! Array.isArray(object) && object !== null;
    }

    _merge(target, source) {
        if (! (this._isObject(target) && this._isObject(source))) {
            return target;
        }

        const assign = Object.assign || this._assign;

        Object.keys(source).forEach(key => {
            if (this._isObject(source[key])) {
                if (! target[key]) {
                    assign(target, { [key]: {} });
                }

                this._merge(target[key], source[key]);
                return;
            }

            assign(target, { [key]: source[key] });
        });

        return target;
    }

    _assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        const output = Object(target);
        for (let index = 1; index < arguments.length; index++) {
            const source = arguments[index];
            if (source !== undefined && source !== null) {
                Object.keys(source).forEach(key => {
                    if ({}.hasOwnProperty.call(source, key)) {
                        output[key] = source[key];
                    }
                });
            }
        }

        return output;
    }
}
