import { computed, ref, Ref, provide, reactive, onMounted, isRef, watch, unref, nextTick, warn, markRaw } from 'vue';
import isEqual from 'fast-deep-equal/es6';
import type { SchemaOf } from 'yup';
import { klona as deepCopy } from 'klona/lite';
import {
  FieldMeta,
  SubmissionHandler,
  GenericValidateFunction,
  ValidationResult,
  MaybeRef,
  FormState,
  FormValidationResult,
  PrivateFieldContext,
  PrivateFormContext,
  FormContext,
  FormErrors,
  FormErrorBag,
  SchemaValidationMode,
  RawFormSchema,
  ValidationOptions,
  FieldPathLookup,
  PrivateFieldArrayContext,
  InvalidSubmissionHandler,
} from './types';
import {
  getFromPath,
  isYupValidator,
  keysOf,
  resolveNextCheckboxValue,
  setInPath,
  unsetPath,
  isFormSubmitEvent,
  debounceAsync,
} from './utils';
import { FormContextKey } from './symbols';
import { validateYupSchema, validateObjectSchema } from './validate';
import { refreshInspector, registerFormWithDevTools } from './devtools';

interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?: MaybeRef<
    Record<keyof TValues, GenericValidateFunction | string | Record<string, any>> | SchemaOf<TValues> | undefined
  >;
  initialValues?: MaybeRef<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>;
  initialTouched?: Record<keyof TValues, boolean>;
  validateOnMount?: boolean;
}

let FORM_COUNTER = 0;

