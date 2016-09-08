/* eslint-disable no-underscore-dangle */
export default class ErrorBag
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
