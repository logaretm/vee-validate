import { assign } from '../utils';
import ErrorBag from './errorBag';
import FieldBag from './fieldBag';

export default class ScopedValidator {
  constructor (base, vm) {
    this.id = vm._uid;
    this._base = base;
    this._paused = false;

    // create a mirror bag with limited component scope.
    this.errors = new ErrorBag(base.errors, this.id);
  }

  get flags () {
    return this._base.fields.items.filter(f => f.vmId === this.id).reduce((acc, field) => {
      if (field.scope) {
        if (!acc[`$${field.scope}`]) {
          acc[`$${field.scope}`] = {};
        }

        acc[`$${field.scope}`][field.name] = field.flags;
      }

      acc[field.name] = field.flags;

      return acc;
    }, {});
  }

  get rules () {
    return this._base.rules;
  }

  get fields () {
    return new FieldBag(this._base.fields.filter({ vmId: this.id }));
  }

  get dictionary () {
    return this._base.dictionary;
  }

  get locale () {
    return this._base.locale;
  }

  set locale (val) {
    this._base.locale = val;
  }

  localize (...args) {
    return this._base.localize(...args);
  }

  update (...args) {
    return this._base.update(...args);
  }

  attach (opts) {
    const attachOpts = assign({}, opts, { vmId: this.id });

    return this._base.attach(attachOpts);
  }

  pause () {
    this._paused = true;
  }

  resume () {
    this._paused = false;
  }

  remove (ruleName) {
    return this._base.remove(ruleName);
  }

  detach (...args) {
    return this._base.detach(...args, this.id);
  }

  extend (...args) {
    return this._base.extend(...args);
  }

  validate (descriptor, value, opts = {}) {
    if (this._paused) return Promise.resolve(true);

    return this._base.validate(descriptor, value, assign({}, { vmId: this.id }, opts || {}));
  }

  validateAll (values, opts = {}) {
    if (this._paused) return Promise.resolve(true);

    return this._base.validateAll(values, assign({}, { vmId: this.id }, opts || {}));
  }

  validateScopes (opts = {}) {
    if (this._paused) return Promise.resolve(true);

    return this._base.validateScopes(assign({}, { vmId: this.id }, opts || {}));
  }

  destroy () {
    delete this.id;
    delete this._base;
  }

  reset (matcher) {
    return this._base.reset(Object.assign({}, matcher || {}, { vmId: this.id }));
  }

  flag (...args) {
    return this._base.flag(...args, this.id);
  }
};
