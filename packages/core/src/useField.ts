import { watch, ref, Ref, isRef, reactive, computed, onMounted, toRefs } from 'vue';
import { validate } from './validate';
import { FormController, ValidationResult, MaybeReactive, FieldComposite } from './types';
import { createFlags, normalizeRules, extractLocators } from './utils';
import { normalizeEventValue } from './utils/events';

interface FieldOptions {
  value: Ref<any>;
  immediate?: boolean;
  form?: FormController;
}

type RuleExpression = MaybeReactive<string | Record<string, any>>;

export function useField(fieldName: MaybeReactive<string>, rules: RuleExpression, opts?: FieldOptions): FieldComposite {
  const { value, form, immediate } = useFieldOptions(opts);
  const { flags, errors, failedRules, onBlur, onInput, reset, patch } = useValidationState(value);
  const normalizedRules = computed(() => {
    return normalizeRules(isRef(rules) ? rules.value : rules);
  });

  const validateField = async (): Promise<ValidationResult> => {
    flags.pending.value = true;
    const result = await validate(value.value, normalizedRules.value, {
      name: isRef(fieldName) ? fieldName.value : fieldName,
      values: form?.values.value ?? {},
      names: form?.names.value ?? {}
    });

    patch(result);

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

  onMounted(() => {
    validate(value.value, isRef(rules) ? rules.value : rules).then(result => {
      if (immediate) {
        patch(result);
        return;
      }

      // Initial silent validation.
      flags.valid.value = result.valid;
      flags.invalid.value = !result.valid;
    });
  });

  const field = {
    vid: fieldName,
    name: fieldName, // TODO: Custom field names
    value: value,
    ...flags,
    errors,
    failedRules,
    reset,
    validate: validateField,
    onInput,
    onBlur
  };

  useFormController(field, normalizedRules, form);

  return field;
}

function useFieldOptions(opts: FieldOptions | undefined): FieldOptions {
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

function useValidationState(value: Ref<any>) {
  const errors: Ref<string[]> = ref([]);
  const { onBlur, reset: resetFlags, ...flags } = useFlags();
  const failedRules: Ref<Record<string, string>> = ref({});
  const initialValue = value.value;

  const onInput = (e: Event) => {
    value.value = normalizeEventValue(e);
    flags.dirty.value = true;
    flags.pristine.value = false;
  };

  function patch(result: ValidationResult) {
    errors.value = result.errors;
    flags.changed.value = initialValue !== value.value;
    flags.valid.value = result.valid;
    flags.invalid.value = !result.valid;
    flags.validated.value = true;
    flags.pending.value = false;
    failedRules.value = result.failedRules;
  }

  const reset = () => {
    errors.value = [];
    failedRules.value = {};
    resetFlags();
  };

  return {
    flags,
    errors,
    failedRules,
    patch,
    reset,
    onBlur,
    onInput
  };
}

function useFormController(field: FieldComposite, rules: Ref<Record<string, any>>, form?: FormController) {
  if (!form) return;

  form.register(field);

  const dependencies = computed(() => {
    return Object.keys(rules.value).reduce((acc: string[], rule: string) => {
      const deps = extractLocators(rules.value[rule]).map((dep: any) => dep.__locatorRef);
      acc.push(...deps);

      return acc;
    }, []);
  });

  watch(dependencies, val => {
    val.forEach(dep => {
      watch(form.fields[dep].value, () => {
        if (field.validated.value) {
          field.validate();
        }
      });
    });
  });
}

function useFlags() {
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
  function reset() {
    const defaults = createFlags();
    Object.keys(flags).forEach((key: string) => {
      // Skip these, since they are computed anyways.
      if (key === 'passed' || key === 'failed') {
        return;
      }

      flags[key] = defaults[key];
    });
  }

  return {
    ...toRefs(flags),
    passed,
    failed,
    onBlur,
    reset
  };
}
