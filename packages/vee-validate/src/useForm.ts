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
  watchEffect,
  shallowRef,
  readonly,
  toValue,
  MaybeRef,
  MaybeRefOrGetter,
} from 'vue';
import { PartialDeep } from 'type-fest';
import { klona as deepCopy } from 'klona/full';
import {
  FieldMeta,
  SubmissionHandler,
  GenericValidateFunction,
  ValidationResult,
  FormState,
  FormValidationResult,
  PrivateFormContext,
  FormContext,
  FormErrors,
  FormErrorBag,
  SchemaValidationMode,
  RawFormSchema,
  ValidationOptions,
  PrivateFieldArrayContext,
  InvalidSubmissionHandler,
  FieldState,
  GenericObject,
  TypedSchema,
  Path,
  FlattenAndSetPathsType,
  PathValue,
  PathState,
  PathStateConfig,
  BaseFieldProps,
  InputBindsConfig,
  LazyInputBindsConfig,
  ResetFormOpts,
  MapValuesPathsToRefs,
  ComponentBindsConfig,
  LazyComponentBindsConfig,
} from './types';
import {
  getFromPath,
  isYupValidator,
  keysOf,
  setInPath,
  unsetPath,
  isFormSubmitEvent,
  debounceAsync,
  withLatest,
  isEqual,
  isTypedSchema,
  normalizeErrorItem,
  omit,
  debounceNextTick,
  normalizeEventValue,
} from './utils';
import { FormContextKey } from './symbols';
import { validateTypedSchema, validateObjectSchema } from './validate';
import { refreshInspector, registerFormWithDevTools } from './devtools';
import { isCallable, merge, normalizeFormPath } from '../../shared';
import { getConfig } from './config';

type FormSchema<TValues extends Record<string, unknown>> =
  | FlattenAndSetPathsType<TValues, GenericValidateFunction | string | GenericObject>
  | undefined;

export interface FormOptions<
  TValues extends GenericObject,
  TOutput = TValues,
  TSchema extends TypedSchema<TValues, TOutput> | FormSchema<TValues> =
    | FormSchema<TValues>
    | TypedSchema<TValues, TOutput>,
> {
  validationSchema?: MaybeRef<TSchema extends TypedSchema ? TypedSchema<TValues, TOutput> : any>;
  initialValues?: PartialDeep<TValues> | undefined | null;
  initialErrors?: FlattenAndSetPathsType<TValues, string | undefined>;
  initialTouched?: FlattenAndSetPathsType<TValues, boolean>;
  validateOnMount?: boolean;
  keepValuesOnUnmount?: MaybeRef<boolean>;
}

let FORM_COUNTER = 0;

const PRIVATE_PATH_STATE_KEYS: (keyof PathState)[] = ['bails', 'fieldsCount', 'id', 'multiple', 'type', 'validate'];

function resolveInitialValues<TValues extends GenericObject = GenericObject>(opts?: FormOptions<TValues>): TValues {
  const providedValues = { ...toValue(opts?.initialValues || {}) };
  const schema = unref(opts?.validationSchema);
  if (schema && isTypedSchema(schema) && isCallable(schema.cast)) {
    return deepCopy(schema.cast(providedValues) || {});
  }

  return deepCopy(providedValues) as TValues;
}

export function useForm<
  TValues extends GenericObject = GenericObject,
  TOutput = TValues,
  TSchema extends FormSchema<TValues> | TypedSchema<TValues, TOutput> =
    | FormSchema<TValues>
    | TypedSchema<TValues, TOutput>,
