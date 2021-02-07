import { computed, ref, Ref, provide, reactive, onMounted, isRef, watch, unref, nextTick, warn } from 'vue';
import type { SchemaOf, ValidationError } from 'yup';
import {
  FieldMeta,
  FormContext,
  SubmissionHandler,
  GenericValidateFunction,
  SubmitEvent,
  ValidationResult,
  MaybeReactive,
  FormState,
  FormValidationResult,
  PrivateFieldComposite,
  YupValidator,
  PublicFormContext,
} from './types';
import { getFromPath, isYupValidator, keysOf, resolveNextCheckboxValue, setInPath, unsetPath } from './utils';
import { FormErrorsSymbol, FormContextSymbol, FormInitialValuesSymbol } from './symbols';

interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?: Record<keyof TValues, GenericValidateFunction | string | Record<string, any>> | SchemaOf<TValues>;
  initialValues?: MaybeReactive<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>;
  initialTouched?: Record<keyof TValues, boolean>;
  initialDirty?: Record<keyof TValues, boolean>;
  validateOnMount?: boolean;
}

export function useForm<TValues extends Record<string, any> = Record<string, any>>(
  opts?: FormOptions<TValues>
): PublicFormContext<TValues> {
  // A flat array containing field references
  const fields: Ref<PrivateFieldComposite[]> = ref([]);

  // If the form is currently submitting
  const isSubmitting = ref(false);

  // a field map object useful for faster access of fields
  const fieldsById = computed<Record<keyof TValues, PrivateFieldComposite | PrivateFieldComposite[]>>(() => {
    return fields.value.reduce((acc, field) => {
      const fieldPath: keyof TValues = unref(field.name);
      // if the field was not added before
      if (!acc[fieldPath]) {
        acc[fieldPath] = field;
        field.idx = -1;

        return acc;
      }

      // if the same name is detected
      const existingField: PrivateFieldComposite | PrivateFieldComposite[] = acc[fieldPath];
      if (!Array.isArray(existingField)) {
        existingField.idx = 0;
        acc[fieldPath] = [existingField];
      }

      const fieldGroup = acc[fieldPath] as PrivateFieldComposite[];
      field.idx = fieldGroup.length;
      fieldGroup.push(field);

      return acc;
    }, {} as Record<keyof TValues, PrivateFieldComposite | PrivateFieldComposite[]>);
  });

  // The number of times the user tried to submit the form
  const submitCount = ref(0);

  // a private ref for all form values
  const formValues = reactive({}) as TValues;
  // a lookup to keep track of values by their field ids
  // this is important because later we need it if fields swap names
  const valuesByFid: Record<string, any> = {};

  // an aggregation of field errors in a map object
  const errors = computed<Record<keyof TValues, string | undefined>>(() => {
    return fields.value.reduce((acc, field) => {
      // Check if its a grouped field (checkbox/radio)
      let message: string | undefined;
      const fieldName: keyof TValues = unref(field.name);
      const fieldInstance = fieldsById.value[fieldName];
      if (Array.isArray(fieldInstance)) {
        message = unref((fieldInstance.find(f => unref(f.checked)) || field).errorMessage);
      } else {
        message = unref(field.errorMessage);
      }

      if (message) {
        acc[fieldName] = message;
      }

      return acc;
    }, {} as Record<keyof TValues, string | undefined>);
  });

  // initial form values
  const { readonlyInitialValues, initialValues, setInitialValues } = useFormInitialValues<TValues>(
    fieldsById,
    formValues,
    opts?.initialValues
  );

  // form meta aggregations
  const meta = useFormMeta(fields, readonlyInitialValues);

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: keyof TValues, message: string | undefined) {
    const fieldInstance: PrivateFieldComposite | PrivateFieldComposite[] | undefined = fieldsById.value[field];
    if (!fieldInstance) {
      return;
    }

    if (Array.isArray(fieldInstance)) {
      fieldInstance.forEach(instance => {
        instance.setValidationState({ valid: !!message, errors: message ? [message] : [] });
      });
      return;
    }

    fieldInstance.setValidationState({ valid: !!message, errors: message ? [message] : [] });
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrors(fields: Partial<Record<keyof TValues, string | undefined>>) {
    keysOf(fields).forEach(field => {
      setFieldError(field, fields[field]);
    });
  }

  /**
   * Sets a single field value
   */
  function setFieldValue<T extends keyof TValues = string>(
    field: T,
    value: TValues[T] | undefined,
    { force } = { force: false }
  ) {
    const fieldInstance: PrivateFieldComposite | PrivateFieldComposite[] | undefined = fieldsById.value[field];

    // Multiple checkboxes, and only one of them got updated
    if (Array.isArray(fieldInstance) && fieldInstance[0]?.type === 'checkbox' && !Array.isArray(value)) {
      const newVal = resolveNextCheckboxValue(getFromPath(formValues, field as string) || [], value, undefined);
      setInPath(formValues, field as string, newVal);
      fieldInstance.forEach(fieldItem => {
        valuesByFid[fieldItem.fid] = newVal;
      });
      return;
    }

    let newValue = value;
    // Single Checkbox: toggles the field value unless the field is being reset then force it
    if (!Array.isArray(fieldInstance) && fieldInstance?.type === 'checkbox' && !force) {
      newValue = resolveNextCheckboxValue<TValues[T]>(
        getFromPath<TValues[T]>(formValues, field as string) as TValues[T],
        value as TValues[T],
        unref(fieldInstance.uncheckedValue) as TValues[T]
      );
    }

    setInPath(formValues, field as string, newValue);
    // multiple radio fields
    if (fieldInstance && Array.isArray(fieldInstance)) {
      fieldInstance.forEach(fieldItem => {
        valuesByFid[fieldItem.fid] = newValue;
      });
      return;
    }

    if (fieldInstance) {
      valuesByFid[fieldInstance.fid] = newValue;
    }
  }

  /**
   * Sets multiple fields values
   */
  function setValues(fields: Partial<TValues>) {
    keysOf(fields).forEach(field => {
      setFieldValue(field, fields[field]);
    });
  }

  /**
   * Sets the touched meta state on a field
   */
  function setFieldTouched(field: keyof TValues, isTouched: boolean) {
    const fieldInstance: PrivateFieldComposite | PrivateFieldComposite[] | undefined = fieldsById.value[field];
    if (!fieldInstance) {
      return;
    }

    if (Array.isArray(fieldInstance)) {
      fieldInstance.forEach(f => f.setTouched(isTouched));
      return;
    }

    fieldInstance.setTouched(isTouched);
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
   * Sets the dirty meta state on a field
   */
  function setFieldDirty(field: keyof TValues, isDirty: boolean) {
    const fieldInstance: PrivateFieldComposite | PrivateFieldComposite[] | undefined = fieldsById.value[field];
    if (!fieldInstance) {
      return;
    }

    if (Array.isArray(fieldInstance)) {
      fieldInstance.forEach(f => f.setDirty(isDirty));
      return;
    }

    fieldInstance.setDirty(isDirty);
  }

  /**
   * Sets the dirty meta state on multiple fields
   */
  function setDirty(fields: Partial<Record<keyof TValues, boolean>>) {
    keysOf(fields).forEach(field => {
      setFieldDirty(field, !!fields[field]);
    });
  }

  /**
   * Resets all fields
   */
  const resetForm = (state?: Partial<FormState<TValues>>) => {
    // set initial values if provided
    if (state?.values) {
      setInitialValues(state.values);
    }

    // Reset all fields state
    fields.value.forEach(f => f.resetField());

    // set explicit state afterwards
    if (state?.dirty) {
      setDirty(state.dirty);
    }
    if (state?.touched) {
      setTouched(state.touched);
    }
    if (state?.errors) {
      setErrors(state.errors);
    }

    submitCount.value = state?.submitCount || 0;
  };

  function registerField(field: PrivateFieldComposite<unknown>) {
    fields.value.push(field);
    if (isRef(field.name)) {
      valuesByFid[field.fid] = field.value.value;
      // ensures when a field's name was already taken that it preserves its same value
      // necessary for fields generated by loops
      watch(
        field.name,
        newPath => {
          setFieldValue(newPath, valuesByFid[field.fid]);
        },
        {
          flush: 'post',
        }
      );
    }
  }

  function unregisterField(field: PrivateFieldComposite<unknown>) {
    const idx = fields.value.indexOf(field);
    if (idx === -1) {
      return;
    }

    fields.value.splice(idx, 1);
    const fid = field.fid;
    // cleans up the field value from fid lookup
    nextTick(() => {
      delete valuesByFid[fid];
    });
    const fieldName = unref(field.name);
    // in this case, this is a single field not a group (checkbox or radio)
    // so remove the field value key immediately
    if (field.idx === -1) {
      unsetPath(formValues, fieldName);
      unsetPath(initialValues.value, fieldName);
      return;
    }

    // otherwise find the actual value in the current array of values and remove it
    const valueIdx: number | undefined = getFromPath<unknown[] | undefined>(formValues, fieldName)?.indexOf?.(
      unref(field.valueProp)
    );

    if (valueIdx === undefined) {
      unsetPath(formValues, fieldName);

      return;
    }

    if (valueIdx === -1) {
      return;
    }

    if (Array.isArray(formValues[fieldName])) {
      unsetPath(formValues, `${fieldName}.${valueIdx}`);
      return;
    }

    unsetPath(formValues, fieldName);
    unsetPath(initialValues.value, fieldName);
  }

  async function validate(): Promise<FormValidationResult<TValues>> {
    function resultReducer(acc: FormValidationResult<TValues>, result: { key: keyof TValues; errors: string[] }) {
      if (!result.errors.length) {
        return acc;
      }

      acc.valid = false;
      acc.errors[result.key] = result.errors[0];

      return acc;
    }

    if (formCtx.validateSchema) {
      return formCtx.validateSchema(true).then(results => {
        return keysOf(results)
          .map(r => ({ key: r, errors: results[r].errors }))
          .reduce(resultReducer, { errors: {}, valid: true });
      });
    }

    const results = await Promise.all(
      fields.value.map(f => {
        return f.validate().then((result: ValidationResult) => {
          return {
            key: unref(f.name),
            errors: result.errors,
          };
        });
      })
    );

    return results.reduce(resultReducer, { errors: {}, valid: true });
  }

  async function validateField(field: keyof TValues): Promise<ValidationResult> {
    const fieldInstance: PrivateFieldComposite | PrivateFieldComposite[] | undefined = fieldsById.value[field];
    if (!fieldInstance) {
      warn(`field with name ${field} was not found`);

      return Promise.resolve({ errors: [], valid: true });
    }

    if (Array.isArray(fieldInstance)) {
      return fieldInstance.map(f => f.validate())[0];
    }

    return fieldInstance.validate();
  }

  const handleSubmit = (fn?: SubmissionHandler<TValues>) => {
    return function submissionHandler(e: unknown) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }

      isSubmitting.value = true;
      submitCount.value++;
      return validate()
        .then(result => {
          if (result.valid && typeof fn === 'function') {
            return fn(immutableFormValues.value, {
              evt: e as SubmitEvent,
              setDirty,
              setFieldDirty,
              setErrors,
              setFieldError,
              setTouched,
              setFieldTouched,
              setValues,
              setFieldValue,
              resetForm,
            });
          }
        })
        .then(
          () => {
            isSubmitting.value = false;
          },
          err => {
            isSubmitting.value = false;

            // re-throw the err so it doesn't go silent
            throw err;
          }
        );
    };
  };

  const formCtx: FormContext<TValues> = {
    register: registerField,
    unregister: unregisterField,
    fields: fieldsById,
    values: formValues,
    schema: opts?.validationSchema,
    submitCount,
    validateSchema: isYupValidator(opts?.validationSchema)
      ? (shouldMutate = false) => {
          return validateYupSchema(formCtx, shouldMutate);
        }
      : undefined,
    validate,
    validateField,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    setTouched,
    setFieldDirty,
    setDirty,
    resetForm,
    meta,
    isSubmitting,
    handleSubmit,
  };

  const immutableFormValues = computed<TValues>(() => {
    return fields.value.reduce((formData: Record<keyof TValues, any>, field) => {
      setInPath(formData, unref(field.name), unref(field.value));

      return formData;
    }, {} as TValues);
  });

  const submitForm = handleSubmit((_, { evt }) => {
    if (evt) {
      evt?.target?.submit?.();
    }
  });

  // Trigger initial validation
  onMounted(() => {
    if (opts?.initialErrors) {
      setErrors(opts.initialErrors);
    }

    if (opts?.initialDirty) {
      setDirty(opts.initialDirty);
    }

    if (opts?.initialTouched) {
      setTouched(opts.initialTouched);
    }

    if (opts?.validateOnMount) {
      validate();
    }
  });

  // Provide injections
  provide(FormContextSymbol, formCtx as FormContext);
  provide(FormErrorsSymbol, errors);

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
    setFieldDirty,
    setDirty,
  };
}

