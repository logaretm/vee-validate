import { watch, ref, Ref, isRef, reactive, computed, onMounted, toRefs, watchEffect } from 'vue';
import { validate } from './validate';
import {
  FormController,
  ValidationResult,
  MaybeReactive,
  GenericValidateFunction,
  Flag,
  ValidationFlags,
} from './types';
import { normalizeRules, extractLocators, normalizeEventValue, unwrap, genFieldErrorId } from './utils';
import { isCallable } from '../../shared';

interface FieldOptions {
  value: Ref<any>;
  disabled: MaybeReactive<boolean>;
  immediate?: boolean;
  bails?: boolean;
  form?: FormController;
}

type RuleExpression = MaybeReactive<string | Record<string, any> | GenericValidateFunction>;

/**
 * Creates a field composite.
 */
export function useField(fieldName: MaybeReactive<string>, rules: RuleExpression, opts?: Partial<FieldOptions>) {
  const { value, form, immediate, bails, disabled } = normalizeOptions(opts);
  const { meta, errors, failedRules, onBlur, handleChange, reset, patch } = useValidationState(value);
  // eslint-disable-next-line prefer-const
  let schemaValidation: GenericValidateFunction | string | Record<string, any> | undefined;
  const normalizedRules = computed(() => {
    return normalizeRules(schemaValidation || unwrap(rules));
  });

  const runValidation = async (): Promise<ValidationResult> => {
    meta.pending.value = true;
    const result = await validate(value.value, normalizedRules.value, {
      name: unwrap(fieldName),
      values: form?.values.value ?? {},
      bails,
    });

    // Must be updated regardless if a mutation is needed or not
    // FIXME: is this needed?
    meta.valid.value = result.valid;
    meta.invalid.value = !result.valid;
    meta.pending.value = false;

    return result;
  };

  const runValidationWithMutation = () => runValidation().then(patch);

  onMounted(() => {
    runValidation().then(result => {
      if (immediate) {
        patch(result);
      }
    });
  });

  const errorMessage = computed(() => {
    return errors.value[0];
  });

  const aria = useAriAttrs(fieldName, meta);

  const field = {
    name: fieldName,
    value: value,
    meta,
    errors,
    errorMessage,
    failedRules,
    aria,
    reset,
    validate: runValidationWithMutation,
    handleChange,
    onBlur,
    disabled,
  };

  watch(value, runValidationWithMutation, {
    deep: true,
  });

  if (isRef(rules)) {
    watch(rules, runValidationWithMutation, {
      deep: true,
    });
  }

  // if no associated form return the field API immediately
  if (!form) {
    return field;
  }

  // associate the field with the given form
  form.register(field);

  // set the rules if present in schema
  schemaValidation = extractRuleFromSchema(form.schema, unwrap(fieldName));

  // extract cross-field dependencies in a computed prop
  const dependencies = computed(() => {
    const rulesVal = normalizedRules.value;
    // is falsy, a function schema or a yup schema
    if (!rulesVal || isCallable(rulesVal) || isCallable(rulesVal.validate)) {
      return [];
    }

    return Object.keys(rulesVal).reduce((acc: string[], rule: string) => {
      const deps = extractLocators((normalizedRules as Ref<Record<string, any>>).value[rule]).map(
        (dep: any) => dep.__locatorRef
      );
      acc.push(...deps);

      return acc;
    }, []);
  });

  // Adds a watcher that runs the validation whenever field dependencies change
  watchEffect(() => {
    // Skip if no dependencies
    if (!dependencies.value.length) {
      return;
    }

    // For each dependent field, validate it if it was validated before
    dependencies.value.forEach(dep => {
      if (dep in form.values.value && meta.validated.value) {
        runValidationWithMutation();
      }
    });
  });

  return field;
}

/**
 * Normalizes partial field options to include the full
 */
function normalizeOptions(opts: Partial<FieldOptions> | undefined): FieldOptions {
  const defaults = () => ({
    value: ref(undefined),
    immediate: false,
    bails: true,
    rules: '',
    disabled: false,
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
function useValidationState(value: Ref<any>) {
  const errors: Ref<string[]> = ref([]);
  const { onBlur, reset: resetFlags, meta } = useMeta();
  const initialValue = value.value;

  // Common input/change event handler
  const handleChange = (e: Event) => {
    value.value = normalizeEventValue(e);
    meta.dirty.value = true;
    meta.pristine.value = false;
  };

  // Updates the validation state with the validation result
  function patch(result: ValidationResult) {
    errors.value = result.errors;
    meta.changed.value = initialValue !== value.value;
    meta.valid.value = result.valid;
    meta.invalid.value = !result.valid;
    meta.validated.value = true;

    return result;
  }

  // Resets the validation state
  const reset = () => {
    errors.value = [];
    resetFlags();
  };

  return {
    meta,
    errors,
    patch,
    reset,
    onBlur,
    handleChange,
  };
}

/**
 * Exposes meta flags state and some associated actions with them.
 */
function useMeta() {
  const initialMeta = (): ValidationFlags => ({
    untouched: true,
    touched: false,
    dirty: false,
    pristine: true,
    valid: false,
    invalid: false,
    validated: false,
    pending: false,
    changed: false,
    passed: false,
    failed: false,
  });

  const flags = reactive(initialMeta());

  const passed = computed(() => {
    return flags.valid && flags.validated;
  });

  const failed = computed(() => {
    return flags.invalid && flags.validated;
  });

  /**
   * Handles common onBlur meta update
   */
  const onBlur = () => {
    flags.touched = true;
    flags.untouched = false;
  };

  /**
   * Resets the flag state
   */
  function reset() {
    const defaults = initialMeta();
    Object.keys(flags).forEach((key: string) => {
      // Skip these, since they are computed anyways
      if (key === 'passed' || key === 'failed') {
        return;
      }

      flags[key as Flag] = defaults[key as Flag];
    });
  }

  return {
    meta: {
      ...toRefs(flags),
      passed,
      failed,
    },
    onBlur,
    reset,
  };
}

function useAriAttrs(fieldName: MaybeReactive<string>, meta: Record<Flag, Ref<boolean>>) {
  return computed(() => {
    return {
      'aria-invalid': meta.failed.value ? 'true' : 'false',
      'aria-describedBy': genFieldErrorId(unwrap(fieldName)),
    };
  });
}

/**
 * Extracts the validation rules from a schema
 */
function extractRuleFromSchema(schema: Record<string, any> | undefined, fieldName: string) {
  // no schema at all
  if (!schema) {
    return undefined;
  }

  // a yup schema
  if (schema.fields?.[fieldName]) {
    return schema.fields?.[fieldName];
  }

  // there is a key on the schema object for this field
  if (schema[fieldName]) {
    return schema[fieldName];
  }

  return undefined;
}
