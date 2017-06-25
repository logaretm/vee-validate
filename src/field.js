import { uniqId, assign, isCallable } from './utils';

const DEFAULT_OPTIONS = {
  scope: '__global__',
  active: true,
  required: false,
  rules: {},
  vm: null
};

export default class Field {
  constructor(name, el, options = {}) {
    this.id = uniqId();
    this.name = name;
    this.el = el;
    const mergedOptions = assign({}, DEFAULT_OPTIONS, options);
    this.flags = {
      untouched: true,
      touched: false,
      dirty: false,
      pristine: true,
      valid: null,
      invalid: null,
      validated: false,
      required: mergedOptions.required,
      pending: false
    };
    this.component = options.vm;
    this.update(mergedOptions);
  }

  get isComponent() {
    return !!this.component;
  }

  update(options) {
    this.scope = options.scope;
    this.rules = options.rules || {};
  }

  updateAriaAttrs() {
    if (!isCallable(this.el.setAttribute)) {
      return;
    }

    this.el.setAttribute('aria-required', this.flags.required);
    this.el.setAttribute('aria-invalid', this.flags.invalid);
  }
}
