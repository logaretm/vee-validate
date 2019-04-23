import { DirectiveBinding } from 'vue/types/options';
import { VNode, VNodeDirective } from 'vue';
import { resolveDirectiveRules, resolveName, resolveFeatures, resolveAlias, resolveValue } from './resolvers';
import { _Vue } from '../plugin';
import { modes } from '../modes';
import RuleContainer from './ruleContainer';
import { addEventListener, normalizeEventValue } from '../utils/events';
import { findModel, getInputEventName, isTextInput, isCheckboxOrRadioInput } from '../utils/vnode';
import { getValidator } from '../state';
import {
  uniqId,
  createFlags,
  normalizeRules,
  isCallable,
  isEqual,
  values,
  defineNonReactive,
  includes,
  computeClassObj
} from '../utils';
import { getConfig } from '../config';
import { createObserver } from '../mapValidationState';
import Validator from './validator';
import { ValidationResult, ValidationFlags } from '../types';

const DEFAULT_CLASSES = {
  touched: 'touched', // the control has been blurred
  untouched: 'untouched', // the control hasn't been blurred
  valid: 'valid', // model is valid
  invalid: 'invalid', // model is invalid
  pristine: 'pristine', // control has not been interacted with
  dirty: 'dirty' // control has been interacted with
};

function computeModeSetting(ctx: Field) {
  let compute;
  if (typeof ctx.mode === 'string') {
    compute = modes[ctx.mode];
  } else {
    compute = ctx.mode;
  }

  return compute({
    errors: ctx.errors,
    value: ctx.value,
    flags: ctx.flags
  });
}
export default class Field {
  el!: HTMLElement;
  vid!: string;
  deps!: { [k: string]: Field };
  flags: ValidationFlags;
  errors: string[];
  classes: { [k: string]: boolean };
  name: string;
  vnode!: VNode;
  binding!: DirectiveBinding;
  initialized!: boolean;
  opts: any;
  validator!: Validator;
  rules: any;
  isRequired!: boolean;
  ctx: any;
  initialValue: any;
  isDisabled: any;
  private _value: any;
  private _listeners: any;
  private _waitingFor: any;
  private _cancellationToken: any;
  private _interactions: any;
  private _flagsCache?: ValidationFlags;

  constructor(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    defineNonReactive(this, 'el', el);
    defineNonReactive(this, 'vid', (vnode.data && vnode.data.ref) || uniqId());
    defineNonReactive(this, 'deps', {});
    defineNonReactive(this, 'validator', getValidator());
    defineNonReactive(this, 'ctx', vnode.context);
    defineNonReactive(this, 'opts', {});
    defineNonReactive(this, 'binding', binding);
    defineNonReactive(this, 'vnode', vnode);
    defineNonReactive(this, 'initialized', false);
    defineNonReactive(this, '_listeners', {});
    defineNonReactive(this, '_interactions', {});
    defineNonReactive(this, '_value', resolveValue(el, vnode));
    defineNonReactive(this, 'rules', resolveDirectiveRules(el, binding, vnode));

    (this.el as any)._vid = this.vid;
    this.flags = _Vue.observable(createFlags());
    this.errors = _Vue.observable([]);
    this.classes = _Vue.observable(computeClassObj(getConfig().classNames, this.flags));
    this.name = resolveName(el, vnode);
    if (binding.modifiers.persist) {
      this.restoreFieldState();
    }
  }

  get value() {
    return this._value;
  }

  get mode() {
    return getConfig().mode;
  }

  set value(value) {
    if (!isEqual(value, this._value)) {
      this.validateDeps();
    }

    this._value = value;
  }

  get componentInstance() {
    return this.vnode.componentInstance;
  }

  static from(el: any, vnode: any): Field | undefined {
    if (!vnode.context.$_veeObserver) {
      return undefined;
    }

    return vnode.context.$_veeObserver.state.refs[el._vid];
  }

