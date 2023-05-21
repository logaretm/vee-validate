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
  MapValuesPathsToRefs,
  FieldState,
  GenericObject,
  TypedSchema,
  Path,
  FlattenAndSetPathsType,
  PathValue,
  PathState,
  PathStateConfig,
  BaseComponentBinds,
  BaseInputBinds,
  InputBindsConfig,
  ComponentBindsConfig,
  LazyInputBindsConfig,
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
  normalizeEventValue,
  omit,
} from './utils';
import { FormContextKey } from './symbols';
import { validateTypedSchema, validateObjectSchema } from './validate';
import { refreshInspector, registerFormWithDevTools } from './devtools';
import { isCallable, merge } from '../../shared';
import { getConfig } from './config';
import { PartialDeep } from 'type-fest';

type FormSchema<TValues extends Record<string, unknown>> =
  | FlattenAndSetPathsType<TValues, GenericValidateFunction | string | GenericObject>
  | undefined;

export interface FormOptions<
  TValues extends GenericObject,
  TOutput = TValues,
  TSchema extends TypedSchema<TValues, TOutput> | FormSchema<TValues> =
    | FormSchema<TValues>
    | TypedSchema<TValues, TOutput>
> {
  validationSchema?: MaybeRef<TSchema extends TypedSchema ? TypedSchema<TValues, TOutput> : any>;
  initialValues?: MaybeRef<PartialDeep<TValues> | undefined | null>;
  initialErrors?: FlattenAndSetPathsType<TValues, string | undefined>;
  initialTouched?: FlattenAndSetPathsType<TValues, boolean>;
  validateOnMount?: boolean;
  keepValuesOnUnmount?: MaybeRef<boolean>;
}

let FORM_COUNTER = 0;

const PRIVATE_PATH_STATE_KEYS: (keyof PathState)[] = ['bails', 'fieldsCount', 'id', 'multiple', 'type', 'validate'];

