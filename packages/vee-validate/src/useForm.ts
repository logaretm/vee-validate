import {
  computed,
  ref,
  Ref,
  provide,
  reactive,
  onMounted,
  isRef,
  watch,
  unref,
  nextTick,
  warn,
  markRaw,
  watchEffect,
} from 'vue';
import { klona as deepCopy } from 'klona/full';
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
  MapValues,
  FieldState,
  GenericFormValues,
  TypedSchema,
  YupSchema,
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
  isEmptyContainer,
  withLatest,
  isEqual,
  isTypedSchema,
} from './utils';
import { FormContextKey } from './symbols';
import { validateTypedSchema, validateObjectSchema } from './validate';
import { refreshInspector, registerFormWithDevTools } from './devtools';
import { _useFieldValue } from './useFieldState';
import { isCallable } from '../../shared';

export interface FormOptions<TValues extends GenericFormValues, TOutput extends TValues = TValues> {
  validationSchema?: MaybeRef<
    | YupSchema<TValues>
    | TypedSchema<TValues, TOutput>
    | Record<keyof TValues, GenericValidateFunction | string | GenericFormValues>
    | undefined
  >;
  initialValues?: MaybeRef<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>;
  initialTouched?: Record<keyof TValues, boolean>;
  validateOnMount?: boolean;
  keepValuesOnUnmount?: MaybeRef<boolean>;
}

let FORM_COUNTER = 0;

function resolveInitialValues<TValues extends GenericFormValues = GenericFormValues>(
  opts?: FormOptions<TValues>
): TValues {
  const providedValues = unref(opts?.initialValues) || {};
  if (opts?.validationSchema && isTypedSchema(opts.validationSchema) && isCallable(opts.validationSchema.cast)) {
    return deepCopy(opts.validationSchema.cast(providedValues));
  }

  return deepCopy(providedValues) as TValues;
}