export function useForm<TValues extends Record<string, any> = Record<string, any>>(
  opts?: FormOptions<TValues>
): FormContext<TValues> {
  const formId = FORM_COUNTER++;

  // A lookup containing fields or field groups
  const fieldsByPath: Ref<FieldPathLookup<TValues>> = ref({} as any);

  // If the form is currently submitting
  const isSubmitting = ref(false);

  // The number of times the user tried to submit the form
  const submitCount = ref(0);

  // dictionary for field arrays to receive various signals like reset
  const fieldArraysLookup: Record<string, PrivateFieldArrayContext> = {};

  // a private ref for all form values
  const formValues = reactive(deepCopy(unref(opts?.initialValues) || {})) as TValues;

  // the source of errors for the form fields
  const { errorBag, setErrorBag, setFieldErrorBag } = useErrorBag(opts?.initialErrors);

  // Gets the first error of each field
  const errors = computed<FormErrors<TValues>>(() => {
    return keysOf(errorBag.value).reduce((acc, key) => {
      const bag = errorBag.value[key];
      if (bag && bag.length) {
        acc[key] = bag[0];
      }

      return acc;
    }, {} as FormErrors<TValues>);
  });

  function getFirstFieldAtPath(path: string): PrivateFieldContext<unknown> | undefined {
    const fieldOrGroup = fieldsByPath.value[path];

    return Array.isArray(fieldOrGroup) ? fieldOrGroup[0] : fieldOrGroup;
  }

  function fieldExists(path: string) {
    return !!fieldsByPath.value[path];
  }

  /**
   * Holds a computed reference to all fields names and labels
   */
  const fieldNames = computed(() => {
    return keysOf(fieldsByPath.value).reduce((names, path) => {
      const field = getFirstFieldAtPath(path as string);
      if (field) {
        names[path as string] = unref(field.label || field.name) || '';
      }

      return names;
    }, {} as Record<string, string>);
  });

  const fieldBailsMap = computed(() => {
    return keysOf(fieldsByPath.value).reduce((map, path) => {
      const field = getFirstFieldAtPath(path as string);
      if (field) {
        map[path as string] = field.bails ?? true;
      }

      return map;
    }, {} as Record<string, boolean>);
  });

  // mutable non-reactive reference to initial errors
  // we need this to process initial errors then unset them
  const initialErrors = { ...(opts?.initialErrors || {}) };

  // initial form values
  const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues<TValues>(
    fieldsByPath,
    formValues,
    opts?.initialValues
  );

  // form meta aggregations
  const meta = useFormMeta(fieldsByPath, formValues, initialValues, errors);

  const schema = opts?.validationSchema;
  const formCtx: PrivateFormContext<TValues> = {
    formId,
    fieldsByPath,
    values: formValues,
    errorBag,
    errors,
    schema,
    submitCount,
    meta,
    isSubmitting,
    fieldArraysLookup,
    validateSchema: unref(schema) ? validateSchema : undefined,
    validate,
    register: registerField,
    unregister: unregisterField,
    setFieldErrorBag,
    validateField,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    setTouched,
    resetForm,
    handleSubmit,
    stageInitialValue,
    unsetInitialValue,
    setFieldInitialValue,
  };

  function isFieldGroup(
    fieldOrGroup: PrivateFieldContext | PrivateFieldContext[]
  ): fieldOrGroup is PrivateFieldContext[] {
    return Array.isArray(fieldOrGroup);
  }

  function applyFieldMutation(
    fieldOrGroup: PrivateFieldContext | PrivateFieldContext[],
    mutation: (f: PrivateFieldContext) => unknown
  ) {
    if (Array.isArray(fieldOrGroup)) {
      return fieldOrGroup.forEach(mutation);
    }

    return mutation(fieldOrGroup);
  }

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: keyof TValues, message: string | string[] | undefined) {
    setFieldErrorBag(field, message);
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrors(fields: Partial<Record<keyof TValues, string | string[] | undefined>>) {
    setErrorBag(fields);
  }

  /**
   * Sets a single field value
   */
  function setFieldValue<T extends keyof TValues = string>(
    field: T,
    value: TValues[T] | undefined,
    { force } = { force: false }
  ) {
    const fieldInstance = fieldsByPath.value[field];
    const clonedValue = deepCopy(value);
    // field wasn't found, create a virtual field as a placeholder
    if (!fieldInstance) {
      setInPath(formValues, field as string, clonedValue);
      return;
    }

    // Multiple checkboxes, and only one of them got updated
    if (isFieldGroup(fieldInstance) && fieldInstance[0]?.type === 'checkbox' && !Array.isArray(value)) {
      const newValue = deepCopy(
        resolveNextCheckboxValue(getFromPath(formValues, field as string) || [], value, undefined)
      );

      setInPath(formValues, field as string, newValue);
      return;
    }

    let newValue = value;
    // Single Checkbox: toggles the field value unless the field is being reset then force it
    if (!isFieldGroup(fieldInstance) && fieldInstance.type === 'checkbox' && !force) {
      newValue = deepCopy(
        resolveNextCheckboxValue<TValues[T]>(
          getFromPath<TValues[T]>(formValues, field as string) as TValues[T],
          value as TValues[T],
          unref(fieldInstance.uncheckedValue) as TValues[T]
        )
      );
    }

    setInPath(formValues, field as string, newValue);
  }

  /**
   * Sets multiple fields values
   */
  function setValues(fields: Partial<TValues>) {
    // clean up old values
    keysOf(formValues).forEach(key => {
      delete formValues[key];
    });

    // set up new values
    keysOf(fields).forEach(path => {
      setFieldValue(path, fields[path]);
    });

    // regenerate the arrays when the form values change
    Object.values(fieldArraysLookup).forEach(f => f && f.reset());
  }

  /**
   * Sets the touched meta state on a field
   */
  function setFieldTouched(field: keyof TValues, isTouched: boolean) {
    const fieldInstance = fieldsByPath.value[field];

    if (fieldInstance) {
      applyFieldMutation(fieldInstance, f => f.setTouched(isTouched));
    }
  }

  /**
   * Sets the touched meta state on multiple fields
   */
  function setTouched(fields: Partial<Record<keyof TValues, boolean>>) {
    keysOf(fields).forEach(field => {
      setFieldTouched(field, !!fields[field]);
    });
  }

  /**
   * Resets all fields
   */
  function resetForm(state?: Partial<FormState<TValues>>) {
    // set initial values if provided
    if (state?.values) {
      setInitialValues(state.values);
      setValues(state?.values);
    } else {
      // clean up the initial values back to the original
      setInitialValues(originalInitialValues.value);
      // otherwise clean the current values
      setValues(originalInitialValues.value);
    }

    Object.values(fieldsByPath.value).forEach(field => {
      if (!field) {
        return;
      }

      applyFieldMutation(field, f => f.resetField());
    });

    if (state?.touched) {
      setTouched(state.touched);
    }

    setErrors(state?.errors || {});
    submitCount.value = state?.submitCount || 0;
  }

  function insertFieldAtPath(field: PrivateFieldContext, path: string) {
    const rawField = markRaw(field);
    const fieldPath: keyof TValues = path;

    // first field at that path
    if (!fieldsByPath.value[fieldPath]) {
      fieldsByPath.value[fieldPath] = rawField;
      return;
    }

    const fieldAtPath = fieldsByPath.value[fieldPath];
    if (fieldAtPath && !Array.isArray(fieldAtPath)) {
      fieldsByPath.value[fieldPath] = [fieldAtPath];
    }

    // add the new array to that path
    fieldsByPath.value[fieldPath] = [...(fieldsByPath.value[fieldPath] as PrivateFieldContext[]), rawField];
  }

  function removeFieldFromPath(field: PrivateFieldContext, path: string) {
    const fieldPath: keyof TValues = path;
    const fieldAtPath = fieldsByPath.value[fieldPath];
    if (!fieldAtPath) {
      return;
    }

    // same field at path
    if (!isFieldGroup(fieldAtPath) && field.id === fieldAtPath.id) {
      delete fieldsByPath.value[fieldPath];
      return;
    }

    if (isFieldGroup(fieldAtPath)) {
      const idx = fieldAtPath.findIndex(f => f.id === field.id);
      if (idx === -1) {
        return;
      }

      fieldAtPath.splice(idx, 1);

      if (fieldAtPath.length === 1) {
        fieldsByPath.value[fieldPath] = fieldAtPath[0];
        return;
      }

      if (!fieldAtPath.length) {
        delete fieldsByPath.value[fieldPath];
      }
    }
  }

  function registerField(field: PrivateFieldContext) {
    const fieldPath = unref(field.name);
    insertFieldAtPath(field, fieldPath);

    if (isRef(field.name)) {
      // ensures when a field's name was already taken that it preserves its same value
      // necessary for fields generated by loops
      watch(field.name, async (newPath, oldPath) => {
        // cache the value
        await nextTick();
        removeFieldFromPath(field, oldPath);
        insertFieldAtPath(field, newPath);

        // re-validate if either path had errors before
        if (errors.value[oldPath] || errors.value[newPath]) {
          validateField(newPath);
        }

        // clean up the old path if no other field is sharing that name
        // #3325
        await nextTick();
        if (!fieldExists(oldPath)) {
          unsetPath(formValues, oldPath);
        }
      });
    }

    // if field already had errors (initial errors) that's not user-set, validate it again to ensure state is correct
    // the difference being that `initialErrors` will contain the error message while other errors (pre-validated schema) won't have them as initial errors
    // #3342
    const initialErrorMessage = unref(field.errorMessage);
    if (initialErrorMessage && initialErrors?.[fieldPath] !== initialErrorMessage) {
      validateField(fieldPath);
    }

    // marks the initial error as "consumed" so it won't be matched later with same non-initial error
    delete initialErrors[fieldPath];
  }

  function unregisterField(field: PrivateFieldContext<unknown>) {
    const fieldName = unref(field.name);
    removeFieldFromPath(field, fieldName);

    nextTick(() => {
      // clears a field error on unmounted
      // we wait till next tick to make sure if the field is completely removed and doesn't have any siblings like checkboxes
      // #3384
      if (!fieldExists(fieldName)) {
        setFieldError(fieldName, undefined);
        unsetPath(formValues, fieldName);
      }
    });
  }

  async function validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues>> {
    if (formCtx.validateSchema) {
      return formCtx.validateSchema(opts?.mode || 'force');
    }

    // No schema, each field is responsible to validate itself
    const validations = await Promise.all(
      Object.values(fieldsByPath.value).map(field => {
        const fieldInstance: PrivateFieldContext | undefined = Array.isArray(field) ? field[0] : field;
        if (!fieldInstance) {
          return Promise.resolve({ key: '', valid: true, errors: [] });
        }

        return fieldInstance.validate(opts).then((result: ValidationResult) => {
          return {
            key: unref(fieldInstance.name),
            valid: result.valid,
            errors: result.errors,
          };
        });
      })
    );

    const results: Partial<Record<keyof TValues, ValidationResult>> = {};
    const errors: Partial<Record<keyof TValues, string>> = {};
    for (const validation of validations) {
      results[validation.key as keyof TValues] = {
        valid: validation.valid,
        errors: validation.errors,
      };

      if (validation.errors.length) {
        errors[validation.key as keyof TValues] = validation.errors[0];
      }
    }

    return {
      valid: validations.every(r => r.valid),
      results,
      errors,
    };
  }

  async function validateField(field: keyof TValues): Promise<ValidationResult> {
    const fieldInstance = fieldsByPath.value[field];
    if (!fieldInstance) {
      warn(`field with name ${field} was not found`);

      return Promise.resolve({ errors: [], valid: true });
    }

    if (Array.isArray(fieldInstance)) {
      return fieldInstance.map(f => f.validate())[0];
    }

    return fieldInstance.validate();
  }

  function handleSubmit<TReturn = unknown>(
    fn?: SubmissionHandler<TValues, TReturn>,
    onValidationError?: InvalidSubmissionHandler<TValues>
  ) {
    return function submissionHandler(e: unknown) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Touch all fields
      setTouched(
        keysOf(fieldsByPath.value).reduce((acc, field) => {
          acc[field] = true;

          return acc;
        }, {} as Record<keyof TValues, boolean>)
      );

      isSubmitting.value = true;
      submitCount.value++;
      return validate()
        .then(result => {
          if (result.valid && typeof fn === 'function') {
            return fn(deepCopy(formValues), {
              evt: e as Event,
              setErrors,
              setFieldError,
              setTouched,
              setFieldTouched,
              setValues,
              setFieldValue,
              resetForm,
            });
          }

          if (!result.valid && typeof onValidationError === 'function') {
            onValidationError({
              values: deepCopy(formValues),
              evt: e as Event,
              errors: result.errors,
              results: result.results,
            });
          }
        })
        .then(
          returnVal => {
            isSubmitting.value = false;

            return returnVal;
          },
          err => {
            isSubmitting.value = false;

            // re-throw the err so it doesn't go silent
            throw err;
          }
        );
    };
  }

  function setFieldInitialValue(path: string, value: unknown) {
    setInPath(initialValues.value, path, deepCopy(value));
  }

  function unsetInitialValue(path: string) {
    unsetPath(initialValues.value, path);
  }

  /**
   * Sneaky function to set initial field values
   */
  function stageInitialValue(path: string, value: unknown) {
    setInPath(formValues, path, value);
    setFieldInitialValue(path, value);
  }

  async function _validateSchema(): Promise<FormValidationResult<TValues>> {
    const schemaValue = unref(schema);
    if (!schemaValue) {
      return { valid: true, results: {}, errors: {} };
    }

    const formResult = isYupValidator(schemaValue)
      ? await validateYupSchema(schemaValue, formValues)
      : await validateObjectSchema(schemaValue as RawFormSchema<TValues>, formValues, {
          names: fieldNames.value,
          bailsMap: fieldBailsMap.value,
        });

    return formResult;
  }

  /**
   * Batches validation runs in 5ms batches
   */
  const debouncedSchemaValidation = debounceAsync(_validateSchema, 5);

  async function validateSchema(mode: SchemaValidationMode): Promise<FormValidationResult<TValues>> {
    const formResult = await debouncedSchemaValidation();

    // fields by id lookup
    const fieldsById = formCtx.fieldsByPath.value || {};
    // errors fields names, we need it to also check if custom errors are updated
    const currentErrorsPaths = keysOf(formCtx.errorBag.value);
    // collect all the keys from the schema and all fields
    // this ensures we have a complete keymap of all the fields
    const paths = [
      ...new Set([...keysOf(formResult.results), ...keysOf(fieldsById), ...currentErrorsPaths]),
    ] as string[];

    // aggregates the paths into a single result object while applying the results on the fields
    return paths.reduce(
      (validation, path) => {
        const field = fieldsById[path];
        const messages = (formResult.results[path] || { errors: [] as string[] }).errors;
        const fieldResult = {
          errors: messages,
          valid: !messages.length,
        };
        validation.results[path as keyof TValues] = fieldResult;
        if (!fieldResult.valid) {
          validation.errors[path as keyof TValues] = fieldResult.errors[0];
        }

        // field not rendered
        if (!field) {
          setFieldError(path, messages);

          return validation;
        }

        // always update the valid flag regardless of the mode
        applyFieldMutation(field, f => (f.meta.valid = fieldResult.valid));
        if (mode === 'silent') {
          return validation;
        }

        const wasValidated = Array.isArray(field) ? field.some(f => f.meta.validated) : field.meta.validated;
        if (mode === 'validated-only' && !wasValidated) {
          return validation;
        }

        applyFieldMutation(field, f => f.setState({ errors: fieldResult.errors }));

        return validation;
      },
      { valid: formResult.valid, results: {}, errors: {} } as FormValidationResult<TValues>
    );
  }

  const submitForm = handleSubmit((_, { evt }) => {
    if (isFormSubmitEvent(evt)) {
      evt.target.submit();
    }
  });

  // Trigger initial validation
  onMounted(() => {
    if (opts?.initialErrors) {
      setErrors(opts.initialErrors);
    }

    if (opts?.initialTouched) {
      setTouched(opts.initialTouched);
    }

    // if validate on mount was enabled
    if (opts?.validateOnMount) {
      validate();
      return;
    }

    // otherwise run initial silent validation through schema if available
    // the useField should skip their own silent validation if a yup schema is present
    if (formCtx.validateSchema) {
      formCtx.validateSchema('silent');
    }
  });

  if (isRef(schema)) {
    watch(schema, () => {
      formCtx.validateSchema?.('validated-only');
    });
  }

  // Provide injections
  provide(FormContextKey, formCtx as PrivateFormContext);

  if (__DEV__) {
    registerFormWithDevTools(formCtx as PrivateFormContext);
    watch(
      () => ({
        errors: errorBag.value,
        ...meta.value,
        values: formValues,
        isSubmitting: isSubmitting.value,
        submitCount: submitCount.value,
      }),
      refreshInspector,
      {
        deep: true,
      }
    );
  }

  return {
    errors,
    meta,
    values: formValues,
    isSubmitting,
    submitCount,
    validate,
    validateField,
    handleReset: () => resetForm(),
    resetForm,
    handleSubmit,
    submitForm,
    setFieldError,
    setErrors,
    setFieldValue,
    setValues,
    setFieldTouched,
    setTouched,
  };
}

