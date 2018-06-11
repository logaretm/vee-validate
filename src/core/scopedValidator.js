import { assign } from './utils';
import Config from '../config';

export default class ScopedValidator {
  constructor (base, vm) {
    this.id = vm._uid;
    this.base = base;
    this.fields = this.base.fields;
    this.errors = this.base.errors;
  }

  get flags () {
    return this.base.flags;
  }

  get dictionary () {
    return this.base.dictionary;
  }

  static get dictionary () {
    return Config.dependency('dictionary');
  }

  localize (...args) {
    return this.base.localize(...args);
  }

  update (...args) {
    return this.base.update(...args);
  }

  attach (opts) {
    const attachOpts = assign({}, opts, { vmUid: this.id });

    return this.base.attach(attachOpts);
  }

  remove (ruleName) {
    return this.base.remove(ruleName);
  }

  detach (...args) {
    return this.base.detach(...args, this.id);
  }

  extend (...args) {
    return this.base.extend(...args);
  }

  validate (name, value, scope, silent) {
    return this.base.validate({ name, value, scope, silent, uid: this.id });
  }

  validateAll (...args) {
    return this.base.validateAll(...args, this.id);
  }

  validateScopes (...args) {
    return this.base.validateScopes(...args, this.id);
  }

  destroy () {
    delete this.id;
    delete this.base;
  }

  reset (matcher) {
    return this.base.reset(matcher, this.id);
  }

  flag (...args) {
    return this.base.flag(...args, this.id);
  }
};
