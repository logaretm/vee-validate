import { assign } from '../utils';
import ErrorBag from './errorBag';

export default class ScopedValidator {
  constructor (base, vm) {
    this.id = vm._uid;
    this._base = base;
    this._paused = false;

    // create a mirror bag with limited component scope.
    this.errors = new ErrorBag(base.errors, this.id);
    this.fields = [];
  }

  get rules () {
    return this._base.rules;
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

    const field = this._base.attach(attachOpts);
    this.fields.push(field);

    return field;
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
    const field = this._base.detach(...args, this.id);
    const idx = this.fields.indexOf(field);
    if (idx !== -1) {
      this.fields.splice(idx, 1);
    }

    return field;
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
