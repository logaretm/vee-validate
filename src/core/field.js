import { resolveDirectiveRules, resolveName, resolveFeatures, resolveAlias, resolveValue } from './resolvers';
import { Vue } from '../plugin';
import { modes } from '../modes';
import RuleContainer from './ruleContainer';
import { addEventListener, normalizeEventValue } from '../utils/events';
import { findModel, getInputEventName } from '../utils/vnode';
import { getValidator } from '../state';
import {
  uniqId,
  createFlags,
  normalizeRules,
  isNullOrUndefined,
  toggleClass,
  isTextInput,
  isCallable,
  toArray,
  isCheckboxOrRadioInput,
  isEqual,
  values,
  defineNonReactive,
  assign,
  includes
} from '../utils';
import { getConfig } from '../config';

const DEFAULT_CLASSES = {
  touched: 'touched', // the control has been blurred
  untouched: 'untouched', // the control hasn't been blurred
  valid: 'valid', // model is valid
  invalid: 'invalid', // model is invalid
  pristine: 'pristine', // control has not been interacted with
  dirty: 'dirty' // control has been interacted with
};

function createObserver () {
  const state = Vue.observable({ refs: {} });
  state.subscribe = (ctx) => {
    Vue.set(state.refs, ctx.vid, ctx);
  };

  state.unsubscribe = (ctx) => {
    Vue.delete(state.refs, ctx.vid);
  };

  return state;
}

function computeModeSetting (ctx) {
  const compute = isCallable(ctx.mode) ? ctx.mode : modes[ctx.mode];

  return compute({
    errors: ctx.errors,
    value: ctx.value,
    flags: ctx.flags
  });
}
export default class Field {
  constructor (el, binding, vnode) {
    defineNonReactive(this, 'el', el);
    defineNonReactive(this, 'vid', vnode.data.ref || uniqId());
    defineNonReactive(this, 'deps', {});
    defineNonReactive(this, 'validator', getValidator());
    defineNonReactive(this, 'vmId', vnode.context._uid);
    defineNonReactive(this, 'ctx', vnode.context);
    defineNonReactive(this, 'opts', {});
    defineNonReactive(this, 'binding', binding);
    defineNonReactive(this, 'vnode', vnode);
    defineNonReactive(this, 'initialized', false);
    defineNonReactive(this, '_listeners', {});
    defineNonReactive(this, '_interactions', {});
    defineNonReactive(this, '_value', resolveValue(el, vnode));
    defineNonReactive(this, 'rules', resolveDirectiveRules(el, binding, vnode));

    this.el._vid = this.vid;
    this.flags = Vue.observable(createFlags());
    this.errors = Vue.observable([]);
    this.name = resolveName(el, vnode);
    if (binding.modifiers.persist) {
      this.restoreFieldState();
    }
  }

  get value () {
    return this._value;
  }

  get mode () {
    return getConfig().mode;
  }

  set value (value) {
    if (!isEqual(value, this._value)) {
      this.validateDeps();
    }

    this._value = value;
  }

  get componentInstance () {
    return this.vnode.componentInstance;
  }

  static from (el, vnode) {
    if (!vnode.context.$_veeObserver) {
      return null;
    }

    return vnode.context.$_veeObserver.refs[el._vid];
  }

