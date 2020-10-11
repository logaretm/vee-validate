import { computed, ref, Ref, provide, reactive, onMounted, isRef, watch } from 'vue';
import type { ValidationError } from 'yup';
import type { useField } from './useField';
import {
  FieldMeta,
  FormController,
  SubmissionHandler,
  GenericValidateFunction,
  SubmitEvent,
  ValidationResult,
  MaybeReactive,
} from './types';
import { unwrap } from './utils/refs';
import { getFromPath, isYupValidator, keysOf, setInPath, unsetPath } from './utils';
import { FormErrorsSymbol, FormInitialValues, FormSymbol } from './symbols';

interface FormOptions {
  validationSchema?: Record<string, GenericValidateFunction | string | Record<string, any>>;
  initialValues?: MaybeReactive<Record<string, any>>;
  validateOnMount?: boolean;
}

type FieldComposite = ReturnType<typeof useField>;

export function useForm(opts?: FormOptions) {
  const fields: Ref<any[]> = ref([]);
  const isSubmitting = ref(false);
  const fieldsById = computed(() => {
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

  const activeFields = computed(() => {
    return fields.value.filter(field => !unwrap(field.disabled));
  });

  /**
   * Manually sets an error message on a specific field
   */
  function setFieldError(field: string, message: string) {
    const fieldInstance = fieldsById.value[field];
    if (!fieldInstance) {
      return;
    }

    if (Array.isArray(fieldInstance)) {
      fieldInstance.forEach(instance => {
        instance.setValidationState({ errors: [message] });
      });
      return;
    }

    fieldInstance.setValidationState({ errors: [message] });
  }

  /**
   * Sets errors for the fields specified in the object
   */
  function setErrors(fields: Record<string, string>) {
    Object.keys(fields).forEach(field => {
      setFieldError(field, fields[field]);
    });
  }

  /**
   * Sets a single field value
   */
  function setFieldValue(path: string, value: any) {
    const field = fieldsById.value[path];

    // Multiple checkboxes, and only one of them got updated
    if (Array.isArray(field) && field[0]?.type === 'checkbox' && !Array.isArray(value)) {
      const oldVal = getFromPath(formValues, path);
      const newVal = Array.isArray(oldVal) ? [...oldVal] : [];
      const idx = newVal.indexOf(value);
      idx >= 0 ? newVal.splice(idx, 1) : newVal.push(value);
      setInPath(formValues, path, newVal);
      return;
    }

    let newValue = value;
    // Single Checkbox
    if (field?.type === 'checkbox') {
      newValue = getFromPath(formValues, path) === value ? undefined : value;
    }

    setInPath(formValues, path, newValue);
  }

  /**
   * Sets multiple fields values
   */
  function setValues(fields: Record<string, any>) {
    Object.keys(fields).forEach(field => {
      setFieldValue(field, fields[field]);
    });
  }

  const handleReset = () => {
    fields.value.forEach((f: any) => f.reset());
  };

  // a private ref for all form values
  const formValues = reactive<Record<string, any>>({});
  const controller: FormController = {
    register(field: FieldComposite) {
      fields.value.push(field);
    },
    unregister(field: FieldComposite) {
      const idx = fields.value.indexOf(field);
      if (idx === -1) {
        return;
      }

      fields.value.splice(idx, 1);
      const fieldName = field.name;
      // in this case, this is a single field not a group (checkbox or radio)
      // so remove the field value key immediately
      if (field.idx === -1) {
        unsetPath(formValues, fieldName);
        return;
      }

      // otherwise find the actual value in the current array of values and remove it
      const valueIdx: number | undefined = getFromPath(formValues, fieldName)?.indexOf?.(unwrap(field.valueProp));

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
    },
    fields: fieldsById,
    values: formValues,
    schema: opts?.validationSchema,
    validateSchema: isYupValidator(opts?.validationSchema)
      ? (shouldMutate = false) => {
          return validateYupSchema(controller, shouldMutate);
        }
      : undefined,
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    reset: handleReset,
  };

  const validate = async () => {
    if (controller.validateSchema) {
      return controller.validateSchema(true).then(results => {
        return Object.keys(results).every(r => !results[r].errors.length);
      });
    }

    const results = await Promise.all(
      activeFields.value.map((f: any) => {
        return f.validate();
      })
    );

    return results.every(r => !r.errors.length);
  };

  const errors = computed(() => {
    return activeFields.value.reduce((acc: Record<string, string>, field) => {
      // Check if its a grouped field (checkbox/radio)
      if (Array.isArray(fieldsById.value[field.name])) {
        const group = fieldsById.value[field.name];
        const message = unwrap((group.find((f: any) => unwrap(f.checked)) || field).errorMessage);
        if (message) {
          acc[field.name] = message;
        }

        return acc;
      }

      const message = unwrap(field.errorMessage);
      if (message) {
        acc[field.name] = message;
      }

      return acc;
    }, {});
  });

  const activeFormValues = computed(() => {
    return activeFields.value.reduce((formData: Record<string, any>, field) => {
      setInPath(formData, field.name, unwrap(field.value));

      return formData;
    }, {});
  });

  const handleSubmit = (fn?: SubmissionHandler) => {
    return function submissionHandler(e: unknown) {
      if (e instanceof Event) {
        e.preventDefault();
        e.stopPropagation();
      }

      isSubmitting.value = true;
      return validate()
        .then(result => {
          if (result && typeof fn === 'function') {
            return fn(activeFormValues.value, { evt: e as SubmitEvent, form: controller });
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

  provide(FormSymbol, controller);
  provide(FormErrorsSymbol, errors);
  const initialValues = computed<Record<string, any>>(() => {
    const vals = opts?.initialValues || {};
    if (isRef(vals)) {
      return vals.value as Record<string, any>;
    }

    return vals;
  });

  // Provide fields with a reference to the initial values
  provide(FormInitialValues, initialValues);

  // Watch initial values for changes, and update the pristine (non-dirty fields)
  // we exclude dirty fields because it's unlikely you want to change the form values using initial values
  // we mostly watch them for API population or newly inserted fields
  watch(
    initialValues,
    value => {
      const isDirty = (f: any) => f.meta.dirty;
      Object.keys(fieldsById.value).forEach(fieldPath => {
        const field = fieldsById.value[fieldPath];
        const isFieldDirty = Array.isArray(field) ? field.some(isDirty) : isDirty(field);
        if (isFieldDirty) {
          return;
        }

        const newValue = getFromPath(value, fieldPath);
        setInPath(formValues, fieldPath, newValue);
      });
    },
    {
      deep: true,
    }
  );

  const meta = useFormMeta(fields, initialValues);
  // Trigger initial validation
  onMounted(() => {
    if (opts?.validateOnMount) {
      validate();
    }
  });

  return {
    errors,
    meta,
    form: controller,
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
  };
}

const MERGE_STRATEGIES: Record<keyof Omit<FieldMeta, 'initialValue'>, 'every' | 'some'> = {
  valid: 'every',
  dirty: 'some',
  touched: 'some',
  pending: 'some',
};

function useFormMeta(fields: Ref<any[]>, initialValues: MaybeReactive<Record<string, any>>) {
  return computed(() => {
    const flags = keysOf(MERGE_STRATEGIES).reduce((acc, flag) => {
      const mergeMethod = MERGE_STRATEGIES[flag];
      acc[flag] = fields.value[mergeMethod](field => field.meta[flag]);

      return acc;
    }, {} as Record<string, boolean>);

    return {
      initialValues: unwrap(initialValues),
      ...flags,
    };
  });
}

async function validateYupSchema(
  form: FormController,
  shouldMutate = false
): Promise<Record<string, ValidationResult>> {
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
  const aggregatedResult = Object.keys(fields).reduce((result: Record<string, ValidationResult>, fieldId) => {
    const field = fields[fieldId];
    const messages = (errorsByPath[fieldId] || { errors: [] }).errors;
    const fieldResult = {
      errors: messages,
    };

    result[fieldId] = fieldResult;
    const isGroup = Array.isArray(field);
    const touched = isGroup ? field.some((f: any) => f.meta.dirty) : field.meta.dirty;
    if (!shouldMutate && !touched) {
      return result;
    }

    if (isGroup) {
      field.forEach((f: any) => f.setValidationState(fieldResult));

      return result;
    }

    field.setValidationState(fieldResult);

    return result;
  }, {});

  return aggregatedResult;
}