>(opts?: FormOptions<TValues, TOutput, TSchema>): FormContext<TValues, TOutput> {
  const formId = FORM_COUNTER++;

  // Prevents fields from double resetting their values, which causes checkboxes to toggle their initial value
  let FIELD_ID_COUNTER = 0;

  // If the form is currently submitting
  const isSubmitting = ref(false);

  // If the form is currently validating
  const isValidating = ref(false);

  // The number of times the user tried to submit the form
  const submitCount = ref(0);

  // field arrays managed by this form
  const fieldArrays: PrivateFieldArrayContext[] = [];

  // a private ref for all form values
  const formValues = reactive(resolveInitialValues(opts)) as TValues;

  const pathStates = ref<PathState<unknown>[]>([]);

  const extraErrorsBag: Ref<FormErrorBag<TValues>> = ref({});

  const pathStateLookup = ref<Record<string, PathState>>({});

  const rebuildPathLookup = debounceNextTick(() => {
    pathStateLookup.value = pathStates.value.reduce(
      (names, state) => {
        names[normalizeFormPath(toValue(state.path))] = state;

        return names;
      },
      {} as Record<string, PathState>,
    );
  });

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: Path<TValues> | PathState, message: string | undefined | string[]) {
    const state = findPathState(field);
    if (!state) {
      if (typeof field === 'string') {
        extraErrorsBag.value[normalizeFormPath(field) as Path<TValues>] = normalizeErrorItem(message);
      }
      return;
    }

    // Move the error from the extras path if exists
    if (typeof field === 'string') {
      const normalizedPath = normalizeFormPath(field) as Path<TValues>;
      if (extraErrorsBag.value[normalizedPath]) {
        delete extraErrorsBag.value[normalizedPath];
      }
    }

    state.errors = normalizeErrorItem(message);
    state.valid = !state.errors.length;
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrors(paths: Partial<FlattenAndSetPathsType<TValues, string | string[] | undefined>>) {
    keysOf(paths).forEach(path => {
      setFieldError(path, paths[path]);
    });
  }

  if (opts?.initialErrors) {
    setErrors(opts.initialErrors);
  }

  const errorBag = computed<FormErrorBag<TValues>>(() => {
    const pathErrors = pathStates.value.reduce((acc, state) => {
      if (state.errors.length) {
        acc[state.path as Path<TValues>] = state.errors;
      }

      return acc;
    }, {} as FormErrorBag<TValues>);

    return { ...extraErrorsBag.value, ...pathErrors };
  });

  // Gets the first error of each field
  const errors = computed<FormErrors<TValues>>(() => {
    return keysOf(errorBag.value).reduce((acc, key) => {
      const errors = errorBag.value[key];
      if (errors?.length) {
        acc[key] = errors[0];
      }

      return acc;
    }, {} as FormErrors<TValues>);
  });

  /**
   * Holds a computed reference to all fields names and labels
   */
  const fieldNames = computed(() => {
    return pathStates.value.reduce(
      (names, state) => {
        names[state.path] = { name: state.path || '', label: state.label || '' };

        return names;
      },
      {} as Record<string, { name: string; label: string }>,
    );
  });

  const fieldBailsMap = computed(() => {
    return pathStates.value.reduce(
      (map, state) => {
        map[state.path] = state.bails ?? true;

        return map;
      },
      {} as Record<string, boolean>,
    );
  });

  // mutable non-reactive reference to initial errors
  // we need this to process initial errors then unset them
  const initialErrors = {
    ...(opts?.initialErrors || ({} as FlattenAndSetPathsType<TValues, string | undefined>)),
  };

  const keepValuesOnUnmount = opts?.keepValuesOnUnmount ?? false;

  // initial form values
  const { initialValues, originalInitialValues, setInitialValues } = useFormInitialValues<TValues>(
    pathStates,
    formValues,
    opts,
  );

  // form meta aggregations
  const meta = useFormMeta(pathStates, formValues, originalInitialValues, errors);

  const controlledValues = computed(() => {
    return pathStates.value.reduce((acc, state) => {
      const value = getFromPath(formValues, state.path);
      setInPath(acc, state.path, value);

      return acc;
    }, {} as TValues);
  });

  const schema = opts?.validationSchema;

  function createPathState<TValue>(
    path: MaybeRefOrGetter<Path<TValues>>,
    config?: Partial<PathStateConfig>,
  ): PathState<TValue> {
    const initialValue = computed(() => getFromPath(initialValues.value, toValue(path)));
    const pathStateExists = pathStateLookup.value[toValue(path)];
    const isCheckboxOrRadio = config?.type === 'checkbox' || config?.type === 'radio';
    if (pathStateExists && isCheckboxOrRadio) {
      pathStateExists.multiple = true;
      const id = FIELD_ID_COUNTER++;
      if (Array.isArray(pathStateExists.id)) {
        pathStateExists.id.push(id);
      } else {
        pathStateExists.id = [pathStateExists.id, id];
      }

      pathStateExists.fieldsCount++;
      pathStateExists.__flags.pendingUnmount[id] = false;

      return pathStateExists as PathState<TValue>;
    }

    const currentValue = computed(() => getFromPath(formValues, toValue(path)));
    const pathValue = toValue(path);

    const unsetBatchIndex = UNSET_BATCH.findIndex(_path => _path === pathValue);
    if (unsetBatchIndex !== -1) {
      UNSET_BATCH.splice(unsetBatchIndex, 1);
    }

    const isRequired = computed(() => {
      if (isTypedSchema(schema)) {
        return (schema as TypedSchema).describe?.(toValue(path)).required ?? false;
      }

      // Path own schema
      if (isTypedSchema(config?.schema)) {
        return (config?.schema as TypedSchema).describe?.().required ?? false;
      }

      return false;
    });

    const id = FIELD_ID_COUNTER++;
    const state = reactive({
      id,
      path,
      touched: false,
      pending: false,
      valid: true,
      validated: !!initialErrors[pathValue]?.length,
      required: isRequired,
      initialValue,
      errors: shallowRef([]),
      bails: config?.bails ?? false,
      label: config?.label,
      type: config?.type || 'default',
      value: currentValue,
      multiple: false,
      __flags: {
        pendingUnmount: { [id]: false },
        pendingReset: false,
      },
      fieldsCount: 1,
      validate: config?.validate,
      dirty: computed(() => {
        return !isEqual(unref(currentValue), unref(initialValue));
      }),
    }) as PathState<TValue>;

    pathStates.value.push(state);
    pathStateLookup.value[pathValue] = state;
    rebuildPathLookup();

    if (errors.value[pathValue] && !initialErrors[pathValue]) {
      nextTick(() => {
        validateField(pathValue, { mode: 'silent' });
      });
    }

    // Handles when a path changes
    if (isRef(path)) {
      watch(path, newPath => {
        rebuildPathLookup();
        const nextValue = deepCopy(currentValue.value);
        pathStateLookup.value[newPath] = state;

        nextTick(() => {
          setInPath(formValues, newPath, nextValue);
        });
      });
    }

    return state;
  }

  /**
   * Batches validation runs in 5ms batches
   * Must have two distinct batch queues to make sure they don't override each other settings #3783
   */
  const debouncedSilentValidation = debounceAsync(_validateSchema, 5);
  const debouncedValidation = debounceAsync(_validateSchema, 5);

  const validateSchema = withLatest(
    async (mode: SchemaValidationMode) => {
      return (await (mode === 'silent'
        ? debouncedSilentValidation()
        : debouncedValidation())) as FormValidationResult<TValues>;
    },
    (formResult, [mode]) => {
      // fields by id lookup
      // errors fields names, we need it to also check if custom errors are updated
      const currentErrorsPaths = keysOf(formCtx.errorBag.value);
      // collect all the keys from the schema and all fields
      // this ensures we have a complete key map of all the fields
      const paths = [
        ...new Set([...keysOf(formResult.results), ...pathStates.value.map(p => p.path), ...currentErrorsPaths]),
      ].sort() as string[];

      // aggregates the paths into a single result object while applying the results on the fields
      const results = paths.reduce(
        (validation, _path) => {
          const expectedPath = _path as Path<TValues>;
          const pathState = findPathState(expectedPath) || findHoistedPath(expectedPath);
          const messages = formResult.results[expectedPath]?.errors || [];
          // This is the real path of the field, because it might've been a hoisted field
          const path = (toValue(pathState?.path) || expectedPath) as Path<TValues>;
          // It is possible that multiple paths are collected across loops
          // We want to merge them to avoid overriding any iteration's results
          const fieldResult = mergeValidationResults(
            { errors: messages, valid: !messages.length },
            validation.results[path],
          );
          validation.results[path] = fieldResult;
          if (!fieldResult.valid) {
            validation.errors[path] = fieldResult.errors[0];
          }

          // clean up extra errors if path state exists
          if (pathState && extraErrorsBag.value[path]) {
            delete extraErrorsBag.value[path];
          }

          // field not rendered
          if (!pathState) {
            setFieldError(path, messages);

            return validation;
          }

          // always update the valid flag regardless of the mode
          pathState.valid = fieldResult.valid;
          if (mode === 'silent') {
            return validation;
          }

          if (mode === 'validated-only' && !pathState.validated) {
            return validation;
          }

          setFieldError(pathState, fieldResult.errors);

          return validation;
        },
        { valid: formResult.valid, results: {}, errors: {} } as FormValidationResult<TValues>,
      );

      if (formResult.values) {
        results.values = formResult.values;
      }

      return results;
    },
  );

  function mutateAllPathState(mutation: (state: PathState) => void) {
    pathStates.value.forEach(mutation);
  }

  function findPathState<TPath extends Path<TValues>>(path: TPath | PathState) {
    const normalizedPath = typeof path === 'string' ? normalizeFormPath(path) : path;
    const pathState = typeof normalizedPath === 'string' ? pathStateLookup.value[normalizedPath] : normalizedPath;

    return pathState as PathState<PathValue<TValues, TPath>> | undefined;
  }

  function findHoistedPath(path: Path<TValues>) {
    const candidates = pathStates.value.filter(state => path.startsWith(state.path));

    return candidates.reduce(
      (bestCandidate, candidate) => {
        if (!bestCandidate) {
          return candidate as PathState<PathValue<TValues, Path<TValues>>>;
        }

        return (candidate.path.length > bestCandidate.path.length ? candidate : bestCandidate) as PathState<
          PathValue<TValues, Path<TValues>>
        >;
      },
      undefined as PathState<PathValue<TValues, Path<TValues>>> | undefined,
    );
  }

  let UNSET_BATCH: Path<TValues>[] = [];
  let PENDING_UNSET: Promise<void> | null;
  function unsetPathValue<TPath extends Path<TValues>>(path: TPath) {
    UNSET_BATCH.push(path);
    if (!PENDING_UNSET) {
      PENDING_UNSET = nextTick(() => {
        const sortedPaths = [...UNSET_BATCH].sort().reverse();
        sortedPaths.forEach(p => {
          unsetPath(formValues, p);
        });

        UNSET_BATCH = [];
        PENDING_UNSET = null;
      });
    }

    return PENDING_UNSET;
  }

  function makeSubmissionFactory(onlyControlled: boolean) {
    return function submitHandlerFactory<TReturn = unknown>(
      fn?: SubmissionHandler<TValues, TOutput, TReturn>,
      onValidationError?: InvalidSubmissionHandler<TValues>,
    ) {
      return function submissionHandler(e: unknown) {
        if (e instanceof Event) {
          e.preventDefault();
          e.stopPropagation();
        }

        // Touch all fields
        mutateAllPathState(s => (s.touched = true));

        isSubmitting.value = true;
        submitCount.value++;
        return validate()
          .then(result => {
            const values = deepCopy(formValues);

            if (result.valid && typeof fn === 'function') {
              const controlled = deepCopy(controlledValues.value);
              let submittedValues = (onlyControlled ? controlled : values) as unknown as TOutput;
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
            },
          );
      };
    };
  }

  const handleSubmitImpl = makeSubmissionFactory(false);
  const handleSubmit: typeof handleSubmitImpl & { withControlled: typeof handleSubmitImpl } = handleSubmitImpl as any;
  handleSubmit.withControlled = makeSubmissionFactory(true);

  function removePathState<TPath extends Path<TValues>>(path: TPath, id: number) {
    const idx = pathStates.value.findIndex(s => s.path === path);
    const pathState = pathStates.value[idx];
    if (idx === -1 || !pathState) {
      return;
    }

    nextTick(() => {
      validateField(path, { mode: 'silent', warn: false });
    });

    if (pathState.multiple && pathState.fieldsCount) {
      pathState.fieldsCount--;
    }

    if (Array.isArray(pathState.id)) {
      const idIndex = pathState.id.indexOf(id);
      if (idIndex >= 0) {
        pathState.id.splice(idIndex, 1);
      }

      delete pathState.__flags.pendingUnmount[id];
    }

    if (!pathState.multiple || pathState.fieldsCount <= 0) {
      pathStates.value.splice(idx, 1);
      unsetInitialValue(path);
      rebuildPathLookup();
      delete pathStateLookup.value[path];
    }
  }

  function destroyPath(path: string) {
    keysOf(pathStateLookup.value).forEach(key => {
      if (key.startsWith(path)) {
        delete pathStateLookup.value[key];
      }
    });

    pathStates.value = pathStates.value.filter(s => !s.path.startsWith(path));
    nextTick(() => {
      rebuildPathLookup();
    });
  }

  const formCtx: PrivateFormContext<TValues, TOutput> = {
    formId,
    values: formValues,
    controlledValues,
    errorBag,
    errors,
    schema,
    submitCount,
    meta,
    isSubmitting,
    isValidating,
    fieldArrays,
    keepValuesOnUnmount,
    validateSchema: unref(schema) ? validateSchema : undefined,
    validate,
    setFieldError,
    validateField,
    setFieldValue,
    setValues,
    setErrors,
    setFieldTouched,
    setTouched,
    resetForm,
    resetField,
    handleSubmit,
    useFieldModel,
    defineInputBinds,
    defineComponentBinds: defineComponentBinds as any,
    defineField,
    stageInitialValue,
    unsetInitialValue,
    setFieldInitialValue,
    createPathState,
    getPathState: findPathState,
    unsetPathValue,
    removePathState,
    initialValues: initialValues as Ref<TValues>,
    getAllPathStates: () => pathStates.value,
    destroyPath,
    isFieldTouched,
    isFieldDirty,
    isFieldValid,
  };

  /**
   * Sets a single field value
   */
  function setFieldValue<T extends Path<TValues>>(
    field: T | PathState,
    value: PathValue<TValues, T> | undefined,
    shouldValidate = true,
  ) {
    const clonedValue = deepCopy(value);
    const path = typeof field === 'string' ? field : (field.path as Path<TValues>);
    const pathState = findPathState(path);
    if (!pathState) {
      createPathState(path);
    }

    setInPath(formValues, path, clonedValue);
    if (shouldValidate) {
      validateField(path);
    }
  }

  function forceSetValues(fields: PartialDeep<TValues>, shouldValidate = true) {
    // clean up old values
    keysOf(formValues).forEach(key => {
      delete formValues[key];
    });

    // set up new values
    keysOf(fields).forEach(path => {
      setFieldValue(path as Path<TValues>, fields[path], false);
    });

    if (shouldValidate) {
      validate();
    }
  }

  /**
   * Sets multiple fields values
   */
  function setValues(fields: PartialDeep<TValues>, shouldValidate = true) {
    merge(formValues, fields);
    // regenerate the arrays when the form values change
    fieldArrays.forEach(f => f && f.reset());

    if (shouldValidate) {
      validate();
    }
  }

  function createModel<TPath extends Path<TValues>>(
    path: MaybeRefOrGetter<TPath>,
    shouldValidate?: MaybeRefOrGetter<boolean>,
  ) {
    const pathState = findPathState(toValue(path)) || createPathState(path);

    return computed({
      get() {
        return pathState.value;
      },
      set(value) {
        const pathValue = toValue(path);
        setFieldValue(pathValue, value, toValue(shouldValidate) ?? false);
      },
    }) as Ref<PathValue<TValues, TPath>>;
  }

  /**
   * Sets the touched meta state on a field
   */
  function setFieldTouched(field: Path<TValues> | PathState, isTouched: boolean) {
    const pathState = findPathState(field);
    if (pathState) {
      pathState.touched = isTouched;
    }
  }

  function isFieldTouched(field: Path<TValues>) {
    const pathState = findPathState(field);
    if (pathState) {
      return pathState.touched;
    }

    // Find all nested paths and consider their touched state
    return pathStates.value.filter(s => s.path.startsWith(field)).some(s => s.touched);
  }

  function isFieldDirty(field: Path<TValues>) {
    const pathState = findPathState(field);
    if (pathState) {
      return pathState.dirty;
    }

    return pathStates.value.filter(s => s.path.startsWith(field)).some(s => s.dirty);
  }

  function isFieldValid(field: Path<TValues>) {
    const pathState = findPathState(field);
    if (pathState) {
      return pathState.valid;
    }

    return pathStates.value.filter(s => s.path.startsWith(field)).every(s => s.valid);
  }

  /**
   * Sets the touched meta state on multiple fields
   */
  function setTouched(fields: Partial<FlattenAndSetPathsType<TValues, boolean>> | boolean) {
    if (typeof fields === 'boolean') {
      mutateAllPathState(state => {
        state.touched = fields;
      });

      return;
    }

    keysOf(fields).forEach(field => {
      setFieldTouched(field, !!fields[field]);
    });
  }

  function resetField(field: Path<TValues>, state?: Partial<FieldState>) {
    const newValue = state && 'value' in state ? state.value : getFromPath(initialValues.value, field);
    const pathState = findPathState(field);
    if (pathState) {
      pathState.__flags.pendingReset = true;
    }

    setFieldInitialValue(field, deepCopy(newValue), true);
    setFieldValue(field, newValue as PathValue<TValues, typeof field>, false);
    setFieldTouched(field, state?.touched ?? false);
    setFieldError(field, state?.errors || []);

    nextTick(() => {
      if (pathState) {
        pathState.__flags.pendingReset = false;
      }
    });
  }

  /**
   * Resets all fields
   */
  function resetForm(resetState?: Partial<FormState<TValues>>, opts?: ResetFormOpts) {
    let newValues = deepCopy(resetState?.values ? resetState.values : originalInitialValues.value);
    newValues = opts?.force ? newValues : merge(originalInitialValues.value, newValues);
    newValues = isTypedSchema(schema) && isCallable(schema.cast) ? schema.cast(newValues) : newValues;
    setInitialValues(newValues);
    mutateAllPathState(state => {
      state.__flags.pendingReset = true;
      state.validated = false;
      state.touched = resetState?.touched?.[state.path as Path<TValues>] || false;

      setFieldValue(state.path as Path<TValues>, getFromPath(newValues, state.path), false);
      setFieldError(state.path as Path<TValues>, undefined);
    });

    opts?.force ? forceSetValues(newValues, false) : setValues(newValues, false);
    setErrors(resetState?.errors || {});
    submitCount.value = resetState?.submitCount || 0;
    nextTick(() => {
      validate({ mode: 'silent' });

      mutateAllPathState(state => {
        state.__flags.pendingReset = false;
      });
    });
  }

  async function validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues, TOutput>> {
    const mode = opts?.mode || 'force';
    if (mode === 'force') {
      mutateAllPathState(f => (f.validated = true));
    }

    if (formCtx.validateSchema) {
      return formCtx.validateSchema(mode);
    }

    isValidating.value = true;

    // No schema, each field is responsible to validate itself
    const validations = await Promise.all(
      pathStates.value.map(state => {
        if (!state.validate) {
          return Promise.resolve({
            key: state.path,
            valid: true,
            errors: [],
          });
        }

        return state.validate(opts).then((result: ValidationResult) => {
          return {
            key: state.path,
            valid: result.valid,
            errors: result.errors,
          };
        });
      }),
    );

    isValidating.value = false;

    const results: Partial<FlattenAndSetPathsType<TValues, ValidationResult>> = {};
    const errors: Partial<FlattenAndSetPathsType<TValues, string>> = {};
    for (const validation of validations) {
      results[validation.key as Path<TValues>] = {
        valid: validation.valid,
        errors: validation.errors,
      };

      if (validation.errors.length) {
        errors[validation.key as Path<TValues>] = validation.errors[0];
      }
    }

    return {
      valid: validations.every(r => r.valid),
      results,
      errors,
    };
  }

  async function validateField(path: Path<TValues>, opts?: Partial<ValidationOptions>): Promise<ValidationResult> {
    const state = findPathState(path);
    if (state && opts?.mode !== 'silent') {
      state.validated = true;
    }

    if (schema) {
      const { results }: FormValidationResult<TValues, TOutput> = await validateSchema(opts?.mode || 'validated-only');

      return results[path] || { errors: [], valid: true };
    }

    if (state?.validate) {
      return state.validate(opts);
    }

    const shouldWarn = !state && (opts?.warn ?? true);
    if (shouldWarn) {
      if (__DEV__) {
        warn(`field with path ${path} was not found`);
      }
    }

    return Promise.resolve({ errors: [], valid: true });
  }

  function unsetInitialValue(path: string) {
    unsetPath(initialValues.value, path);
  }

  /**
   * Sneaky function to set initial field values
   */
  function stageInitialValue(path: string, value: unknown, updateOriginal = false) {
    setFieldInitialValue(path, value);
    setInPath(formValues, path, value);
    if (updateOriginal && !opts?.initialValues) {
      setInPath(originalInitialValues.value, path, deepCopy(value));
    }
  }

  function setFieldInitialValue(path: string, value: unknown, updateOriginal = false) {
    setInPath(initialValues.value, path, deepCopy(value));
    if (updateOriginal) {
      setInPath(originalInitialValues.value, path, deepCopy(value));
    }
  }

  async function _validateSchema(): Promise<FormValidationResult<TValues, TOutput>> {
    const schemaValue = unref(schema);
    if (!schemaValue) {
      return { valid: true, results: {}, errors: {} };
    }

    isValidating.value = true;

    const formResult =
      isYupValidator(schemaValue) || isTypedSchema(schemaValue)
        ? await validateTypedSchema<TValues, TOutput>(schemaValue, formValues)
        : await validateObjectSchema<TValues, TOutput>(schemaValue as RawFormSchema<TValues>, formValues, {
            names: fieldNames.value,
            bailsMap: fieldBailsMap.value,
          });

    isValidating.value = false;

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
        isValidating: isValidating.value,
        submitCount: submitCount.value,
      }),
      refreshInspector,
      {
        deep: true,
      },
    );
  }

  function defineField<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>,
  ) {
    const label = isCallable(config) ? undefined : config?.label;
    const pathState = (findPathState(toValue(path)) || createPathState(path, { label })) as PathState<TValue>;
    const evalConfig = () => (isCallable(config) ? config(omit(pathState, PRIVATE_PATH_STATE_KEYS)) : config || {});

    function onBlur() {
      pathState.touched = true;
      const validateOnBlur = evalConfig().validateOnBlur ?? getConfig().validateOnBlur;
      if (validateOnBlur) {
        validateField(pathState.path as Path<TValues>);
      }
    }

    function onInput() {
      const validateOnInput = evalConfig().validateOnInput ?? getConfig().validateOnInput;
      if (validateOnInput) {
        nextTick(() => {
          validateField(pathState.path as Path<TValues>);
        });
      }
    }

    function onChange() {
      const validateOnChange = evalConfig().validateOnChange ?? getConfig().validateOnChange;
      if (validateOnChange) {
        nextTick(() => {
          validateField(pathState.path as Path<TValues>);
        });
      }
    }

    const props = computed(() => {
      const base: BaseFieldProps = {
        onChange,
        onInput,
        onBlur,
      };

      if (isCallable(config)) {
        return {
          ...base,
          ...(config(omit(pathState, PRIVATE_PATH_STATE_KEYS)).props || {}),
        } as BaseFieldProps & TExtras;
      }

      if (config?.props) {
        return {
          ...base,
          ...config.props(omit(pathState, PRIVATE_PATH_STATE_KEYS)),
        } as BaseFieldProps & TExtras;
      }

      return base as BaseFieldProps & TExtras;
    });

    const model = createModel(
      path,
      () => evalConfig().validateOnModelUpdate ?? getConfig()?.validateOnModelUpdate ?? true,
    );

    return [model, props] as [Ref<TValue>, Ref<BaseFieldProps & TExtras>];
  }

  /**
   * @deprecated use defineField instead
   */
  function useFieldModel<TPath extends Path<TValues>>(path: TPath): Ref<PathValue<TValues, TPath>>;
  function useFieldModel<TPaths extends readonly [...MaybeRef<Path<TValues>>[]]>(
    paths: TPaths,
  ): MapValuesPathsToRefs<TValues, TPaths>;
  function useFieldModel<TPaths extends Path<TValues> | readonly [...MaybeRef<Path<TValues>>[]]>(pathOrPaths: TPaths) {
    if (!Array.isArray(pathOrPaths)) {
      return createModel(pathOrPaths as any);
    }

    return pathOrPaths.map(p => createModel(p, true)) as unknown as MapValuesPathsToRefs<TValues, any>;
  }

  /**
   * @deprecated use defineField instead
   */
  function defineInputBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>,
  ) {
    const [model, props] = defineField(path, config);

    function onBlur(e: Event) {
      props.value.onBlur(e);
    }

    function onInput(e: Event) {
      const value = normalizeEventValue(e) as PathValue<TValues, TPath>;
      setFieldValue(toValue(path), value, false);
      props.value.onInput(e);
    }

    function onChange(e: Event) {
      const value = normalizeEventValue(e) as PathValue<TValues, TPath>;
      setFieldValue(toValue(path), value, false);
      props.value.onChange(e);
    }

    return computed(() => {
      return {
        ...props.value,
        onBlur,
        onInput,
        onChange,
        value: model.value,
      };
    });
  }

  /**
   * @deprecated use defineField instead
   */
  function defineComponentBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TModel extends string = 'modelValue',
    TExtras extends GenericObject = GenericObject,
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<ComponentBindsConfig<TValue, TExtras, TModel>> | LazyComponentBindsConfig<TValue, TExtras, TModel>,
  ) {
    const [model, props] = defineField(path, config);
    const pathState = findPathState(toValue(path)) as PathState<TValue>;

    function onUpdateModelValue(value: TValue) {
      model.value = value;
    }

    return computed(() => {
      const conf = isCallable(config) ? config(omit(pathState, PRIVATE_PATH_STATE_KEYS)) : config || {};
      return {
        [conf.model || 'modelValue']: model.value,
        [`onUpdate:${conf.model || 'modelValue'}`]: onUpdateModelValue,
        ...props.value,
      };
    });
  }

  return {
    ...formCtx,
    values: readonly(formValues) as TValues,
    handleReset: () => resetForm(),
    submitForm,
  };
}

