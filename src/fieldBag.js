export default class FieldBag {
    constructor() {
        this.fields = {};
    }

    add(name, flags) {
        this.fields[name] = flags;
    }

    remove(name) {
        delete this.fields[name];
    }

    _getFlag(flag, name) {
        if (! this.fields[name]) {
            return false;
        }

        return this.fields[name][flag];
    }

    setFlags(name, flags) {
        if (! this.fields[name]) {
            return;
        }

        Object.keys(flags).forEach(flag => this.setFlag(name, flag, flags[flag]));
    }

    setFlag(name, flag, value) {
        this.fields[name][flag] = value;
    }

    dirty(name) {
        return this._getFlag('dirty', name);
    }

    valid(name) {
        return this._getFlag('valid', name);
    }

    validated(name) {
        return this._getFlag('validated', name);
    }
}
