import {
  uniqId,
  createFlags,
  assign,
  normalizeRules,
  isNullOrUndefined,
  getDataAttribute,
  setDataAttribute,
  toggleClass,
  getInputEventName,
  debounce,
  isCallable,
  warn,
  toArray,
  getPath,
  makeEventsArray,
  makeDelayObject,
} from './utils';
import Generator from './generator';

// @flow

const DEFAULT_OPTIONS = {
  targetOf: null,
  initial: false,
  scope: null,
  listen: true,
  name: null,
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
  id: string;
  el: ?HTMLInputElement;
  updated: boolean;
  dependencies: Array<{ name: string, field: Field }>;
  watchers: Watcher[];
  events: string[];
  rules: { [string]: Object };
  validity: boolean;
  aria: boolean;
  vm: Object | null;
  component: Object | null;
  ctorConfig: ?Object;
  flags: { [string]: boolean };
  alias: ?string;
  getter: () => any;
  name: string;
  scope: string | null;
  targetOf: ?string;
  initial: boolean;
  classes: boolean;
  classNames: { [string]: string };
  delay: number | Object;
  listen: boolean;
  model: ?string;
  value: any;
  _alias: ?string;

  constructor (el: HTMLInputElement | null, options: FieldOptions | MapObject = {}) {
    this.id = uniqId();
    this.el = el;
    this.updated = false;
    this.dependencies = [];
    this.watchers = [];
    this.events = [];
    this.delay = 0;
    this.rules = {};
    if (this.el && !options.targetOf) {
      setDataAttribute(this.el, 'id', this.id); // cache field id if it is independent and has a root element.
    }
    options = assign({}, DEFAULT_OPTIONS, options);
    this.validity = options.validity;
    this.aria = options.aria;
    this.flags = createFlags();
    this.vm = options.vm;
    this.component = options.component;
    this.ctorConfig = this.component ? getPath('$options.$_veeValidate', this.component) : undefined;
    this.update(options);
    this.updated = false;
  }

  get validator (): any {
    if (!this.vm || !this.vm.$validator) {
      warn('No validator instance detected.');
      return { validate: () => {} };
    }

    return this.vm.$validator;
  }

  get isRequired (): boolean {
    return !!this.rules.required;
  }

  get isDisabled (): boolean {
    return !!(this.component && this.component.disabled) || !!(this.el && this.el.disabled);
  }

  /**
   * Gets the display name (user-friendly name).
   */
  get alias (): ?string {
    if (this._alias) {
      return this._alias;
    }

    let alias = null;
    if (this.el) {
      alias = getDataAttribute(this.el, 'as');
    }

    if (!alias && this.component) {
      return this.component.$attrs && this.component.$attrs['data-vv-as'];
    }

    return alias;
  }

  /**
   * Gets the input value.
   */

  get value (): any {
    if (!isCallable(this.getter)) {
      return undefined;
    }

    return this.getter();
  }

  /**
   * If the field rejects false as a valid value for the required rule.
   */

  get rejectsFalse (): boolean {
    if (this.component && this.ctorConfig) {
      return !!this.ctorConfig.rejectsFalse;
    }

    if (!this.el) {
      return false;
    }

    return this.el.type === 'checkbox';
  }

  /**
   * Determines if the instance matches the options provided.
   */
  matches (options: { [string]: any }): boolean {
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
   * Updates the field with changed data.
   */
  update (options: Object) {
    this.targetOf = options.targetOf || null;
    this.initial = options.initial || this.initial || false;

    // update errors scope if the field scope was changed.
    if (!isNullOrUndefined(options.scope) && options.scope !== this.scope && isCallable(this.validator.update)) {
      this.validator.update(this.id, { scope: options.scope });
    }
    this.scope = !isNullOrUndefined(options.scope) ? options.scope
      : !isNullOrUndefined(this.scope) ? this.scope : null;
    this.name = (!isNullOrUndefined(options.name) ? String(options.name) : options.name) || this.name || null;
    this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
    this.model = options.model || this.model;
    this.listen = options.listen !== undefined ? options.listen : this.listen;
    this.classes = options.classes || this.classes || false;
    this.classNames = options.classNames || this.classNames || DEFAULT_OPTIONS.classNames;
    this.getter = isCallable(options.getter) ? options.getter : this.getter;
    this._alias = options.alias || this._alias;
    this.events = (options.events) ? makeEventsArray(options.events) : this.events;
    this.delay = (options.delay) ? makeDelayObject(this.events, options.delay) : makeDelayObject(this.events, this.delay);
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
    if (!this.el) {
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
    const def = createFlags();
    Object.keys(this.flags).forEach(flag => {
      this.flags[flag] = def[flag];
    });

    this.addActionListeners();
    this.updateClasses();
    this.updateAriaAttrs();
    this.updateCustomValidity();
  }

  /**
   * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
   */
  setFlags (flags: { [string]: boolean }) {
    const negated = {
      pristine: 'dirty',
      dirty: 'pristine',
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

    if (
      flags.untouched !== undefined ||
      flags.touched !== undefined ||
      flags.dirty !== undefined ||
      flags.pristine !== undefined
    ) {
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
        try {
          // try query selector
          el = this.vm.$el.querySelector(selector);
        } catch (err) {
          el = null;
        }
      }

      if (!el) {
        try {
          el = this.vm.$el.querySelector(`input[name="${selector}"]`);
        } catch (err) {
          el = null;
        }
      }

      if (!el) {
        return;
      }

      const options: { [string]: any } = {
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
   */
  unwatch (tag?: ?RegExp = null) {
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

    if (this.component && isCallable(this.component.$once)) {
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

    if (!this.el) return;

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

    const fn = this.targetOf ? () => {
      this.validator.validate(`#${this.targetOf}`);
    } : (...args) => {
      // if its a DOM event, resolve the value, otherwise use the first parameter as the value.
      if (args.length === 0 || (isCallable(Event) && args[0] instanceof Event) || (args[0] && args[0].srcElement)) {
        args[0] = this.value;
      }
      this.validator.validate(`#${this.id}`, args[0]);
    };

    const inputEvent = getInputEventName(this.el);
    // replace input event with suitable one.
    let events = this.events.map(e => {
      return e === 'input' ? inputEvent : e;
    });

    // if there is a watchable model and an on input validation is requested.
    if (this.model && events.indexOf(inputEvent) !== -1) {
      const debouncedFn = debounce(fn, this.delay[inputEvent]);
      const unwatch = this.vm.$watch(this.model, (...args) => {
        this.flags.pending = true;
        debouncedFn(...args);
      });
      this.watchers.push({
        tag: 'input_model',
        unwatch
      });
      // filter out input event as it is already handled by the watcher API.
      events = events.filter(e => e !== inputEvent);
    }

    // Add events.
    events.forEach(e => {
      const debouncedFn = debounce(fn, this.delay[e]);
      const validate = (...args) => {
        this.flags.pending = true;
        debouncedFn(...args);
      };

      if (this.component) {
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
    if (!this.aria || !this.el || !isCallable(this.el.setAttribute)) return;

    this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
    this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  }

  /**
   * Updates the custom validity for the field.
   */
  updateCustomValidity () {
    if (!this.validity || !this.el || !isCallable(this.el.setCustomValidity)) return;

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
