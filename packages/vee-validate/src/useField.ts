import {
  watch,
  isRef,
  computed,
  onMounted,
  unref,
  provide,
  getCurrentInstance,
  Ref,
  ComponentInternalInstance,
  onBeforeUnmount,
  nextTick,
  WatchStopHandle,
} from 'vue';
import { klona as deepCopy } from 'klona/full';
import { validate as validateValue } from './validate';
import {
  MaybeRef,
  GenericValidateFunction,
  TypedSchema,
  FieldContext,
  FieldState,
  PrivateFieldContext,
  SchemaValidationMode,
  ValidationOptions,
  FormContext,
  PrivateFormContext,
  YupSchema,
  MaybeRefOrLazy,
  InputType,
} from './types';
import {
  normalizeRules,
  extractLocators,
  normalizeEventValue,
  hasCheckedAttr,
  getFromPath,
  injectWithSelf,
  resolveNextCheckboxValue,
  isYupValidator,
  applyModelModifiers,
  withLatest,
  isEqual,
  isTypedSchema,
  lazyToRef,
  unravel,
} from './utils';
import { isCallable } from '../../shared';
import { FieldContextKey, FormContextKey, IS_ABSENT } from './symbols';
import { useFieldState } from './useFieldState';
import { refreshInspector, registerSingleFieldWithDevtools } from './devtools';

export interface FieldOptions<TValue = unknown> {
  initialValue?: MaybeRef<TValue>;
  validateOnValueUpdate: boolean;
  validateOnMount?: boolean;
  bails?: boolean;
  type?: InputType;
  valueProp?: MaybeRef<TValue>;
  checkedValue?: MaybeRef<TValue>;
  uncheckedValue?: MaybeRef<TValue>;
  label?: MaybeRef<string | undefined>;
  controlled?: boolean;
  standalone?: boolean;
  keepValueOnUnmount?: MaybeRef<boolean | undefined>;
  modelPropName?: string;
  syncVModel?: boolean;
  form?: FormContext;
}

export type RuleExpression<TValue> =
  | string
  | Record<string, unknown>
  | GenericValidateFunction<TValue>
  | GenericValidateFunction<TValue>[]
  | TypedSchema<TValue>
  | YupSchema<TValue>
  | undefined;

/**
 * Creates a field composite.
 */
export function useField<TValue = unknown>(
  path: MaybeRefOrLazy<string>,
  rules?: MaybeRef<RuleExpression<TValue>>,
  opts?: Partial<FieldOptions<TValue>>
): FieldContext<TValue> {
  if (hasCheckedAttr(opts?.type)) {
    return useFieldWithChecked(path, rules, opts);
  }

  return _useField(path, rules, opts);
}

