import { computed, ref, Ref, provide, reactive, onMounted, isRef, watch, unref, nextTick } from 'vue';
import type { ObjectSchema, ValidationError } from 'yup';
import type { useField } from './useField';
import {
  FieldMeta,
  FormContext,
  SubmissionHandler,
  GenericValidateFunction,
  SubmitEvent,
  ValidationResult,
  MaybeReactive,
} from './types';
import { getFromPath, isYupValidator, keysOf, setInPath, unsetPath } from './utils';
import { FormErrorsSymbol, FormInitialValues, FormSymbol } from './symbols';

interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?:
    | Record<keyof TValues, GenericValidateFunction | string | Record<string, any>>
    | ObjectSchema<TValues>;
  initialValues?: MaybeReactive<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>;
  initialTouched?: Record<keyof TValues, boolean>;
  initialDirty?: Record<keyof TValues, boolean>;
  validateOnMount?: boolean;
}

type FieldComposite = ReturnType<typeof useField>;

export function useForm<TValues extends Record<string, any> = Record<string, any>>(opts?: FormOptions<TValues>) {
  // A flat array containing field references
  const fields: Ref<any[]> = ref([]);

  // If the form is currently submitting
  const isSubmitting = ref(false);

  // a field map object useful for faster access of fields
  const fieldsById = computed<Record<keyof TValues, any>>(() => {
    return fields.value.reduce((acc, field) => {
      // if the field was not added before
      if (!acc[field.name]) {
        acc[field.name] = field;
        field.idx = -1;

        return acc;
      }

      // if the same name is detected
      if (!Array.isArray(acc[field.name])) {
        const firstField = acc[field.name];
        firstField.idx = 0;
        acc[field.name] = [firstField];
      }

      field.idx = acc[field.name].length;
      acc[field.name].push(field);

      return acc;
    }, {} as Record<string, any>);
  });

  // a private ref for all form values
  const formValues = reactive({}) as TValues;
  // a lookup to keep track of values by their field ids
  // this is important because later we need it if fields swap names
  const valuesByFid: Record<string, any> = {};

  // an aggregation of field errors in a map object
  const errors = computed<{ [P in keyof TValues]?: string }>(() => {
    return fields.value.reduce((acc: Record<keyof TValues, string>, field) => {
      // Check if its a grouped field (checkbox/radio)
      let message: string | undefined;
      if (Array.isArray(fieldsById.value[field.name])) {
        const group = fieldsById.value[field.name];
        message = unref((group.find((f: any) => unref(f.checked)) || field).errorMessage);
      } else {
        message = unref(field.errorMessage);
      }

      if (message) {
        acc[field.name as keyof TValues] = message;
      }

      return acc;
    }, {});
  });

  // initial form values
  const { initialValues } = useFormInitialValues<TValues>(fieldsById, formValues, opts?.initialValues);

  // form meta aggregations
  const meta = useFormMeta(fields, initialValues);

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: keyof TValues, message: string | undefined) {
    const fieldInstance = fieldsById.value[field];
    if (!fieldInstance) {
      return;
    }

    if (Array.isArray(fieldInstance)) {
      fieldInstance.forEach(instance => {
        instance.setValidationState({ errors: message ? [message] : [] });
      });
      return;
    }

    fieldInstance.setValidationState({ errors: message ? [message] : [] });
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
  function setFieldValue<T extends keyof TValues = string>(field: T, value: TValues[T] | undefined) {
    const fieldInstance = fieldsById.value[field] as any;

    // Multiple checkboxes, and only one of them got updated
    if (Array.isArray(fieldInstance) && fieldInstance[0]?.type === 'checkbox' && !Array.isArray(value)) {
      const oldVal = getFromPath(formValues, field as string);
      const newVal = Array.isArray(oldVal) ? [...oldVal] : [];
      const idx = newVal.indexOf(value);
      idx >= 0 ? newVal.splice(idx, 1) : newVal.push(value);
      setInPath(formValues, field as string, newVal);
      fieldInstance.forEach(fieldItem => {
        valuesByFid[fieldItem.fid] = newVal;
      });
      return;
    }

    let newValue = value;
    // Single Checkbox
    if (fieldInstance?.type === 'checkbox') {
      newValue = getFromPath(formValues, field as string) === value ? undefined : value;
    }

    setInPath(formValues, field as string, newValue);
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
    const fieldInstance = fieldsById.value[field];
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
    const fieldInstance = fieldsById.value[field];
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
  const handleReset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  function registerField(field: FieldComposite) {
    fields.value.push(field);
    if (isRef(field.name)) {
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

  function unregisterField(field: FieldComposite) {
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
      return;
    }

    // otherwise find the actual value in the current array of values and remove it
    const valueIdx: number | undefined = getFromPath(formValues, fieldName)?.indexOf?.(unref(field.valueProp));

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
  }

  const formCtx: FormContext<TValues> = {
    register: registerField,
    unregister: unregisterField,
    fields: fieldsById,
    values: formValues,
    schema: opts?.validationSchema,
    validateSchema: isYupValidator(opts?.validationSchema)
      ? (shouldMutate = false) => {
          return validateYupSchema(formCtx, shouldMutate);
        }
      : undefined,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    setTouched,
    setFieldDirty,
    setDirty,
    reset: handleReset,
  };

  const validate = async () => {
    if (formCtx.validateSchema) {
      return formCtx.validateSchema(true).then(results => {
        return Object.keys(results).every(r => !results[r].errors.length);
      });
    }

    const results = await Promise.all(
      fields.value.map((f: any) => {
        return f.validate();
      })
    );

    return results.every(r => !r.errors.length);
  };

  const immutableFormValues = computed<TValues>(() => {
    return fields.value.reduce((formData: Record<keyof TValues, any>, field) => {
      setInPath(formData, field.name, unref(field.value));

      return formData;
    }, {});
  });

  const handleSubmit = (fn?: SubmissionHandler<TValues>) => {
    return function submissionHandler(e: unknown) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }

      isSubmitting.value = true;
      return validate()
        .then(result => {
          if (result && typeof fn === 'function') {
            return fn(immutableFormValues.value, { evt: e as SubmitEvent, form: formCtx });
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

  const submitForm = handleSubmit((_, { evt }) => {
    if (evt) {
      evt?.target?.submit();
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
  provide(FormInitialValues, initialValues);
  provide(FormSymbol, formCtx as FormContext);
  provide(FormErrorsSymbol, errors);

  return {
    errors,
    meta,
    values: formValues,
    validate,
    isSubmitting,
    handleReset,
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
function useFormMeta<TValues>(fields: Ref<any[]>, initialValues: MaybeReactive<TValues>) {
  const MERGE_STRATEGIES: Record<keyof Omit<FieldMeta, 'initialValue'>, 'every' | 'some'> = {
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
    }, {} as Record<keyof Omit<FieldMeta, 'initialValue'>, boolean>);

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
  const errors: any[] = await (form.schema as any)
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
    acc[err.path] = err;

    return acc;
  }, {});

  // Aggregates the validation result
  const aggregatedResult = keysOf(fields).reduce((result: Record<keyof TValues, ValidationResult>, fieldId) => {
    const field = fields[fieldId];
    const messages = (errorsByPath[fieldId] || { errors: [] }).errors;
    const fieldResult = {
      errors: messages,
    };

    result[fieldId] = fieldResult;
    const isGroup = Array.isArray(field);
    const isDirty = isGroup ? field.some((f: any) => f.meta.dirty) : field.meta.dirty;
    if (!shouldMutate && !isDirty) {
      return result;
    }

    if (isGroup) {
      field.forEach((f: any) => f.setValidationState(fieldResult));

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
function useFormInitialValues<TValues>(
  fields: Ref<Record<keyof TValues, any>>,
  formValues: TValues,
  providedValues?: MaybeReactive<TValues>
) {
  const initialValues = computed<TValues>(() => {
    if (isRef(providedValues)) {
      return providedValues.value;
    }

    return providedValues || ({} as TValues);
  });

  // Watch initial values for changes, and update the pristine (non-dirty and non-touched fields)
  // we exclude dirty and untouched fields because it's unlikely you want to change the form values using initial values
  // we mostly watch them for API population or newly inserted fields
  watch(
    initialValues,
    value => {
      const isSafeToUpdate = (f: any) => f.meta.dirty || f.meta.touched;
      keysOf(fields.value).forEach(fieldPath => {
        const field = fields.value[fieldPath];
        const isFieldDirty = Array.isArray(field) ? field.some(isSafeToUpdate) : isSafeToUpdate(field);
        if (isFieldDirty) {
          return;
        }

        const newValue = getFromPath(value, fieldPath as string);
        setInPath(formValues, fieldPath as string, newValue);
      });
    },
    {
      deep: true,
    }
  );

  return {
    initialValues,
  };
}
