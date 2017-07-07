import { uniqId, assign, isCallable, setDataAttribute, addClass, removeClass, getInputEventName, debounce } from './utils';

const DEFAULT_OPTIONS = {
  scope: '__global__',
  active: true,
  required: false,
  rules: {},
  vm: null,
  classes: false,
  events: 'input|blur',
  delay: 0,
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

  get isDisabled () {
    return (this.isVue && this.component.disabled) || this.el.disabled;
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
    this.model = options.model || this.model;
    this.classNames = options.classNames;
    this.expression = JSON.stringify(options.expression);
    this.alias = options.alias;
    this.getters = options.getters;
    this.delay = 0;
    this.events = Array.isArray(options.events) ? options.events : options.events.split('|');

    if (options.classes && !this.classes) {
      this.addClassListeners();
      this.updateClasses();
    } else if (this.classes) {
      // remove them.
      this._unwatch(/class/);
    }

    this.classes = options.classes;
    this.addValueListeners();
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

  /**
   * Adds the listeners required for validation.
   */
  addValueListeners () {
    this._unwatch(/input/);
    const validate = debounce(() => {
      this.$validator.validate(`#${this.id}`, this.value);
    }, this.delay);

    const inputEvent = getInputEventName(this.el);
    // replace input event with suitable one.
    let events = this.events.map(e => {
      return e === 'input' ? inputEvent : e;
    });

    // if there is a watchable model and an on input validation is requested.
    if (this.model && events.indexOf(inputEvent) !== -1) {
      const unwatch = this.vm.$watch(this.model.expression, validate);
      this.watchers.push({
        tag: 'input',
        unwatch
      });
      // filter out input event as it is already handled by the watcher API.
      events = events.filter(e => e !== inputEvent);
    }

    // Add events.
    events.forEach(e => {
      if (this.isVue) {
        this.component.$on(e, validate);
        this.watchers.push({
          tag: 'vue_input',
          unwatch: () => {
            this.component.$off(e, validate);
          }
        });
        return;
      }

      this.el.addEventListener(e, validate);
      this.watchers.push({
        tag: 'el_input',
        unwatch: () => {
          this.el.removeEventListener(e, validate);
        }
      });
    });
  }

  /**
   * Removes all listeners.
   */
  destroy () {
    this.watchers.forEach(w => w.unwatch());
    this.watchers = [];
  }
}