function _useField<TValue = unknown>(
  path: MaybeRefOrLazy<string>,
  rules?: MaybeRef<RuleExpression<TValue>>,
  opts?: Partial<FieldOptions<TValue>>
): FieldContext<TValue> {
  const {
    initialValue: modelValue,
    validateOnMount,
    bails,
    type,
    checkedValue,
    label,
    validateOnValueUpdate,
    uncheckedValue,
    controlled,
    keepValueOnUnmount,
    modelPropName,
    syncVModel,
    form: controlForm,
  } = normalizeOptions(opts);

  const injectedForm = controlled ? injectWithSelf(FormContextKey) : undefined;
  const form = (controlForm as PrivateFormContext | undefined) || injectedForm;
  const name = lazyToRef(path);
  let PENDING_UNMOUNT = false;

  const validator = computed(() => {
    const schema = unref(form?.schema);
    if (schema) {
      return undefined;
    }

    const rulesValue = unref(rules);

    if (
      isYupValidator(rulesValue) ||
      isTypedSchema(rulesValue) ||
      isCallable(rulesValue) ||
      Array.isArray(rulesValue)
    ) {
      return rulesValue;
    }

    return normalizeRules(rulesValue);
  });

  const { id, value, initialValue, meta, setState, errors } = useFieldState(name, {
    modelValue,
    form,
    bails,
    label,
    type,
    validate: validator.value ? validate : undefined,
  });

  const errorMessage = computed(() => errors.value[0]);

  if (syncVModel) {
    useVModel({ value, prop: modelPropName, handleChange });
  }

  /**
   * Handles common onBlur meta update
   */
  const handleBlur = () => {
    meta.touched = true;
  };

  async function validateCurrentValue(mode: SchemaValidationMode) {
    if (form?.validateSchema) {
      return (await form.validateSchema(mode)).results[unref(name)] ?? { valid: true, errors: [] };
    }

    if (validator.value) {
      return validateValue(value.value, validator.value, {
        name: unref(name),
        label: unref(label),
        values: form?.values ?? {},
        bails,
      });
    }

    return { valid: true, errors: [] };
  }

  const validateWithStateMutation = withLatest(
    async () => {
      meta.pending = true;
      meta.validated = true;

      return validateCurrentValue('validated-only');
    },
    result => {
      if (PENDING_UNMOUNT) {
        return;
      }

      setState({ errors: result.errors });
      meta.pending = false;
      meta.valid = result.valid;

      return result;
    }
  );

  const validateValidStateOnly = withLatest(
    async () => {
      return validateCurrentValue('silent');
    },
    result => {
      meta.valid = result.valid;

      return result;
    }
  );

  function validate(opts?: Partial<ValidationOptions>) {
    if (opts?.mode === 'silent') {
      return validateValidStateOnly();
    }

    return validateWithStateMutation();
  }

  // Common input/change event handler
  function handleChange(e: unknown, shouldValidate = true) {
    const newValue = normalizeEventValue(e) as TValue;

    value.value = newValue;
    if (!validateOnValueUpdate && shouldValidate) {
      validateWithStateMutation();
    }
  }

  // Runs the initial validation
  onMounted(() => {
    if (validateOnMount) {
      return validateWithStateMutation();
    }

    // validate self initially if no form was handling this
    // forms should have their own initial silent validation run to make things more efficient
    if (!form || !form.validateSchema) {
      validateValidStateOnly();
    }
  });

  function setTouched(isTouched: boolean) {
    meta.touched = isTouched;
  }

  let unwatchValue: WatchStopHandle;
  let lastWatchedValue = deepCopy(value.value);
  function watchValue() {
    unwatchValue = watch(
      value,
      (val, oldVal) => {
        if (form?.isResetting.value) {
          return;
        }

        if (isEqual(val, oldVal) && isEqual(val, lastWatchedValue)) {
          return;
        }

        const validateFn = validateOnValueUpdate ? validateWithStateMutation : validateValidStateOnly;
        validateFn();
        lastWatchedValue = deepCopy(val);
      },
      {
        deep: true,
      }
    );
  }

  watchValue();

  function resetField(state?: Partial<FieldState<TValue>>) {
    unwatchValue?.();

    const newValue = state && 'value' in state ? (state.value as TValue) : initialValue.value;

    setState({
      value: deepCopy(newValue),
      initialValue: deepCopy(newValue),
      touched: state?.touched ?? false,
      errors: state?.errors || [],
    });

    meta.pending = false;
    meta.validated = false;
    validateValidStateOnly();

    // need to watch at next tick to avoid triggering the value watcher
    nextTick(() => {
      watchValue();
    });
  }

  function setValue(newValue: TValue) {
    value.value = newValue;
  }

  function setErrors(errors: string[] | string) {
    setState({ errors: Array.isArray(errors) ? errors : [errors] });
  }

  const field: PrivateFieldContext<TValue> = {
    id,
    name,
    label,
    value,
    meta,
    errors,
    errorMessage,
    type,
    checkedValue,
    uncheckedValue,
    bails,
    keepValueOnUnmount,
    resetField,
    handleReset: () => resetField(),
    validate,
    handleChange,
    handleBlur,
    setState,
    setTouched,
    setErrors,
    setValue,
  };

  provide(FieldContextKey, field);

  if (isRef(rules) && typeof unref(rules) !== 'function') {
    watch(
      rules,
      (value, oldValue) => {
        if (isEqual(value, oldValue)) {
          return;
        }

        meta.validated ? validateWithStateMutation() : validateValidStateOnly();
      },
      {
        deep: true,
      }
    );
  }

  if (__DEV__) {
    (field as any)._vm = getCurrentInstance();
    watch(() => ({ errors: errors.value, ...meta, value: value.value }), refreshInspector, {
      deep: true,
    });

    if (!form) {
      registerSingleFieldWithDevtools(field);
    }
  }

  // if no associated form return the field API immediately
  if (!form) {
    return field;
  }

  // associate the field with the given form

  // extract cross-field dependencies in a computed prop
  const dependencies = computed(() => {
    const rulesVal = validator.value;
    // is falsy, a function schema or a yup schema
    if (
      !rulesVal ||
      isCallable(rulesVal) ||
      isYupValidator(rulesVal) ||
      isTypedSchema(rulesVal) ||
      Array.isArray(rulesVal)
    ) {
      return {};
    }

    return Object.keys(rulesVal).reduce((acc, rule: string) => {
      const deps = extractLocators(rulesVal[rule])
        .map((dep: any) => dep.__locatorRef)
        .reduce((depAcc, depName) => {
          const depValue = getFromPath(form.values, depName) || form.values[depName];

          if (depValue !== undefined) {
            depAcc[depName] = depValue;
          }

          return depAcc;
        }, {} as Record<string, unknown>);

      Object.assign(acc, deps);

      return acc;
    }, {} as Record<string, unknown>);
  });

  // Adds a watcher that runs the validation whenever field dependencies change
  watch(dependencies, (deps, oldDeps) => {
    // Skip if no dependencies or if the field wasn't manipulated
    if (!Object.keys(deps).length) {
      return;
    }

    const shouldValidate = !isEqual(deps, oldDeps);
    if (shouldValidate) {
      meta.validated ? validateWithStateMutation() : validateValidStateOnly();
    }
  });

  onBeforeUnmount(() => {
    PENDING_UNMOUNT = true;
    const shouldKeepValue = unref(field.keepValueOnUnmount) ?? unref(form.keepValuesOnUnmount);
    if (shouldKeepValue || !form) {
      return;
    }

    const path = unravel(name);
    const pathState = form.getPathState(path);
    const matchesId =
      Array.isArray(pathState?.id) && pathState?.multiple
        ? pathState?.id.includes(field.id)
        : pathState?.id === field.id;
    if (!matchesId) {
      return;
    }

    if (pathState?.multiple && Array.isArray(pathState.value)) {
      const valueIdx = pathState.value.findIndex(i => isEqual(i, unref(field.checkedValue)));
      if (valueIdx > -1) {
        const newVal = [...pathState.value];
        newVal.splice(valueIdx, 1);
        form.setFieldValue(path, newVal);
      }

      if (Array.isArray(pathState.id)) {
        pathState.id.splice(pathState.id.indexOf(field.id), 1);
      }
    } else {
      form.unsetPathValue(path);
    }

    form.removePathState(path);
  });

  return field;
}

