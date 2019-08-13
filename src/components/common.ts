import { VNodeDirective, VNode } from 'vue';
import { isCallable, debounce, identity } from '../utils';
import { modes, InteractionModeFactory } from '../modes';
import { ValidationResult, ValidationFlags, KnownKeys } from '../types';
import { findModel, getInputEventName, addVNodeListener } from '../utils/vnode';
import { ProviderInstance } from './Provider';

/**
 * Determines if a provider needs to run validation.
 */
function shouldValidate(ctx: ProviderInstance, model: VNodeDirective) {
  // when an immediate/initial validation is needed and wasn't done before.
  if (!ctx._ignoreImmediate && ctx.immediate) {
    return true;
  }

  // when the value changes for whatever reason.
  if (ctx.value !== model.value) {
    return true;
  }

  // when it needs validation due to props/cross-fields changes.
  if (ctx._needsValidation) {
    return true;
  }

  // when the initial value is undefined and the field wasn't rendered yet.
  if (!ctx.initialized && model.value === undefined) {
    return true;
  }

  return false;
}

export interface ValidationContext extends Pick<ValidationFlags, KnownKeys<ValidationFlags>> {
  errors: string[];
  classes: { [k: string]: boolean };
  valid: boolean;
  failedRules: { [k: string]: string };
  reset: () => void;
  validate: (evtOrNewValue: Event | any) => Promise<ValidationResult>;
  ariaInput: {
    'aria-invalid': 'true' | 'false';
    'aria-required': 'true' | 'false';
    'aria-errormessage': string;
  };
  ariaMsg: {
    id: string;
    'aria-live': 'off' | 'assertive';
  };
}

export function createValidationCtx(ctx: ProviderInstance): ValidationContext {
  return {
    ...ctx.flags,
    errors: ctx.messages,
    classes: ctx.classes,
    failedRules: ctx.failedRules,
    reset: () => ctx.reset(),
    validate: (...args: any[]) => ctx.validate(...args),
    ariaInput: {
      'aria-invalid': ctx.flags.invalid ? 'true' : 'false',
      'aria-required': ctx.isRequired ? 'true' : 'false',
      'aria-errormessage': `vee_${ctx.id}`
    },
    ariaMsg: {
      id: `vee_${ctx.id}`,
      'aria-live': ctx.messages.length ? 'assertive' : 'off'
    }
  };
}

export function onRenderUpdate(vm: ProviderInstance, model: VNodeDirective | undefined) {
  if (!model) {
    return;
  }

  if (!vm.initialized) {
    vm.initialValue = model.value;
  }

  const validateNow = shouldValidate(vm, model);
  vm._needsValidation = false;
  vm.value = model.value;
  vm._ignoreImmediate = true;

  if (!validateNow) {
    return;
  }

  vm.validateSilent().then(vm.immediate || vm.flags.validated ? vm.applyResult : identity);
}

export function computeModeSetting(ctx: ProviderInstance) {
  const compute = (isCallable(ctx.mode) ? ctx.mode : modes[ctx.mode]) as InteractionModeFactory;

  return compute({
    errors: ctx.messages,
    value: ctx.value,
    flags: ctx.flags
  });
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers(vm: ProviderInstance) {
  const onInput = (e: any) => {
    vm.syncValue(e); // track and keep the value updated.
    vm.setFlags({ dirty: true, pristine: false });
  };

  // Blur event listener.
  const onBlur = () => {
    vm.setFlags({ touched: true, untouched: false });
  };

  let onValidate = vm.$veeHandler;
  const mode = computeModeSetting(vm);

  // Handle debounce changes.
  if (!onValidate || vm.$veeDebounce !== vm.debounce) {
    onValidate = debounce(() => {
      vm.$nextTick(() => {
        const pendingPromise: Promise<ValidationResult> = vm.validateSilent();
        // avoids race conditions between successive validations.
        vm._pendingValidation = pendingPromise;
        pendingPromise.then(result => {
          if (pendingPromise === vm._pendingValidation) {
            vm.applyResult(result);
            vm._pendingValidation = undefined;
          }
        });
      });
    }, mode.debounce || vm.debounce);

    // Cache the handler so we don't create it each time.
    vm.$veeHandler = onValidate;
    // cache the debounce value so we detect if it was changed.
    vm.$veeDebounce = vm.debounce;
  }

  return { onInput, onBlur, onValidate };
}

// Adds all plugin listeners to the vnode.
export function addListeners(vm: ProviderInstance, node: VNode) {
  const model = findModel(node);
  // cache the input eventName.
  vm._inputEventName = vm._inputEventName || getInputEventName(node, model);

  onRenderUpdate(vm, model);

  const { onInput, onBlur, onValidate } = createCommonHandlers(vm);
  addVNodeListener(node, vm._inputEventName, onInput);
  addVNodeListener(node, 'blur', onBlur);

  // add the validation listeners.
  vm.normalizedEvents.forEach((evt: string) => {
    addVNodeListener(node, evt, onValidate);
  });

  vm.initialized = true;
}
