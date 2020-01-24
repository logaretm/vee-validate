import { watch, ref, Ref, isRef, reactive, computed, onMounted, toRefs } from 'vue';
import { validate } from './validate';
import { Flag, FormController, ValidationResult, MaybeReactive } from './types';
import { createFlags, normalizeRules, extractLocators } from './utils';

interface FieldOptions {
  value: Ref<any>;
  immediate: boolean;
  form?: FormController;
}

export function useFlags() {
  const flags = reactive(createFlags());
  const passed = computed(() => {
    return flags.valid && flags.validated;
  });

  const failed = computed(() => {
    return flags.invalid && flags.validated;
  });

  const onBlur = () => {
    flags.touched = true;
    flags.untouched = false;
  };

  const onInput = () => {
    flags.dirty = true;
    flags.pristine = false;
  };

  return {
    ...toRefs(flags),
    passed,
    failed,
    onInput,
    onBlur
  };
}

export function useField(fieldName: string, rules: MaybeReactive<string | Record<string, any>>, opts?: FieldOptions) {
  const errors: Ref<string[]> = ref([]);
  const failedRules: Ref<Record<string, string>> = ref({});
  const { value, form, immediate } = normalizeOptions(opts);
  const initialValue = value.value;
  const { onBlur, onInput, ...flags } = useFlags();

  function commitResult(result: ValidationResult) {
    errors.value = result.errors;
    flags.changed.value = initialValue !== value.value;
    flags.valid.value = result.valid;
    flags.invalid.value = !result.valid;
    flags.validated.value = true;
    flags.pending.value = false;
    failedRules.value = result.failedRules;
  }

  const normalizedRules = computed(() => {
    return normalizeRules(isRef(rules) ? rules.value : rules);
  });

  const validateField = async (): Promise<ValidationResult> => {
    flags.pending.value = true;
    const result = await validate(value.value, normalizedRules.value, {
      name: fieldName,
      values: form?.values.value ?? {},
      names: form?.names.value ?? {}
    });

    commitResult(result);

    return result;
  };

  watch(value, validateField, {
    lazy: true,
    deep: true
  });

  if (isRef(rules)) {
    watch(rules, validateField, {
      lazy: true,
      deep: true
    });
  }

  const reset = () => {
    errors.value = [];
    const defaults = createFlags();
    failedRules.value = {};
    Object.keys(flags).forEach((key: string) => {
      // Skip these, since they are computed anyways.
      if (key === 'passed' || key === 'failed') {
        return;
      }

      (flags[key as Flag] as Ref<boolean>).value = defaults[key as Flag];
    });
  };

  onMounted(() => {
    validate(initialValue, isRef(rules) ? rules.value : rules).then(result => {
      if (immediate) {
        commitResult(result);
        return;
      }

      // Initial silent validation.
      flags.valid.value = result.valid;
      flags.invalid.value = !result.valid;
    });
  });

  const field = {
    vid: fieldName,
    value: value,
    ...flags,
    errors,
    reset,
    validate: validateField,
    onInput,
    onBlur
  };

  // eslint-disable-next-line no-unused-expressions
  form?.register(field);

  if (form) {
    const dependencies = computed(() => {
      return Object.keys(normalizedRules.value).reduce((acc: string[], rule: string) => {
        const deps = extractLocators(normalizedRules.value[rule]).map((dep: any) => dep.__locatorRef);
        acc.push(...deps);

        return acc;
      }, []);
    });

    watch(dependencies, val => {
      val.forEach(dep => {
        watch(form.fields[dep].value, () => {
          if (flags.validated.value) {
            validateField();
          }
        });
      });
    });
  }

  return field;
}

function normalizeOptions(opts: FieldOptions | undefined): FieldOptions {
  const defaults = () => ({
    value: ref(null),
    immediate: false,
    rules: ''
  });

  if (!opts) {
    return defaults();
  }

  return {
    ...defaults(),
    ...(opts ?? {})
  };
}
