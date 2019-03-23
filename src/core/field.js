import Resolver from './resolver';
import RuleContainer from './ruleContainer';
import { isEvent, addEventListener, addEventListenerOnce } from '../utils/events';
import { findModel } from '../utils/vnode';
import {
  uniqId,
  createFlags,
  normalizeRules,
  isNullOrUndefined,
  toggleClass,
  isTextInput,
  debounce,
  isCallable,
  toArray,
  isCheckboxOrRadioInput,
  includes,
  isEqual,
  values
} from '../utils';

// @flow

function createObserver () {
  return {
    refs: {},
    subscribe (ctx) {
      this.refs[ctx.vid] = ctx;
    },
    unsubscribe (ctx) {
      delete this.refs[ctx.vid];
    }
  };
}

export default class Field {
  constructor (el, binding, vnode) {
    this.el = el;
    this.vid = vnode.data.ref || uniqId();
    this.el._vid = this.vid;
    this.id = this.el._vid;
    this.deps = {};
    this._value = undefined;
    this.flags = createFlags();
    this.$ctx = vnode.context;
    this.$validator = vnode.context.$validator;
  }

  get value () {
    return this._value;
  }

  set value (value) {
    if (!isEqual(value, this._value)) {
      this.validateDeps();
    }

    this._value = value;
  }

  static from (el, vnode) {
    if (!vnode.context.$_veeObserver) {
      return null;
    }

    return vnode.context.$_veeObserver.refs[el._vid];
  }

  validate () {
    const options = Resolver.generate(this.el, this.binding, this.vnode);
    this.classes = options.classes;
    this.classNames = options.classNames;
    this.aria = options.aria;
    this.validity = options.validity;

    return this.$validator.verify(this.value, this.rules, {
      name: options.alias || options.name,
      bails: options.bails,
      values: this.createValuesLookup(),
    }).then(res => {
      this.flags.validated = true;
      this.applyResult(res);

      return res;
    });
  }

  fieldDeps () {
    const rules = normalizeRules(this.rules);
    this.isRequired = !!rules.required;

    return Object.keys(rules).filter(RuleContainer.isTargetRule).map(rule => {
      return rules[rule][0];
    });
  }

  createValuesLookup () {
    return this.fieldDeps().reduce((acc, depName) => {
      const fields = this.$ctx.$_veeObserver.refs;
      if (!fields[depName]) {
        return acc;
      }

      // register cross-field dependencies
      fields[depName].deps[this.vid] = this;
      acc[depName] = fields[depName].value;

      return acc;
    }, {});
  }

  onModelUpdated (model, binding, vnode) {
    if (model.value === this.value) {
      return;
    }

    this.value = model.value;
    this.validate();
  }

  validateDeps () {
    values(this.deps).forEach(dep => {
      if (dep.flags.validated) {
        this.$ctx.$nextTick(() => {
          dep.validate();
        });
      }
    });
  }

  applyResult ({ valid, errors }) {
    const fieldName = this.el.name;
    this.flags.valid = valid;
    this.flags.invalid = !valid;
    this.$validator.errors.removeById(this.vid);
    this.$validator.errors.add(
      errors.map(e => ({
        id: this.vid,
        field: fieldName,
        msg: e.replace('{field}', fieldName)
      }))
    );
    this.applyClasses();
    this.applyAriaAttrs();
    this.applyCustomValidity();
  }

  addLiteListeners (el) {
    addEventListener(el, 'input', () => {
      this._emittedEvt = true;
    });
  }

  addListeners (el) {
    if (this.hasListener) {
      return;
    }

    const inputEvt = this._determineInputEvent();
    const events = this._determineEventList(inputEvt);

    events.forEach(ev => {
      addEventListener(el, ev, (e) => {
        const value = e.target.value;
        this.value = value;
        this.validate();
        this._emittedEvt = false;
      });
    });
    this.hasListener = true;
  }

