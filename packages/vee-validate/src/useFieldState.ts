import { computed, isRef, reactive, ref, Ref, unref, watch, MaybeRef, MaybeRefOrGetter, toValue } from 'vue';
import { FieldMeta, FieldState, FieldValidator, InputType, PrivateFormContext, PathState, TypedSchema } from './types';
import { getFromPath, isEqual, normalizeErrorItem } from './utils';

export interface StateSetterInit<TValue = unknown> extends FieldState<TValue> {
  initialValue: TValue;
}

export interface FieldStateComposable<TValue = unknown> {
  id: number;
  path: MaybeRef<string>;
  meta: FieldMeta<TValue>;
  value: Ref<TValue>;
  flags: PathState['__flags'];
  initialValue: Ref<TValue>;
  errors: Ref<string[]>;
  setState(state: Partial<StateSetterInit<TValue>>): void;
}

export interface StateInit<TInput = unknown, TOutput = TInput> {
  modelValue: MaybeRef<TInput>;
  form?: PrivateFormContext;
  bails: boolean;
  label?: MaybeRefOrGetter<string | undefined>;
  type?: InputType;
  validate?: FieldValidator<TOutput>;
  schema?: MaybeRefOrGetter<TypedSchema<TInput> | undefined>;
}

let ID_COUNTER = 0;

export function useFieldState<TValue = unknown>(
  path: MaybeRef<string>,
  init: Partial<StateInit<TValue>>,
): FieldStateComposable<TValue> {
  const { value, initialValue, setInitialValue } = _useFieldValue<TValue>(path, init.modelValue, init.form);

  if (!init.form) {
    const { errors, setErrors } = createFieldErrors();
    const id = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;
    const meta = createFieldMeta(value, initialValue, errors, init.schema);

    function setState(state: Partial<StateSetterInit<TValue>>) {
      if ('value' in state) {
        value.value = state.value as TValue;
      }

      if ('errors' in state) {
        setErrors(state.errors);
      }

      if ('touched' in state) {
        meta.touched = state.touched ?? meta.touched;
      }

      if ('initialValue' in state) {
        setInitialValue(state.initialValue as TValue);
      }
    }

    return {
      id,
      path,
      value,
      initialValue,
      meta,
      flags: { pendingUnmount: { [id]: false }, pendingReset: false },
      errors,
      setState,
    };
  }

  const state = init.form.createPathState(path, {
    bails: init.bails,
    label: init.label,
    type: init.type,
    validate: init.validate,
    schema: init.schema,
  });

  const errors = computed(() => state.errors);

  function setState(state: Partial<StateSetterInit<TValue>>) {
    if ('value' in state) {
      value.value = state.value as TValue;
    }

    if ('errors' in state) {
      init.form?.setFieldError(unref(path), state.errors);
    }

    if ('touched' in state) {
      init.form?.setFieldTouched(unref(path), state.touched ?? false);
    }

    if ('initialValue' in state) {
      setInitialValue(state.initialValue as TValue);
    }
  }

  return {
    id: Array.isArray(state.id) ? state.id[state.id.length - 1] : state.id,
    path,
    value,
    errors,
    meta: state,
    initialValue,
    flags: state.__flags,
    setState,
  };
}

interface FieldValueComposable<TValue = unknown> {
  value: Ref<TValue>;
  initialValue: Ref<TValue>;
  setInitialValue(value: TValue): void;
}

/**
 * Creates the field value and resolves the initial value
 */
export function _useFieldValue<TValue = unknown>(
  path: MaybeRef<string>,
  modelValue?: MaybeRef<TValue>,
  form?: PrivateFormContext,
): FieldValueComposable<TValue> {
  const modelRef = ref(unref(modelValue)) as Ref<TValue>;

  function resolveInitialValue() {
    if (!form) {
      return unref(modelRef) as TValue;
    }

    return getFromPath<TValue>(form.initialValues.value, unref(path), unref(modelRef)) as TValue;
  }

  function setInitialValue(value: TValue) {
    if (!form) {
      modelRef.value = value;
      return;
    }

    form.setFieldInitialValue(unref(path), value, true);
  }

  const initialValue = computed(resolveInitialValue);

  // if no form is associated, use a regular ref.
  if (!form) {
    const value = ref(resolveInitialValue()) as Ref<TValue>;

    return {
      value,
      initialValue,
      setInitialValue,
    };
  }

  // to set the initial value, first check if there is a current value, if there is then use it.
  // otherwise use the configured initial value if it exists.
  // prioritize model value over form values
  // #3429
  const currentValue = resolveModelValue(modelValue, form, initialValue, path);
  form.stageInitialValue(unref(path), currentValue, true);
  // otherwise use a computed setter that triggers the `setFieldValue`
  const value = computed<TValue>({
    get() {
      return getFromPath<TValue>(form.values, unref(path)) as TValue;
    },
    set(newVal) {
      form.setFieldValue(unref(path), newVal, false);
    },
  }) as Ref<TValue>;

  return {
    value,
    initialValue,
    setInitialValue,
  };
}

/*
  to set the initial value, first check if there is a current value, if there is then use it.
  otherwise use the configured initial value if it exists.
  prioritize model value over form values
  #3429
*/
function resolveModelValue<TValue>(
  modelValue: MaybeRef<TValue> | undefined,
  form: PrivateFormContext,
  initialValue: MaybeRef<TValue> | undefined,
  path: MaybeRef<string>,
): TValue {
  if (isRef(modelValue)) {
    return unref(modelValue);
  }

  if (modelValue !== undefined) {
    return modelValue;
  }

  return getFromPath(form.values, unref(path), unref(initialValue)) as TValue;
}

/**
 * Creates meta flags state and some associated effects with them
 */
function createFieldMeta<TValue>(
  currentValue: Ref<TValue>,
  initialValue: MaybeRef<TValue> | undefined,
  errors: Ref<string[]>,
  schema?: MaybeRefOrGetter<TypedSchema<TValue> | undefined>,
) {
  const isRequired = computed(() => toValue(schema)?.describe?.().required ?? false);

  const meta = reactive({
    touched: false,
    pending: false,
    valid: true,
    required: isRequired,
    validated: !!unref(errors).length,
    initialValue: computed(() => unref(initialValue) as TValue | undefined),
    dirty: computed(() => {
      return !isEqual(unref(currentValue), unref(initialValue));
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
    },
  );

  return meta;
}

/**
 * Creates the error message state for the field state
 */
export function createFieldErrors() {
  const errors = ref<string[]>([]);

  return {
    errors,
    setErrors: (messages: string | string[] | null | undefined) => {
      errors.value = normalizeErrorItem(messages);
    },
  };
}
