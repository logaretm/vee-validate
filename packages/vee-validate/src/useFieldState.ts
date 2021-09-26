import { computed, reactive, ref, Ref, unref, watch } from 'vue';
import isEqual from 'fast-deep-equal/es6';
import { FormContextKey } from './symbols';
import { FieldMeta, FieldState, MaybeRef } from './types';
import { getFromPath, injectWithSelf } from './utils';

interface StateSetterInit<TValue = unknown> extends FieldState<TValue> {
  initialValue: TValue;
}

interface FieldStateComposable<TValue = unknown> {
  id: number;
  path: MaybeRef<string>;
  meta: FieldMeta<TValue>;
  value: Ref<TValue>;
  initialValue: Ref<TValue>;
  errorMessage: Ref<string | undefined>;
  errors: Ref<string[]>;
  setState(state: Partial<StateSetterInit<TValue>>): void;
}

interface StateInit<TValue = unknown> {
  modelValue: MaybeRef<TValue>;
  standalone: boolean;
}

let ID_COUNTER = 0;

export function useFieldState<TValue = unknown>(
  path: MaybeRef<string>,
  init: Partial<StateInit<TValue>>
): FieldStateComposable<TValue> {
  const { value, initialValue, setInitialValue } = _useFieldValue<TValue>(path, init.modelValue, !init.standalone);
  const { errorMessage, errors, setErrors } = _useFieldErrors(path, !init.standalone);
  const meta = _useFieldMeta(value, initialValue, errors);
  const id = ID_COUNTER >= Number.MAX_SAFE_INTEGER ? 0 : ++ID_COUNTER;

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
    errors,
    errorMessage,
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
function _useFieldValue<TValue = unknown>(
  path: MaybeRef<string>,
  modelValue: MaybeRef<TValue> | undefined,
  shouldInjectForm: boolean
): FieldValueComposable<TValue> {
  const form = shouldInjectForm ? injectWithSelf(FormContextKey, undefined) : undefined;
  const modelRef = ref(unref(modelValue)) as Ref<TValue>;

  function resolveInitialValue() {
    if (!form) {
      return unref(modelRef) as TValue;
    }

    return getFromPath<TValue>(form.meta.value.initialValues, unref(path), unref(modelRef)) as TValue;
  }

  function setInitialValue(value: TValue) {
    if (!form) {
      modelRef.value = value;
      return;
    }

    form.setFieldInitialValue(unref(path), value);
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
  const currentValue = modelValue ? unref(modelValue) : getFromPath(form.values, unref(path), unref(initialValue));
  form.stageInitialValue(unref(path), currentValue);
  // otherwise use a computed setter that triggers the `setFieldValue`
  const value = computed<TValue>({
    get() {
      return getFromPath<TValue>(form.values, unref(path)) as TValue;
    },
    set(newVal) {
      form.setFieldValue(unref(path), newVal);
    },
  }) as Ref<TValue>;

  return {
    value,
    initialValue,
    setInitialValue,
  };
}

/**
 * Creates meta flags state and some associated effects with them
 */
function _useFieldMeta<TValue>(
  currentValue: Ref<TValue>,
  initialValue: MaybeRef<TValue> | undefined,
  errors: Ref<string[]>
) {
  const meta = reactive({
    touched: false,
    pending: false,
    valid: true,
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
    }
  );

  return meta;
}

/**
 * Creates the error message state for the field state
 */
export function _useFieldErrors(path: MaybeRef<string>, shouldInjectForm: boolean) {
  const form = shouldInjectForm ? injectWithSelf(FormContextKey, undefined) : undefined;

  function normalizeErrors(messages: string | string[] | null | undefined) {
    if (!messages) {
      return [];
    }

    return Array.isArray(messages) ? messages : [messages];
  }

  if (!form) {
    const errors = ref<string[]>([]);

    return {
      errors,
      errorMessage: computed<string | undefined>(() => errors.value[0]),
      setErrors: (messages: string | string[] | null | undefined) => {
        errors.value = normalizeErrors(messages);
      },
    };
  }

  const errors = computed(() => form.errorBag.value[unref(path)] || []);

  return {
    errors,
    errorMessage: computed<string | undefined>(() => errors.value[0]),
    setErrors: (messages: string | string[] | null | undefined) => {
      form.setFieldErrorBag(unref(path), normalizeErrors(messages));
    },
  };
}
