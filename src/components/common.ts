import { VNode } from 'vue';
import { isCallable, debounce, isRefEqual } from '../utils';
import { modes, InteractionModeFactory } from '../modes';
import { ValidationResult, ValidationFlags, KnownKeys, ProviderInstance } from '../types';
import { findModel, getInputEventName, addVNodeListener, findValue } from '../utils/vnode';

/**
 * Determines if a provider needs to run validation.
 */
function shouldValidate(ctx: ProviderInstance, value: string) {
  // when an immediate/initial validation is needed and wasn't done before.
  if (!ctx._ignoreImmediate && ctx.immediate) {
    return true;
  }

  // when the value changes for whatever reason.
  if (!isRefEqual(ctx.value, value) && ctx.normalizedEvents.length) {
    return true;
  }

  // when it needs validation due to props/cross-fields changes.
  if (ctx._needsValidation) {
    return true;
  }

  // when the initial value is undefined and the field wasn't rendered yet.
  if (!ctx.initialized && value === undefined) {
    return true;
  }

  return false;
}

export interface ValidationContext extends Pick<ValidationFlags, KnownKeys<ValidationFlags>> {
  errors: string[];
  classes: Record<string, boolean>;
  valid: boolean;
  failedRules: Record<string, string>;
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
    errors: ctx.errors,
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
      'aria-live': ctx.errors.length ? 'assertive' : 'off'
    }
  };
}

export function onRenderUpdate(vm: ProviderInstance, value: any | undefined) {
  if (!vm.initialized) {
    vm.initialValue = value;
  }

  const validateNow = shouldValidate(vm, value);
  vm._needsValidation = false;
  vm.value = value;
  vm._ignoreImmediate = true;

  if (!validateNow) {
    return;
  }

  const validate = () => {
    if (vm.immediate || vm.flags.validated) {
      return triggerThreadSafeValidation(vm);
    }

    vm.validateSilent();
  };

  if (vm.initialized) {
    validate();
    return;
  }

  vm.$once('hook:mounted', () => validate());
}

export function computeModeSetting(ctx: ProviderInstance) {
  const compute = (isCallable(ctx.mode) ? ctx.mode : modes[ctx.mode]) as InteractionModeFactory;

  return compute(ctx);
}

export function triggerThreadSafeValidation(vm: ProviderInstance) {
  const pendingPromise: Promise<ValidationResult> = vm.validateSilent();
  // avoids race conditions between successive validations.
  vm._pendingValidation = pendingPromise;
  return pendingPromise.then(result => {
    if (pendingPromise === vm._pendingValidation) {
      vm.applyResult(result);
      vm._pendingValidation = undefined;
    }

    return result;
  });
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers(vm: ProviderInstance) {
  if (!vm.$veeOnInput) {
    vm.$veeOnInput = (e: any) => {
      vm.syncValue(e); // track and keep the value updated.
      vm.setFlags({ dirty: true, pristine: false });
    };
  }

  const onInput = vm.$veeOnInput;

  if (!vm.$veeOnBlur) {
    vm.$veeOnBlur = () => {
      vm.setFlags({ touched: true, untouched: false });
    };
  }

  // Blur event listener.
  const onBlur = vm.$veeOnBlur;

  let onValidate = vm.$veeHandler;
  const mode = computeModeSetting(vm);

  // Handle debounce changes.
  if (!onValidate || vm.$veeDebounce !== vm.debounce) {
    onValidate = debounce(() => {
      vm.$nextTick(() => {
        if (!vm._pendingReset) {
          triggerThreadSafeValidation(vm);
        }

        vm._pendingReset = false;
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
  const value = findValue(node);
  // cache the input eventName.
  vm._inputEventName = vm._inputEventName || getInputEventName(node, findModel(node));
  onRenderUpdate(vm, value?.value);

  const { onInput, onBlur, onValidate } = createCommonHandlers(vm);
  addVNodeListener(node, vm._inputEventName, onInput);
  addVNodeListener(node, 'blur', onBlur);

  // add the validation listeners.
  vm.normalizedEvents.forEach((evt: string) => {
    addVNodeListener(node, evt, onValidate);
  });

  vm.initialized = true;
}
