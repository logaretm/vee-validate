import {
  watch,
  isRef,
  computed,
  onMounted,
  onBeforeUnmount,
  unref,
  WatchStopHandle,
  provide,
  nextTick,
  getCurrentInstance,
  Ref,
  ComponentInternalInstance,
} from 'vue';
import { klona as deepCopy } from 'klona/full';
import isEqual from 'fast-deep-equal/es6';
import { validate as validateValue } from './validate';
import {
  ValidationResult,
  MaybeRef,
  GenericValidateFunction,
  YupValidator,
  FieldContext,
  FieldState,
  PrivateFieldContext,
  SchemaValidationMode,
  ValidationOptions,
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
  type?: string;
  valueProp?: MaybeRef<TValue>;
  checkedValue?: MaybeRef<TValue>;
  uncheckedValue?: MaybeRef<TValue>;
  label?: MaybeRef<string | undefined>;
  standalone?: boolean;
  keepValueOnUnmount?: MaybeRef<boolean | undefined>;
  modelPropName?: string;
  syncVModel?: boolean;
}

export type RuleExpression<TValue> =
  | string
  | Record<string, unknown>
  | GenericValidateFunction<TValue>
  | GenericValidateFunction<TValue>[]
  | YupValidator<TValue>
  | undefined;

/**
 * Creates a field composite.
 */
export function useField<TValue = unknown>(
  name: MaybeRef<string>,
  rules?: MaybeRef<RuleExpression<TValue>>,
  opts?: Partial<FieldOptions<TValue>>
): FieldContext<TValue> {
  if (hasCheckedAttr(opts?.type)) {
    return useCheckboxField(name, rules, opts);
  }

  return _useField(name, rules, opts);
}

function _useField<TValue = unknown>(
  name: MaybeRef<string>,
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
    standalone,
    keepValueOnUnmount,
    modelPropName,
    syncVModel,
  } = normalizeOptions(unref(name), opts);

  const form = !standalone ? injectWithSelf(FormContextKey) : undefined;

  // a flag indicating if the field is about to be removed/unmounted.
  let markedForRemoval = false;
  const { id, value, initialValue, meta, setState, errors, errorMessage } = useFieldState(name, {
    modelValue,
    standalone,
  });

  if (syncVModel) {
    useVModel({ value, prop: modelPropName, handleChange });
  }

  /**
   * Handles common onBlur meta update
   */
  const handleBlur = () => {
    meta.touched = true;
  };

  const normalizedRules = computed(() => {
    let rulesValue = unref(rules);
    const schema = unref(form?.schema);
    if (schema && !isYupValidator(schema)) {
      rulesValue = extractRuleFromSchema<TValue>(schema, unref(name)) || rulesValue;
    }

    if (isYupValidator(rulesValue) || isCallable(rulesValue) || Array.isArray(rulesValue)) {
      return rulesValue;
    }

    return normalizeRules(rulesValue);
  });

  async function validateCurrentValue(mode: SchemaValidationMode) {
    if (form?.validateSchema) {
      return (await form.validateSchema(mode)).results[unref(name)] ?? { valid: true, errors: [] };
    }

    return validateValue(value.value, normalizedRules.value, {
      name: unref(label) || unref(name),
      values: form?.values ?? {},
      bails,
    });
  }

  const validateWithStateMutation = withLatest(
    async () => {
      meta.pending = true;
      meta.validated = true;

      return validateCurrentValue('validated-only');
    },
    result => {
      if (markedForRemoval) {
        result.valid = true;
        result.errors = [];
      }

      setState({ errors: result.errors });
      meta.pending = false;

      return result;
    }
  );

  const validateValidStateOnly = withLatest(
    async () => {
      return validateCurrentValue('silent');
    },
    result => {
      if (markedForRemoval) {
        result.valid = true;
      }

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
  function watchValue() {
    unwatchValue = watch(
      value,
      (val, oldVal) => {
        if (isEqual(val, oldVal)) {
          return;
        }

        const validateFn = validateOnValueUpdate ? validateWithStateMutation : validateValidStateOnly;
        validateFn();
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
  form.register(field);

  onBeforeUnmount(() => {
    markedForRemoval = true;
    form.unregister(field);
  });

  // extract cross-field dependencies in a computed prop
  const dependencies = computed(() => {
    const rulesVal = normalizedRules.value;
    // is falsy, a function schema or a yup schema
    if (!rulesVal || isCallable(rulesVal) || isYupValidator(rulesVal) || Array.isArray(rulesVal)) {
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

  return field;
}

/**
 * Normalizes partial field options to include the full options
 */
function normalizeOptions<TValue>(name: string, opts: Partial<FieldOptions<TValue>> | undefined): FieldOptions<TValue> {
  const defaults = () => ({
    initialValue: undefined,
    validateOnMount: false,
    bails: true,
    rules: '',
    label: name,
    validateOnValueUpdate: true,
    standalone: false,
    keepValueOnUnmount: undefined,
    modelPropName: 'modelValue',
    syncVModel: true,
  });

  if (!opts) {
    return defaults();
  }

  // TODO: Deprecate this in next major release
  const checkedValue = 'valueProp' in opts ? opts.valueProp : opts.checkedValue;

  return {
    ...defaults(),
    ...(opts || {}),
    checkedValue,
  };
}

/**
 * Extracts the validation rules from a schema
 */
export function extractRuleFromSchema<TValue>(
  schema: Record<string, RuleExpression<TValue>> | undefined,
  fieldName: string
) {
  // no schema at all
  if (!schema) {
    return undefined;
  }

  // there is a key on the schema object for this field
  return schema[fieldName];
}

function useCheckboxField<TValue = unknown>(
  name: MaybeRef<string>,
  rules?: MaybeRef<RuleExpression<TValue>>,
  opts?: Partial<FieldOptions<TValue>>
): FieldContext<TValue> {
  const form = !opts?.standalone ? injectWithSelf(FormContextKey) : undefined;
  const checkedValue = opts?.checkedValue;
  const uncheckedValue = opts?.uncheckedValue;

  function patchCheckboxApi(
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
        return;
      }

      let newValue = normalizeEventValue(e) as TValue;
      // Single checkbox field without a form to toggle it's value
      if (!form) {
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

  return patchCheckboxApi(_useField<TValue>(name, rules, opts));
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

function getCurrentModelValue<TValue = unknown>(vm: ComponentInternalInstance, propName: string) {
  return vm.props[propName] as TValue;
}