/**
 * Manages form meta aggregation
 */
function useFormMeta<TValues extends Record<string, unknown>>(
  fieldsByPath: Ref<FieldPathLookup<TValues>>,
  currentValues: TValues,
  initialValues: MaybeRef<TValues>,
  errors: Ref<FormErrors<TValues>>
) {
  const MERGE_STRATEGIES: Record<keyof Pick<FieldMeta<unknown>, 'touched' | 'pending' | 'valid'>, 'every' | 'some'> = {
    touched: 'some',
    pending: 'some',
    valid: 'every',
  };

  const isDirty = computed(() => {
    return !isEqual(currentValues, unref(initialValues));
  });

  const flags = computed(() => {
    const fields = Object.values(fieldsByPath.value).flat(1).filter(Boolean) as PrivateFieldContext[];

    return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields[mergeMethod](field => field.meta[flag]);

      return acc;
    }, {} as Record<keyof Omit<FieldMeta<unknown>, 'initialValue'>, boolean>);
  });

  return computed(() => {
    return {
      initialValues: unref(initialValues) as TValues,
      ...flags.value,
      valid: flags.value.valid && !keysOf(errors.value as any).length,
      dirty: isDirty.value,
    };
  });
}

/**
 * Manages the initial values prop
 */
function useFormInitialValues<TValues extends Record<string, any>>(
  fields: Ref<FieldPathLookup<TValues>>,
  formValues: TValues,
  providedValues?: MaybeRef<TValues>
) {
  // these are the mutable initial values as the fields are mounted/unmounted
  const initialValues = ref<TValues>(deepCopy(unref(providedValues) as TValues) || ({} as TValues));
  // these are the original initial value as provided by the user initially, they don't keep track of conditional fields
  // this is important because some conditional fields will overwrite the initial values for other fields who had the same name
  // like array fields, any push/insert operation will overwrite the initial values because they "create new fields"
  // so these are the values that the reset function should use
  // these only change when the user explicitly chanegs the initial values or when the user resets them with new values.
  const originalInitialValues = ref<TValues>(deepCopy(unref(providedValues) as TValues) || ({} as TValues));

  function setInitialValues(values: Partial<TValues>, updateFields = false) {
    initialValues.value = deepCopy(values);
    originalInitialValues.value = deepCopy(values);

    if (!updateFields) {
      return;
    }

    // update the pristine non-touched fields
    // those are excluded because it's unlikely you want to change the form values using initial values
    // we mostly watch them for API population or newly inserted fields
    // if the user API is taking too much time before user interaction they should consider disabling or hiding their inputs until the values are ready
    keysOf(fields.value).forEach(fieldPath => {
      const field = fields.value[fieldPath];
      const wasTouched = Array.isArray(field) ? field.some(f => f.meta.touched) : field?.meta.touched;
      if (!field || wasTouched) {
        return;
      }

      const newValue = getFromPath(initialValues.value, fieldPath as string);
      setInPath(formValues, fieldPath as string, deepCopy(newValue));
    });
  }

  if (isRef(providedValues)) {
    watch(
      providedValues,
      value => {
        setInitialValues(value, true);
      },
      {
        deep: true,
      }
    );
  }

  return {
    initialValues,
    originalInitialValues,
    setInitialValues,
  };
}

function useErrorBag<TValues extends Record<string, any>>(initialErrors?: FormErrors<TValues>) {
  const errorBag: Ref<FormErrorBag<TValues>> = ref({});

  function normalizeErrorItem(message: string | string[]) {
    return Array.isArray(message) ? message : message ? [message] : [];
  }

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldErrorBag(field: keyof TValues, message: string | undefined | string[]) {
    if (!message) {
      delete errorBag.value[field];
      return;
    }

    errorBag.value[field] = normalizeErrorItem(message);
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrorBag(fields: Partial<Record<keyof TValues, string | string[] | undefined>>) {
    errorBag.value = keysOf(fields).reduce((acc, key) => {
      const message = fields[key] as string | string[] | undefined;
      if (message) {
        acc[key] = normalizeErrorItem(message);
      }

      return acc;
    }, {} as FormErrorBag<TValues>);
  }

  if (initialErrors) {
    setErrorBag(initialErrors);
  }

  return {
    errorBag,
    setErrorBag,
    setFieldErrorBag,
  };
}