/**
 * Normalizes partial field options to include the full options
 */
function normalizeOptions<TValue>(opts: Partial<FieldOptions<TValue>> | undefined): FieldOptions<TValue> {
  const defaults = (): Partial<FieldOptions<TValue>> => ({
    initialValue: undefined,
    validateOnMount: false,
    bails: true,
    label: undefined,
    validateOnValueUpdate: true,
    keepValueOnUnmount: undefined,
    modelPropName: 'modelValue',
    syncVModel: true,
    controlled: true,
  });

  const isVModelSynced = opts?.syncVModel ?? true;
  const initialValue =
    isVModelSynced && !('initialValue' in (opts || {}))
      ? getCurrentModelValue(getCurrentInstance(), opts?.modelPropName || 'modelValue')
      : opts?.initialValue;

  if (!opts) {
    return { ...defaults(), initialValue } as FieldOptions<TValue>;
  }

  // TODO: Deprecate this in next major release
  const checkedValue = 'valueProp' in opts ? opts.valueProp : opts.checkedValue;
  const controlled = 'standalone' in opts ? !opts.standalone : opts.controlled;

  return {
    ...defaults(),
    ...(opts || {}),
    initialValue,
    controlled: controlled ?? true,
    checkedValue,
  } as FieldOptions<TValue>;
}

