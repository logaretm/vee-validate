import { MaybeRefOrGetter, MaybeRef, ref, watch, onMounted, onBeforeUnmount, Ref } from 'vue';
import { FieldOptions, RuleExpression, useField } from './useField';
import { getConfig } from './config';

interface ListenerOptions {
  validateOnChange: boolean;
  validateOnInput: boolean;
  validateOnBlur: boolean;
}

export function useFieldRef<TValue = unknown>(
  path: MaybeRefOrGetter<string>,
  rules?: MaybeRef<RuleExpression<TValue>>,
  opts?: Partial<FieldOptions<TValue> & ListenerOptions>,
) {
  const field = useField(path, rules, opts);
  const inputRef = ref<HTMLInputElement>();

  watch(field.errorMessage, msg => {
    inputRef.value?.setCustomValidity(msg || '');
  });

  watch(field.value, value => {
    if (!inputRef.value) {
      return;
    }

    if (field.value.value === inputRef.value.value) {
      return;
    }

    inputRef.value.value = String(value);
  });

  useEventListener(inputRef, 'input', event => {
    field.handleChange(event, opts?.validateOnInput ?? getConfig().validateOnInput);
  });

  useEventListener(inputRef, 'change', event => {
    field.handleChange(event, opts?.validateOnChange ?? getConfig().validateOnChange);
  });

  useEventListener(inputRef, 'blur', event => {
    field.handleBlur(event, opts?.validateOnBlur ?? getConfig().validateOnBlur);
  });

  onMounted(() => {
    if (!inputRef.value) {
      return;
    }

    if (field.meta.required) {
      inputRef.value.required = field.meta.required;
    }
  });

  return {
    ...field,
    inputRef,
  };
}

function useEventListener(
  el: Ref<HTMLElement | undefined>,
  event: string,
  handler: EventListenerOrEventListenerObject,
) {
  onMounted(() => {
    el.value?.addEventListener(event, handler);
  });

  onBeforeUnmount(() => {
    el.value?.removeEventListener(event, handler);
  });
}
