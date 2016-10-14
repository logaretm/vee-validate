export default class FieldBag {
    constructor($vm) {
        this.$vm = $vm;
        // Needed to bypass render errors if the fields aren't populated yet.
        this.fields = new Proxy({}, {
            get(target, property) {
                if (! (property in target) && typeof property === 'string') {
                    // eslint-disable-next-line
                    target[property] = {};
                }

                return target[property];
            }
        });
    }

    /**
     * Initializes and adds a new field to the bag.
     */
    _add(name) {
        this.fields[name] = {};
        this._setFlags(name, { dirty: false, valid: false }, true);
    }

    /**
     * Remooves a field from the bag.
     */
    _remove(name) {
        delete this.fields[name];
    }

    /**
     * Sets the flags for a specified field.
     */
    _setFlags(name, flags, initial = false) {
        Object.keys(flags).forEach(flag => this._setFlag(name, flag, flags[flag], initial));

        /* istanbul ignore if */
        if (this.$vm) {
            this.$vm.fields = Object.assign({}, this.$vm.fields, this.fields);
        }
    }

    /**
     * Sets a flag for a specified field.
     */
    _setFlag(name, flag, value, initial = false) {
        const method = `set${flag.charAt(0).toUpperCase()}${flag.slice(1)}`;
        if (typeof this[method] !== 'function') {
            return;
        }

        this[method](name, value, initial);
    }

    /**
     * Updates the dirty flag for a specified field with its dependant flags.
     */
    setDirty(name, value, initial = false) {
        this.fields[name].dirty = value;
        this.fields[name].clean = initial || ! value;
        this.fields[name].passed = this.fields[name].valid && value;
        this.fields[name].failed = ! this.fields[name].valid && value;
    }

    /**
     * Updates the valid flag for a specified field with its dependant flags.
     */
    setValid(name, value) {
        this.fields[name].valid = value;
        this.fields[name].passed = this.fields[name].dirty && value;
        this.fields[name].failed = this.fields[name].dirty && ! value;
    }
}
