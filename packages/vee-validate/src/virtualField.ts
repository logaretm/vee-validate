import { computed, unref, watch } from 'vue';
import { VirtualFieldComposite, FieldState, FormContext, ValidationResult } from './types';
import { useFieldValue, useFieldMeta, useFieldErrors } from './useField';
import { getFromPath } from './utils';

export function createVirtualField<TValue = unknown>(name: string, form: FormContext): VirtualFieldComposite<TValue> {
  const initialValue = computed(() => getFromPath(form.meta.value.initialValues, name) as TValue);
  const value = useFieldValue(initialValue, name, form);
  const { errors, setErrors, errorMessage } = useFieldErrors(name, form);
  const meta = useFieldMeta(initialValue, value, errors);

  let unwatchValue = watch(value, validate);
  function watchValue() {
    unwatchValue = watch(value, validate);
  }

  function setValidationState(result: ValidationResult) {
    meta.valid = result.valid;
    setErrors(result.errors);
  }

  function resetField(state?: Partial<FieldState<unknown>>) {
    unwatchValue();
    if (state && 'value' in state) {
      form.setFieldInitialValue(name, state.value);
    }

    form.setFieldValue(name, state?.value || unref(initialValue));
    form.setFieldTouched(name, state?.touched ?? false);

    setValidationState({
      valid: !state?.errors || !state.errors?.length,
      errors: state?.errors || [],
    });
    watchValue();
  }

  async function validate() {
    meta.pending = true;
    meta.validated = true;
    let result: ValidationResult;
    if (form.validateSchema) {
      result = (await form.validateSchema('validated-only')).results[name] ?? { valid: true, errors: [] };
    } else {
      result = { valid: true, errors: [] };
    }

    meta.pending = false;
    setValidationState(result);

    return result;
  }

  function setTouched(isTouched: boolean) {
    meta.touched = isTouched;
  }

  return {
    name,
    meta,
    kind: 'virtual',
    errors,
    errorMessage,
    value,
    setValidationState,
    resetField,
    validate,
    setErrors,
    setTouched,
  };
}