/**
 * Manages form meta aggregation
 */
function useFormMeta<TValues>(fields: Ref<PrivateFieldComposite[]>, initialValues: MaybeReactive<TValues>) {
  const MERGE_STRATEGIES: Record<keyof Omit<FieldMeta<unknown>, 'initialValue'>, 'every' | 'some'> = {
    valid: 'every',
    dirty: 'some',
    touched: 'some',
    pending: 'some',
  };

  return computed(() => {
    const flags = keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields.value[mergeMethod](field => field.meta[flag]);

      return acc;
    }, {} as Record<keyof Omit<FieldMeta<unknown>, 'initialValue'>, boolean>);

    return {
      initialValues: unref(initialValues) as TValues,
      ...flags,
    };
  });
}

async function validateYupSchema<TValues>(
  form: FormContext<TValues>,
  shouldMutate = false
): Promise<Record<keyof TValues, ValidationResult>> {
  const errors: ValidationError[] = await (form.schema as YupValidator)
    .validate(form.values, { abortEarly: false })
    .then(() => [])
    .catch((err: ValidationError) => {
      // Yup errors have a name prop one them.
      // https://github.com/jquense/yup#validationerrorerrors-string--arraystring-value-any-path-string
      if (err.name !== 'ValidationError') {
        throw err;
      }

      // list of aggregated errors
      return err.inner || [];
    });

  const fields = form.fields.value;
  const errorsByPath = errors.reduce((acc, err) => {
    acc[err.path as keyof TValues] = err;

    return acc;
  }, {} as Record<keyof TValues, ValidationError>);

  // Aggregates the validation result
  const aggregatedResult = keysOf(fields).reduce((result: Record<keyof TValues, ValidationResult>, fieldId) => {
    const field: PrivateFieldComposite | PrivateFieldComposite[] = fields[fieldId];
    const messages = (errorsByPath[fieldId] || { errors: [] }).errors;
    const fieldResult = {
      errors: messages,
      valid: !messages.length,
    };

    result[fieldId] = fieldResult;
    const isDirty = Array.isArray(field) ? field.some(f => f.meta.dirty) : field.meta.dirty;
    if (!shouldMutate && !isDirty) {
      return result;
    }

    if (Array.isArray(field)) {
      field.forEach(f => f.setValidationState(fieldResult));

      return result;
    }

    field.setValidationState(fieldResult);

    return result;
  }, {} as Record<keyof TValues, ValidationResult>);

  return aggregatedResult;
}

