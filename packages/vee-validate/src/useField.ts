import {
  watch,
  ref,
  isRef,
  reactive,
  computed,
  onMounted,
  onBeforeUnmount,
  unref,
  WatchStopHandle,
  provide,
  Ref,
} from 'vue';
import { BaseSchema } from 'yup';
import isEqual from 'fast-deep-equal/es6';
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
  injectWithSelf,
  resolveNextCheckboxValue,
  isYupValidator,
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

type RuleExpression<TValue> =
  | string
  | Record<string, unknown>
  | GenericValidateFunction
  | YupValidator
  | BaseSchema<TValue>
  | undefined;

let ID_COUNTER = 0;

/**
 * Creates a field composite.
 */
export function useField<TValue = unknown>(
  name: MaybeReactive<string>,
  rules?: MaybeReactive<RuleExpression<TValue>>,
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
    errorMessage,
    handleBlur,
    handleInput,
    resetValidationState,
    setValidationState,
    setErrors,
    value,
    checked,
  } = useValidationState<TValue>({
    name,
    initValue: initialValue,
    form,
    type,
    valueProp,
  });

  const normalizedRules = computed(() => {
    let rulesValue = unref(rules);
    const schema = form?.schema;
    if (schema && !isYupValidator(schema)) {
      rulesValue = extractRuleFromSchema<TValue>(schema, unref(name)) || rulesValue;
    }

    if (isYupValidator(rulesValue) || isCallable(rulesValue)) {
      return rulesValue;
    }

    return normalizeRules(rulesValue);
  });

  async function validateWithStateMutation(): Promise<ValidationResult> {
    meta.pending = true;
    let result: ValidationResult;
    if (!form || !form.validateSchema) {
      result = await validateValue(value.value, normalizedRules.value, {
        name: unref(label) || unref(name),
        values: form?.values ?? {},
        bails,
      });
    } else {
      result = (await form.validateSchema())[unref(name)] ?? { valid: true, errors: [] };
    }

    meta.pending = false;

    return setValidationState(result);
  }

  async function validateValidStateOnly(): Promise<void> {
    let result: ValidationResult;
    if (!form || !form.validateSchema) {
      result = await validateValue(value.value, normalizedRules.value, {
        name: unref(label) || unref(name),
        values: form?.values ?? {},
        bails,
      });
    } else {
      result = (await form.validateSchema(false))?.[unref(name)] ?? { valid: true, errors: [] };
    }

    meta.valid = result.valid;
  }

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
    if (!validateOnValueUpdate) {
      return validateWithStateMutation();
    }
  };

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
    unwatchValue = watch(value, validateOnValueUpdate ? validateWithStateMutation : validateValidStateOnly, {
      deep: true,
    });
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
    validate: validateWithStateMutation,
    handleChange,
    handleBlur,
    handleInput,
    setValidationState,
    setTouched,
    setErrors,
  };

  provide(FieldContextSymbol, field);

  if (isRef(rules) && typeof unref(rules) !== 'function') {
    watch(
      rules,
      (value, oldValue) => {
        if (isEqual(value, oldValue)) {
          return;
        }

        return validateWithStateMutation();
      },
      {
        deep: true,
      }
    );
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
    if (!Object.keys(deps).length) {
      return;
    }

    const shouldValidate = !isEqual(deps, oldDeps);
    if (shouldValidate) {
      meta.dirty ? validateWithStateMutation() : validateValidStateOnly();
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
  initValue?: MaybeReactive<TValue>;
  form?: FormContext;
  type?: string;
}) {
  const { errors, errorMessage, setErrors } = useErrorsSource(name, form);
  const formInitialValues = injectWithSelf(FormInitialValuesSymbol, undefined);
  const initialValue = computed(() => {
    return (getFromPath<TValue>(unref(formInitialValues), unref(name)) ?? unref(initValue)) as TValue;
  });
  const value = useFieldValue(initialValue, name, form);
  const meta = useMeta(initialValue, value, errors);

  const checked = hasCheckedAttr(type)
    ? computed(() => {
        if (Array.isArray(value.value)) {
          return value.value.includes(unref(valueProp));
        }

        return unref(valueProp) === value.value;
      })
    : undefined;

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
  };

  // Updates the validation state with the validation result
  function setValidationState(result: ValidationResult) {
    setErrors(result.errors);

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

    setErrors(state?.errors || []);
    meta.touched = state?.touched ?? false;
    meta.pending = false;
  }

  return {
    meta,
    errors,
    errorMessage,
    setErrors,
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
function useMeta<TValue>(initialValue: MaybeReactive<TValue>, currentValue: Ref<TValue>, errors: Ref<string[]>) {
  const meta = reactive({
    touched: false,
    pending: false,
    valid: true,
    initialValue: computed(() => unref(initialValue) as TValue | undefined),
    dirty: computed(() => {
      return !isEqual(currentValue.value, unref(initialValue));
    }),
  }) as FieldMeta<TValue>;

  watch(
    errors,
    value => {
      meta.valid = !value.length;
    },
    {
      immediate: true,
      flush: 'sync',
    }
  );

  return meta;
}

/**
 * Extracts the validation rules from a schema
 */
function extractRuleFromSchema<TValue>(schema: Record<string, RuleExpression<TValue>> | undefined, fieldName: string) {
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
  initialValue: MaybeReactive<TValue | undefined>,
  path: MaybeReactive<string>,
  form?: FormContext
): WritableRef<TValue> {
  // if no form is associated, use a regular ref.
  if (!form) {
    return ref(unref(initialValue)) as WritableRef<TValue>;
  }

  // set initial value
  form.stageInitialValue(unref(path), unref(initialValue));
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

function useErrorsSource(path: MaybeReactive<string>, form?: FormContext) {
  if (!form) {
    const errors = ref<string[]>([]);
    return {
      errors: computed(() => errors.value),
      errorMessage: computed<string | undefined>(() => errors.value[0]),
      setErrors: (messages: string | string[]) => {
        errors.value = Array.isArray(messages) ? messages : [messages];
      },
    };
  }

  const errors = computed(() => form.errorBag.value[unref(path)] || []);

  return {
    errors,
    errorMessage: computed<string | undefined>(() => errors.value[0]),
    setErrors: (messages: string | string[]) => {
      form.setFieldErrorBag(unref(path), messages);
    },
  };
}
