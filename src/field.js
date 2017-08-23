import { uniqId, assign, normalizeRules, setDataAttribute, toggleClass, getInputEventName, debounce, isCallable, warn, toArray } from './utils';
import Generator from './generator';

const DEFAULT_FLAGS = {
  untouched: true,
  touched: false,
  dirty: false,
  pristine: true,
  valid: null,
  invalid: null,
  validated: false,
  pending: false,
  required: false
};

const DEFAULT_OPTIONS = {
  targetOf: null,
  initial: false,
  scope: null,
  listen: true,
  name: null,
  active: true,
  required: false,
  rules: {},
  vm: null,
  classes: false,
  validity: true,
  aria: true,
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

export default class Field {
  constructor (el, options = {}) {
    this.id = uniqId();
    this.el = el;
    this.updated = false;
    this.dependencies = [];
    this.watchers = [];
    this.events = [];
    this.rules = {};
    if (!this.isHeadless && !(this.targetOf || options.targetOf)) {
      setDataAttribute(this.el, 'id', this.id); // cache field id if it is independent and has a root element.
    }
    options = assign({}, DEFAULT_OPTIONS, options);
    this.validity = options.validity;
    this.aria = options.aria;
    this.flags = assign({}, DEFAULT_FLAGS);
    this.vm = options.vm || this.vm;
    this.component = options.component || this.component;
    this.update(options);
    this.updated = false;
  }

  get isVue () {
    return !!this.component;
  }

  get validator () {
    if (!this.vm || !this.vm.$validator) {
      warn('No validator instance detected.');
      return { validate: () => {} };
    }

    return this.vm.$validator;
  }

  get isRequired () {
    return !!this.rules.required;
  }

  get isDisabled () {
    return (this.isVue && this.component.disabled) || (this.el && this.el.disabled);
  }

  get isHeadless () {
    return !this.el;
  }

  /**
   * Gets the display name (user-friendly name).
   * @return {String}
   */
  get displayName () {
    return this.alias;
  }

  /**
   * Gets the input value.
   * @return {*}
   */
  get value () {
    if (!isCallable(this.getter)) {
      return undefined;
    }

    return this.getter();
  }

  /**
   * If the field rejects false as a valid value for the required rule. 
   */
  get rejectsFalse () {
    if (this.isVue || this.isHeadless) {
      return false;
    }

    return this.el.type === 'checkbox';
  }

  /**
   * Determines if the instance matches the options provided.
   * @param {Object} options The matching options.
   */
  matches (options) {
    if (options.id) {
      return this.id === options.id;
    }

    if (options.name === undefined && options.scope === undefined) {
      return true;
    }

    if (options.scope === undefined) {
      return this.name === options.name;
    }

    if (options.name === undefined) {
      return this.scope === options.scope;
    }

    return options.name === this.name && options.scope === this.scope;
  }

  /**
   *
   * @param {Object} options
   */
  update (options) {
    this.targetOf = options.targetOf || null;
    this.initial = options.initial || this.initial || false;

    // update errors scope if the field scope was changed.
    if (options.scope && options.scope !== this.scope && this.validator.errors && isCallable(this.validator.errors.update)) {
      this.validator.errors.update(this.id, { scope: options.scope });
    }
    this.scope = options.scope || this.scope || null;
    this.name = options.name || this.name || null;
    this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
    this.model = options.model || this.model;
    this.listen = options.listen !== undefined ? options.listen : this.listen;
    this.classes = options.classes || this.classes || false;
    this.classNames = options.classNames || this.classNames || DEFAULT_OPTIONS.classNames;
    this.alias = options.alias || this.alias;
    this.getter = isCallable(options.getter) ? options.getter : this.getter;
    this.delay = options.delay || this.delay || 0;
    this.events = typeof options.events === 'string' && options.events.length ? options.events.split('|') : this.events;
    this.updateDependencies();
    this.addActionListeners();

    // update required flag flags
    if (options.rules !== undefined) {
      this.flags.required = this.isRequired;
    }

    // validate if it was validated before and field was updated and there was a rules mutation.
    if (this.flags.validated && options.rules !== undefined && this.updated) {
      this.validator.validate(`#${this.id}`);
    }

    this.updated = true;

    // no need to continue.
    if (this.isHeadless) {
      return;
    };

    this.updateClasses();
    this.addValueListeners();
    this.updateAriaAttrs();
  }

  /**
   * Resets field flags and errors.
   */
  reset () {
    Object.keys(this.flags).forEach(flag => {
      this.flags[flag] = DEFAULT_FLAGS[flag];
    });

    this.addActionListeners();
    this.updateClasses();
    this.validator.errors.removeById(this.id);
  }

  /**
   * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
   * @param {Object} flags 
   */
  setFlags (flags) {
    const negated = {
      pristine: 'dirty',
      dirty: 'pristene',
      valid: 'invalid',
      invalid: 'valid',
      touched: 'untouched',
      untouched: 'touched'
    };

    Object.keys(flags).forEach(flag => {
      this.flags[flag] = flags[flag];
      // if it has a negation and was not specified, set it as well.
      if (negated[flag] && flags[negated[flag]] === undefined) {
        this.flags[negated[flag]] = !flags[flag];
      }
    });

    if (flags.untouched || flags.touched) {
      this.addActionListeners();
    }
    this.updateClasses();
    this.updateAriaAttrs();
    this.updateCustomValidity();
  }

  /**
   * Determines if the field requires references to target fields.
  */
  updateDependencies () {
    // reset dependencies.
    this.dependencies.forEach(d => d.field.destroy());
    this.dependencies = [];

    // we get the selectors for each field.
    const fields = Object.keys(this.rules).reduce((prev, r) => {
      if (r === 'confirmed') {
        prev.push({ selector: this.rules[r][0] || `${this.name}_confirmation`, name: r });
      } else if (/after|before/.test(r)) {
        prev.push({ selector: this.rules[r][0], name: r });
      }

      return prev;
    }, []);

    if (!fields.length || !this.vm || !this.vm.$el) return;

    // must be contained within the same component, so we use the vm root element constrain our dom search.
    fields.forEach(({ selector, name }) => {
      let el = null;
      // vue ref selector.
      if (selector[0] === '$') {
        el = this.vm.$refs[selector.slice(1)];
      } else {
        // try a query selection.
        el = this.vm.$el.querySelector(selector);
      }

      if (!el) {
        // try a name selector
        el = this.vm.$el.querySelector(`input[name="${selector}"]`);
      }

      if (!el) {
        return;
      }

      const options = {
        vm: this.vm,
        classes: this.classes,
        classNames: this.classNames,
        delay: this.delay,
        scope: this.scope,
        events: this.events.join('|'),
        initial: this.initial,
        targetOf: this.id
      };

      // probably a component.
      if (isCallable(el.$watch)) {
        options.component = el;
        options.el = el.$el;
        options.getter = Generator.resolveGetter(el.$el, { child: el });
      } else {
        options.el = el;
        options.getter = Generator.resolveGetter(el, {});
      }

      this.dependencies.push({ name, field: new Field(options.el, options) });
    });
  }

  /**
   * Removes listeners.
   * @param {RegExp} tag
   */
  unwatch (tag = null) {
    if (!tag) {
      this.watchers.forEach(w => w.unwatch());
      this.watchers = [];
      return;
    }
    this.watchers.filter(w => tag.test(w.tag)).forEach(w => w.unwatch());
    this.watchers = this.watchers.filter(w => !tag.test(w.tag));
  }

  /**
   * Updates the element classes depending on each field flag status.
   */
  updateClasses () {
    if (!this.classes) return;

    toggleClass(this.el, this.classNames.dirty, this.flags.dirty);
    toggleClass(this.el, this.classNames.pristine, this.flags.pristine);
    toggleClass(this.el, this.classNames.valid, !!this.flags.valid);
    toggleClass(this.el, this.classNames.invalid, !!this.flags.invalid);
    toggleClass(this.el, this.classNames.touched, this.flags.touched);
    toggleClass(this.el, this.classNames.untouched, this.flags.untouched);
  }

  /**
   * Adds the listeners required for automatic classes and some flags.
   */
  addActionListeners () {
    // remove previous listeners.
    this.unwatch(/class/);

    const onBlur = () => {
      this.flags.touched = true;
      this.flags.untouched = false;
      if (this.classes) {
        toggleClass(this.el, this.classNames.touched, true);
        toggleClass(this.el, this.classNames.untouched, false);
      }

      // only needed once.
      this.unwatch(/^class_blur$/);
    };

    const inputEvent = getInputEventName(this.el);
    const onInput = () => {
      this.flags.dirty = true;
      this.flags.pristine = false;
      if (this.classes) {
        toggleClass(this.el, this.classNames.pristine, false);
        toggleClass(this.el, this.classNames.dirty, true);
      }

      // only needed once.
      this.unwatch(/^class_input$/);
    };

    if (this.isVue && isCallable(this.component.$once)) {
      this.component.$once('input', onInput);
      this.component.$once('blur', onBlur);
      this.watchers.push({
        tag: 'class_input',
        unwatch: () => {
          this.component.$off('input', onInput);
        }
      });
      this.watchers.push({
        tag: 'class_blur',
        unwatch: () => {
          this.component.$off('blur', onBlur);
        }
      });
      return;
    }

    if (this.isHeadless) return;

    this.el.addEventListener(inputEvent, onInput);
    // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
    const blurEvent = ['radio', 'checkbox'].indexOf(this.el.type) === -1 ? 'blur' : 'click';
    this.el.addEventListener(blurEvent, onBlur);
    this.watchers.push({
      tag: 'class_input',
      unwatch: () => {
        this.el.removeEventListener(inputEvent, onInput);
      }
    });

    this.watchers.push({
      tag: 'class_blur',
      unwatch: () => {
        this.el.removeEventListener(blurEvent, onBlur);
      }
    });
  }

  /**
   * Adds the listeners required for validation.
   */
  addValueListeners () {
    this.unwatch(/^input_.+/);
    if (!this.listen) return;

    let fn = null;
    if (this.targetOf) {
      fn = () => {
        this.validator.validate(`#${this.targetOf}`);
      };
    } else {
      fn = (...args) => {
        if (args.length === 0 || (isCallable(Event) && args[0] instanceof Event)) {
          args[0] = this.value;
        }
        this.validator.validate(`#${this.id}`, args[0]);
      };
    }
    const validate = debounce(fn, this.delay);

    const inputEvent = getInputEventName(this.el);
    // replace input event with suitable one.
    let events = this.events.map(e => {
      return e === 'input' ? inputEvent : e;
    });

    // if there is a watchable model and an on input validation is requested.
    if (this.model && events.indexOf(inputEvent) !== -1) {
      const unwatch = this.vm.$watch(this.model, validate);
      this.watchers.push({
        tag: 'input_model',
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
          tag: 'input_vue',
          unwatch: () => {
            this.component.$off(e, validate);
          }
        });
        return;
      }

      if (~['radio', 'checkbox'].indexOf(this.el.type)) {
        const els = document.querySelectorAll(`input[name="${this.el.name}"]`);
        toArray(els).forEach(el => {
          el.addEventListener(e, validate);
          this.watchers.push({
            tag: 'input_native',
            unwatch: () => {
              el.removeEventListener(e, validate);
            }
          });
        });

        return;
      }

      this.el.addEventListener(e, validate);
      this.watchers.push({
        tag: 'input_native',
        unwatch: () => {
          this.el.removeEventListener(e, validate);
        }
      });
    });
  }

  /**
   * Updates aria attributes on the element.
   */
  updateAriaAttrs () {
    if (!this.aria || this.isHeadless || !isCallable(this.el.setAttribute)) return;

    this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
    this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  }

  /**
   * Updates the custom validity for the field.
   */
  updateCustomValidity () {
    if (!this.validity || this.isHeadless || !isCallable(this.el.setCustomValidity)) return;

    this.el.setCustomValidity(this.flags.valid ? '' : (this.validator.errors.firstById(this.id) || ''));
  }

  /**
   * Removes all listeners.
   */
  destroy () {
    this.watchers.forEach(w => w.unwatch());
    this.watchers = [];
    this.dependencies.forEach(d => d.field.destroy());
    this.dependencies = [];
  }
}
