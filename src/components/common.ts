import { VNodeDirective } from 'vue';
import { isCallable, debounce } from '../utils';
import { modes } from '../modes';
import { ValidationResult, ValidationFlags } from '../types';
import { ValidationClassMap } from '../config';

/**
 * Determines if a provider needs to run validation.
 */
function shouldValidate(ctx: any, model: VNodeDirective) {
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

export interface ValidationContext {
  errors: string[];
  flags: ValidationFlags;
  classes: ValidationClassMap;
  valid: boolean;
  failedRules: { [k: string]: string };
  reset: () => void;
  validate: (evtOrNewValue: Event | any) => Promise<ValidationResult>;
  aria: {
    'aria-invalid': 'true' | 'false';
    'aria-required': 'true' | 'false';
  };
}

export function createValidationCtx(ctx: any): ValidationContext {
  return {
    errors: ctx.messages,
    flags: ctx.flags,
    classes: ctx.classes,
    valid: ctx.isValid,
    failedRules: ctx.failedRules,
    reset: () => ctx.reset(),
    validate: (...args: any[]) => ctx.validate(...args),
    aria: {
      'aria-invalid': ctx.flags.invalid ? 'true' : 'false',
      'aria-required': ctx.isRequired ? 'true' : 'false'
    }
  };
}

export function onRenderUpdate(vm: any, model: VNodeDirective) {
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

  vm.validateSilent().then(vm.immediate || vm.flags.validated ? vm.applyResult : (x: any) => x);
}

export function computeModeSetting(ctx: any) {
  const compute = isCallable(ctx.mode) ? ctx.mode : modes[ctx.mode];

  return compute({
    errors: ctx.messages,
    value: ctx.value,
    flags: ctx.flags
  });
}

// Creates the common handlers for a validatable context.
export function createCommonHandlers(vm: any) {
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
        // tslint:disable-next-line
        pendingPromise.then(result => {
          if (pendingPromise === vm._pendingValidation) {
            vm.applyResult(result);
            vm._pendingValidation = null;
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