function resolveInitialValues<TValues extends GenericObject = GenericObject>(opts?: FormOptions<TValues>): TValues {
  const providedValues = unref(opts?.initialValues) || {};
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
    | TypedSchema<TValues, TOutput>
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
  const formValues = reactive(resolveInitialValues(opts));

  const pathStates = ref<PathState<unknown>[]>([]);

  const extraErrorsBag: Ref<FormErrorBag<TValues>> = ref({});

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: Path<TValues> | PathState, message: string | undefined | string[]) {
    const state = findPathState(field);
    if (!state) {
      if (typeof field === 'string') {
        extraErrorsBag.value[field] = normalizeErrorItem(message);
      }
      return;
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
    return pathStates.value.reduce((names, state) => {
      names[state.path] = { name: state.path || '', label: state.label || '' };

      return names;
    }, {} as Record<string, { name: string; label: string }>);
  });

  const fieldBailsMap = computed(() => {
    return pathStates.value.reduce((map, state) => {
      map[state.path] = state.bails ?? true;

      return map;
    }, {} as Record<string, boolean>);
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
    opts
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
    config?: Partial<PathStateConfig>
  ): PathState<TValue> {
    const initialValue = computed(() => getFromPath(initialValues.value, toValue(path)));
    const pathStateExists = pathStates.value.find(state => state.path === unref(path));
    if (pathStateExists) {
      if (config?.type === 'checkbox' || config?.type === 'radio') {
        pathStateExists.multiple = true;
      }

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
    const id = FIELD_ID_COUNTER++;
    const state = reactive({
      id,
      path,
      touched: false,
      pending: false,
      valid: true,
      validated: !!initialErrors[pathValue]?.length,
      initialValue,
      errors: shallowRef([]),
      bails: config?.bails ?? false,
      label: config?.label,
      type: config?.type || 'default',
      value: currentValue,
      multiple: false,
      __flags: {
        pendingUnmount: { [id]: false },
      },
      fieldsCount: 1,
      validate: config?.validate,
      dirty: computed(() => {
        return !isEqual(unref(currentValue), unref(initialValue));
      }),
    }) as PathState<TValue>;

    pathStates.value.push(state);

    // if it has errors before, validate it.
    if (errors.value[pathValue] && !initialErrors[pathValue]) {
      nextTick(() => {
        validateField(pathValue);
      });
    }

    // Handles when a path changes
    if (isRef(path)) {
      watch(path, newPath => {
        const nextValue = deepCopy(currentValue.value);

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
      return (await mode) === 'silent' ? debouncedSilentValidation() : debouncedValidation();
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
      return paths.reduce(
        (validation, _path) => {
          const path = _path as Path<TValues>;
          const pathState = findPathState(path) || findHoistedPath(path);
          const messages = (formResult.results[path] || { errors: [] as string[] }).errors;
          const fieldResult = {
            errors: messages,
            valid: !messages.length,
          };
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
        { valid: formResult.valid, results: {}, errors: {} } as FormValidationResult<TValues>
      );
    }
  );

  function mutateAllPathState(mutation: (state: PathState) => void) {
    pathStates.value.forEach(mutation);
  }

  function findPathState<TPath extends Path<TValues>>(path: TPath | PathState) {
    const pathState = typeof path === 'string' ? pathStates.value.find(state => state.path === path) : path;

    return pathState as PathState<PathValue<TValues, TPath>> | undefined;
  }

  function findHoistedPath(path: Path<TValues>) {
    const candidates = pathStates.value.filter(state => path.startsWith(state.path));

    return candidates.reduce((bestCandidate, candidate) => {
      if (!bestCandidate) {
        return candidate as PathState<PathValue<TValues, Path<TValues>>>;
      }

      return (candidate.path.length > bestCandidate.path.length ? candidate : bestCandidate) as PathState<
        PathValue<TValues, Path<TValues>>
      >;
    }, undefined as PathState<PathValue<TValues, Path<TValues>>> | undefined);
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
      onValidationError?: InvalidSubmissionHandler<TValues>
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
              let submittedValues = (onlyControlled ? controlled : values) as TOutput;
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

  function removePathState<TPath extends Path<TValues>>(path: TPath, id: number) {
    const idx = pathStates.value.findIndex(s => s.path === path);
    const pathState = pathStates.value[idx];
    if (idx === -1 || !pathState) {
      return;
    }

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
    }
  }

  function markForUnmount(path: string) {
    return mutateAllPathState(s => {
      if (s.path.startsWith(path)) {
        keysOf(s.__flags.pendingUnmount).forEach(id => {
          s.__flags.pendingUnmount[id] = true;
        });
      }
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
    stageInitialValue,
    unsetInitialValue,
    setFieldInitialValue,
    useFieldModel,
    createPathState,
    getPathState: findPathState,
    unsetPathValue,
    removePathState,
    initialValues: initialValues as Ref<TValues>,
    getAllPathStates: () => pathStates.value,
    markForUnmount,
  };

  /**
   * Sets a single field value
   */
  function setFieldValue<T extends Path<TValues>>(field: T | PathState, value: PathValue<TValues, T> | undefined) {
    const clonedValue = deepCopy(value);
    const path = typeof field === 'string' ? field : (field.path as Path<TValues>);
    const pathState = findPathState(path);
    if (!pathState) {
      createPathState(path);
    }

    setInPath(formValues, path, clonedValue);
  }

  /**
   * Sets multiple fields values
   */
  function setValues(fields: PartialDeep<TValues>) {
    merge(formValues, fields);

    // regenerate the arrays when the form values change
    fieldArrays.forEach(f => f && f.reset());
  }

  function createModel<TPath extends Path<TValues>>(path: MaybeRef<TPath>) {
    const pathState = findPathState(unref(path)) || createPathState(path);

    return computed({
      get() {
        return pathState.value;
      },
      set(value) {
        const pathValue = unref(path);
        setFieldValue(pathValue, value);
        pathState.validated = true;
        pathState.pending = true;
        validateField(pathValue).then(() => {
          pathState.pending = false;
        });
      },
    }) as Ref<PathValue<TValues, TPath>>;
  }

  function useFieldModel<TPath extends Path<TValues>>(path: TPath): Ref<PathValue<TValues, TPath>>;
  function useFieldModel<TPaths extends readonly [...MaybeRef<Path<TValues>>[]]>(
    paths: TPaths
  ): MapValuesPathsToRefs<TValues, TPaths>;
  function useFieldModel<TPaths extends Path<TValues> | readonly [...MaybeRef<Path<TValues>>[]]>(pathOrPaths: TPaths) {
    if (!Array.isArray(pathOrPaths)) {
      return createModel(pathOrPaths as any);
    }

    return pathOrPaths.map(createModel) as unknown as MapValuesPathsToRefs<TValues, any>;
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

  /**
   * Sets the touched meta state on multiple fields
   */
  function setTouched(fields: Partial<FlattenAndSetPathsType<TValues, boolean>>) {
    keysOf(fields).forEach(field => {
      setFieldTouched(field, !!fields[field]);
    });
  }

  function resetField(field: Path<TValues>, state?: Partial<FieldState>) {
    const newValue = state && 'value' in state ? state.value : getFromPath(initialValues.value, field);

    setFieldInitialValue(field, deepCopy(newValue));
    setFieldValue(field, newValue as PathValue<TValues, typeof field>);
    setFieldTouched(field, state?.touched ?? false);
    setFieldError(field, state?.errors || []);
  }

  /**
   * Resets all fields
   */
  function resetForm(resetState?: Partial<FormState<TValues>>) {
    const newValues = resetState?.values ? resetState.values : originalInitialValues.value;
    setInitialValues(newValues);
    setValues(newValues);
    mutateAllPathState(state => {
      state.validated = false;
      state.touched = resetState?.touched?.[state.path as Path<TValues>] || false;

      setFieldValue(state.path as Path<TValues>, getFromPath(newValues, state.path));
      setFieldError(state.path as Path<TValues>, undefined);
    });

    setErrors(resetState?.errors || {});
    submitCount.value = resetState?.submitCount || 0;
    nextTick(() => {
      validate({ mode: 'silent' });
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
      })
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

  async function validateField(path: Path<TValues>): Promise<ValidationResult> {
    const state = findPathState(path);
    if (state) {
      state.validated = true;
    }

    if (schema) {
      const { results }: FormValidationResult<TValues, TOutput> = await validateSchema('validated-only');

      return results[path] || { errors: [], valid: true };
    }

    if (state?.validate) {
      return state.validate();
    }

    if (!state) {
      warn(`field with path ${path} was not found`);
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

  function setFieldInitialValue(path: string, value: unknown) {
    setInPath(initialValues.value, path, deepCopy(value));
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
      }
    );
  }

  function defineComponentBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<ComponentBindsConfig<TValue, TExtras>> | LazyComponentBindsConfig<TValue, TExtras>
  ) {
    const pathState = findPathState(toValue(path)) || createPathState(path);
    const evalConfig = () => (isCallable(config) ? config(omit(pathState, PRIVATE_PATH_STATE_KEYS)) : config || {});

    function onBlur() {
      pathState.touched = true;
      const validateOnBlur = evalConfig().validateOnBlur ?? getConfig().validateOnBlur;
      if (validateOnBlur) {
        validateField(pathState.path as Path<TValues>);
      }
    }

    function onUpdateModelValue(value: TValue) {
      setFieldValue(pathState.path as Path<TValues>, value as PathValue<TValues, TPath>);
      const validateOnModelUpdate = evalConfig().validateOnModelUpdate ?? getConfig().validateOnModelUpdate;
      if (validateOnModelUpdate) {
        validateField(pathState.path as Path<TValues>);
      }
    }

    const props = computed(() => {
      const base: BaseComponentBinds<TValue> = {
        modelValue: pathState.value,
        'onUpdate:modelValue': onUpdateModelValue,
        onBlur,
      };

      if (isCallable(config)) {
        return {
          ...base,
          ...(config(pathState).props || {}),
        } as BaseComponentBinds<TValue> & TExtras;
      }

      if (config?.mapProps) {
        return {
          ...base,
          ...config.mapProps(omit(pathState, PRIVATE_PATH_STATE_KEYS)),
        } as BaseComponentBinds<TValue> & TExtras;
      }

      return base as BaseComponentBinds<TValue> & TExtras;
    });

    return props;
  }

  function defineInputBinds<
    TPath extends Path<TValues>,
    TValue = PathValue<TValues, TPath>,
    TExtras extends GenericObject = GenericObject
  >(
    path: MaybeRefOrGetter<TPath>,
    config?: Partial<InputBindsConfig<TValue, TExtras>> | LazyInputBindsConfig<TValue, TExtras>
  ) {
    const pathState = (findPathState(toValue(path)) || createPathState(path)) as PathState<TValue>;
    const evalConfig = () => (isCallable(config) ? config(omit(pathState, PRIVATE_PATH_STATE_KEYS)) : config || {});

    function onBlur() {
      pathState.touched = true;
      const validateOnBlur = evalConfig().validateOnBlur ?? getConfig().validateOnBlur;
      if (validateOnBlur) {
        validateField(pathState.path as Path<TValues>);
      }
    }

    function onInput(e: Event) {
      const value = normalizeEventValue(e) as PathValue<TValues, TPath>;
      setFieldValue(pathState.path as Path<TValues>, value);
      const validateOnInput = evalConfig().validateOnInput ?? getConfig().validateOnInput;
      if (validateOnInput) {
        validateField(pathState.path as Path<TValues>);
      }
    }

    function onChange(e: Event) {
      const value = normalizeEventValue(e) as PathValue<TValues, TPath>;
      setFieldValue(pathState.path as Path<TValues>, value);
      const validateOnChange = evalConfig().validateOnChange ?? getConfig().validateOnChange;
      if (validateOnChange) {
        validateField(pathState.path as Path<TValues>);
      }
    }

    const props = computed(() => {
      const base: BaseInputBinds<TValue> = {
        value: pathState.value,
        onChange,
        onInput,
        onBlur,
      };

      if (isCallable(config)) {
        return {
          ...base,
          ...(config(omit(pathState, PRIVATE_PATH_STATE_KEYS)).attrs || {}),
        } as BaseInputBinds<TValue> & TExtras;
      }

      if (config?.mapAttrs) {
        return {
          ...base,
          ...config.mapAttrs(omit(pathState, PRIVATE_PATH_STATE_KEYS)),
        } as BaseInputBinds<TValue> & TExtras;
      }

      return base as BaseInputBinds<TValue> & TExtras;
    });

    return props;
  }

  return {
    ...formCtx,
    values: readonly(formValues),
    handleReset: () => resetForm(),
    submitForm,
    defineComponentBinds,
    defineInputBinds,
  };
}

/**
 * Manages form meta aggregation
 */
function useFormMeta<TValues extends Record<string, unknown>>(
  pathsState: Ref<PathState<unknown>[]>,
  currentValues: TValues,
  initialValues: MaybeRef<PartialDeep<TValues>>,
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
    const states = pathsState.value;

    return keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = states[mergeMethod](s => s[flag]);

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
  opts?: FormOptions<TValues>
) {
  const values = resolveInitialValues(opts) as PartialDeep<TValues>;
  const providedValues = opts?.initialValues;
  // these are the mutable initial values as the fields are mounted/unmounted
  const initialValues = ref(values) as Ref<PartialDeep<TValues>>;
  // these are the original initial value as provided by the user initially, they don't keep track of conditional fields
  // this is important because some conditional fields will overwrite the initial values for other fields who had the same name
  // like array fields, any push/insert operation will overwrite the initial values because they "create new fields"
  // so these are the values that the reset function should use
  // these only change when the user explicitly changes the initial values or when the user resets them with new values.
  const originalInitialValues = ref<PartialDeep<TValues>>(deepCopy(values)) as Ref<PartialDeep<TValues>>;

  function setInitialValues(values: PartialDeep<TValues>, updateFields = false) {
    initialValues.value = deepCopy(values);
    originalInitialValues.value = deepCopy(values);

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

  if (isRef(providedValues)) {
    watch(
      providedValues,
      value => {
        if (value) {
          setInitialValues(value, true);
        }
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
