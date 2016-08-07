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
     */
    add(field, msg) {
        this.errors.push({
            field,
            msg
        });
    }

    /**
     * Gets all error messages from the internal array.
     *
     * @return {Array} errors Array of all error messages.
     */
    all() {
        return this.errors.map(e => e.msg);
    }

    /**
     * Checks if there is any errrors in the internal array.
     *
     * @return {boolean} result True if there was at least one error, false otherwise.
     */
    any() {
        return !! this.errors.length;
    }

    /**
     * Removes all items from the internal array.
     */
    clear() {
        this.errors = [];
    }

    /**
     * Groups the errors for a specific field into a single array.
     *
     * @param  {string} field The field name.
     * @return {Array} errors The errors for the specified field.
     */
    collect(field) {
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
    first(field) {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i].field === field) {
                return this.errors[i].msg;
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
    has(field) {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i].field === field) {
                return true;
            }
        }

        return false;
    }

    /**
     * Removes all error messages assoicated with a specific field.
     *
     * @param  {string} field The field which messages are to be removed.
     */
    remove(field) {
        this.errors = this.errors.filter(e => e.field !== field);
    }
}