function useFieldWithChecked<TValue = unknown>(
  name: MaybeRefOrLazy<string>,
  rules?: MaybeRef<RuleExpression<TValue>>,
  opts?: Partial<FieldOptions<TValue>>
): FieldContext<TValue> {
  const form = !opts?.standalone ? injectWithSelf(FormContextKey) : undefined;
  const checkedValue = opts?.checkedValue;
  const uncheckedValue = opts?.uncheckedValue;

  function patchCheckedApi(
    field: FieldContext<TValue> & { originalHandleChange?: FieldContext['handleChange'] }
  ): FieldContext<TValue> {
    const handleChange = field.handleChange;

    const checked = computed(() => {
      const currentValue = unref(field.value);
      const checkedVal = unref(checkedValue);

      return Array.isArray(currentValue)
        ? currentValue.findIndex(v => isEqual(v, checkedVal)) >= 0
        : isEqual(checkedVal, currentValue);
    });

    function handleCheckboxChange(e: unknown, shouldValidate = true) {
      if (checked.value === ((e as Event)?.target as HTMLInputElement)?.checked) {
        if (shouldValidate) {
          field.validate();
        }
        return;
      }

      const path = unravel(name);
      const pathState = form?.getPathState(path);
      const value = normalizeEventValue(e);
      let newValue!: TValue;
      if (form && pathState?.multiple && pathState.type === 'checkbox') {
        newValue = resolveNextCheckboxValue(getFromPath(form.values, path) || [], value, undefined) as TValue;
      } else {
        // Single checkbox field without a form to toggle it's value
        newValue = resolveNextCheckboxValue(unref(field.value), unref(checkedValue), unref(uncheckedValue)) as TValue;
      }

      handleChange(newValue, shouldValidate);
    }

    return {
      ...field,
      checked,
      checkedValue,
      uncheckedValue,
      handleChange: handleCheckboxChange,
    };
  }

  return patchCheckedApi(_useField<TValue>(name, rules, opts));
}

interface ModelOpts<TValue> {
  prop?: string;
  value: Ref<TValue>;
  handleChange: FieldContext['handleChange'];
}

function useVModel<TValue = unknown>({ prop, value, handleChange }: ModelOpts<TValue>) {
  const vm = getCurrentInstance();
  /* istanbul ignore next */
  if (!vm) {
    if (__DEV__) {
      console.warn('Failed to setup model events because `useField` was not called in setup.');
    }
    return;
  }

  const propName = prop || 'modelValue';
  const emitName = `update:${propName}`;

  // Component doesn't have a model prop setup (must be defined on the props)
  if (!(propName in vm.props)) {
    return;
  }

  watch(value, newValue => {
    if (isEqual(newValue, getCurrentModelValue(vm, propName))) {
      return;
    }

    vm.emit(emitName, newValue);
  });

  watch(
    () => getCurrentModelValue<TValue>(vm, propName),
    propValue => {
      if ((propValue as any) === IS_ABSENT && value.value === undefined) {
        return;
      }

      const newValue = (propValue as any) === IS_ABSENT ? undefined : propValue;
      if (isEqual(newValue, applyModelModifiers(value.value, vm.props.modelModifiers))) {
        return;
      }

      handleChange(newValue);
    }
  );
}

function getCurrentModelValue<TValue = unknown>(vm: ComponentInternalInstance | null, propName: string) {
  if (!vm) {
    return undefined;
  }

  return vm.props[propName] as TValue;
}
