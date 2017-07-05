import { uniqId, assign, isCallable, setDataAttribute, addClass, removeClass } from './utils';

const DEFAULT_OPTIONS = {
  scope: '__global__',
  active: true,
  required: false,
  rules: {},
  vm: null,
  classes: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  }
};

/**
 * Generates the default flags for the field.
 * @param {Object} options
 */
const generateFlags = (options) => ({
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: null,
  invalid: null,
  validated: false,
  pending: false,
  required: !!options.rules.required
});

export default class Field {
  constructor(el, options = {}) {
    this.id = uniqId();
    this.el = el;
    this.expression = null;
    this.callbacks = [];
    this.events = [];
    setDataAttribute(this.el, 'id', this.id); // cache field id.
    options = assign({}, DEFAULT_OPTIONS, options);
    this.flags = generateFlags(options);
    this.update(options);
  }

  get isComponent() {
    return !!this.component;
  }

  /**
   * Gets the display name (user-friendly name).
   * @return {String}
   */
  get displayName() {
    return this.alias || this.name;
  }

  /**
   * Gets the input value.
   * @return {*}
   */
  get value() {
    if (!this.getters || !this.getters.context || !this.getters.value) return null;

    const ctx = this.getters.context();

    return this.getters.value(ctx);
  }

  /**
   * Determines if the instance matches the options provided.
   * @param {Object} options The matching options.
   */
  matches(options) {
    if (options.id) {
      return this.id === options.id;
    }

    return options.name === this.name && options.scope === this.scope;
  }

  /**
   *
   * @param {Object} options
   */
  update(options) {
    this.component = options.vm || this.component;
    this.scope = options.scope || this.scope;
    this.name = options.name || this.name;
    this.rules = options.rules || this.rules;
    this.classes = options.classes;
    this.classNames = options.classNames;
    this.expression = JSON.stringify(options.expression);
    this.alias = options.alias;
    this.getters = options.getters;

    if (this.classes) {
      // TODO: Initialize the classes.
    }

    if (isCallable(options.onDestroy)) {
      this.events.push({ on: 'destroy', handler: options.onDestroy });
    }
  }


  destroy() {
    this.events.filter(e => e.on === 'destroy').forEach(e => {
      e.handler();
    });

    // TODO: Remove classes listeners.
  }
}
