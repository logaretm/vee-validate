/* eslint-disable no-underscore-dangle */

export default class Dictionary
{
    constructor(dictionary = {}) {
        this.dictionary = {};
        this.merge(dictionary);
    }

    hasLocale(locale) {
        return !! this.dictionary[locale];
    }

    getMessage(locale, key) {
        return this.dictionary[locale].messages[key];
    }

    getAttribute(locale, key) {
        return this.dictionary[locale].attributes[key];
    }

    hasMessage(locale, key) {
        return !! (this.hasLocale(locale) && this.dictionary[locale].messages[key]);
    }

    hasAttribute(locale, key) {
        return !! (this.hasLocale(locale) && this.dictionary[locale].attributes[key]);
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

        Object.keys(source).forEach(key => {
            if (this._isObject(source[key])) {
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
