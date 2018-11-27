import Resolver from './resolver';
import RuleContainer from './ruleContainer';
import { isEvent, addEventListener, normalizeEvents } from '../utils/events';
import {
  uniqId,
  createFlags,
  assign,
  normalizeRules,
  isNullOrUndefined,
  getDataAttribute,
  toggleClass,
  isTextInput,
  debounce,
  isCallable,
  warn,
  toArray,
  getPath,
  makeDelayObject,
  merge,
  isObject,
  isCheckboxOrRadioInput,
  includes
} from '../utils';

// @flow

const DEFAULT_OPTIONS = {
  targetOf: null,
  immediate: false,
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
  immediate: boolean;
  classes: boolean;
  classNames: { [string]: string };
  delay: number | Object;
  listen: boolean;
  model: null | { expression: string | null, lazy: boolean };
  value: any;
  _alias: ?string;
  _delay: number | Object;

  constructor (options: FieldOptions | MapObject = {}) {
    this.id = uniqId();
    this.el = options.el;
    this.updated = false;
    this.dependencies = [];
    this.vmId = options.vmId;
    this.watchers = [];
    this.events = [];
    this.delay = 0;
    this.rules = {};
    this._cacheId(options);
    this.classNames = assign({}, DEFAULT_OPTIONS.classNames);
    options = assign({}, DEFAULT_OPTIONS, options);
    this._delay = !isNullOrUndefined(options.delay) ? options.delay : 0; // cache initial delay
    this.validity = options.validity;
    this.aria = options.aria;
    this.flags = createFlags();
    this.vm = options.vm;
    this.componentInstance = options.component;
    this.ctorConfig = this.componentInstance ? getPath('$options.$_veeValidate', this.componentInstance) : undefined;
    this.update(options);
    // set initial value.
    this.initialValue = this.value;
    this.updated = false;
  }

  get validator (): any {
    if (!this.vm || !this.vm.$validator) {
      return { validate: () => {} };
    }

    return this.vm.$validator;
  }

  get isRequired (): boolean {
    return !!this.rules.required;
  }

  get isDisabled (): boolean {
    return !!(this.componentInstance && this.componentInstance.disabled) || !!(this.el && this.el.disabled);
  }

  /**
   * Gets the display name (user-friendly name).
   */
  get alias (): ?string {
    if (this._alias) {
      return this._alias;
    }

    let alias = null;
    if (this.ctorConfig && this.ctorConfig.alias) {
      alias = isCallable(this.ctorConfig.alias) ? this.ctorConfig.alias.call(this.componentInstance) : this.ctorConfig.alias;
    }

    if (!alias && this.el) {
      alias = getDataAttribute(this.el, 'as');
    }

    if (!alias && this.componentInstance) {
      return this.componentInstance.$attrs && this.componentInstance.$attrs['data-vv-as'];
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

  get bails () {
    return this._bails;
  }

  /**
   * If the field rejects false as a valid value for the required rule.
   */

  get rejectsFalse (): boolean {
    if (this.componentInstance && this.ctorConfig) {
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
  matches (options: FieldMatchOptions | null): boolean {
    if (!options) {
      return true;
    }

    if (options.id) {
      return this.id === options.id;
    }

    let matchesComponentId = isNullOrUndefined(options.vmId) ? () => true : (id) => id === this.vmId;
    if (!matchesComponentId(options.vmId)) {
      return false;
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
   * Caches the field id.
   */
  _cacheId (options: FieldOptions): void {
    if (this.el && !options.targetOf) {
      this.el._veeValidateId = this.id;
    }
  }

  /**
   * Keeps a reference of the most current validation run.
   */
  waitFor (pendingPromise) {
    this._waitingFor = pendingPromise;
  }

  isWaitingFor (promise) {
    return this._waitingFor === promise;
  }

  /**
   * Updates the field with changed data.
   */
  update (options: Object) {
    this.targetOf = options.targetOf || null;
    this.immediate = options.immediate || this.immediate || false;

    // update errors scope if the field scope was changed.
    if (!isNullOrUndefined(options.scope) && options.scope !== this.scope && isCallable(this.validator.update)) {
      this.validator.update(this.id, { scope: options.scope });
    }
    this.scope = !isNullOrUndefined(options.scope) ? options.scope
      : !isNullOrUndefined(this.scope) ? this.scope : null;
    this.name = (!isNullOrUndefined(options.name) ? String(options.name) : options.name) || this.name || null;
    this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
    this._bails = options.bails !== undefined ? options.bails : this._bails;
    this.model = options.model || this.model;
    this.listen = options.listen !== undefined ? options.listen : this.listen;
    this.classes = (options.classes || this.classes || false) && !this.componentInstance;
    this.classNames = isObject(options.classNames) ? merge(this.classNames, options.classNames) : this.classNames;
    this.getter = isCallable(options.getter) ? options.getter : this.getter;
    this._alias = options.alias || this._alias;
    this.events = (options.events) ? normalizeEvents(options.events) : this.events;
    this.delay = makeDelayObject(this.events, options.delay || this.delay, this._delay);
    this.updateDependencies();
    this.addActionListeners();

    if (process.env.NODE_ENV !== 'production' && !this.name && !this.targetOf) {
      warn('A field is missing a "name" or "data-vv-name" attribute');
    }

    // update required flag flags
    if (options.rules !== undefined) {
      this.flags.required = this.isRequired;
    }

    // validate if it was validated before and field was updated and there was a rules mutation.
    if (this.flags.validated && options.rules !== undefined && this.updated) {
      this.validator.validate(`#${this.id}`);
    }

    this.updated = true;
    this.addValueListeners();

    // no need to continue.
    if (!this.el) {
      return;
    };

    this.updateClasses();
    this.updateAriaAttrs();
  }

  /**
   * Resets field flags and errors.
   */
  reset () {
    if (this._cancellationToken) {
      this._cancellationToken.cancelled = true;
      delete this._cancellationToken;
    }

    const defaults = createFlags();
    Object.keys(this.flags).filter(flag => flag !== 'required').forEach(flag => {
      this.flags[flag] = defaults[flag];
    });

    this.addValueListeners();
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
      if (RuleContainer.isTargetRule(r)) {
        prev.push({ selector: this.rules[r][0], name: r });
      }

      return prev;
    }, []);

    if (!fields.length || !this.vm || !this.vm.$el) return;

    // must be contained within the same component, so we use the vm root element constrain our dom search.
    fields.forEach(({ selector, name }) => {
      const ref = this.vm.$refs[selector];
      const el = Array.isArray(ref) ? ref[0] : ref;
      if (!el) {
        return;
      }

      const options: FieldOptions = {
        vm: this.vm,
        classes: this.classes,
        classNames: this.classNames,
        delay: this.delay,
        scope: this.scope,
        events: this.events.join('|'),
        immediate: this.immediate,
        targetOf: this.id
      };

      // probably a component.
      if (isCallable(el.$watch)) {
        options.component = el;
        options.el = el.$el;
        options.getter = Resolver.resolveGetter(el.$el, el.$vnode);
      } else {
        options.el = el;
        options.getter = Resolver.resolveGetter(el, {});
      }

      this.dependencies.push({ name, field: new Field(options) });
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
    if (!this.classes || this.isDisabled) return;
    const applyClasses = (el) => {
      toggleClass(el, this.classNames.dirty, this.flags.dirty);
      toggleClass(el, this.classNames.pristine, this.flags.pristine);
      toggleClass(el, this.classNames.touched, this.flags.touched);
      toggleClass(el, this.classNames.untouched, this.flags.untouched);
      // make sure we don't set any classes if the state is undetermined.
      if (!isNullOrUndefined(this.flags.valid) && this.flags.validated) {
        toggleClass(el, this.classNames.valid, this.flags.valid);
      }

      if (!isNullOrUndefined(this.flags.invalid) && this.flags.validated) {
        toggleClass(el, this.classNames.invalid, this.flags.invalid);
      }
    };

    if (!isCheckboxOrRadioInput(this.el)) {
      applyClasses(this.el);
      return;
    }

    const els = document.querySelectorAll(`input[name="${this.el.name}"]`);
    toArray(els).forEach(applyClasses);
  }

  /**
   * Adds the listeners required for automatic classes and some flags.
   */
  addActionListeners () {
    // remove previous listeners.
    this.unwatch(/class/);

    if (!this.el) return;

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

    const inputEvent = isTextInput(this.el) ? 'input' : 'change';
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

    if (this.componentInstance && isCallable(this.componentInstance.$once)) {
      this.componentInstance.$once('input', onInput);
      this.componentInstance.$once('blur', onBlur);
      this.watchers.push({
        tag: 'class_input',
        unwatch: () => {
          this.componentInstance.$off('input', onInput);
        }
      });
      this.watchers.push({
        tag: 'class_blur',
        unwatch: () => {
          this.componentInstance.$off('blur', onBlur);
        }
      });
      return;
    }

    if (!this.el) return;

    addEventListener(this.el, inputEvent, onInput);
    // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
    const blurEvent = isCheckboxOrRadioInput(this.el) ? 'change' : 'blur';
    addEventListener(this.el, blurEvent, onBlur);
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

  checkValueChanged () {
    // handle some people initialize the value to null, since text inputs have empty string value.
    if (this.initialValue === null && this.value === '' && isTextInput(this.el)) {
      return false;
    }

    return this.value !== this.initialValue;
  }

  /**
   * Determines the suitable primary event to listen for.
   */
  _determineInputEvent () {
    // if its a custom component, use the customized model event or the input event.
    if (this.componentInstance) {
      return (this.componentInstance.$options.model && this.componentInstance.$options.model.event) || 'input';
    }

    if (this.model && this.model.lazy) {
      return 'change';
    }

    if (isTextInput(this.el)) {
      return 'input';
    }

    return 'change';
  }

  /**
   * Determines the list of events to listen to.
   */
  _determineEventList (defaultInputEvent) {
    // if no event is configured, or it is a component or a text input then respect the user choice.
    if (!this.events.length || this.componentInstance || isTextInput(this.el)) {
      return [...this.events].map(evt => {
        if (evt === 'input' && this.model && this.model.lazy) {
          return 'change';
        }

        return evt;
      });
    }

    // force suitable event for non-text type fields.
    return this.events.map(e => {
      if (e === 'input') {
        return defaultInputEvent;
      }

      return e;
    });
  }

  /**
   * Adds the listeners required for validation.
   */
  addValueListeners () {
    this.unwatch(/^input_.+/);
    if (!this.listen || !this.el) return;

    const token = { cancelled: false };
    const fn = this.targetOf ? () => {
      this.flags.changed = this.checkValueChanged(); ;
      this.validator.validate(`#${this.targetOf}`);
    } : (...args) => {
      // if its a DOM event, resolve the value, otherwise use the first parameter as the value.
      if (args.length === 0 || isEvent(args[0])) {
        args[0] = this.value;
      }

      this.flags.changed = this.checkValueChanged();
      this.validator.validate(`#${this.id}`, args[0]);
    };

    const inputEvent = this._determineInputEvent();
    let events = this._determineEventList(inputEvent);

    // if there is a model and an on input validation is requested.
    if (this.model && includes(events, inputEvent)) {
      let ctx = null;
      let expression = this.model.expression;
      // if its watchable from the context vm.
      if (this.model.expression) {
        ctx = this.vm;
        expression = this.model.expression;
      }

      // watch it from the custom component vm instead.
      if (!expression && this.componentInstance && this.componentInstance.$options.model) {
        ctx = this.componentInstance;
        expression = this.componentInstance.$options.model.prop || 'value';
      }

      if (ctx && expression) {
        const debouncedFn = debounce(fn, this.delay[inputEvent], token);
        const unwatch = ctx.$watch(expression, (...args) => {
          this.flags.pending = true;
          this._cancellationToken = token;
          debouncedFn(...args);
        });
        this.watchers.push({
          tag: 'input_model',
          unwatch
        });

        // filter out input event as it is already handled by the watcher API.
        events = events.filter(e => e !== inputEvent);
      }
    }

    // Add events.
    events.forEach(e => {
      const debouncedFn = debounce(fn, this.delay[e], token);
      const validate = (...args) => {
        this.flags.pending = true;
        this._cancellationToken = token;
        debouncedFn(...args);
      };

      this._addComponentEventListener(e, validate);
      this._addHTMLEventListener(e, validate);
    });
  }

  _addComponentEventListener (evt, validate) {
    if (!this.componentInstance) return;

    this.componentInstance.$on(evt, validate);
    this.watchers.push({
      tag: 'input_vue',
      unwatch: () => {
        this.componentInstance.$off(evt, validate);
      }
    });
  }

  _addHTMLEventListener (evt, validate) {
    if (!this.el || this.componentInstance) return;

    // listen for the current element.
    const addListener = (el) => {
      addEventListener(el, evt, validate);
      this.watchers.push({
        tag: 'input_native',
        unwatch: () => {
          el.removeEventListener(evt, validate);
        }
      });
    };

    addListener(this.el);
    if (!isCheckboxOrRadioInput(this.el)) {
      return;
    }

    const els = document.querySelectorAll(`input[name="${this.el.name}"]`);
    toArray(els).forEach(el => {
      // skip if it is added by v-validate and is not the current element.
      if (el._veeValidateId && el !== this.el) {
        return;
      }

      addListener(el);
    });
  }

  /**
   * Updates aria attributes on the element.
   */
  updateAriaAttrs () {
    if (!this.aria || !this.el || !isCallable(this.el.setAttribute)) return;

    const applyAriaAttrs = (el) => {
      el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
      el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
    };

    if (!isCheckboxOrRadioInput(this.el)) {
      applyAriaAttrs(this.el);
      return;
    }

    const els = document.querySelectorAll(`input[name="${this.el.name}"]`);
    toArray(els).forEach(applyAriaAttrs);
  }

  /**
   * Updates the custom validity for the field.
   */
  updateCustomValidity () {
    if (!this.validity || !this.el || !isCallable(this.el.setCustomValidity) || !this.validator.errors) return;

    this.el.setCustomValidity(this.flags.valid ? '' : (this.validator.errors.firstById(this.id) || ''));
  }

  /**
   * Removes all listeners.
   */
  destroy () {
    // ignore the result of any ongoing validation.
    if (this._cancellationToken) {
      this._cancellationToken.cancelled = true;
    }

    this.unwatch();
    this.dependencies.forEach(d => d.field.destroy());
    this.dependencies = [];
  }
}