  onUpdate (el, binding, vnode) {
    this.el = el;
    this.binding = binding;
    this.vnode = vnode;
    const model = findModel(vnode);
    this.rules = binding.value;
    this.registerField(vnode);
    this.updateOptions(el, binding, vnode);
    if (model) {
      this.onModelUpdated(model, binding, vnode);
      this.addLiteListeners(el);
    } else {
      this.addListeners(el);
    }

    this._emittedEvt = false;
    if (binding.modifiers && binding.modifiers.immediate && !this.flags.validated) {
      this.validate();
    }

    this.addActionListeners();
  }

  updateOptions (el, binding, vnode) {
    const options = Resolver.generate(el, binding, vnode);
    this.events = options.events;
    this.componentInstance = options.component;
  }

  registerField (vnode) {
    if (!vnode.context.$_veeObserver) {
      vnode.context.$_veeObserver = createObserver();
    }

    vnode.context.$_veeObserver.subscribe(this);
  }

  get validator (): any {
    if (!this.vm || !this.vm.$validator) {
      return { validate: () => {} };
    }

    return this.vm.$validator;
  }

  get isDisabled (): boolean {
    return !!(this.componentInstance && this.componentInstance.disabled) || !!(this.el && this.el.disabled);
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

    // update initial value
    this.initialValue = this.value;
    this.flags.changed = false;

    this.addValueListeners();
    this.addActionListeners();
    this.updateClasses(true);
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
  applyClasses (isReset = false) {
    if (!this.classes || this.isDisabled) return;

    const classes = values(this.classNames).reduce((acc, name) => {
      if (this.flags[name] && this.classNames[name]) {
        acc[name] = this.classNames[name];
      }

      return acc;
    }, {});

    // remove valid/invalid classes on reset.
    if (isReset) {
      delete classes.valid;
      delete classes.invalid;
    }

    // make sure we don't set any classes if the state is undetermined.
    if (!isNullOrUndefined(this.flags.valid) && this.flags.validated) {
      delete classes.valid;
    }

    if (!isNullOrUndefined(this.flags.invalid) && this.flags.validated) {
      delete classes.valid;
    }

    this.el.className = values(classes).join(' ');
  }

  /**
   * Adds the listeners required for automatic classes and some flags.
   */
  addActionListeners () {
    // remove previous listeners.
    if (!this.el) return;

    const onBlur = () => {
      this.flags.touched = true;
      this.flags.untouched = false;
      if (this.classes) {
        toggleClass(this.el, this.classNames.touched, true);
        toggleClass(this.el, this.classNames.untouched, false);
      }
    };

    const inputEvent = isTextInput(this.el) ? 'input' : 'change';
    const onInput = () => {
      this.flags.dirty = true;
      this.flags.pristine = false;
      if (this.classes) {
        toggleClass(this.el, this.classNames.pristine, false);
        toggleClass(this.el, this.classNames.dirty, true);
      }
    };

    if (this.componentInstance && isCallable(this.componentInstance.$once)) {
      this.componentInstance.$once('input', onInput);
      this.componentInstance.$once('blur', onBlur);
      return;
    }

    addEventListenerOnce(this.el, inputEvent, onInput);
    // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
    const blurEvent = isCheckboxOrRadioInput(this.el) ? 'change' : 'blur';
    addEventListenerOnce(this.el, blurEvent, onBlur);
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
      const target = this.validator._resolveField(`#${this.targetOf}`);
      if (target && target.flags.validated) {
        this.validator.validate(`#${this.targetOf}`);
      }
    } : (...args) => {
      // if its a DOM event, resolve the value, otherwise use the first parameter as the value.
      if (args.length === 0 || isEvent(args[0])) {
        args[0] = this.value;
      }

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
  applyAriaAttrs () {
    if (!this.aria || !this.el || !isCallable(this.el.setAttribute)) return;

    this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
    this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  }

  /**
   * Updates the custom validity for the field.
   */
  applyCustomValidity () {
    if (!this.validity || !this.el || !isCallable(this.el.setCustomValidity) || !this.$ctx.$validator.errors) return;

    this.el.setCustomValidity(this.flags.valid ? '' : (this.$ctx.$validator.errors.firstById(this.vid) || ''));
  }

  /**
   * Removes all listeners.
   */
  destroy () {
    // ignore the result of any ongoing validation.
    if (this._cancellationToken) {
      this._cancellationToken.cancelled = true;
    }
  }
}