  validate() {
    const options = resolveFeatures(this.binding, this.vnode);
    const alias = resolveAlias(this.el, this.vnode);
    const name = resolveName(this.el, this.vnode);
    this.opts.aria = options.aria;
    this.opts.validity = options.validity;

    const validation = this.validator
      .validate(this.value, this.rules, {
        name: alias || name,
        bails: options.bails,
        values: this.createValuesLookup(),
        isInitial: !this.initialized
      })
      .then(res => {
        // prevent race conditions from overriding each other.
        // fixed by waiting for the most recent validation triggered.
        // if its not waiting for anything then we can also mutate the state.
        if (!this.isWaitingFor(undefined) && !this.isWaitingFor(validation)) return res;
        this.waitFor(undefined);

        this.flags.validated = true;
        this.applyResult(res);

        return res;
      });

    this.waitFor(validation);

    return validation;
  }

  fieldDeps() {
    const rules: any = normalizeRules(this.rules);
    this.isRequired = !!rules.required;

    return Object.keys(rules)
      .filter(RuleContainer.isTargetRule)
      .map(rule => {
        return rules[rule][0];
      });
  }

  createValuesLookup() {
    const fields = this.ctx.$_veeObserver.state.refs;

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

  onModelUpdated(model: VNodeDirective) {
    if (model.value === this.value) {
      return;
    }

    if (!this.initialized) {
      defineNonReactive(this, 'initialValue', model.value);
    }

    this.value = model.value;
    this.flags.changed = this.value === this.initialValue;
    const { on } = computeModeSetting(this);
    if (this.initialized && on && on.includes('input')) {
      // tslint:disable-next-line
      this.validate();
    }
  }

  validateDeps() {
    values(this.deps).forEach(dep => {
      if (dep.flags.validated) {
        this.ctx.$nextTick(() => {
          // tslint:disable-next-line
          dep.validate();
        });
      }
    });
  }

  applyResult({ valid, errors }: { valid: boolean; errors: string[] }) {
    this.flags.valid = valid;
    this.flags.invalid = !valid;
    this.errors = errors;
    this.computeClasses();
    this.applyAriaAttrs();
    this.applyCustomValidity();
  }

  async onUpdate(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    this.el = el;
    this.binding = binding;
    this.vnode = vnode;
    const model = findModel(vnode);
    const rules = resolveDirectiveRules(el, binding, vnode);
    let shouldValidate = !isEqual(rules, this.rules) && this.flags.validated;
    this.rules = rules;
    this.flags.required = !!this.rules.required;
    this.registerField(vnode);
    const options = resolveFeatures(binding, vnode);
    this.opts.classes = options.classes;
    this.opts.classNames = { ...DEFAULT_CLASSES, ...options.classNames };
    const inputEvt = getInputEventName(this.vnode, model);
    let events = this._determineEventList(inputEvt);
    if (includes(events, 'input') && model) {
      this.onModelUpdated(model);
      events = events.filter(evt => evt !== 'input');
    }

    this.addListeners(el, events);
    this.computeClasses();
    shouldValidate = shouldValidate || (binding.modifiers && binding.modifiers.immediate && !this.flags.validated);
    if (shouldValidate) {
      // tslint:disable-next-line
      await this.validate();
    }

    this.addActionListeners();
    this.initialized = true;
  }

  registerField(vnode: any) {
    if (!vnode.context.$_veeObserver) {
      vnode.context.$_veeObserver = createObserver();
    }

    vnode.context.$_veeObserver.subscribe(this);
  }

  addListeners(el: HTMLElement, events: string[]) {
    const handler = (e: unknown) => {
      const value = normalizeEventValue(e);
      this.value = value;
      this.flags.changed = this.value !== this.initialValue;

      return this.validate();
    };

    events.forEach(evt => {
      if (this._listeners[evt]) {
        return;
      }

      if (this.componentInstance) {
        this.componentInstance.$on(evt, handler);
        this._listeners[evt] = () => this.componentInstance && this.componentInstance.$off(evt, handler);
        return;
      }

      this._listeners[evt] = addEventListener(el, evt, handler);
    });
  }

  /**
   * Keeps a reference of the most current validation run.
   */
  waitFor(pendingPromise: Promise<ValidationResult> | undefined) {
    this._waitingFor = pendingPromise;
  }

  isWaitingFor(promise: Promise<ValidationResult> | undefined) {
    return this._waitingFor === promise;
  }

  /**
   * Resets field flags and errors.
   */
  reset() {
    if (this._cancellationToken) {
      this._cancellationToken.cancelled = true;
      delete this._cancellationToken;
    }

    const defaults = createFlags();
    Object.keys(this.flags)
      .filter(flag => flag !== 'required')
      .forEach(flag => {
        this.flags[flag] = defaults[flag];
      });

    // update initial value
    this.errors = [];
    this.initialValue = this.value;
    this.flags.changed = false;

    this.addActionListeners();
    this.computeClasses(true);
    this.applyAriaAttrs();
    this.applyCustomValidity();
  }

  /**
   * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
   */
  setFlags(flags: Partial<ValidationFlags>) {
    const negated: { [x: string]: string | undefined } = {
      pristine: 'dirty',
      dirty: 'pristine',
      valid: 'invalid',
      invalid: 'valid',
      touched: 'untouched',
      untouched: 'touched'
    };

    Object.keys(flags).forEach(flag => {
      this.flags[flag] = flags[flag];

      let negatedName = negated[flag];
      if (!negatedName) return;

      this.flags[negatedName] = !flags[flag];
    });

    if (
      flags.untouched !== undefined ||
      flags.touched !== undefined ||
      flags.dirty !== undefined ||
      flags.pristine !== undefined
    ) {
      this.addActionListeners();
    }
    this.computeClasses();
    this.applyAriaAttrs();
    this.applyCustomValidity();
  }

  /**
   * Updates the element classes depending on each field flag status.
   */
  computeClasses(isReset = false) {
    if (!this.opts.classes || this.isDisabled || isEqual(this._flagsCache, this.flags)) return;

    if (isReset) {
      this.flags.valid = false;
      this.flags.invalid = false;
    }

    this.classes = computeClassObj(this.opts.classNames, this.flags);
    this._flagsCache = { ...this.flags };
  }

  /**
   * Adds the listeners required for automatic classes and some flags.
   */
  addActionListeners() {
    // remove previous listeners.
    if (!this.el) return;

    const onBlur = () => {
      this.flags.touched = true;
      this.flags.untouched = false;
      if (this.opts.classes) {
        this.computeClasses();
      }
    };

    const inputEvent = isTextInput(this.vnode) ? 'input' : 'change';
    const onInput = () => {
      this.flags.dirty = true;
      this.flags.pristine = false;
      if (this.opts.classes) {
        this.computeClasses();
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
      const blurEvent = isCheckboxOrRadioInput(this.vnode) ? 'change' : 'blur';
      this._interactions.blur = addEventListener(this.el, blurEvent, onBlur);
    }
  }

  /**
   * Determines the list of events to listen to.
   */
  private _determineEventList(defaultInputEvent: string) {
    const { on } = computeModeSetting(this);
    if (!on) {
      return [];
    }

    return on.reduce((evts: string[], evt) => {
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
  applyAriaAttrs() {
    if (!this.opts.aria || !this.el || !isCallable(this.el.setAttribute)) return;

    this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
    this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  }

  /**
   * Updates the custom validity for the field.
   */
  applyCustomValidity() {
    const input = this.el as HTMLInputElement;
    if (!this.opts.validity || !input || !isCallable(input.setCustomValidity)) return;

    input.setCustomValidity(this.errors[0] || '');
  }

  /**
   * Remove everything.
   */
  destroy() {
    const isPersisted = !!(this.binding.modifiers && this.binding.modifiers.persist);
    if (isPersisted) {
      this.persistFieldState();
    }

    // Remove All listeners.
    Object.keys(this._listeners).forEach(evt => this._listeners[evt]());

    // Remove cross-field references.
    const fields = this.ctx.$_veeObserver.state.refs;
    this.fieldDeps().forEach(depName => {
      delete fields[depName].deps[this.vid];
    });
    this.ctx.$_veeObserver.unsubscribe(this);
  }

  persistFieldState() {
    if (!this.ctx.$_veeObserver._persistStore) {
      this.ctx.$_veeObserver._persistStore = {};
    }

    this.ctx.$_veeObserver._persistStore[this.vid] = {
      errors: this.errors,
      flags: this.flags
    };
  }

  restoreFieldState() {
    if (!this.ctx.$_veeObserver._persistStore) return;

    const state = this.ctx.$_veeObserver._persistStore[this.vid];
    if (!state) {
      return;
    }

    this.applyResult({ valid: !!state.errors.length, errors: state.errors });
    this.flags = { ...this.flags, ...state.flags };
    delete this.ctx.$_veeObserver._persistStore[this.vid];
  }
}