/**
 * Manages form meta aggregation
 */
function useFormMeta<TValues extends Record<string, unknown>>(
  pathsState: Ref<PathState<unknown>[]>,
  currentValues: TValues,
  initialValues: MaybeRef<PartialDeep<TValues>>,
  errors: Ref<FormErrors<TValues>>,
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
    const states = pathsState.value;

    return keysOf(MERGE_STRATEGIES).reduce(
      (acc, flag) => {
        const mergeMethod = MERGE_STRATEGIES[flag];
        acc[flag] = states[mergeMethod](s => s[flag]);

        return acc;
      },
      {} as Record<keyof Omit<FieldMeta<unknown>, 'initialValue'>, boolean>,
    );
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
      initialValues: unref(initialValues) as Partial<TValues>,
      ...flags,
      valid: flags.valid && !keysOf(errors.value).length,
      dirty: isDirty.value,
    };
  });
}

/**
 * Manages the initial values prop
 */
function useFormInitialValues<TValues extends GenericObject>(
  pathsState: Ref<PathState<unknown>[]>,
  formValues: TValues,
  opts?: FormOptions<TValues>,
) {
  const values = resolveInitialValues(opts) as PartialDeep<TValues>;
  // these are the mutable initial values as the fields are mounted/unmounted
  const initialValues = ref(values) as Ref<PartialDeep<TValues>>;
  // these are the original initial value as provided by the user initially, they don't keep track of conditional fields
  // this is important because some conditional fields will overwrite the initial values for other fields who had the same name
  // like array fields, any push/insert operation will overwrite the initial values because they "create new fields"
  // so these are the values that the reset function should use
  // these only change when the user explicitly changes the initial values or when the user resets them with new values.
  const originalInitialValues = ref<PartialDeep<TValues>>(deepCopy(values)) as Ref<PartialDeep<TValues>>;

  function setInitialValues(values: PartialDeep<TValues>, updateFields = false) {
    initialValues.value = merge(deepCopy(initialValues.value) || {}, deepCopy(values));
    originalInitialValues.value = merge(deepCopy(originalInitialValues.value) || {}, deepCopy(values));

    if (!updateFields) {
      return;
    }

    // update the pristine non-touched fields
    // those are excluded because it's unlikely you want to change the form values using initial values
    // we mostly watch them for API population or newly inserted fields
    // if the user API is taking too much time before user interaction they should consider disabling or hiding their inputs until the values are ready
    pathsState.value.forEach(state => {
      const wasTouched = state.touched;
      if (wasTouched) {
        return;
      }

      const newValue = getFromPath(initialValues.value, state.path);
      setInPath(formValues, state.path, deepCopy(newValue));
    });
  }

  return {
    initialValues,
    originalInitialValues,
    setInitialValues,
  };
}

function mergeValidationResults(a: ValidationResult, b?: ValidationResult): ValidationResult {
  if (!b) {
    return a;
  }

  return {
    valid: a.valid && b.valid,
    errors: [...a.errors, ...b.errors],
  };
}
