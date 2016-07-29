export default class ErrorBag
{
    constructor() {
        this.errors = [];
    }

    add(field, msg) {
        this.errors.push({
            field,
            msg
        });
    }

    remove(field) {
        this.errors = this.errors.filter(e => e.field !== field);
    }

    has(field) {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i].field === field) {
                return true;
            }
        }

        return false;
    }

    clear() {
        this.errors = [];
    }

    first(field) {
        for (let i = 0; i < this.errors.length; i++) {
            if (this.errors[i].field === field) {
                return this.errors[i].msg;
            }
        }

        return null;
    }

    collect(field) {
        return this.errors.filter(e => e.field === field);
    }

    all() {
        return this.errors;
    }

    count() {
        return this.errors.length;
    }
}