  validate (isInitial = false) {
    const options = resolveFeatures(this.binding, this.vnode);
    const alias = resolveAlias(this.el, this.vnode);
    const name = resolveName(this.el, this.vnode);
    this.opts.aria = options.aria;
    this.opts.validity = options.validity;

    return this.validator.verify(this.value, this.rules, {
      name: alias || name,
      bails: options.bails,
      values: this.createValuesLookup(),
      isInitial: isInitial
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
    const fields = this.ctx.$_veeObserver.refs;

    return this.fieldDeps().reduce((acc, depName) => {
      if (!fields[depName]) {
        return acc;
      }

      // register cross-field dependencies
      fields[depName].deps[this.vid] = this;
      acc[depName] = fields[depName].value;

      return acc;
    }, {});
  }

  onModelUpdated (model) {
    if (model.value === this.value) {
      return;
    }

    if (!this.initialized) {
      defineNonReactive(this, 'initialValue', model.value);
    }

    this.value = model.value;
    this.flags.changed = this.value === this.initialValue;
    const { on } = computeModeSetting(this);
    if (this.initialized && on.includes('input')) {
      this.validate();
    }
  }

  validateDeps () {
    values(this.deps).forEach(dep => {
      if (dep.flags.validated) {
        this.ctx.$nextTick(() => {
          dep.validate();
        });
      }
    });
  }

  applyResult ({ valid, errors }) {
    this.flags.valid = valid;
    this.flags.invalid = !valid;
    this.errors = errors;
    this.applyClasses();
    this.applyAriaAttrs();
    this.applyCustomValidity();
  }

  onUpdate (el, binding, vnode) {
    this.el = el;
    this.binding = binding;
    this.vnode = vnode;
    const model = findModel(vnode);
    const rules = resolveDirectiveRules(el, binding, vnode);
    let shouldValidate = !isEqual(rules, this.rules) && this.flags.validated;
    this.rules = rules;
    this.flags.required = !!this.rules.required;
    this.registerField(vnode);
    const options = resolveFeatures(el, binding, vnode);
    this.opts.classes = options.classes;
    this.opts.classNames = assign({}, DEFAULT_CLASSES, options.classNames);
    const inputEvt = getInputEventName(this.vnode, model);
    let events = this._determineEventList(inputEvt);
    if (includes(events, 'input') && model) {
      this.onModelUpdated(model);
      events = events.filter(evt => evt !== 'input');
    }

    this.addListeners(el, events);
    this.applyClasses();
    shouldValidate = shouldValidate || (binding.modifiers && binding.modifiers.immediate && !this.flags.validated);
    if (shouldValidate) {
      this.validate(!this.initialized);
    }

    this.addActionListeners();
    this.initialized = true;
  }

  registerField (vnode) {
    if (!vnode.context.$_veeObserver) {
      vnode.context.$_veeObserver = createObserver();
    }

    vnode.context.$_veeObserver.subscribe(this);
  }

  addListeners (el, events) {
    const handler = (e) => {
      const value = normalizeEventValue(e);
      this.value = value;
      this.flags.changed = this.value !== this.initialValue;
      this.validate();
    };

    events.forEach(evt => {
      if (this._listeners[evt]) {
        return;
      }

      if (this.componentInstance) {
        this.componentInstance.$on(evt, handler);
        this._listeners[evt] = () => this.componentInstance.$off(evt, handler);
        return;
      }

      this._listeners[evt] = addEventListener(el, evt, handler);
    });
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
    this.errors = [];
    this.initialValue = this.value;
    this.flags.changed = false;

    this.addActionListeners();
    this.applyClasses(true);
    this.applyAriaAttrs();
    this.applyCustomValidity();
  }

  /**
   * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
   */
  setFlags (flags) {
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
   * Updates the element classes depending on each field flag status.
   */
  applyClasses (isReset = false) {
    if (!this.opts.classes || this.isDisabled) return;

    const applyClasses = (el) => {
      toggleClass(el, this.opts.classNames.dirty, this.flags.dirty);
      toggleClass(el, this.opts.classNames.pristine, this.flags.pristine);
      toggleClass(el, this.opts.classNames.touched, this.flags.touched);
      toggleClass(el, this.opts.classNames.untouched, this.flags.untouched);

      // remove valid/invalid classes on reset.
      if (isReset) {
        toggleClass(el, this.opts.classNames.valid, false);
        toggleClass(el, this.opts.classNames.invalid, false);
      }

      // make sure we don't set any classes if the state is undetermined.
      if (!isNullOrUndefined(this.flags.valid) && this.flags.validated) {
        toggleClass(el, this.opts.classNames.valid, this.flags.valid);
      }

      if (!isNullOrUndefined(this.flags.invalid) && this.flags.validated) {
        toggleClass(el, this.opts.classNames.invalid, this.flags.invalid);
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
    if (!this.el) return;

    const onBlur = () => {
      this.flags.touched = true;
      this.flags.untouched = false;
      if (this.opts.classes) {
        toggleClass(this.el, this.opts.classNames.touched, true);
        toggleClass(this.el, this.opts.classNames.untouched, false);
      }
    };

    const inputEvent = isTextInput(this.el) ? 'input' : 'change';
    const onInput = () => {
      this.flags.dirty = true;
      this.flags.pristine = false;
      if (this.opts.classes) {
        toggleClass(this.el, this.opts.classNames.pristine, false);
        toggleClass(this.el, this.opts.classNames.dirty, true);
      }
    };

    if (this.componentInstance && isCallable(this.componentInstance.$once)) {
      this.componentInstance.$once('input', onInput);
      this.componentInstance.$once('blur', onBlur);
      return;
    }

    if (!this._interactions.input) {
      this._interactions.input = addEventListener(this.el, inputEvent, onInput);
    }

    if (!this._interactions.blur) {
      // Checkboxes and radio buttons on Mac don't emit blur naturally, so we listen on click instead.
      const blurEvent = isCheckboxOrRadioInput(this.el) ? 'change' : 'blur';
      this._interactions.blur = addEventListener(this.el, blurEvent, onBlur);
    }
  }

  /**
   * Determines the list of events to listen to.
   */
  _determineEventList (defaultInputEvent) {
    const { on } = computeModeSetting(this);

    return on.reduce((evts, evt) => {
      if (evt === 'input' && defaultInputEvent !== evt) {
        evts.push(defaultInputEvent);
        return evts;
      }

      evts.push(evt);

      return evts;
    }, []);
  }

  /**
   * Updates aria attributes on the element.
   */
  applyAriaAttrs () {
    if (!this.opts.aria || !this.el || !isCallable(this.el.setAttribute)) return;

    this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
    this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  }

  /**
   * Updates the custom validity for the field.
   */
  applyCustomValidity () {
    if (!this.opts.validity || !this.el || !isCallable(this.el.setCustomValidity)) return;

    this.el.setCustomValidity(this.errors[0] || '');
  }

  /**
   * Remove everything.
   */
  destroy () {
    const isPersisted = !!(this.binding.modifiers && this.binding.modifiers.persist);
    if (isPersisted) {
      this.persistFieldState();
    }

    // Remove All listeners.
    Object.keys(this._listeners).forEach(evt => this._listeners[evt]());

    // Remove cross-field references.
    const fields = this.ctx.$_veeObserver.refs;
    this.fieldDeps().forEach(depName => {
      delete fields[depName].deps[this.vid];
    });
    this.ctx.$_veeObserver.unsubscribe(this);
  }

  persistFieldState () {
    if (!this.ctx.$_veeObserver._persistStore) {
      this.ctx.$_veeObserver._persistStore = {};
    }

    this.ctx.$_veeObserver._persistStore[this.vid] = {
      errors: this.errors,
      flags: this.flags
    };
  }

  restoreFieldState () {
    if (!this.ctx.$_veeObserver._persistStore) return;

    const state = this.ctx.$_veeObserver._persistStore[this.vid];
    if (!state) {
      return;
    }

    this.applyResult({ valid: !!state.errors.length, errors: state.errors });
    this.flags = assign({}, this.flags, state.flags);
    delete this.ctx.$_veeObserver._persistStore[this.vid];
  }
}