/**
 * Manages the initial values prop
 */
function useFormInitialValues<TValues extends Record<string, any>>(
  fields: Ref<Record<keyof TValues, PrivateFieldComposite | PrivateFieldComposite[]>>,
  formValues: TValues,
  providedValues?: MaybeReactive<TValues>
) {
  const initialValues = ref<TValues>((unref(providedValues) as TValues) || ({} as TValues));
  // acts as a read only proxy of the initial values object
  const computedInitials = computed<TValues>(() => {
    return initialValues.value as TValues;
  });

  function setInitialValues(values: Partial<TValues>, updateFields = false) {
    initialValues.value = {
      ...initialValues.value,
      ...values,
    };

    if (!updateFields) {
      return;
    }

    // update the pristine (non-dirty and non-touched fields)
    // we exclude dirty and untouched fields because it's unlikely you want to change the form values using initial values
    // we mostly watch them for API population or newly inserted fields
    const isSafeToUpdate = (f: PrivateFieldComposite) => f.meta.dirty || f.meta.touched;
    keysOf(fields.value).forEach(fieldPath => {
      const field: PrivateFieldComposite | PrivateFieldComposite[] = fields.value[fieldPath];
      const isFieldDirty = Array.isArray(field) ? field.some(isSafeToUpdate) : isSafeToUpdate(field);
      if (isFieldDirty) {
        return;
      }

      const newValue = getFromPath(initialValues.value, fieldPath as string);
      setInPath(formValues, fieldPath as string, newValue);
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

  provide(FormInitialValuesSymbol, computedInitials);

  return {
    readonlyInitialValues: computedInitials,
    initialValues,
    setInitialValues,
  };
}
