import {
  watch,
  ref,
  Ref,
  isRef,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  unref,
  WatchStopHandle,
  provide,
} from 'vue';
import { validate as validateValue } from './validate';
import {
  FormContext,
  ValidationResult,
  MaybeReactive,
  GenericValidateFunction,
  FieldMeta,
  YupValidator,
  FieldComposable,
  FieldState,
  PrivateFieldComposite,
  WritableRef,
} from './types';
import {
  normalizeRules,
  extractLocators,
  normalizeEventValue,
  hasCheckedAttr,
  getFromPath,
  setInPath,
  injectWithSelf,
  resolveNextCheckboxValue,
  isYupValidator,
  keysOf,
} from './utils';
import { isCallable } from '../../shared';
import { FieldContextSymbol, FormInitialValuesSymbol, FormContextSymbol } from './symbols';

interface FieldOptions<TValue = unknown> {
  initialValue?: MaybeReactive<TValue>;
  validateOnValueUpdate: boolean;
  validateOnMount?: boolean;
  bails?: boolean;
  type?: string;
  valueProp?: MaybeReactive<TValue>;
  uncheckedValue?: MaybeReactive<TValue>;
  label?: MaybeReactive<string>;
}

type RuleExpression = string | Record<string, unknown> | GenericValidateFunction | YupValidator | undefined;

let ID_COUNTER = 0;

/**
 * Creates a field composite.
 */