export function useForm<TValues extends GenericFormValues = GenericFormValues, TOutput extends TValues = TValues>(
  opts?: FormOptions<TValues, TOutput>
): FormContext<TValues, TOutput> {
  const formId = FORM_COUNTER++;

  const controlledModelPaths: Set<string> = new Set();

  // Prevents fields from double resetting their values, which causes checkboxes to toggle their initial value
  // TODO: This won't be needed if we centralize all the state inside the `form` for form inputs
  let RESET_LOCK = false;

  // A lookup containing fields or field groups
  const fieldsByPath: Ref<FieldPathLookup<TValues>> = ref({} as any);

  // If the form is currently submitting
  const isSubmitting = ref(false);

  // The number of times the user tried to submit the form
  const submitCount = ref(0);

  // field arrays managed by this form
  const fieldArrays: PrivateFieldArrayContext[] = [];

  // a private ref for all form values
  const formValues = reactive(resolveInitialValues(opts));

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
        names[path as string] = { name: unref(field.name) || '', label: unref(field.label) || '' };
      }

      return names;
    }, {} as Record<string, { name: string; label: string }>);
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

  const keepValuesOnUnmount = opts?.keepValuesOnUnmount ?? false;

  // initial form values
  const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues<TValues>(
    fieldsByPath,
    formValues,
    opts
  );

  // form meta aggregations
  const meta = useFormMeta(fieldsByPath, formValues, originalInitialValues, errors);

  const controlledValues = computed(() => {
    return [...controlledModelPaths, ...keysOf(fieldsByPath.value)].reduce((acc, path) => {
      const value = getFromPath(formValues, path as string);
      setInPath(acc, path as string, value);

      return acc;
    }, {} as TValues);
  });

  const schema = opts?.validationSchema;

  /**
   * Batches validation runs in 5ms batches
   * Must have two distinct batch queues to make sure they don't override each other settings #3783
   */
  const debouncedSilentValidation = debounceAsync(_validateSchema, 5);
  const debouncedValidation = debounceAsync(_validateSchema, 5);

  const validateSchema = withLatest(
    async (mode: SchemaValidationMode) => {
      return (await mode) === 'silent' ? debouncedSilentValidation() : debouncedValidation();
    },
    (formResult, [mode]) => {
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
  );

  function makeSubmissionFactory(onlyControlled: boolean) {
    return function submitHandlerFactory<TReturn = unknown>(
      fn?: SubmissionHandler<TValues, TOutput, TReturn>,
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
            const values = deepCopy(formValues) as TOutput;

            if (result.valid && typeof fn === 'function') {
              const controlled = deepCopy(controlledValues.value) as TOutput;
              let submittedValues = onlyControlled ? controlled : values;
              if (result.values) {
                submittedValues = result.values;
              }

              return fn(submittedValues, {
                evt: e as Event,
                controlledValues: controlled,
                setErrors,
                setFieldError,
                setTouched,
                setFieldTouched,
                setValues,
                setFieldValue,
                resetForm,
                resetField,
              });
            }

            if (!result.valid && typeof onValidationError === 'function') {
              onValidationError({
                values,
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
    };
  }

  const handleSubmitImpl = makeSubmissionFactory(false);
  const handleSubmit: typeof handleSubmitImpl & { withControlled: typeof handleSubmitImpl } = handleSubmitImpl as any;
  handleSubmit.withControlled = makeSubmissionFactory(true);

  const formCtx: PrivateFormContext<TValues, TOutput> = {
    formId,
    fieldsByPath,
    values: formValues,
    controlledValues,
    errorBag,
    errors,
    schema,
    submitCount,
    meta,
    isSubmitting,
    fieldArrays,
    keepValuesOnUnmount,
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
    resetField,
    handleSubmit,
    stageInitialValue,
    unsetInitialValue,
    setFieldInitialValue,
    useFieldModel,
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

  function mutateAllFields(mutation: (f: PrivateFieldContext) => unknown) {
    Object.values(fieldsByPath.value).forEach(field => {
      if (!field) {
        return;
      }

      // avoid resetting the field values, because they should've been reset already.
      applyFieldMutation(field, mutation);
    });
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

    if (isFieldGroup(fieldInstance) && fieldInstance[0]?.type === 'checkbox' && !Array.isArray(value)) {
      // Multiple checkboxes, and only one of them got updated
      const newValue = deepCopy(
        resolveNextCheckboxValue(getFromPath(formValues, field as string) || [], value, undefined)
      );

      setInPath(formValues, field as string, newValue);
      return;
    }

    let newValue = clonedValue;
    // Single Checkbox: toggles the field value unless the field is being reset then force it
    if (!isFieldGroup(fieldInstance) && fieldInstance.type === 'checkbox' && !force && !RESET_LOCK) {
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
    fieldArrays.forEach(f => f && f.reset());
  }

  function createModel<TPath extends keyof TValues>(path: MaybeRef<TPath>) {
    const { value } = _useFieldValue<TValues[TPath]>(path as string, undefined, formCtx as PrivateFormContext);
    watch(
      value,
      () => {
        if (!fieldExists(unref(path as string))) {
          validate({ mode: 'validated-only' });
        }
      },
      {
        deep: true,
      }
    );

    controlledModelPaths.add(unref(path) as string);

    return value;
  }

  function useFieldModel<TPath extends keyof TValues>(path: MaybeRef<TPath>): Ref<TValues[TPath]>;
  function useFieldModel<TPath extends keyof TValues>(paths: [...TPath[]]): MapValues<typeof paths, TValues>;
  function useFieldModel<TPath extends keyof TValues>(path: MaybeRef<TPath> | [...MaybeRef<TPath>[]]) {
    if (!Array.isArray(path)) {
      return createModel<TPath>(path);
    }

    return path.map(createModel) as MapValues<typeof path, TValues>;
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

  function resetField(field: keyof TValues, state?: Partial<FieldState>) {
    const fieldInstance = fieldsByPath.value[field];

    if (fieldInstance) {
      applyFieldMutation(fieldInstance, f => f.resetField(state));
    }
  }

  /**
   * Resets all fields
   */
  function resetForm(state?: Partial<FormState<TValues>>) {
    RESET_LOCK = true;

    // Reset all field states first
    mutateAllFields(f => f.resetField());

    // reset values
    const newValues = state?.values ? state.values : originalInitialValues.value;
    setInitialValues(newValues);
    setValues(newValues);

    if (state?.touched) {
      setTouched(state.touched);
    }

    setErrors(state?.errors || {});
    submitCount.value = state?.submitCount || 0;
    nextTick(() => {
      RESET_LOCK = false;
    });
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
          // clear up both paths errors
          setFieldError(oldPath, undefined);
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
    const fieldInstance = fieldsByPath.value[fieldName];
    const isGroup = !!fieldInstance && isFieldGroup(fieldInstance);
    removeFieldFromPath(field, fieldName);

    // clears a field error on unmounted
    // we wait till next tick to make sure if the field is completely removed and doesn't have any siblings like checkboxes
    nextTick(() => {
      const shouldKeepValue = unref(field.keepValueOnUnmount) ?? unref(keepValuesOnUnmount);
      const currentGroupValue = getFromPath(formValues, fieldName);
      // The boolean here is we check if the field still belongs to the same control group with that name
      // if another group claimed the name, we should avoid handling it since it is no longer the same group
      // this happens with `v-for` over some checkboxes and field arrays.
      // also if the group no longer exist we can assume this group was the last one that controlled it
      const isSameGroup =
        isGroup && (fieldInstance === fieldsByPath.value[fieldName] || !fieldsByPath.value[fieldName]);

      // group field that still has a dangling value, the field may exist or not after it was removed.
      // This used to be handled in the useField composable but the form has better context on when it should/not happen.
      // if it does belong to it that means the group still exists
      // #3844
      if (isSameGroup && !shouldKeepValue) {
        if (Array.isArray(currentGroupValue)) {
          const valueIdx = currentGroupValue.findIndex(i => isEqual(i, unref(field.checkedValue)));
          if (valueIdx > -1) {
            const newVal = [...currentGroupValue];
            newVal.splice(valueIdx, 1);
            setFieldValue(fieldName, newVal as any, { force: true });
          }
        } else if (currentGroupValue === unref(field.checkedValue)) {
          // Remove field if it is a group but does not have an array value, like for radio inputs #3963
          unsetPath(formValues, fieldName);
        }
      }

      // Field was removed entirely, we should unset its path
      // #3384
      if (!fieldExists(fieldName)) {
        setFieldError(fieldName, undefined);

        // Checks if the field was configured to be unset during unmount or not
        // Checks both the form-level config and field-level one
        // Field has the priority if it is set, otherwise it goes to the form settings
        if (shouldKeepValue) {
          return;
        }

        // Don't apply emptyContainer check unless the current group value is an array
        if (isGroup && Array.isArray(currentGroupValue) && !isEmptyContainer(currentGroupValue)) {
          return;
        }

        unsetPath(formValues, fieldName);
      }
    });
  }

  async function validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues, TOutput>> {
    const mode = opts?.mode || 'force';
    if (mode === 'force') {
      mutateAllFields(f => (f.meta.validated = true));
    }

    if (formCtx.validateSchema) {
      return formCtx.validateSchema(mode);
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
      warn(`field with name ${field as string} was not found`);

      return Promise.resolve({ errors: [], valid: true });
    }

    if (Array.isArray(fieldInstance)) {
      return fieldInstance.map(f => f.validate())[0];
    }

    return fieldInstance.validate();
  }

  function unsetInitialValue(path: string) {
    unsetPath(initialValues.value, path);
  }

  /**
   * Sneaky function to set initial field values
   */
  function stageInitialValue(path: string, value: unknown, updateOriginal = false) {
    setInPath(formValues, path, value);
    setFieldInitialValue(path, value);
    if (updateOriginal && !opts?.initialValues) {
      setInPath(originalInitialValues.value, path, deepCopy(value));
    }
  }

  function setFieldInitialValue(path: string, value: unknown) {
    setInPath(initialValues.value, path, deepCopy(value));
  }

  async function _validateSchema(): Promise<FormValidationResult<TValues, TOutput>> {
    const schemaValue = unref(schema);
    if (!schemaValue) {
      return { valid: true, results: {}, errors: {} };
    }

    const formResult =
      isYupValidator(schemaValue) || isTypedSchema(schemaValue)
        ? await validateTypedSchema<TValues, TOutput>(schemaValue, formValues)
        : await validateObjectSchema<TValues, TOutput>(schemaValue as RawFormSchema<TValues>, formValues, {
            names: fieldNames.value,
            bailsMap: fieldBailsMap.value,
          });

    return formResult;
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
    ...formCtx,
    handleReset: () => resetForm(),
    submitForm,
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

  function calculateFlags() {
    const fields = Object.values(fieldsByPath.value).flat(1).filter(Boolean) as PrivateFieldContext[];

    return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields[mergeMethod](field => field.meta[flag]);

      return acc;
    }, {} as Record<keyof Omit<FieldMeta<unknown>, 'initialValue'>, boolean>);
  }

  const flags = reactive(calculateFlags());
  watchEffect(() => {
    const value = calculateFlags();
    flags.touched = value.touched;
    flags.valid = value.valid;
    flags.pending = value.pending;
  });

  return computed(() => {
    return {
      initialValues: unref(initialValues) as TValues,
      ...flags,
      valid: flags.valid && !keysOf(errors.value as any).length,
      dirty: isDirty.value,
    };
  });
}

/**
 * Manages the initial values prop
 */
function useFormInitialValues<TValues extends GenericFormValues>(
  fields: Ref<FieldPathLookup<TValues>>,
  formValues: TValues,
  opts?: FormOptions<TValues>
) {
  const values = resolveInitialValues(opts);
  const providedValues = opts?.initialValues;
  // these are the mutable initial values as the fields are mounted/unmounted
  const initialValues = ref<TValues>(values);
  // these are the original initial value as provided by the user initially, they don't keep track of conditional fields
  // this is important because some conditional fields will overwrite the initial values for other fields who had the same name
  // like array fields, any push/insert operation will overwrite the initial values because they "create new fields"
  // so these are the values that the reset function should use
  // these only change when the user explicitly changes the initial values or when the user resets them with new values.
  const originalInitialValues = ref<TValues>(deepCopy(values));

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

function useErrorBag<TValues extends GenericFormValues>(initialErrors?: FormErrors<TValues>) {
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
