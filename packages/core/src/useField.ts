import { watch, ref, Ref, isRef, reactive, computed, onMounted, watchEffect, inject, onBeforeUnmount } from 'vue';
import { validate } from './validate';
import {
  FormController,
  ValidationResult,
  MaybeReactive,
  GenericValidateFunction,
  Flag,
  ValidationFlags,
} from './types';
import {
  normalizeRules,
  extractLocators,
  normalizeEventValue,
  unwrap,
  genFieldErrorId,
  hasCheckedAttr,
  getFromPath,
} from './utils';
import { isCallable } from '../../shared';
import { FormInitialValues, FormSymbol } from './symbols';

interface FieldOptions {
  initialValue: any;
  disabled: MaybeReactive<boolean>;
  immediate?: boolean;
  bails?: boolean;
  form?: FormController;
  type?: string;
  valueProp?: MaybeReactive<any>;
}

type RuleExpression = MaybeReactive<string | Record<string, any> | GenericValidateFunction>;

/**
 * Creates a field composite.
 */
export function useField(fieldName: MaybeReactive<string>, rules: RuleExpression, opts?: Partial<FieldOptions>) {
  const { initialValue, form, immediate, bails, disabled, type, valueProp } = normalizeOptions(opts);
  const { meta, errors, onBlur, handleChange, reset, patch, value, checked } = useValidationState({
    fieldName,
    initValue: unwrap(initialValue),
    form,
    type,
    valueProp,
  });

  const nonYupSchemaRules = extractRuleFromSchema(form?.schema, unwrap(fieldName));
  const normalizedRules = computed(() => {
    return normalizeRules(nonYupSchemaRules || unwrap(rules));
  });

  const runValidation = async (): Promise<ValidationResult> => {
    meta.pending = true;
    if (!form || !form.validateSchema) {
      const result = await validate(value.value, normalizedRules.value, {
        name: unwrap(fieldName),
        values: form?.values ?? {},
        bails,
      });

      // Must be updated regardless if a mutation is needed or not
      // FIXME: is this needed?
      meta.valid = !result.errors.length;
      meta.invalid = !!result.errors.length;
      meta.pending = false;

      return result;
    }

    const results = await form.validateSchema();
    meta.pending = false;

    return results[unwrap(fieldName)];
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
    aria,
    reset,
    validate: runValidationWithMutation,
    handleChange,
    onBlur,
    disabled,
    setValidationState: patch,
    type,
    valueProp,
    checked,
    idx: -1,
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

  onBeforeUnmount(() => {
    form.unregister(field);
  });

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
      if (dep in form.values && meta.validated) {
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
  const form = inject(FormSymbol, undefined) as FormController | undefined;

  const defaults = () => ({
    initialValue: undefined,
    immediate: false,
    bails: true,
    rules: '',
    disabled: false,
    form,
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
function useValidationState({
  fieldName,
  initValue,
  form,
  type,
  valueProp,
}: {
  fieldName: MaybeReactive<string>;
  initValue?: any;
  form?: FormController;
  type?: string;
  valueProp: any;
}) {
  const errors: Ref<string[]> = ref([]);
  const { onBlur, reset: resetFlags, meta } = useMeta();
  const initialValue = initValue ?? getFromPath(inject(FormInitialValues, {}), unwrap(fieldName));
  const value = useFieldValue(initialValue, fieldName, form);
  if (hasCheckedAttr(type) && initialValue) {
    value.value = initialValue;
  }
  const checked = hasCheckedAttr(type)
    ? computed(() => {
        if (Array.isArray(value.value)) {
          return value.value.includes(unwrap(valueProp));
        }

        return unwrap(valueProp) === value.value;
      })
    : undefined;

  if (checked === undefined || checked.value) {
    // Set the value without triggering the watcher
    value.value = initialValue;
  }

  // Common input/change event handler
  const handleChange = (e: Event) => {
    value.value = normalizeEventValue(e);
    meta.dirty = true;
    meta.pristine = false;
  };

  // Updates the validation state with the validation result
  function patch(result: ValidationResult) {
    errors.value = result.errors;
    meta.changed = initialValue !== value.value;
    meta.valid = !result.errors.length;
    meta.invalid = !!result.errors.length;
    meta.validated = true;

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
    value,
    checked,
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

  const meta = reactive(initialMeta());
  watchEffect(() => {
    meta.passed = meta.valid && meta.validated;
    meta.failed = meta.invalid && meta.validated;
  });

  /**
   * Handles common onBlur meta update
   */
  const onBlur = () => {
    meta.touched = true;
    meta.untouched = false;
  };

  /**
   * Resets the flag state
   */
  function reset() {
    const defaults = initialMeta();
    Object.keys(meta).forEach((key: string) => {
      // Skip these, since they are computed anyways
      if (['passed', 'failed'].includes(key)) {
        return;
      }

      meta[key as Flag] = defaults[key as Flag];
    });
  }

  return {
    meta,
    onBlur,
    reset,
  };
}

function useAriAttrs(fieldName: MaybeReactive<string>, meta: Record<string, boolean>) {
  return computed(() => {
    return {
      'aria-invalid': meta.failed ? 'true' : 'false',
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

  // there is a key on the schema object for this field
  return schema[fieldName];
}

/**
 * Manages the field value
 */
function useFieldValue(initialValue: any, path: MaybeReactive<string>, form?: FormController) {
  // if no form is associated, use a regular ref.
  if (!form) {
    return ref(initialValue);
  }

  // otherwise use a computed setter that triggers the `setFieldValue`
  const value = computed({
    get() {
      return getFromPath(form.values, unwrap(path));
    },
    set(newVal: any) {
      form.setFieldValue(unwrap(path), newVal);
    },
  });

  return value;
}