export function useField<TValue = unknown>(
  name: MaybeReactive<string>,
  rules?: MaybeReactive<RuleExpression>,
  opts?: Partial<FieldOptions<TValue>>
): FieldComposable<TValue> {
  const fid = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;
  const {
    initialValue,
    validateOnMount,
    bails,
    type,
    valueProp,
    label,
    validateOnValueUpdate,
    uncheckedValue,
  } = normalizeOptions(unref(name), opts);

  const form = injectWithSelf(FormContextSymbol);
  const {
    meta,
    errors,
    handleBlur,
    handleInput,
    resetValidationState,
    setValidationState,
    value,
    checked,
  } = useValidationState<TValue>({
    name,
    // make sure to unref initial value because of possible refs passed in
    initValue: unref(initialValue) as TValue | undefined,
    form,
    type,
    valueProp,
  });

  const normalizedRules = computed(() => {
    let rulesValue = unref(rules);
    const schema = form?.schema;
    if (schema && !isYupValidator(schema)) {
      rulesValue = extractRuleFromSchema(schema, unref(name)) || rulesValue;
    }

    if (isYupValidator(rulesValue) || isCallable(rulesValue)) {
      return rulesValue;
    }

    return normalizeRules(rulesValue);
  });

  const validate = async (): Promise<ValidationResult> => {
    meta.pending = true;
    let result: ValidationResult;
    if (!form || !form.validateSchema) {
      result = await validateValue(value.value, normalizedRules.value, {
        name: unref(label) || unref(name),
        values: form?.values ?? {},
        bails,
      });
    } else {
      result = (await form.validateSchema())[unref(name)];
    }

    meta.pending = false;

    return setValidationState(result);
  };

  // Common input/change event handler
  const handleChange = (e: unknown) => {
    if (checked && checked.value === ((e as Event)?.target as HTMLInputElement)?.checked) {
      return;
    }

    let newValue = normalizeEventValue(e) as TValue;
    // Single checkbox field without a form to toggle it's value
    if (checked && type === 'checkbox' && !form) {
      newValue = resolveNextCheckboxValue(value.value, unref(valueProp), unref(uncheckedValue)) as TValue;
    }

    value.value = newValue;
    meta.dirty = true;
    if (!validateOnValueUpdate) {
      return validate();
    }
  };

  if (validateOnMount) {
    onMounted(validate);
  }

  const errorMessage = computed(() => {
    return errors.value[0];
  });

  function setTouched(isTouched: boolean) {
    meta.touched = isTouched;
  }

  function setDirty(isDirty: boolean) {
    meta.dirty = isDirty;
  }

  let unwatchValue: WatchStopHandle;
  function watchValue() {
    if (validateOnValueUpdate) {
      unwatchValue = watch(value, validate, {
        deep: true,
      });
    }
  }

  watchValue();

  function resetField(state?: Partial<FieldState<TValue>>) {
    unwatchValue?.();
    resetValidationState(state);
    watchValue();
  }

  const field: PrivateFieldComposite<TValue> = {
    idx: -1,
    fid,
    name,
    value,
    meta,
    errors,
    errorMessage,
    type,
    valueProp,
    uncheckedValue,
    checked,
    resetField,
    handleReset: () => resetField(),
    validate,
    handleChange,
    handleBlur,
    handleInput,
    setValidationState,
    setTouched,
    setDirty,
  };

  provide(FieldContextSymbol, field);

  if (isRef(rules) && typeof unref(rules) !== 'function') {
    watch(rules, validate, {
      deep: true,
    });
  }

  // if no associated form return the field API immediately
  if (!form) {
    return field;
  }

  // associate the field with the given form
  form.register(field);

  onBeforeUnmount(() => {
    form.unregister(field);
  });

  // extract cross-field dependencies in a computed prop
  const dependencies = computed(() => {
    const rulesVal = normalizedRules.value;
    // is falsy, a function schema or a yup schema
    if (!rulesVal || isCallable(rulesVal) || isYupValidator(rulesVal)) {
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
    if (!Object.keys(deps).length || !meta.dirty) {
      return;
    }

    const shouldValidate = Object.keys(deps).some(depName => {
      return deps[depName] !== oldDeps[depName];
    });

    if (shouldValidate) {
      validate();
    }
  });

  return field;
}

/**
 * Normalizes partial field options to include the full
 */
function normalizeOptions<TValue>(name: string, opts: Partial<FieldOptions<TValue>> | undefined): FieldOptions<TValue> {
  const defaults = () => ({
    initialValue: undefined,
    validateOnMount: false,
    bails: true,
    rules: '',
    label: name,
    validateOnValueUpdate: true,
  });

  if (!opts) {
    return defaults();
  }

  return {
    ...defaults(),
    ...(opts || {}),
  };
}

/**
 * Manages the validation state of a field.
 */
function useValidationState<TValue>({
  name,
  initValue,
  form,
  type,
  valueProp,
}: {
  name: MaybeReactive<string>;
  valueProp?: MaybeReactive<TValue>;
  initValue?: TValue;
  form?: FormContext;
  type?: string;
}) {
  const errors: Ref<string[]> = ref([]);
  const formInitialValues = injectWithSelf(FormInitialValuesSymbol, undefined);
  const initialValue = (getFromPath<TValue>(unref(formInitialValues), unref(name)) ?? initValue) as TValue;
  const { resetMeta, meta } = useMeta(initialValue);
  const value = useFieldValue(initialValue, name, form);
  if (hasCheckedAttr(type) && initialValue) {
    value.value = initialValue;
  }
  const checked = hasCheckedAttr(type)
    ? computed(() => {
        if (Array.isArray(value.value)) {
          return value.value.includes(unref(valueProp));
        }

        return unref(valueProp) === value.value;
      })
    : undefined;

  if (checked === undefined || checked.value) {
    // Set the value without triggering the watcher
    value.value = initialValue;
  }

  /**
   * Handles common onBlur meta update
   */
  const handleBlur = () => {
    meta.touched = true;
  };

  /**
   * Handles common on blur events
   */
  const handleInput = (e: unknown) => {
    // Checkboxes/Radio will emit a `change` event anyway, custom components will use `update:modelValue`
    // so this is redundant
    if (!hasCheckedAttr(type)) {
      value.value = normalizeEventValue(e) as TValue;
    }

    meta.dirty = true;
  };

  // Updates the validation state with the validation result
  function setValidationState(result: ValidationResult) {
    errors.value = result.errors;
    meta.valid = !result.errors.length;

    return result;
  }

  // Resets the validation state
  function resetValidationState(state?: Partial<FieldState<TValue>>) {
    const fieldPath = unref(name);
    const newValue =
      state && 'value' in state
        ? (state.value as TValue)
        : ((getFromPath<TValue>(unref(formInitialValues), fieldPath) ?? initValue) as TValue);
    if (form) {
      form.setFieldValue(fieldPath, newValue, { force: true });
    } else {
      value.value = newValue;
    }
    errors.value = state?.errors || [];

    resetMeta(state);
  }

  return {
    meta,
    errors,
    setValidationState,
    resetValidationState,
    handleBlur,
    handleInput,
    value,
    checked,
  };
}

/**
 * Exposes meta flags state and some associated actions with them.
 */
function useMeta<TValue>(initialValue: TValue) {
  const initialMeta = (): FieldMeta<TValue> => ({
    touched: false,
    dirty: false,
    valid: false,
    pending: false,
    initialValue,
  });

  const meta = reactive(initialMeta()) as FieldMeta<TValue>;

  /**
   * Resets the flag state
   */
  function resetMeta(state?: Pick<Partial<FieldState<TValue>>, 'dirty' | 'touched' | 'value'>) {
    const defaults = initialMeta();
    meta.pending = defaults.pending;
    meta.touched = state?.touched ?? defaults.touched;
    meta.dirty = state?.dirty ?? defaults.dirty;
    meta.initialValue = state?.value ?? defaults.initialValue;
  }

  return {
    meta,
    resetMeta,
  };
}

/**
 * Extracts the validation rules from a schema
 */
function extractRuleFromSchema(schema: Record<string, RuleExpression> | undefined, fieldName: string) {
  // no schema at all
  if (!schema) {
    return undefined;
  }

  // there is a key on the schema object for this field
  return schema[fieldName];
}

/**
 * Manages the field value
 */
function useFieldValue<TValue>(
  initialValue: TValue | undefined,
  path: MaybeReactive<string>,
  form?: FormContext
): WritableRef<TValue> {
  // if no form is associated, use a regular ref.
  if (!form) {
    return ref(initialValue) as WritableRef<TValue>;
  }

  // set initial value
  setInPath(form.values, unref(path), initialValue);
  // otherwise use a computed setter that triggers the `setFieldValue`
  const value = computed<TValue>({
    get() {
      return getFromPath<TValue>(form.values, unref(path)) as TValue;
    },
    set(newVal) {
      form.setFieldValue(unref(path), newVal);
    },
  });

  return value as WritableRef<TValue>;
}
