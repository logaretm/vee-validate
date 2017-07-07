import { uniqId, assign, isCallable, setDataAttribute, addClass, removeClass, getInputEventName } from './utils';

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
  constructor (el, options = {}) {
    this.id = uniqId();
    this.el = el;
    this.expression = null;
    this.watchers = [];
    this.events = [];
    setDataAttribute(this.el, 'id', this.id); // cache field id.
    options = assign({}, DEFAULT_OPTIONS, options);
    this.flags = generateFlags(options);
    this.update(options);
  }

  get isVue () {
    return !!this.component;
  }

  /**
   * Gets the display name (user-friendly name).
   * @return {String}
   */
  get displayName () {
    return this.alias || this.name;
  }

  /**
   * Gets the input value.
   * @return {*}
   */
  get value () {
    if (!this.getters || !this.getters.context || !this.getters.value) return null;

    const ctx = this.getters.context();

    return this.getters.value(ctx);
  }

  /**
   * Determines if the instance matches the options provided.
   * @param {Object} options The matching options.
   */
  matches (options) {
    if (options.id) {
      return this.id === options.id;
    }

    return options.name === this.name && options.scope === this.scope;
  }

  /**
   *
   * @param {Object} options
   */
  update (options) {
    this.component = options.vm || this.component;
    this.scope = options.scope || this.scope;
    this.name = options.name || this.name;
    this.rules = options.rules || this.rules;
    this.classNames = options.classNames;
    this.expression = JSON.stringify(options.expression);
    this.alias = options.alias;
    this.getters = options.getters;

    if (options.classes && !this.classes) {
      this.addClassListeners();
      this.updateClasses();
    } else if (this.classes) {
      // remove them.
      this._unwatch(/class/);
    }

    this.classes = options.classes;
    if (isCallable(options.onDestroy)) {
      this.events.push({ on: 'destroy', handler: options.onDestroy });
    }
  }

  /**
   * Removes listeners.
   * @param {RegExp} tag 
   */
  _unwatch (tag) {
    this.watchers.filter(w => tag.test(w.tag)).forEach(w => w.unwatch());
    this.watchers = this.watchers.filter(w => w.tag !== tag);
  }

  /**
   * Adds or removes a class name based on a boolean value.
   * @param {String} className 
   * @param {Boolean} status 
   */
  toggleClass (className, status) {
    if (!className) return;

    if (status) {
      return addClass(this.el, className);
    }

    removeClass(this.el, className);
  }

  /**
   * Updates the element classes depending on each field flag status.
   */
  updateClasses () {
    this.toggleClass(this.classNames.dirty, this.flags.dirty);
    this.toggleClass(this.classNames.pristine, this.flags.pristine);
    this.toggleClass(this.classNames.valid, this.flags.valid);
    this.toggleClass(this.classNames.invalid, this.flags.invalid);
    this.toggleClass(this.classNames.touched, this.flags.touched);
    this.toggleClass(this.classNames.untouched, this.flags.untouched);
  }

  /**
   * Adds the listeners required for automatic classes.
   */
  addClassListeners () {
    // remove previous listeners.
    this._unwatch(/class/);

    const onFocus = () => {
      this.toggleClass(this.classNames.touched, true);
      this.toggleClass(this.classNames.untouched, false);
      this.field.flags.touched = true;
      this.field.flags.untouched = false;

      // only needed once.
      this._unwatch(/^class_focus$/);
    };

    const event = getInputEventName(this.el);
    const onInput = () => {
      this.toggleClass(this.classNames.pristine, false);
      this.toggleClass(this.classNames.dirty, true);
      this.field.flags.dirty = true;
      this.field.flags.pristine = false;

      // only needed once.
      this._unwatch(/^class_input$/);
    };

    if (this.isVue) {
      this.component.$once('input', onInput);
      this.component.$once('focus', onFocus);
      this.watchers.push({
        tag: 'class_input',
        unwatch: () => {
          this.component.$off('input', onInput);
        }
      });
      this.watchers.push({
        tag: 'class_focus',
        unwatch: () => {
          this.component.$off('focus', onFocus);
        }
      });
      return;
    }
    this.el.addEventListener(event, onInput);
    this.el.addEventListener('focus', onFocus);
    this.watchers.push({
      tag: 'class_input',
      unwatch: () => {
        this.el.removeEventListener(event, onInput);
      }
    });
    this.watchers.push({
      tag: 'class_focus',
      unwatch: () => {
        this.el.removeEventListener('focus', onFocus);
      }
    });
  }

  destroy () {
    this.events.filter(e => e.on === 'destroy').forEach(e => {
      e.handler();
    });

    // remove auto classes listeners.
    this._unwatch(/class/);
  }
}
